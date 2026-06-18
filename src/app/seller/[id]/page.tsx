"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Seller = { id: string; name: string; bio: string; avatar: string };
type Product = { id: string; title: string; price: number; category: { name: string }; images: { url: string }[] };

export default function SellerPage() {
  const { id } = useParams();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`/api/seller/${id}`).then((r) => r.json()).then(({ seller, products }) => {
      setSeller(seller);
      setProducts(products ?? []);
    });
  }, [id]);

  if (!seller) return <div className="text-center py-20 text-gray-400">Yuklanmoqda...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-2xl font-bold text-amber-700">
          {seller.name[0]}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">{seller.name}</h1>
          {seller.bio && <p className="text-gray-500 text-sm mt-1">{seller.bio}</p>}
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-700 mb-4">Ishlari ({products.length})</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group">
            <div className="aspect-square bg-gray-100 overflow-hidden">
              {p.images[0] ? (
                <Image src={p.images[0].url} alt={p.title} width={300} height={300} className="w-full h-full object-cover group-hover:scale-105 transition" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">🪑</div>
              )}
            </div>
            <div className="p-3">
              <p className="font-semibold text-gray-800 truncate">{p.title}</p>
              <p className="text-amber-600 font-bold text-sm">{p.price.toLocaleString()} so&apos;m</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
