'use client';

import { useState, useEffect } from 'react';
import { QrCode, Sparkles, Shield, Zap, Star, Users, TrendingUp, Camera, Menu, ChevronRight, Upload, ImageIcon, AlertCircle, X, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import MobileReviewGenerator from '@/components/MobileReviewGenerator';
import MobileQRCodeGenerator from '@/components/MobileQRCodeGenerator';
import MobilePhotoUpload from '@/components/MobilePhotoUpload';
import { GoogleReviewService, DEFAULT_BUSINESS } from '@/lib/google-review';

export default function MobileHome() {
  const [currentReview, setCurrentReview] = useState<string>('');
  const [businessType, setBusinessType] = useState('seafood restaurant');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewUrl, setReviewUrl] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoDescription, setPhotoDescription] = useState<string>('');
  const [dishName, setDishName] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [activeStep, setActiveStep] = useState<'upload' | 'generate' | 'submit'>('upload');
  const [showMenu, setShowMenu] = useState(false);

  // Mark when component is mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate initial review URL (client-side only)
  useEffect(() => {
    if (!isClient) return;
    
    if (currentReview) {
      updateReviewUrl();
    }
  }, [currentReview, isClient]);

  const updateReviewUrl = () => {
    const reviewData = {
      rating: 5,
      reviewText: currentReview,
      placeId: DEFAULT_BUSINESS.placeId,
      businessName: DEFAULT_BUSINESS.name,
    };

    const url = GoogleReviewService.generateReviewUrl(reviewData);
    setReviewUrl(url);
  };

  const handleReviewGenerated = (review: string) => {
    setCurrentReview(review);
    setActiveStep('submit');
  };

  const handlePhotoUpload = (file: File | null, description: string) => {
    setSelectedPhoto(file);
    setPhotoDescription(description);
    if (file) {
      toast.success('Photo uploaded!');
      setActiveStep('generate');
    }
  };

  const handleDishInput = (dish: string) => {
    setDishName(dish);
    if (dish) {
      toast.success(`Selected: ${dish}`);
      setActiveStep('generate');
    }
  };

  const handleSubmitReview = () => {
    if (!currentReview) {
      toast.error('Please generate a review first');
      setActiveStep('generate');
      return;
    }

    setIsSubmitting(true);
    
    const validation = GoogleReviewService.validateReview(currentReview);
    if (!validation.isValid) {
      toast.error(`Review validation failed: ${validation.issues.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    window.open(reviewUrl, '_blank', 'noopener,noreferrer');
    
    toast.success('Opening Google Review page...');
    setIsSubmitting(false);
  };

  const handleRegenerateQR = () => {
    updateReviewUrl();
    toast.success('QR code updated!');
  };

  const handleSkipToGenerate = () => {
    setActiveStep('generate');
    toast.success('Skipped photo upload');
  };

  const handleBackToUpload = () => {
    setActiveStep('upload');
  };

  const handleBackToGenerate = () => {
    setActiveStep('generate');
  };

  const features = [
    {
      icon: <QrCode className="w-5 h-5" />,
      title: 'QR Scan',
      description: 'Scan for review page'
    },
    {
      icon: <Camera className="w-5 h-5" />,
      title: 'Photo Upload',
      description: 'Optional meal photos'
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'AI Review',
      description: '20-word personalized'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'One-Click',
      description: 'Direct to Google'
    }
  ];

  const stats = [
    { label: 'Rating', value: '4.8★', icon: <Star className="w-4 h-4" /> },
    { label: 'Increase', value: '300%', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Satisfaction', value: '95%', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">QR</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Xie Bao Crab House</h1>
                <p className="text-xs text-gray-500">Review Generator</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-600"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveStep('upload')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${activeStep === 'upload' ? 'bg-primary-100 text-primary-700' : 'text-gray-600'}`}
            >
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">1. Upload</span>
            </button>
            
            <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
            
            <button
              onClick={() => activeStep !== 'upload' && setActiveStep('generate')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${activeStep === 'generate' ? 'bg-primary-100 text-primary-700' : activeStep === 'submit' ? 'text-primary-600' : 'text-gray-400'}`}
              disabled={activeStep === 'upload'}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">2. Generate</span>
            </button>
            
            <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
            
            <button
              onClick={() => activeStep === 'submit' && setActiveStep('submit')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${activeStep === 'submit' ? 'bg-primary-100 text-primary-700' : 'text-gray-400'}`}
              disabled={activeStep !== 'submit'}
            >
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">3. Submit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Boost <span className="text-primary-600">Xie Bao Crab House</span> Reviews
          </h1>
          <p className="text-gray-600 text-sm">
            QR scan + AI reviews + Google Maps = More 5-star reviews
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-3 mt-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center space-x-1 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                <div className="text-primary-600">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
              <div className="text-primary-600 mb-2 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm text-center mb-1">{feature.title}</h3>
              <p className="text-gray-600 text-xs text-center">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Step Content */}
        {activeStep === 'upload' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-primary-600" />
                    Step 1: Upload or Enter Dish
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Optional: Upload meal photo or enter dish name for personalized reviews
                  </p>
                </div>
              </div>
              
              <MobilePhotoUpload 
                onPhotoUpload={handlePhotoUpload}
                onDishInput={handleDishInput}
              />
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSkipToGenerate}
                  className="w-full py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Skip to Generate Review</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeStep === 'generate' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <button
                    onClick={handleBackToUpload}
                    className="flex items-center text-gray-600 mb-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    <span className="text-sm">Back to Upload</span>
                  </button>
                  <h2 className="text-lg font-bold text-gray-900">Step 2: Generate Your Review</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    AI creates authentic, 20-word reviews based on your input
                  </p>
                </div>
              </div>
              
              <MobileReviewGenerator 
                businessType={businessType}
                dishName={dishName}
                photoDescription={photoDescription}
                onReviewGenerated={handleReviewGenerated}
              />
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => currentReview && setActiveStep('submit')}
                  disabled={!currentReview}
                  className="w-full py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>Continue to Submit</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeStep === 'submit' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <button
                    onClick={handleBackToGenerate}
                    className="flex items-center text-gray-600 mb-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    <span className="text-sm">Back to Generate</span>
                  </button>
                  <h2 className="text-lg font-bold text-gray-900">Step 3: Submit Your Review</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Scan QR code or click button to submit 5-star review to Google
                  </p>
                </div>
              </div>

              {/* QR Code Generator */}
              {isClient && reviewUrl && (
                <div className="mb-6">
                  <MobileQRCodeGenerator
                    url={reviewUrl}
                    businessName={DEFAULT_BUSINESS.name}
                    onRegenerate={handleRegenerateQR}
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="bg-gradient-to-r from-success-500 to-success-600 rounded-xl p-1 shadow-lg">
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || !currentReview}
                  className="w-full py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Star className="w-5 h-5" />
                  <span>
                    {isSubmitting ? 'Opening Google...' : 'Submit 5-Star Review'}
                  </span>
                </button>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentReview);
                    toast.success('Review copied!');
                  }}
                  className="py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <span className="text-sm font-medium">Copy Text</span>
                </button>
                <button
                  onClick={handleRegenerateQR}
                  className="py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors flex items-center justify-center space-x-2"
                >
                  <span className="text-sm font-medium">New QR Code</span>
                </button>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Ready to Boost Reviews?
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Generate QR codes for your restaurant and watch your Google ratings soar.
              </p>
              <button
                onClick={handleSubmitReview}
                disabled={!currentReview}
                className="w-full py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                Submit Review Now
              </button>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h3 className="font-medium text-blue-900 mb-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Mobile Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use camera to upload meal photos directly</li>
            <li>• Tap dish suggestions for quick selection</li>
            <li>• Swipe between steps using progress bar</li>
            <li>• Save QR code to phone for later scanning</li>
            <li>• Enable notifications for review updates</li>
          </ul>
        </div>
      </main>

      {/* Mobile Footer */}
      <footer className="mt-8 px-4 py-6 bg-white border-t border-gray-200">
        <div className="text-center">
          <p className="text-gray-600 text-sm">© 2024 Xie Bao Crab House</p>
          <p className="text-gray-500 text-xs mt-1">Scan QR code to leave a Google review</p>
          
          {/* App Store Badges (Placeholder) */}
          <div className="flex justify-center gap-3 mt-4">
            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs">
              📱 Mobile Optimized
            </div>
            <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-xs">
              🔒 Secure & Private
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-40">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveStep('upload')}
            className={`flex flex-col items-center p-2 ${activeStep === 'upload' ? 'text-primary-600' : 'text-gray-500'}`}
          >
            <Camera className="w-5 h-5" />
            <span className="text-xs mt-1">Upload</span>
          </button>
          
          <button
            onClick={() => activeStep !== 'upload' && setActiveStep('generate')}
            className={`flex flex-col items-center p-2 ${activeStep === 'generate' ? 'text-primary-600' : 'text-gray-500'}`}
            disabled={activeStep === 'upload'}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-xs mt-1">Generate</span>
          </button>
          
          <button
            onClick={() => activeStep === 'submit' && setActiveStep('submit')}
            className={`flex flex-col items-center p-2 ${activeStep === 'submit' ? 'text-primary-600' : 'text-gray-500'}`}
            disabled={activeStep !== 'submit'}
          >
            <Star className="w-5 h-5" />
            <span className="text-xs mt-1">Submit</span>
          </button>
          
          <button
            onClick={() => window.open('https://www.google.com/maps/place/Xie+Bao+Crab+House', '_blank')}
            className="flex flex-col items-center p-2 text-gray-500"
          >
            <QrCode className="w-5 h-5" />
            <span className="text-xs mt-1">Maps</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowMenu(false)}>
          <div className="absolute right-4 top-16 bg-white rounded-xl shadow-xl w-48 p-3" onClick={e => e.stopPropagation()}>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveStep('upload');
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
              >
                <Camera className="w-4 h-4 mr-2" />
                Upload Photo
              </button>
              <button
                onClick={() => {
                  activeStep !== 'upload' && setActiveStep('generate');
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
                disabled={activeStep === 'upload'}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Review
              </button>
              <button
                onClick={() => {
                  activeStep === 'submit' && setActiveStep('submit');
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
                disabled={activeStep !== 'submit'}
              >
                <Star className="w-4 h-4 mr-2" />
                Submit Review
              </button>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <button
                  onClick={() => window.open('https://github.com/CathySong/SmartReview', '_blank')}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
                >
                  View on GitHub
                </button>
                <button
                  onClick={() => window.open('https://vercel.com', '_blank')}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
                >
                  Powered by Vercel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}