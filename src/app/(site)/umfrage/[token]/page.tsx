import { getSurveyByToken, submitSurveyResponse, type SurveyAnswerInput } from "@/actions/survey-public";
import SurveyForm from "@/components/survey/SurveyForm";
import { CheckCircle2, Clock, Ban } from "lucide-react";

export const metadata = {
  title: "Umfrage | Lernzirkel Ludwigshafen e.V.",
  robots: { index: false, follow: false },
};

function StatusScreen({ icon, title, message }: { icon: React.ReactNode; title: string; message: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-8">
        <div className="mx-auto w-14 h-14 rounded-full bg-[var(--secondary)] flex items-center justify-center mb-4 text-[var(--primary)]">
          {icon}
        </div>
        <h1 className="text-xl font-bold mb-2">{title}</h1>
        <p className="text-sm text-[var(--foreground)]/70">{message}</p>
      </div>
    </div>
  );
}

export default async function SurveyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = await getSurveyByToken(token);

  if (!result.ok) {
    if (result.reason === "COMPLETED") {
      return (
        <StatusScreen
          icon={<CheckCircle2 size={28} />}
          title="Vielen Dank — bereits ausgefüllt"
          message="Diese Umfrage wurde bereits von Ihnen abgeschlossen. Jede Einladung kann nur einmal verwendet werden, um die Anonymität zu schützen."
        />
      );
    }
    if (result.reason === "EXPIRED") {
      return (
        <StatusScreen
          icon={<Clock size={28} />}
          title="Umfrage abgelaufen"
          message="Der Gültigkeitszeitraum dieser Umfrage ist leider abgelaufen."
        />
      );
    }
    return (
      <StatusScreen
        icon={<Ban size={28} />}
        title="Umfrage nicht gefunden"
        message="Dieser Link ist ungültig. Bitte prüfen Sie den Link aus Ihrer E-Mail."
      />
    );
  }

  async function handleSubmit(answers: SurveyAnswerInput[], turnstileToken: string | null) {
    "use server";
    return submitSurveyResponse(token, answers, turnstileToken);
  }

  return (
    <SurveyForm
      language={result.language}
      courseTitle={result.courseTitle}
      questions={result.questions}
      onSubmit={handleSubmit}
    />
  );
}
