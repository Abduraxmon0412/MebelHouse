"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

type Category = { id: string; name: string };

export default function AddProductPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<{ url: string; isPrimary: boolean }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    fetch("/api/categories").then((r) => r.json()).then(({ categories }) => setCategories(categories));
  }, [loading, user, router]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const { url } = await res.json();
    setImages((prev) => [...prev, { url, isPrimary: prev.length === 0 }]);
    setUploading(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, price, categoryId, images }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setSaving(false); return; }
    router.push("/dashboard");
  };

  if (loading) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Yangi mebel qo&apos;shish</h1>
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
        <input
          type="text" placeholder="Mebel nomi" value={title} onChange={(e) => setTitle(e.target.value)} required
          className="border rounded-lg px-4 py-2.5 text-sm"
        />
        <textarea
          placeholder="Tavsif (ixtiyoriy)" value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
          className="border rounded-lg px-4 py-2.5 text-sm resize-none"
        />
        <input
          type="number" placeholder="Narxi (so'm)" value={price} onChange={(e) => setPrice(e.target.value)} required min={0}
          className="border rounded-lg px-4 py-2.5 text-sm"
        />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="border rounded-lg px-4 py-2.5 text-sm">
          <option value="">Kategoriya tanlang</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {/* Rasm yuklash */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Rasmlar</label>
          <div className="flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                <Image src={img.url} alt="" fill className="object-cover" />
                {img.isPrimary && <span className="absolute bottom-0 left-0 right-0 text-center text-xs bg-amber-600 text-white">Asosiy</span>}
              </div>
            ))}
            <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-amber-500 text-2xl text-gray-400">
              {uploading ? "..." : "+"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
            </label>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={saving || uploading} className="bg-amber-600 text-white rounded-lg py-2.5 font-semibold hover:bg-amber-700 disabled:opacity-50">
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>
    </div>
  );
}
