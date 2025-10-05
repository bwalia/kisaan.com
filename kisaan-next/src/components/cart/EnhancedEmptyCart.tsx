'use client';

import Link from 'next/link';

export default function EnhancedEmptyCart() {
  const popularCategories = [
    { name: 'Healthy foods', href: '/?category=healthy-foods', icon: '🥗' },
    { name: 'Organic foods', href: '/?category=organic-foods', icon: '🌿' },
    { name: 'Home & Garden', href: '/?category=home-garden', icon: '🏠' },
    { name: 'Books', href: '/?category=books', icon: '📚' },
  ];

  const benefits = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: 'Free Shipping',
      description: 'On orders over $50'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Easy Returns',
      description: '30-day return policy'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Secure Payment',
      description: 'SSL encrypted checkout'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Main Empty State */}
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center mb-12">
            {/* Cart Icon */}
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
            </div>

            {/* Title and Description */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-[#16a34a] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#16a34a] transition-colors inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Start Shopping
              </Link>

              <Link
                href="/wishlist"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                View Wishlist
              </Link>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Popular Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularCategories.map((category, index) => (
                <Link
                  key={index}
                  href={category.href}
                  className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md hover:border-[#16a34a] transition-all group"
                >
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#16a34a] transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Why Shop With Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-[#16a34a] text-white rounded-lg flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-[#16a34a] to-[#16a34a] rounded-lg p-8 mt-12 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Get notified about new products
            </h2>
            <p className="mb-6 opacity-90">
              Subscribe to our newsletter and be the first to know about new arrivals and exclusive deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-[#16a34a] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}