import { listSurveyQuestions } from "@/actions/survey-admin";
import QuestionsClient from "./QuestionsClient";

export const metadata = { title: "Anket Soruları | Lernzirkel Admin" };

export default async function SurveyQuestionsPage() {
  const questions = await listSurveyQuestions();
  return <QuestionsClient initialQuestions={questions} />;
}
