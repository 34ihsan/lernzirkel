import { NextResponse } from "next/server";
import { syncSystemPages } from "@/actions/admin";

export async function POST() {
  try {
    await syncSystemPages();
    return NextResponse.json({ success: true, message: "Sistem sayfaları başarıyla eşitlendi." });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await syncSystemPages();
    return NextResponse.json({ success: true, message: "Sistem sayfaları başarıyla eşitlendi." });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
