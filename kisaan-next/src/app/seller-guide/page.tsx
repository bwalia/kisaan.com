import Link from "next/link";

export const metadata = {
  title: "Seller Guide | Kisaan",
  description: "Complete guide for sellers on how to start, manage, and grow your business on Kisaan marketplace.",
};

export default function SellerGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#16a34a] via-[#15803d] to-[#14532d] text-white py-20 overflow-hidden">
        {/* Background Banner */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/banner-pricing.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#16a34a]/80 via-[#15803d]/80 to-[#14532d]/80" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 animate-pulse">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Seller Guide</h1>
            <p className="text-xl md:text-2xl text-emerald-100">
              Everything you need to know to start and grow your business on Kisaan
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#getting-started" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#16a34a] hover:bg-emerald-50 rounded-lg transition-colors">
              Getting Started
            </a>
            <a href="#create-store" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#16a34a] hover:bg-emerald-50 rounded-lg transition-colors">
              Create Store
            </a>
            <a href="#add-products" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#16a34a] hover:bg-emerald-50 rounded-lg transition-colors">
              Add Products
            </a>
            <a href="#manage-orders" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#16a34a] hover:bg-emerald-50 rounded-lg transition-colors">
              Manage Orders
            </a>
            <a href="#best-practices" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#16a34a] hover:bg-emerald-50 rounded-lg transition-colors">
              Best Practices
            </a>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section id="getting-started" className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Getting Started
            </h2>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Kisaan Marketplace!</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Kisaan is a multi-vendor marketplace that empowers sellers to reach customers worldwide. Whether you're an individual entrepreneur or an established business, our platform provides all the tools you need to succeed.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-emerald-50 rounded-xl">
                  <div className="text-4xl font-bold text-[#16a34a] mb-2">1,000+</div>
                  <div className="text-sm text-gray-600">Active Sellers</div>
                </div>
                <div className="text-center p-6 bg-emerald-50 rounded-xl">
                  <div className="text-4xl font-bold text-[#16a34a] mb-2">50,000+</div>
                  <div className="text-sm text-gray-600">Monthly Customers</div>
                </div>
                <div className="text-center p-6 bg-emerald-50 rounded-xl">
                  <div className="text-4xl font-bold text-[#16a34a] mb-2">10,000+</div>
                  <div className="text-sm text-gray-600">Products Listed</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#16a34a] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Register Your Account</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Create your seller account by providing your business details, contact information, and payment preferences. The registration process is quick and straightforward.
                    </p>
                    <Link 
                      href="/register" 
                      className="inline-flex items-center gap-2 text-[#16a34a] font-semibold hover:gap-3 transition-all"
                    >
                      Register Now
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#16a34a] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Verify Your Identity</h3>
                    <p className="text-gray-600 leading-relaxed">
                      For security and trust, we require identity verification. Upload your business registration documents and proof of identity. This process typically takes 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#16a34a] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Set Up Your Store</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Once verified, create your store, add your branding, and start listing products. You'll have access to your seller dashboard with all the tools you need.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Create Store */}
      <section id="create-store" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Creating Your Store
            </h2>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 shadow-lg border border-emerald-200 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Store Setup Essentials</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#16a34a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700"><strong>Store Name:</strong> Choose a memorable, unique name that reflects your brand</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#16a34a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700"><strong>Store Logo:</strong> Upload a professional logo (recommended: 500x500px, PNG format)</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#16a34a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700"><strong>Store Description:</strong> Write a compelling description (300-500 words) about your business</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#16a34a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700"><strong>Contact Information:</strong> Provide accurate contact details for customer inquiries</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#16a34a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700"><strong>Shipping Policies:</strong> Define your shipping zones, rates, and delivery times</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#16a34a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700"><strong>Return Policy:</strong> Set clear return and refund policies for your customers</span>
                </li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Branding Tips</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Use consistent colors, fonts, and imagery. Your brand should be recognizable across all touchpoints. High-quality visuals increase customer trust.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Legal Requirements</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Ensure your store policies comply with local regulations. Include terms of service, privacy policy, and comply with consumer protection laws.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add Products */}
      <section id="add-products" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Adding Products
            </h2>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Listing Checklist</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#16a34a] text-white rounded-full flex items-center justify-center text-xs">1</span>
                    Product Images
                  </h4>
                  <ul className="ml-8 space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-[#16a34a] mt-1">•</span>
                      <span>Upload at least 3-5 high-quality images (minimum 1000x1000px)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#16a34a] mt-1">•</span>
                      <span>Use white or neutral backgrounds for main product images</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#16a34a] mt-1">•</span>
                      <span>Show products from multiple angles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#16a34a] mt-1">•</span>
                      <span>Include lifestyle shots showing product in use</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#16a34a] text-white rounded-full flex items-center justify-center text-xs">2</span>
                    Product Title
                  </h4>
                  <ul className="ml-8 space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-[#16a34a] mt-1">•</span>
                      <span>Keep it concise and descriptive (60-80 characters)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#16a34a] mt-1">•</span>
                      <span>Include brand name, product type, and key features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#16a34a] mt-1">•</span>
                      <span>Avoid ALL CAPS or excessive punctuation</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#16a34a] text-white rounded-full flex items-center justify-center text-xs">3</span>
                    Product Description
                  </h4>
                  <ul className="ml-8 space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-[#16a34a] mt-1">•</span>
                      <span>Write detailed, accurate descriptions (300-1000 words)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#16a34a] mt-1">•</span>
                      <span>Highlight key features and benefits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#16a34a] mt-1">•</span>
                      <span>Include specifications, dimensions, and materials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#16a34a] mt-1">•</span>
                      <span>Mention care instructions and warranty information</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#16a34a] text-white rounded-full flex items-center justify-center text-xs">4</span>
                    Pricing Strategy
                  </h4>
                  <ul className="ml-8 space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-[#16a34a] mt-1">•</span>
                      <span>Research competitor pricing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#16a34a] mt-1">•</span>
                      <span>Factor in marketplace fees (see <Link href="/pricing" className="text-[#16a34a] hover:underline">Fees & Pricing</Link>)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#16a34a] mt-1">•</span>
                      <span>Consider offering introductory discounts</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#16a34a] text-white rounded-full flex items-center justify-center text-xs">5</span>
                    Inventory Management
                  </h4>
                  <ul className="ml-8 space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-[#16a34a] mt-1">•</span>
                      <span>Keep accurate stock levels updated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#16a34a] mt-1">•</span>
                      <span>Set low-stock alerts to avoid overselling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#16a34a] mt-1">•</span>
                      <span>Use SKU codes for easy tracking</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex gap-4">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">Pro Tip: SEO Optimization</h4>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    Use relevant keywords in your product titles and descriptions to improve search visibility. Think about what terms customers would use to find your products.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manage Orders */}
      <section id="manage-orders" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Managing Orders
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Order Fulfillment Process</h3>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[#16a34a] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                    <span className="text-gray-700"><strong>Receive Order:</strong> Get instant notification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[#16a34a] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                    <span className="text-gray-700"><strong>Process Payment:</strong> Confirm payment received</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[#16a34a] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                    <span className="text-gray-700"><strong>Pack Order:</strong> Secure packaging required</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[#16a34a] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</span>
                    <span className="text-gray-700"><strong>Ship Order:</strong> Upload tracking information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-[#16a34a] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">5</span>
                    <span className="text-gray-700"><strong>Confirm Delivery:</strong> Mark as delivered</span>
                  </li>
                </ol>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Shipping Best Practices</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">Ship within 1-2 business days for best ratings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">Use quality packaging materials to prevent damage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">Always provide tracking numbers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">Consider insurance for high-value items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">Communicate proactively with customers</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Communication</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Excellent communication is key to maintaining high seller ratings and customer satisfaction:
                </p>
                <ul className="space-y-3 ml-4">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#16a34a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><strong>Response Time:</strong> Reply to customer messages within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#16a34a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><strong>Order Updates:</strong> Send shipping confirmations and tracking info promptly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#16a34a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><strong>Problem Resolution:</strong> Address issues professionally and offer solutions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#16a34a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700"><strong>Follow-up:</strong> Check in after delivery to ensure satisfaction</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section id="best-practices" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Best Practices for Success
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Maintain High Ratings</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  Customer reviews and ratings directly impact your visibility and sales:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Provide accurate product descriptions</li>
                  <li>• Ship orders promptly</li>
                  <li>• Package items securely</li>
                  <li>• Respond to inquiries quickly</li>
                  <li>• Handle returns gracefully</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Optimize for Search</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  Make your products easy to find:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Use relevant keywords in titles</li>
                  <li>• Write detailed descriptions</li>
                  <li>• Select accurate categories</li>
                  <li>• Add multiple product images</li>
                  <li>• Keep prices competitive</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Pricing Strategy</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  Price your products competitively:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Research competitor prices</li>
                  <li>• Factor in all costs and fees</li>
                  <li>• Offer bundle deals</li>
                  <li>• Run seasonal promotions</li>
                  <li>• Consider free shipping threshold</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Grow Your Business</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  Scale your store effectively:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Expand product range gradually</li>
                  <li>• Analyze sales data regularly</li>
                  <li>• Request customer feedback</li>
                  <li>• Stay updated on trends</li>
                  <li>• Invest in marketing</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#16a34a] to-[#15803d] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Prohibited Items</h3>
              <p className="mb-4 text-emerald-50">
                The following items are strictly prohibited on our platform:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-300">×</span>
                      <span>Illegal or stolen goods</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-300">×</span>
                      <span>Counterfeit or replica items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-300">×</span>
                      <span>Weapons and explosives</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-300">×</span>
                      <span>Drugs and drug paraphernalia</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-300">×</span>
                      <span>Hazardous materials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-300">×</span>
                      <span>Live animals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-300">×</span>
                      <span>Adult content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-300">×</span>
                      <span>Tobacco and alcohol (in most regions)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Selling?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join thousands of successful sellers on Kisaan marketplace. Create your store today and reach customers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-[#16a34a] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#15803d] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Create Your Store
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/support"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#16a34a] text-[#16a34a] px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all duration-300"
              >
                Contact Support
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Additional Resources
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/pricing" className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Fees & Pricing</h3>
                <p className="text-sm text-gray-600">Learn about our transparent fee structure and pricing plans.</p>
              </Link>

              <Link href="/support" className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600">Get help anytime from our dedicated support team.</p>
              </Link>

              <Link href="/seller/dashboard" className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Seller Dashboard</h3>
                <p className="text-sm text-gray-600">Access your dashboard to manage your store and products.</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
