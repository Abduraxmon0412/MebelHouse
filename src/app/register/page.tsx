"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refresh } = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    refresh();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Ro&apos;yxatdan o&apos;tish</h1>
        <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
          <input
            type="text" placeholder="Ismingiz (ko'rsatiladigan nom)" value={name} onChange={(e) => setName(e.target.value)} required
            className="border rounded-lg px-4 py-2.5 text-sm"
          />
          <input
            type="text" placeholder="Login (kirish uchun)" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))} required
            className="border rounded-lg px-4 py-2.5 text-sm"
          />
          <input
            type="password" placeholder="Parol (kamida 6 ta belgi)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
            className="border rounded-lg px-4 py-2.5 text-sm"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="bg-amber-600 text-white rounded-lg py-2.5 font-semibold hover:bg-amber-700 disabled:opacity-50">
            {loading ? "Yuklanmoqda..." : "Ro'yxatdan o'tish"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Hisobingiz bormi?{" "}
          <Link href="/login" className="text-amber-600 hover:underline">Kiring</Link>
        </p>
      </div>
    </div>
  );
}
