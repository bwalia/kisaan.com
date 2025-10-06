export default function UnderConstructionBanner() {
  return (
    <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-white rounded-full blur-lg"></div>
      </div>

      <div className="container mx-auto px-4 py-3 relative z-10">
        <div className="flex items-center justify-center space-x-3 text-center">
          <div className="hidden sm:flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-4 h-4 text-white">⚙️</div>
              <div className="w-4 h-4 text-white">⚠️</div>
              <div className="w-4 h-4 text-white">🕐</div>
            </div>
          </div>
          
          <div className="flex-1 max-w-4xl">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:hidden">⚠️</span>
                <span className="font-bold text-sm sm:text-base">
                  🚧 UNDER CONSTRUCTION
                </span>
              </div>
              
              <div className="text-xs sm:text-sm opacity-90 text-center">
                <span className="hidden sm:inline">•</span>
                <span className="mx-1">
                  This site is currently in development and not accepting orders yet
                </span>
              </div>
              
              <div className="text-xs sm:text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                Coming Soon! 🚀
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="h-1 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400"></div>
    </div>
  );
}