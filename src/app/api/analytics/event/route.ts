import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, url, metadata, locale } = body;

    if (!eventName) {
      return NextResponse.json({ error: "eventName is required" }, { status: 400 });
    }

    // 1. Always log to local database
    const event = await prisma.eventLog.create({
      data: {
        eventName: String(eventName).slice(0, 50),
        url: String(url || "/").slice(0, 255),
        locale: locale ? String(locale).slice(0, 10) : null,
        metadata: metadata ? metadata : undefined,
      },
    });

    // 2. Check Admin Marketing & Tracking Approvals
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "global" },
      select: { marketingConfig: true },
    });

    const marketingConfig = (settings?.marketingConfig as any) || {};

    // DSGVO Check: If tracking is NOT explicitly enabled by Admin, STOP here!
    if (!marketingConfig.trackingEnabled) {
      return NextResponse.json({ success: true, logged: true, forwarded: false });
    }

    // 3. Forward to Meta Conversions API (CAPI) if token & pixel provided
    if (marketingConfig.metaPixelId && marketingConfig.metaCapiToken) {
      const metaPayload = {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            event_source_url: url || "https://lernzirkel-lu.de",
            custom_data: metadata || {},
          },
        ],
      };

      fetch(
        `https://graph.facebook.com/v19.0/${marketingConfig.metaPixelId}/events?access_token=${marketingConfig.metaCapiToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(metaPayload),
        }
      ).catch((err) => console.error("Meta CAPI forwarding error:", err));
    }

    // 4. Forward to GA4 Measurement Protocol if configured
    if (marketingConfig.gaMeasurementId && marketingConfig.gaApiSecret) {
      const gaPayload = {
        client_id: `server_${event.id}`,
        events: [
          {
            name: eventName,
            params: {
              page_location: url,
              ...(metadata || {}),
            },
          },
        ],
      };

      fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${marketingConfig.gaMeasurementId}&api_secret=${marketingConfig.gaApiSecret}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gaPayload),
        }
      ).catch((err) => console.error("GA4 forwarding error:", err));
    }

    return NextResponse.json({ success: true, logged: true, forwarded: true });
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
