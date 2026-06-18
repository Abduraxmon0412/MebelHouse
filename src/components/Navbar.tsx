"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    refresh();
    router.push("/");
  };

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-amber-700">
          🪑 Mebel Bozor
        </Link>
        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-sm text-gray-600 hover:text-amber-700">
                    Dashboard
                  </Link>
                  <Link href="/add" className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-amber-700">
                    + Mebel qo'sh
                  </Link>
                  <span className="text-sm text-gray-500">{user.name}</span>
                  <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">
                    Chiqish
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-gray-600 hover:text-amber-700">
                    Kirish
                  </Link>
                  <Link href="/register" className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-amber-700">
                    Ro'yxatdan o'tish
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
