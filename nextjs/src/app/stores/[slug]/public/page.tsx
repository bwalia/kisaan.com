"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

interface Store {
  uuid: string;
  name: string;
  slug: string;
  description?: string;
  email?: string;
  phone?: string;
  logo_url?: string;
  banner_url?: string;
  owner_name: string;
  owner_since: string;
  product_count: number;
  completed_orders: number;
  average_rating: number;
  review_count: number;
}

interface Product {
  uuid: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  stock: number;
  category?: string;
}

interface Review {
  uuid: string;
  rating: number;
  title?: string;
  comment?: string;
  reviewer_name: string;
  created_at: string;
  is_verified_purchase: boolean;
}

export default function PublicStorePage() {
  const params = useParams();
  const router = useRouter();
  const storeSlug = params?.slug as string;

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingDistribution, setRatingDistribution] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'reviews'>('products');
  const [productPage, setProductPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'price_asc' | 'price_desc' | 'name'>('created_at');

  useEffect(() => {
    if (storeSlug) {
      loadStoreProfile();
    }
  }, [storeSlug]);

  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts();
    } else {
      loadReviews();
    }
  }, [activeTab, productPage, reviewPage, searchQuery, sortBy]);

  const loadStoreProfile = async () => {
    try {
      setLoading(true);
      const response = await api.getPublicStoreProfile(storeSlug);
      setStore(response);
    } catch (error: any) {
      toast.error(error.message || "Failed to load store");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await api.getPublicStoreProducts(storeSlug, {
        page: productPage,
        per_page: 12,
        search: searchQuery || undefined,
        sort: sortBy
      });
      setProducts(response.products);
    } catch (error: any) {
      console.error("Failed to load products:", error);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await api.getPublicStoreReviews(storeSlug, {
        page: reviewPage,
        per_page: 10
      });
      setReviews(response.reviews);
      setRatingDistribution(response.rating_distribution);
    } catch (error: any) {
      console.error("Failed to load reviews:", error);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Store not found</h2>
          <button
            onClick={() => router.push("/")}
            className="text-green-600 hover:underline"
          >
            Go to homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div className="bg-white shadow-sm">
        {/* Banner */}
        {store.banner_url && (
          <div className="w-full h-64 bg-gradient-to-r from-green-400 to-green-600">
            <img
              src={store.banner_url}
              alt={store.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Store Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end gap-6 -mt-16 pb-6">
            {/* Logo */}
            <div className="w-32 h-32 rounded-full bg-white shadow-lg overflow-hidden border-4 border-white">
              {store.logo_url ? (
                <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-4xl font-bold">
                  {store.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
              <p className="text-gray-600 mt-1">by {store.owner_name}</p>
              {store.description && (
                <p className="text-gray-700 mt-2 max-w-3xl">{store.description}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-4">
                <div className="flex items-center gap-2">
                  {renderStars(Math.round(store.average_rating))}
                  <span className="text-sm font-medium text-gray-700">
                    {store.average_rating.toFixed(1)} ({store.review_count} reviews)
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{store.product_count}</span> Products
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{store.completed_orders}</span> Orders Completed
                </div>
                <div className="text-sm text-gray-600">
                  Member since {format(new Date(store.owner_since), 'MMM yyyy')}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'products'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Products ({store.product_count})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Reviews ({store.review_count})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-wrap gap-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                >
                  <option value="created_at">Newest</option>
                  <option value="name">Name</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.uuid}
                    onClick={() => router.push(`/products/${product.uuid}`)}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                  >
                    {product.image_url && (
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-xl font-bold text-green-600">
                          ${parseFloat(product.price.toString()).toFixed(2)}
                        </p>
                        {product.stock > 0 ? (
                          <span className="text-sm text-green-600">In Stock</span>
                        ) : (
                          <span className="text-sm text-red-600">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'reviews' && (
          <>
            {/* Rating Overview */}
            {ratingDistribution.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900">
                      {store.average_rating.toFixed(1)}
                    </div>
                    <div className="flex justify-center my-2">
                      {renderStars(Math.round(store.average_rating))}
                    </div>
                    <p className="text-gray-600">{store.review_count} reviews</p>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const dist = ratingDistribution.find(d => d.rating === rating);
                      const count = dist?.count || 0;
                      const percentage = store.review_count > 0 ? (count / store.review_count) * 100 : 0;
                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-8">{rating}★</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600">No reviews yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.uuid} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {renderStars(review.rating)}
                          {review.is_verified_purchase && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <p className="font-medium text-gray-900">{review.reviewer_name}</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        {format(new Date(review.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    {review.title && (
                      <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                    )}
                    {review.comment && (
                      <p className="text-gray-700">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
