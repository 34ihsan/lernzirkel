import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { getCourseSurveyReport, getCourseInviteDetails } from "@/lib/survey-reports";
import { siteConfig } from "@/lib/seo";
import CourseReportClient from "./CourseReportClient";

export const metadata = { title: "Kurs Anket Raporu | Lernzirkel Admin" };

export default async function CourseSurveyReportPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const [report, invites] = await Promise.all([
    getCourseSurveyReport(courseId),
    getCourseInviteDetails(courseId),
  ]);
  if (!report) notFound();

  const walkInUrl = `${siteConfig.url.replace(/\/$/, "")}/umfrage/kurs/${courseId}`;
  const previewUrl = `${walkInUrl}?preview=1`;
  const qrDataUrl = await QRCode.toDataURL(walkInUrl, { margin: 1, width: 320 });

  return (
    <CourseReportClient
      report={report}
      invites={invites}
      walkInUrl={walkInUrl}
      previewUrl={previewUrl}
      qrDataUrl={qrDataUrl}
      courseId={courseId}
    />
  );
}
