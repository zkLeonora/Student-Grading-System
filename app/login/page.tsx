"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { btnCta, input, label } from "@/components/ui";
import { useI18n } from "@/components/I18n";
import { LangSwitch } from "@/components/LangSwitch";

export default function LoginPage() {
const { t, tv } = useI18n();
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState<string | null>(null);
const [submitting, setSubmitting] = useState(false);

const router = useRouter();

const handleLogin = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  console.log("LOGIN CLICKED");
  setError(null);
  setSubmitting(true);

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(tv(data.message) || t("login.fail"));
      return;
    }

    switch (data.role) {
      case "admin":
        router.push("/admin/dashboard");
        break;

      case "guru":
        router.push("/guru/dashboard");
        break;

      case "siswa":
        router.push("/siswa/dashboard");
        break;
    }
  } catch {
    setError(t("login.network"));
  } finally {
    setSubmitting(false);
  }
};

  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="absolute top-4 right-4">
          <LangSwitch />
        </div>
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt={t("login.logoAlt")}
            width={72}
            height={72}
            className="rounded-lg object-cover"
            priority
          />
          <h1 className="mt-5 text-xl font-bold tracking-tight text-white">
            {t("shell.brand")}
          </h1>
          <p className="mt-1.5 text-sm text-[#b3b3b3]">
            {t("login.subtitle")}
          </p>
        </div>

        <div className="rounded-lg bg-[#181818] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          <form className="space-y-4" onSubmit={handleLogin}>
            {error && (
              <p
                role="alert"
                className="rounded bg-[#1f1f1f] px-3 py-2.5 text-sm text-[#f3727f] shadow-[0_0_0_1px_rgb(243,114,127)_inset]"
              >
                {error}
              </p>
            )}
            <div>
              <label htmlFor="username" className={label}>
                {t("login.username")}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={input}
                placeholder={t("login.usernamePh")}
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className={label}>
                {t("login.password")}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={input}
                placeholder={t("login.passwordPh")}
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" disabled={submitting} className={btnCta + " mt-2 w-full"}>
              {submitting ? t("login.processing") : t("login.submit")}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[#7c7c7c]">
          &copy; {new Date().getFullYear()} {t("login.footer")}
        </p>
      </div>
    </main>
  );
}
