'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import api from '@/lib/api';
import { Product, ProductVariant } from '@/types';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import AddToCartSection from '@/components/product/AddToCartSection';

export default function ProductDetails() {
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);

  const { addToCart, loading: cartLoading } = useCart();
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    if (!productId) {
      router.push("/");
      return;
    }

    try {
      setLoading(true);
      const productResponse = await api.getProduct(productId);

      if (!productResponse) {
        router.push("/");
        return;
      }

      setProduct(productResponse);
      setCurrentPrice(
        typeof productResponse.price === 'number' ? productResponse.price : 0
      );
      setCurrentStock(
        typeof productResponse.inventory_quantity === 'number'
          ? productResponse.inventory_quantity
          : 0
      );

      // Load variants separately to avoid blocking product display
      try {
        const variantsResponse = await api.getVariants(productId);
        setVariants(Array.isArray(variantsResponse) ? variantsResponse : []);
      } catch (variantError) {
        console.error('Failed to load variants:', variantError);
        setVariants([]);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleVariantChange = (variantUuid: string) => {
    setSelectedVariant(variantUuid);
    setQuantity(1);

    if (variantUuid && product && variants.length > 0) {
      const variant = variants.find((v) => v.uuid === variantUuid);
      if (variant) {
        setCurrentPrice(
          typeof variant.price === "number" ? variant.price : product.price
        );
        setCurrentStock(
          typeof variant.inventory_quantity === "number"
            ? variant.inventory_quantity
            : 0
        );
      }
    } else if (product) {
      setCurrentPrice(typeof product.price === "number" ? product.price : 0);
      setCurrentStock(
        typeof product.inventory_quantity === "number"
          ? product.inventory_quantity
          : 0
      );
    }
  };

  const handleAddToCart = async () => {
    if (!product?.uuid) {
      return;
    }

    if (currentStock <= 0) {
      return;
    }

    if (quantity <= 0 || quantity > currentStock) {
      return;
    }

    try {
      await addToCart(product.uuid, quantity, selectedVariant || undefined);
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16a34a] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link
            href="/"
            className="bg-[#16a34a] text-white px-6 py-3 rounded-lg hover:bg-[#16a34a] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const getProductImages = () => {
    try {
      if (!product?.images) return [];

      if (Array.isArray(product.images)) {
        return product.images.filter(
          (img) => typeof img === 'string' && img.trim()
        );
      }

      if (typeof product.images === 'string') {
        if (product.images === '') return [];
        const parsed = JSON.parse(product.images);
        return Array.isArray(parsed)
          ? parsed.filter((img) => typeof img === 'string' && img.trim())
          : [];
      }

      return [];
    } catch {
      return [];
    }
  };

  const images = getProductImages();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#16a34a] transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="lg:sticky lg:top-8">
            <ProductImageGallery
              images={images}
              productName={product.name}
            />
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Product Info */}
            <ProductInfo
              product={product}
              currentPrice={currentPrice}
              currentStock={currentStock}
            />

            {/* Add to Cart Section */}
            <div className="border-t border-gray-200 pt-8">
              <AddToCartSection
                variants={variants}
                selectedVariant={selectedVariant}
                quantity={quantity}
                currentStock={currentStock}
                isLoading={cartLoading}
                onVariantChange={handleVariantChange}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                productPrice={product.price}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
