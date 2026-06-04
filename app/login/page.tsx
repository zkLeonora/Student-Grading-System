"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";    
import Image from "next/image";

export default function LoginPage() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

const router = useRouter();

const handleLogin = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  console.log("LOGIN CLICKED");

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
    alert(data.message);
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
};

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-4">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md rounded-md border border-slate-800 shadow-2xl overflow-hidden">
        <div className="h-1 bg-indigo-600" />
        
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-indigo-950/40 border border-slate-800 scale-110" />
              <div className="absolute inset-1 rounded-full border border-dashed border-slate-700/40 animate-[spin_160s_linear_infinite]" />
              <Image 
                src="/logo.png" 
                alt="Logo Sistem Nilai Siswa" 
                fill
                sizes="128px"
                className="relative z-10 w-full h-full rounded-full object-cover border border-slate-700/60 drop-shadow-2xl"
                priority
              />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Aplikasi Pengolahan Nilai Siswa
            </h1>
            <p className="text-sm text-slate-400 mt-5">
              Silakan masuk untuk mengakses data nilai
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded px-3 py-2.5 text-sm transition-all focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
                placeholder="Masukkan username Anda"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded px-3 py-2.5 text-sm transition-all focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
                placeholder="Masukkan password Anda"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded text-sm transition-colors shadow-md mt-2"
            >
              Masuk ke Sistem
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Hubungi Administrator jika terkendala akses.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}