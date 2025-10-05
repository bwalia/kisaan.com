import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#16a34a] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#16a34a] rounded-full blur-3xl"></div>
      </div>

      <div className="container py-12 px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center space-x-3 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#16a34a] to-[#15803d] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold">Kisaan</span>
            </Link>
            <p className="text-gray-300 text-sm mb-5 max-w-sm leading-relaxed">
              Your trusted marketplace connecting buyers and sellers worldwide. Build your dream store with Kisaan.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#16a34a] hover:border-[#16a34a] transition-all duration-300 transform hover:scale-110"
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
                className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#16a34a] hover:border-[#16a34a] transition-all duration-300 transform hover:scale-110"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#16a34a] hover:border-[#16a34a] transition-all duration-300 transform hover:scale-110"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/stores"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Stores
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="font-semibold text-base mb-3">For Sellers</h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/register"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Start Selling
                </Link>
              </li>
              <li>
                <Link
                  href="/seller/stores"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/help/seller-guide"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Seller Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/help/fees"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Fees & Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Support</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/support"
                  className="text-gray-300 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  24/7 Support
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-300 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-gray-300 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-300 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Legal</h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-gray-300 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} Kisaan. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="text-gray-300 hover:text-white text-sm transition-colors">
                Cookies
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                Terms
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <svg
                  className="w-4 h-4 text-[#16a34a]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <svg
                  className="w-4 h-4 text-[#16a34a]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
