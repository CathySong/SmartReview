'use client';

import { useState, useEffect } from 'react';
import { Camera, Sparkles, Star, Upload, ImageIcon, AlertCircle, X, Check, ChevronRight, ArrowLeft, MessageSquare, ThumbsUp, RefreshCw, Copy, QrCode, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function MobileSimplePage() {
  const [activeStep, setActiveStep] = useState<'upload' | 'generate' | 'submit'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dishName, setDishName] = useState<string>('');
  const [photoDescription, setPhotoDescription] = useState<string>('');
  const [reviews, setReviews] = useState<string[]>([]);
  const [selectedReview, setSelectedReview] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

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

  // Generate QR code when review is selected
  useEffect(() => {
    if (selectedReview && activeStep === 'submit') {
      generateQRCode();
    }
  }, [selectedReview, activeStep]);

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
    setPhotoDescription('restaurant food');
    toast.success('Photo uploaded');
  };

  const handleRemovePhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setPhotoDescription('');
  };

  const handleDishSuggestionClick = (dish: string) => {
    setDishName(dish);
    toast.success(`Selected: ${dish}`);
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

  const generateQRCode = async () => {
    setIsGeneratingQR(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 200, 200);
        ctx.fillStyle = '#000000';
        ctx.fillRect(20, 20, 160, 160);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(40, 40, 120, 120);
        ctx.fillStyle = '#000000';
        
        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 7; j++) {
            if ((i + j) % 2 === 0) {
              ctx.fillRect(60 + i * 15, 60 + j * 15, 8, 8);
            }
          }
        }
        
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(85, 85, 30, 30);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('QR', 100, 100);
      }
      
      setQrCodeDataUrl(canvas.toDataURL('image/png'));
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeDataUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `review-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('QR code downloaded');
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

  const handleSubmitReview = () => {
    if (!selectedReview) {
      toast.error('Please generate a review first');
      return;
    }

    toast.success('Opening Google Review...');
    
    window.open(
      'https://www.google.com/maps/place/Xie+Bao+Crab+House/@40.5131462,-74.4085894,17z/data=!3m1!5s0x89c3c7df48f8a6a7:0x9199b8e50eabbc2a!4m8!3m7!1s0x89c3c7466ba52f2f:0xc487fc390524a986!8m2!3d40.5131462!4d-74.4060145!9m1!1b1!16s%2Fg%2F11vwz4qcrq?authuser=0&entry=ttu',
      '_blank'
    );
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
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${activeStep === 'generate' ? 'bg-primary-100 text-primary-700' : activeStep === 'submit' ? 'text-primary-600' : 'text-gray-400'}`}
                disabled={activeStep === 'upload'}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Generate</span>
              </button>
              
              <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
              
              <button
                onClick={() => activeStep === 'submit' && setActiveStep('submit')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${activeStep === 'submit' ? 'bg-primary-100 text-primary-700' : 'text-gray-400'}`}
                disabled={activeStep !== 'submit'}
              >
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">Submit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        {/* Step Content */}
        {activeStep === 'upload' && (
          <div className="space-y-6">
            {/* Dish Input */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">What did you order?</h3>
              
              <input
                type="text"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="Enter dish name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3"
              />
              
              <div className="flex flex-wrap gap-2">
                {COMMON_DISHES.slice(0, 5).map((dish) => (
                  <button
                    key={dish}
                    onClick={() => handleDishSuggestionClick(dish)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      dishName === dish
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {dish}
                  </button>
                ))}
              </div>
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

              {/* Continue Button */}
              <button
                onClick={() => selectedReview && setActiveStep('submit')}
                disabled={!selectedReview}
                className="w-full py-3 bg-primary-600 text-white font-bold rounded-lg mt-4 disabled:opacity-50"
              >
                Continue to Submit
              </button>
            </div>
          </div>
        )}

        {activeStep === 'submit' && (
          <div className="space-y-6">
            {/* QR Code */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <QrCode className="w-5 h-5 mr-2" />
                  Review QR Code
                </h3>
              </div>

              <div className="flex flex-col items-center space-y-4">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                      <p className="text-gray-600 text-sm">Generating QR code...</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    onClick={handleDownloadQR}
                    disabled={!qrCodeDataUrl}
                    className="py-2.5 bg-primary-600 text-white rounded-lg text-sm disabled:opacity-50"
                  >
                    Download
                  </button>
                  <button
                    onClick={handleCopyReview}
                    className="py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                  >
                    Copy Text
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-1">
              <button
                onClick={handleSubmitReview}
                className="w-full py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl flex items-center justify-center space-x-2"
              >
                <Star className="w-5 h-5" />
                <span>Submit 5-Star Review</span>
              </button>
            </div>

            {/* Back Button */}
            <button
              onClick={() => setActiveStep('generate')}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg"
            >
              Back to Generate
            </button>
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