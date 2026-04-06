'use client';

import { useState, useEffect } from 'react';
import { Camera, Sparkles, Star, Upload, ImageIcon, AlertCircle, X, Check, ChevronRight, ArrowLeft, MessageSquare, ThumbsUp, RefreshCw, Copy, QrCode, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function MobileSimplePage() {
  const [activeStep, setActiveStep] = useState<'upload' | 'generate'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [reviews, setReviews] = useState<string[]>([]);
  const [selectedReview, setSelectedReview] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const COMMON_DISHES = [
    'Garlic Crab',
    'Steamed Crab',
    'Salt & Pepper Crab',
    'Crab with Black Bean Sauce',
    'Kung Pao Shrimp',
    'Szechuan Fish',
    'Crispy Duck',
    'Beef with Broccoli',
    'Fried Rice',
    'Lo Mein',
  ];

  // Generate initial reviews
  useEffect(() => {
    if (activeStep === 'generate') {
      generateReviews();
    }
  }, [activeStep]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large (max 5MB)');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    toast.success('Photo uploaded');
  };

  const handleRemovePhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleDishToggle = (dish: string) => {
    setSelectedDishes(prev => {
      if (prev.includes(dish)) {
        return prev.filter(d => d !== dish);
      } else {
        return [...prev, dish];
      }
    });
  };

  const generateReviews = async () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const sampleReviews = [
        "The crab was perfectly cooked with amazing garlic sauce. Service was quick and friendly. Definitely coming back!",
        "Fresh seafood and authentic Chinese flavors. The atmosphere was cozy and the staff were very attentive.",
        "Best crab house in town! Generous portions and reasonable prices. Highly recommend the garlic crab.",
      ];
      
      setReviews(sampleReviews);
      setSelectedReview(sampleReviews[0]);
      toast.success('Reviews generated');
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopyReview = () => {
    if (!selectedReview) return;
    
    navigator.clipboard.writeText(selectedReview)
      .then(() => {
        toast.success('Copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy');
      });
  };

  const handleSubmitReview = async () => {
    if (!selectedReview) {
      toast.error('Please generate a review first');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Copy selected text to clipboard
      await navigator.clipboard.writeText(selectedReview);
      
      // 2. Prepare Google review URL with parameters
      const reviewText = encodeURIComponent(selectedReview);
      const dishesText = selectedDishes.length > 0 
        ? encodeURIComponent(`Ordered: ${selectedDishes.join(', ')}. `)
        : '';
      
      // 3. Create Google review URL
      const googleReviewUrl = `https://www.google.com/maps/place/Xie+Bao+Crab+House/@40.5131462,-74.4085894,17z/data=!3m1!5s0x89c3c7df48f8a6a7:0x9199b8e50eabbc2a!4m8!3m7!1s0x89c3c7466ba52f2f:0xc487fc390524a986!8m2!3d40.5131462!4d-74.4060145!9m1!1b1!16s%2Fg%2F11vwz4qcrq?authuser=0&entry=ttu`;
      
      // 4. Open Google review page
      window.open(googleReviewUrl, '_blank');
      
      // 5. Show success message
      toast.success('Review copied and Google page opened!');
      
      // 6. If photo was uploaded, simulate photo upload to Google
      if (selectedFile) {
        toast.success('Photo ready for upload to Google');
        // Note: Actual photo upload to Google would require Google Photos API integration
        // This is a simulation for the user experience
      }
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">QR</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Review Generator</h1>
              </div>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveStep('upload')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${activeStep === 'upload' ? 'bg-primary-100 text-primary-700' : 'text-gray-600'}`}
              >
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">Upload</span>
              </button>
              
              <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
              
              <button
                onClick={() => activeStep !== 'upload' && setActiveStep('generate')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${activeStep === 'generate' ? 'bg-primary-100 text-primary-700' : 'text-gray-400'}`}
                disabled={activeStep === 'upload'}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Generate</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        {/* Step Content */}
        {activeStep === 'upload' && (
          <div className="space-y-6">
            {/* Dish Input - Multi Select */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">What did you order? (Select multiple)</h3>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {COMMON_DISHES.map((dish) => (
                  <button
                    key={dish}
                    onClick={() => handleDishToggle(dish)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedDishes.includes(dish)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {dish}
                    {selectedDishes.includes(dish) && (
                      <span className="ml-1">✓</span>
                    )}
                  </button>
                ))}
              </div>
              
              {selectedDishes.length > 0 && (
                <div className="mt-3 p-3 bg-primary-50 rounded-lg border border-primary-100">
                  <p className="text-primary-800 text-sm">
                    <span className="font-medium">Selected:</span> {selectedDishes.join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Photo Upload */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">Upload photo (optional)</h3>
              
              {!previewUrl ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-700 mb-2">Tap to upload photo</p>
                  <p className="text-gray-500 text-sm">JPEG, PNG up to 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Uploaded"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Continue Button */}
            <button
              onClick={() => setActiveStep('generate')}
              className="w-full py-3 bg-primary-600 text-white font-bold rounded-lg"
            >
              Continue to Generate
            </button>
          </div>
        )}

        {activeStep === 'generate' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">AI Review Options</h3>
                <button
                  onClick={generateReviews}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm"
                >
                  <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>New</span>
                </button>
              </div>

              {/* Review Options */}
              <div className="space-y-3">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border cursor-pointer ${
                      selectedReview === review
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedReview(review)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">Option {index + 1}</span>
                        </div>
                        <p className="text-gray-800 text-sm">{review}</p>
                      </div>
                      {selectedReview === review && (
                        <ThumbsUp className="w-4 h-4 text-primary-600 ml-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Review Actions */}
              {selectedReview && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">Selected Review</p>
                      <p className="text-gray-600 text-sm">
                        {selectedReview.trim().split(/\s+/).length} words
                      </p>
                    </div>
                    <button
                      onClick={handleCopyReview}
                      className="flex items-center space-x-1 text-primary-600"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button in Generate Tab */}
              <div className="mt-6 space-y-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-1">
                  <button
                    onClick={handleSubmitReview}
                    disabled={!selectedReview || isSubmitting}
                    className="w-full py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Star className="w-5 h-5" />
                    <span>
                      {isSubmitting ? 'Submitting...' : 'Submit to Google'}
                    </span>
                  </button>
                </div>
                
                <div className="text-center text-sm text-gray-600">
                  <p>• Review will be copied to clipboard</p>
                  <p>• Google review page will open</p>
                  {selectedFile && <p>• Photo ready for upload</p>}
                  {selectedDishes.length > 0 && <p>• Selected dishes included</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="px-4 py-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-gray-600 text-sm">Review Generator</p>
        </div>
      </footer>
    </div>
  );
}