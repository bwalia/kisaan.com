import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#1b4332] text-white relative overflow-hidden">
      {/* Background decoration - Farming themed */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-300 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Newsletter Section */}
      <div className="relative z-10 border-b border-white/10">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 justify-center md:justify-start">
                <span className="text-3xl">🌾</span> Join Our Farming Community
              </h3>
              <p className="text-green-100">Get updates on fresh harvests, seasonal produce & farming tips</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-green-200 focus:outline-none focus:border-amber-400 flex-1 md:w-64"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-lg whitespace-nowrap">
                Subscribe 🌱
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12 px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center space-x-3 mb-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-2xl">🌾</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">Kisaan</span>
                <span className="text-xs text-green-200">Farm to Table</span>
              </div>
            </Link>
            <p className="text-green-100 text-sm mb-5 max-w-sm leading-relaxed">
              Empowering farmers worldwide. Connecting you directly to fresh, organic produce from local farms across 150+ countries.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center text-green-200 hover:text-white hover:bg-amber-500 hover:border-amber-500 transition-all duration-300 transform hover:scale-110"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center text-green-200 hover:text-white hover:bg-amber-500 hover:border-amber-500 transition-all duration-300 transform hover:scale-110"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center text-green-200 hover:text-white hover:bg-amber-500 hover:border-amber-500 transition-all duration-300 transform hover:scale-110"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
              <span>🛒</span> Shop
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-green-200 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Fresh Produce
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-green-200 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Organic Products
                </Link>
              </li>
              <li>
                <Link
                  href="/stores"
                  className="text-green-200 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Farm Stores
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-green-200 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  All Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* For Farmers */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
              <span>👨‍🌾</span> For Farmers
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/register"
                  className="text-green-200 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Start Selling
                </Link>
              </li>
              <li>
                <Link
                  href="/seller/stores"
                  className="text-green-200 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Farmer Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/seller-guide"
                  className="text-green-200 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Seller Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-green-200 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Fair Trade Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
              <span>💬</span> Support
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/support"
                  className="text-green-200 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-green-200 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Freshness Guarantee
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-green-200 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Quality Assurance
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-green-200 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
              <span>📋</span> Legal
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/privacy"
                  className="text-green-200 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-green-200 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-green-200 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-green-100 text-sm">
                © {new Date().getFullYear()} Kisaan. Made with 💚 for farmers worldwide
              </span>
            </div>
            <div className="flex items-center gap-6 flex-wrap justify-center">
              <div className="flex items-center gap-2 text-sm text-green-200">
                <span>🌿</span>
                <span>100% Organic</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-200">
                <span>🔒</span>
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-200">
                <span>♻️</span>
                <span>Eco-Friendly</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-200">
                <span>🌍</span>
                <span>150+ Countries</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
