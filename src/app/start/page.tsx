"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const schema = z.object({
  fullName: z
    .string()
    .min(1, { message: "氏名を入力してください" })
    .max(50, { message: "氏名は 50 文字以内で入力してください" }),
  companyName: z
    .string()
    .min(1, { message: "会社名を入力してください" })
    .max(100, { message: "会社名は 100 文字以内で入力してください" }),
  email: z
    .string()
    .min(1, { message: "メールアドレスを入力してください" })
    .email({ message: "正しいメールアドレスを入力してください" }),
});

type FormValues = z.infer<typeof schema>;

export default function StartPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { fullName: "", companyName: "", email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "skweep:lead",
        JSON.stringify({ ...values, createdAt: new Date().toISOString() })
      );
    }
    await new Promise((r) => setTimeout(r, 400));
    router.push("/upload");
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-200/50 via-indigo-200/30 to-transparent blur-3xl" />
      </div>

      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
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
        <div className="mx-auto flex max-w-xl flex-col px-6 py-16">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              STEP 1 / 3 ・ アカウント情報
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              無料解析をはじめる
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              所要 30 秒。クレジットカード不要で、すぐにアップロード画面に進めます。
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-10 rounded-2xl border border-border bg-background p-7 shadow-sm sm:p-8"
          >
            <div className="space-y-5">
              <Field
                id="fullName"
                label="氏名"
                placeholder="山田 太郎"
                autoComplete="name"
                error={errors.fullName?.message}
                {...register("fullName")}
              />
              <Field
                id="companyName"
                label="会社名"
                placeholder="株式会社サンプル"
                autoComplete="organization"
                error={errors.companyName?.message}
                {...register("companyName")}
              />
              <Field
                id="email"
                label="メールアドレス"
                type="email"
                placeholder="taro@example.com"
                autoComplete="email"
                inputMode="email"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-8 w-full disabled:opacity-70"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  送信中…
                </>
              ) : (
                <>
                  次へ進む
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
              「次へ進む」をクリックすると、Skweep の
              <Link href="/" className="mx-1 underline underline-offset-2 hover:text-foreground">
                利用規約
              </Link>
              および
              <Link href="/" className="mx-1 underline underline-offset-2 hover:text-foreground">
                プライバシーポリシー
              </Link>
              に同意したものとみなされます。
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

type FieldProps = React.ComponentProps<typeof Input> & {
  id: string;
  label: string;
  error?: string;
};

function Field({ id, label, error, ...props }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        <span className="ml-1 text-destructive">*</span>
      </Label>
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-10"
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Logo() {
  return (
    <span
      aria-hidden
      className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-500 text-white shadow-sm"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-4 w-4"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 18 L10 12 L14 16 L20 8" />
        <path d="M14 8 H20 V14" />
      </svg>
    </span>
  );
}
