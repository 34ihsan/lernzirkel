import { NextResponse } from "next/server";
import { purgeExpiredApplications } from "@/actions/data-retention";

export async function GET() {
  try {
    const result = await purgeExpiredApplications();
    return NextResponse.json({
      status: "success",
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
