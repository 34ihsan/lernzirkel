import React from "react";
import Link from "next/link";
import { ShieldCheck, FileText, Cookie, Scale } from "lucide-react";
import Breadcrumbs from "@/components/common/Breadcrumbs";

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalPageProps {
  title: string;
  subtitle: string;
  slug: "impressum" | "datenschutz" | "agb" | "cookies";
  lastUpdated: string;
  sections: LegalSection[];
}

const LEGAL_NAV = [
  { slug: "impressum", label: "Impressum", icon: Scale },
  { slug: "datenschutz", label: "Datenschutz", icon: ShieldCheck },
  { slug: "agb", label: "AGB", icon: FileText },
  { slug: "cookies", label: "Cookies", icon: Cookie },
] as const;

export default function LegalPage({ title, subtitle, slug, lastUpdated, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <Breadcrumbs items={[{ label: title, url: `/${slug}`, isCurrent: true }]} />

      <header className="bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white">
        <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
          <p className="mt-3 text-white/85 max-w-2xl">{subtitle}</p>
          <p className="mt-4 text-xs text-white/60">Stand: {lastUpdated}</p>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="lg:sticky lg:top-24 self-start space-y-6">
          <nav aria-label="Rechtliche Informationen" className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
            <ul className="space-y-1">
              {LEGAL_NAV.map(({ slug: s, label, icon: Icon }) => (
                <li key={s}>
                  <Link
                    href={`/${s}`}
                    aria-current={s === slug ? "page" : undefined}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition ${
                      s === slug
                        ? "bg-primary text-white shadow"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Inhaltsverzeichnis" className="hidden lg:block rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Inhalt</div>
            <ol className="space-y-1.5 text-sm">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-gray-600 dark:text-gray-400 hover:text-primary hover:underline">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm p-6 md:p-10 space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 space-y-3">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                <span className="text-primary mr-2">{i + 1}.</span>
                {s.title}
              </h2>
              <div className="space-y-3 text-[15px] [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_strong]:text-gray-900 dark:[&_strong]:text-gray-100">
                {s.content}
              </div>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
