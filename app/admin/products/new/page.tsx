import ProductForm from '@/components/ProductForm';

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto mb-10">
        <nav className="flex mb-4 text-sm text-gray-500 font-medium">
          <a href="/admin/products" className="hover:text-orange-600">Inventory</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Add Product</span>
        </nav>
      </div>
      <ProductForm />
    </div>
  );
}
