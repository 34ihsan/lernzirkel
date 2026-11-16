import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Giriş | Lernzirkel CMS",
};

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
