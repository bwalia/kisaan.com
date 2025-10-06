import { SITE_CONFIG } from "@/utils/site-config";

interface DisabledFeatureMessageProps {
  featureType: 'ordering' | 'registration' | 'selling' | 'general';
  className?: string;
  showIcon?: boolean;
}

export default function DisabledFeatureMessage({ 
  featureType, 
  className = '',
  showIcon = true 
}: DisabledFeatureMessageProps) {
  const messages = {
    ordering: "🛒 Ordering is currently disabled while we prepare our marketplace. Coming soon!",
    registration: "👤 New registrations are temporarily disabled during our launch preparation.",
    selling: "🏪 Seller registration is currently disabled while we finalize our marketplace features.",
    general: SITE_CONFIG.underConstructionMessage
  };

  const icons = {
    ordering: "🛒",
    registration: "👤", 
    selling: "🏪",
    general: "🚧"
  };

  return (
    <div className={`bg-orange-50 border border-orange-200 rounded-lg p-4 text-center ${className}`}>
      <div className="flex items-center justify-center space-x-2">
        {showIcon && (
          <span className="text-2xl">{icons[featureType]}</span>
        )}
        <div>
          <p className="text-orange-800 font-medium">
            {messages[featureType]}
          </p>
          <p className="text-orange-600 text-sm mt-1">
            Expected launch: {SITE_CONFIG.expectedLaunchDate}
          </p>
        </div>
      </div>
    </div>
  );
}