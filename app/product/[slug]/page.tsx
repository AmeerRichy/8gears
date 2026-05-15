import { notFound } from "next/navigation";
import connectDB from "@/app/lib/db/mongodb";
import Product from "@/app/models/Product";
import ProductDetail from "@/app/components/product/ProductDetail";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  try {
    const { slug } = await params;

    await connectDB();

    const product = await Product.findOne({ slug });

    if (!product) return { title: "Product Not Found" };

    return {
      title: `${product.title} | 8 GEARS`,
      description: product.baseDescription,
      openGraph: {
        title: product.title,
        description: product.baseDescription,
        images: [product.variants?.[0]?.images?.[0]],
      },
    };
  } catch (error) {
    return { title: "8 GEARS" };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { slug } = await params;

    console.log("Fetching product with slug:", slug);

    await connectDB();

    const product = await Product.findOne({ slug });

    if (!product) {
      const allProducts = await Product.find({}, "slug");

      console.log("--- DEBUG: PRODUCT NOT FOUND ---");
      console.log("Requested Slug:", slug);
      console.log(
        "Available Slugs in DB:",
        allProducts.map((p) => p.slug)
      );
      console.log("-------------------------------");

      notFound();
    }

    try {
      await Product.findByIdAndUpdate(product._id, {
        $inc: { "analytics.views": 1 },
      });
    } catch (analyticsError) {
      console.error("Analytics update failed:", analyticsError);
    }

    const relatedQuery: any = {
      _id: { $ne: product._id },
    };

    if (product.category) {
      relatedQuery.category = product.category;
    }

    const relatedProducts = await Product.find(relatedQuery)
      .limit(4)
      .lean();

    return (
      <main className="pt-20">
        <ProductDetail
          product={JSON.parse(JSON.stringify(product))}
          relatedProducts={JSON.parse(JSON.stringify(relatedProducts))}
        />
      </main>
    );
  } catch (error: any) {
    console.error("CRITICAL ERROR in ProductPage:", error);
    throw error;
  }
}