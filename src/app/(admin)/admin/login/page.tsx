import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Giriş | Lernzirkel Yönetim Paneli",
};

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
