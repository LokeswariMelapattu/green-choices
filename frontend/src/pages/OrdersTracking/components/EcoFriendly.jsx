import React from 'react';
import { Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EcoFriendly = ({ 
  variant = 'choice', // 'choice' or 'confirmation'
  title,
  description,
  percentage,
  onAction,
  actionLabel,
  secondaryText,
  onSecondaryAction 
}) => {
  const variants = {
    choice: {
      defaultTitle: 'Eco-Friendly Choice Available!',
      defaultDescription: 'Would you like to switch to a more sustainable delivery method?',
      defaultAction: 'Switch to Green',
      titleColor: 'text-gray-800',
      buttonVariant: 'success'
    },
    confirmation: {
      defaultTitle: 'Great choice!',
      defaultDescription: "You've selected the most eco-friendly delivery option",
      defaultAction: 'Learn more',
      titleColor: 'text-green-600',
      buttonVariant: 'link'
    }
  };

  const currentVariant = variants[variant];

  return (
    <div className="relative overflow-hidden rounded-xl border border-green-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md sm:p-6">
      {/* Background Globe Icon */}
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 transform">
        <Globe2 
          className="h-32 w-32 text-green-50 sm:h-40 sm:w-40 md:h-48 md:w-48" 
          strokeWidth={1}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-[80%] sm:max-w-[70%] flex flex-col gap-3">
        <h2 className={`text-lg font-bold sm:text-xl md:text-2xl ${currentVariant.titleColor}`}>
          {title || currentVariant.defaultTitle}
        </h2>
        
        <div className="space-y-2">
          <p className="font-medium text-gray-800 sm:text-lg">
            {description || currentVariant.defaultDescription}
          </p>
          
          {percentage && (
            <p className="text-green-600 font-medium">
              This option reduces emissions by {percentage}!
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 mt-2">
          {variant === 'choice' ? (
            <Button
              onClick={onAction}
              className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-md"
            >
              {actionLabel || currentVariant.defaultAction}
            </Button>
          ) : (
            <p className="text-sm text-gray-600 sm:text-base">
              {secondaryText || "Your choice is helping to reduce carbon emissions and support a greener planet."}
              {onSecondaryAction && (
                <button 
                  onClick={onSecondaryAction}
                  role="button"
                  className="ml-1 text-green-600 hover:text-green-700 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {actionLabel || currentVariant.defaultAction}
                </button>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EcoFriendly;