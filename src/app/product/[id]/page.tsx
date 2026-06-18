"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: { name: string };
  images: { url: string; isPrimary: boolean }[];
  user: { id: string; name: string; bio: string; avatar: string };
};

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    fetch(`/api/products/${id}`).then((r) => r.json()).then(({ product }) => setProduct(product));
  }, [id]);

  if (!product) return <div className="text-center py-20 text-gray-400">Yuklanmoqda...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Rasmlar */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-3">
            {product.images[activeImg] ? (
              <Image src={product.images[activeImg].url} alt={product.title} width={600} height={600} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">🪑</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${i === activeImg ? "border-amber-500" : "border-transparent"}`}>
                  <Image src={img.url} alt="" width={64} height={64} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ma'lumotlar */}
        <div>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{product.category.name}</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">{product.title}</h1>
          <p className="text-3xl font-bold text-amber-600 mt-3">{product.price.toLocaleString()} so&apos;m</p>
          {product.description && <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>}

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Mebelchi</p>
            <p className="font-semibold text-gray-800">{product.user.name}</p>
            {product.user.bio && <p className="text-sm text-gray-500 mt-1">{product.user.bio}</p>}
            <Link href={`/seller/${product.user.id}`} className="text-sm text-amber-600 hover:underline mt-2 inline-block">
              Barcha ishlarini ko&apos;rish →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
