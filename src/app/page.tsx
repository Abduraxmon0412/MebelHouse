"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  title: string;
  price: number;
  category: { name: string };
  images: { url: string }[];
  user: { id: string; name: string };
};

type Category = { id: string; name: string };

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(({ categories }) => setCategories(categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (search) params.set("search", search);
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then(({ products }) => setProducts(products ?? []))
      .finally(() => setLoading(false));
  }, [selectedCategory, minPrice, maxPrice, search]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm p-4 mb-8 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[160px]"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Barcha kategoriyalar</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min narx"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-28"
        />
        <input
          type="number"
          placeholder="Max narx"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-28"
        />
        {(selectedCategory || minPrice || maxPrice || search) && (
          <button
            onClick={() => { setSelectedCategory(""); setMinPrice(""); setMaxPrice(""); setSearch(""); }}
            className="text-sm text-red-500 hover:text-red-700 px-2"
          >
            Tozalash
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Yuklanmoqda...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Mahsulot topilmadi</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                {p.images[0] ? (
                  <Image
                    src={p.images[0].url}
                    alt={p.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">🪑</div>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-gray-800 truncate">{p.title}</p>
                <p className="text-amber-600 font-bold text-sm mt-1">{p.price.toLocaleString()} so&apos;m</p>
                <p className="text-xs text-gray-400 mt-1">{p.category.name} • {p.user.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
