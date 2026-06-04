import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { SkweepLogo } from "@/components/skweep-logo";
import { COMPANY, SERVICE } from "@/lib/company";

const LEGAL_LINKS = [
  { href: "/security", label: "セキュリティ" },
  { href: "/legal/tokushoho", label: "特定商取引法に基づく表記" },
  { href: "/legal/privacy", label: "プライバシーポリシー" },
  { href: "/legal/terms", label: "利用規約" },
];

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <SkweepLogo />
            <span className="text-lg font-semibold tracking-tight">Skweep</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            トップへ戻る
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-14">{children}</article>

        <nav className="mx-auto max-w-3xl border-t border-border px-6 py-8">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            関連ページ
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {COMPANY.name}. {SERVICE.name} is operated by {COMPANY.name}.
        </div>
      </footer>
    </div>
  );
}
