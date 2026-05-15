'use client';

import { useEffect, useState } from 'react';
import ProductForm from '@/components/ProductForm';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto mb-10">
        <nav className="flex mb-4 text-sm text-gray-500 font-medium">
          <a href="/admin/products" className="hover:text-orange-600">Inventory</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Edit Gear</span>
        </nav>
      </div>
      <ProductForm initialData={product} />
    </div>
  );
}
