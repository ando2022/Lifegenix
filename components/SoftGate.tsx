'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, MapPin, Heart } from 'lucide-react';
import { logEvent } from '@/lib/analytics';

interface SoftGateProps {
  onClose: () => void;
}

export default function SoftGate({ onClose }: SoftGateProps) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);

  const handleSetupProfile = () => {
    logEvent('SoftGate_ProfileSetup_Clicked');
    router.push('/profile-setup');
  };

  const handleSkipToShops = () => {
    logEvent('SoftGate_SkipToShops_Clicked');
    router.push('/shops');
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-2xl max-w-md w-full p-6 transform transition-all duration-200 ${
        isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-violet-600" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Find Your Perfect Café Match
          </h2>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Tell us a bit about your health and taste preferences so we can find your best café match.
          </p>

          {/* Benefits */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Personalized recommendations</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>Nearby locations matching your health profile</span>
            </div>
          </div>

          {/* Action button (single) */}
          <div className="space-y-3">
            <button
              onClick={handleSetupProfile}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Set Up My Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
