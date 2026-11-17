import { getWalkInSurveyForm, submitWalkInSurveyResponse, type SurveyAnswerInput } from "@/actions/survey-public";
import SurveyForm from "@/components/survey/SurveyForm";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Umfrage | Lernzirkel Ludwigshafen e.V.",
  robots: { index: false, follow: false },
};

// QR-posteri ile erişilen, çoklu kullanımlı ("walk-in") anket girişi — kişisel davet
// gerektirmez, kimlik bilgisi toplamaz. Örn. sınıfta ders sonunda ortak link/QR ile açılır.
export default async function WalkInSurveyPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { courseId } = await params;
  const { preview } = await searchParams;
  const result = await getWalkInSurveyForm(courseId);
  if (!result.ok) notFound();

  async function handleSubmit(answers: SurveyAnswerInput[], turnstileToken: string | null) {
    "use server";
    return submitWalkInSurveyResponse(courseId, answers, turnstileToken);
  }

  return (
    <SurveyForm
      language="de"
      courseTitle={result.courseTitle}
      questions={result.questions}
      onSubmit={handleSubmit}
      previewMode={preview === "1"}
    />
  );
}
