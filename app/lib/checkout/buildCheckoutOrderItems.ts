import Product from '@/models/Product';
import connectDB from '@/lib/db/mongodb';
import { DISPLAY_CURRENCY, SHIPPING_AMOUNT } from './constants';

export interface CheckoutItemInput {
  productId: string;
  variantId: string;
  quantity: number;
}

export async function buildCheckoutOrderItems(items: CheckoutItemInput[]) {
  await connectDB();

  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    if (item.quantity <= 0) {
      throw new Error(`Invalid quantity for product ${item.productId}`);
    }

    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    // @ts-ignore - variants is a Mongoose array of subdocuments
    let variant = product.variants.id(item.variantId);
    
    // Fallback support for old carts where variantId may equal sku
    if (!variant) {
      variant = product.variants.find((v: any) => v.sku === item.variantId);
    }

    if (!variant) {
      throw new Error(`Variant not found: ${item.variantId} for product ${item.productId}`);
    }

    if (variant.stockQuantity < item.quantity) {
      throw new Error(`Not enough stock for ${product.title} (${variant.size}/${variant.color}). Available: ${variant.stockQuantity}`);
    }

    const lineTotal = variant.price * item.quantity;
    subtotal += lineTotal;

    orderItems.push({
      productId: product._id,
      variantId: variant._id,
      sku: variant.sku,
      title: product.title,
      slug: product.slug,
      color: variant.color,
      colorHex: variant.colorHex,
      size: variant.size,
      unitPrice: variant.price,
      quantity: item.quantity,
      lineTotal: lineTotal,
      image: variant.images[0] || product.lifestyleImage || '',
    });
  }

  const totalAmount = subtotal + SHIPPING_AMOUNT;

  return {
    items: orderItems,
    subtotal,
    shippingAmount: SHIPPING_AMOUNT,
    totalAmount,
    currency: DISPLAY_CURRENCY,
  };
}

