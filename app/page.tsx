'use client';

import { useState, useEffect } from 'react';
import { Camera, MessageSquare, QrCode, Shield, Sparkles, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReviewGenerator from '@/components/ReviewGenerator';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import PhotoUpload from '@/components/PhotoUpload';
import { GoogleReviewService, DEFAULT_BUSINESS } from '@/lib/google-review';

export default function Home() {
  const [currentReview, setCurrentReview] = useState<string>('');
  const [businessType, setBusinessType] = useState('seafood restaurant');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewUrl, setReviewUrl] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoDescription, setPhotoDescription] = useState<string>('');
  const [dishName, setDishName] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

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
      reviewText: currentReview,
      placeId: DEFAULT_BUSINESS.placeId,
      businessName: DEFAULT_BUSINESS.name,
    };

    const url = GoogleReviewService.generateReviewUrl(reviewData);
    setReviewUrl(url);
  };

  const handleReviewGenerated = (review: string) => {
    setCurrentReview(review);
  };

  const handlePhotoUpload = (file: File | null, description: string) => {
    setSelectedPhoto(file);
    setPhotoDescription(description);
    if (file) {
      toast.success('Photo uploaded! AI will generate personalized reviews.');
    }
  };

  const handleDishInput = (dish: string) => {
    setDishName(dish);
    if (dish) {
      toast.success(`Dish selected: ${dish}`);
    }
  };

  const handleSubmitReview = () => {
    if (!currentReview) {
      toast.error('Please generate a review first');
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
    
    toast.success('Opening Google Maps. Please choose your own rating before posting.');
    setIsSubmitting(false);
  };

  const handleRegenerateQR = () => {
    updateReviewUrl();
    toast.success('QR code updated with latest review!');
  };

  const features = [
    {
      icon: <QrCode className="w-6 h-6" />,
      title: 'QR Code Scan',
      description: 'Scan to access Xie Bao Crab House review page'
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: 'Photo Upload',
      description: 'Optional: Upload meal photos for personalized reviews'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI Review Generation',
      description: 'Personalized draft text based on customer context'
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Customer-Controlled Posting',
      description: 'Customer chooses the rating and edits before posting'
    }
  ];

  const stats = [
    { label: 'Policy Focus', value: 'Honest', icon: <Shield className="w-5 h-5" /> },
    { label: 'Customer Control', value: '100%', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Review Destination', value: 'Google', icon: <Star className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Help Customers Write Better <span className="text-primary-600">Google Reviews</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          QR access + optional AI writing help + customer-controlled posting for honest restaurant feedback.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-2 bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-primary-600">
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="card text-center">
            <div className="text-primary-600 mb-4 flex justify-center">
              {feature.icon}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Main Workflow */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <Camera className="w-6 h-6 mr-2 text-primary-600" />
                Step 1: Upload Photo or Enter Dish (Optional)
              </h2>
              <p className="text-gray-600">
                Upload a photo of your meal or enter the dish name for a personalized review draft.
              </p>
            </div>
            
            <PhotoUpload 
              onPhotoUpload={handlePhotoUpload}
              onDishInput={handleDishInput}
            />
          </div>

          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Generate Your Review</h2>
              <p className="text-gray-600">
                AI suggests editable review text based on the customer’s actual experience.
              </p>
            </div>
            
            <ReviewGenerator 
              businessType={businessType}
              dishName={dishName}
              photoDescription={photoDescription}
              onReviewGenerated={handleReviewGenerated}
            />
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 3: Submit Your Review</h2>
            <p className="text-gray-600">
              Open Google Maps, choose your own rating, edit the text, and post only if it reflects your experience.
            </p>
          </div>

          {reviewUrl && (
            <QRCodeGenerator
              url={reviewUrl}
              businessName={DEFAULT_BUSINESS.name}
              onRegenerate={handleRegenerateQR}
            />
          )}

          <div className="card mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Direct Submission</h3>
            <button
              onClick={handleSubmitReview}
              disabled={isSubmitting || !currentReview}
              className="w-full py-4 bg-gradient-to-r from-success-500 to-success-600 text-white font-bold text-lg rounded-lg hover:from-success-600 hover:to-success-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Star className="w-5 h-5" />
              <span>
                {isSubmitting ? 'Opening Google Maps...' : 'Open Google Review Page'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Collect More Honest Customer Feedback?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Give customers a smoother path to Google Maps while keeping the final review honest and fully under their control.
        </p>
        <button
          onClick={handleSubmitReview}
          disabled={!currentReview}
          className="px-8 py-4 bg-primary-600 text-white font-bold text-lg rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          Open Review Page
        </button>
      </div>
    </div>
  );
}
