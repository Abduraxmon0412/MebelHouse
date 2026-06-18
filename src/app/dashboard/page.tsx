"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  title: string;
  price: number;
  category: { name: string };
  images: { url: string }[];
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = () => {
    fetch("/api/products/mine").then((r) => r.json()).then(({ products }) => setProducts(products ?? []));
  };

  useEffect(() => {
    if (!loading && !user) { router.push("/login"); return; }
    if (user) loadProducts();
  }, [loading, user, router]);

  const deleteProduct = async (id: string) => {
    if (!confirm("Haqiqatan o'chirilsinmi?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadProducts();
  };

  if (loading) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mening mebellarim</h1>
        <Link href="/add" className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700">
          + Qo&apos;shish
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Hali mebel qo&apos;shilmagan</p>
          <Link href="/add" className="text-amber-600 hover:underline mt-2 inline-block">Birinchi mebelni qo&apos;shing</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {p.images[0] ? (
                  <Image src={p.images[0].url} alt={p.title} width={300} height={300} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">🪑</div>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-gray-800 truncate">{p.title}</p>
                <p className="text-amber-600 text-sm font-bold">{p.price.toLocaleString()} so&apos;m</p>
                <div className="flex gap-2 mt-2">
                  <Link href={`/product/${p.id}`} className="text-xs text-blue-500 hover:underline">Ko&apos;rish</Link>
                  <button onClick={() => deleteProduct(p.id)} className="text-xs text-red-500 hover:underline">O&apos;chirish</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
