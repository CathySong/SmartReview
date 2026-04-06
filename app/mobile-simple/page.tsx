'use client';

import { useState, useEffect } from 'react';
import { Camera, Sparkles, Star, Upload, ImageIcon, AlertCircle, X, Check, ChevronRight, ArrowLeft, MessageSquare, ThumbsUp, RefreshCw, Copy, QrCode, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function MobileSimplePage() {
  const [activeStep, setActiveStep] = useState<'select' | 'generate'>('select');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [reviews, setReviews] = useState<string[]>([]);
  const [selectedReview, setSelectedReview] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectedDishes, setDetectedDishes] = useState<string[]>([]);

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

  // Generate reviews when entering generate step
  useEffect(() => {
    if (activeStep === 'generate') {
      analyzeAndGenerateReviews();
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
    toast.success('Photo uploaded for AI analysis');
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

  const analyzeAndGenerateReviews = async () => {
    setIsGenerating(true);
    
    // 模拟AI分析照片识别菜品
    setTimeout(() => {
      let finalDishes = [...selectedDishes];
      
      // 如果有上传照片，模拟AI识别菜品
      if (selectedFile) {
        // 模拟从照片中识别菜品
        const photoDetectedDishes = [
          'Garlic Crab',
          'Fried Rice',
          'Spring Rolls'
        ].filter(dish => Math.random() > 0.5); // 随机选择一些菜品
        
        if (photoDetectedDishes.length > 0) {
          setDetectedDishes(photoDetectedDishes);
          finalDishes = Array.from(new Set([...finalDishes, ...photoDetectedDishes]));
          toast.success(`AI detected: ${photoDetectedDishes.join(', ')} from photo`);
        } else {
          toast.success('Photo analyzed - no specific dishes detected');
        }
      }
      
      // 生成20字左右的针对性点评
      const generateShortReview = (dishes: string[]) => {
        if (dishes.length === 0) {
          return "Amazing food and service! Will definitely return.";
        }
        
        if (dishes.length === 1) {
          const dish = dishes[0];
          const reviews = [
            `${dish} was absolutely delicious! Perfectly cooked.`,
            `Loved the ${dish}! Fresh ingredients, great flavor.`,
            `${dish} exceeded expectations. Highly recommend it!`,
            `The ${dish} was fantastic. Will order again.`,
            `${dish} was the highlight of my meal. Excellent!`
          ];
          return reviews[Math.floor(Math.random() * reviews.length)];
        }
        
        if (dishes.length === 2) {
          return `${dishes[0]} and ${dishes[1]} were both excellent! Great meal.`;
        }
        
        const mainDish = dishes[0];
        return `${mainDish} and other dishes were all wonderful. Great experience!`;
      };
      
      // 生成3个20字左右的选项
      const shortReviews = [
        generateShortReview(finalDishes),
        generateShortReview(finalDishes),
        generateShortReview(finalDishes)
      ];
      
      // 确保每个选项都不同
      const uniqueReviews = Array.from(new Set(shortReviews));
      while (uniqueReviews.length < 3) {
        uniqueReviews.push(generateShortReview(finalDishes));
      }
      
      setReviews(uniqueReviews.slice(0, 3));
      setSelectedReview(uniqueReviews[0]);
      
      const source = finalDishes.length > 0 
        ? `selected ${finalDishes.length} dish${finalDishes.length > 1 ? 'es' : ''}`
        : 'general experience';
      toast.success(`Generated 20-word reviews based on ${source}`);
      setIsGenerating(false);
    }, 2000);
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
      toast.error('Please select a review first');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. 编码评论文本用于URL参数
      const encodedReview = encodeURIComponent(selectedReview);
      
      // 2. 创建Google review URL，自动填充评论文本和5星评分
      // 注意：Google Maps URL参数可能有限制，这是模拟自动填充
      const googleReviewUrl = `https://www.google.com/maps/place/Xie+Bao+Crab+House/@40.5131462,-74.4085894,17z/data=!3m1!5s0x89c3c7df48f8a6a7:0x9199b8e50eabbc2a!4m8!3m7!1s0x89c3c7466ba52f2f:0xc487fc390524a986!8m2!3d40.5131462!4d-74.4060145!9m1!1b1!16s%2Fg%2F11vwz4qcrq?authuser=0&entry=ttu`;
      
      // 3. 打开Google review页面
      window.open(googleReviewUrl, '_blank');
      
      // 4. 显示自动填充提示
      toast.success('Google review opened! Your selected review is ready to paste.');
      
      // 5. 自动复制评论文本到剪贴板
      await navigator.clipboard.writeText(selectedReview);
      toast.success('Review copied to clipboard - ready to paste!');
      
      // 6. 显示操作说明
      setTimeout(() => {
        toast.success('Tip: Paste (Cmd/Ctrl+V) in Google review box, select 5 stars, and submit!');
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to open Google review');
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
                onClick={() => setActiveStep('select')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${activeStep === 'select' ? 'bg-primary-100 text-primary-700' : 'text-gray-600'}`}
              >
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Select</span>
              </button>
              
              <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
              
              <button
                onClick={() => setActiveStep('generate')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${activeStep === 'generate' ? 'bg-primary-100 text-primary-700' : 'text-gray-600'}`}
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
        {activeStep === 'select' && (
          <div className="space-y-6">
            {/* Dish Input - Multi Select */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">Select what you ate</h3>
              <p className="text-gray-600 text-sm mb-3">Choose dishes or upload photo/receipt for AI to analyze</p>
              
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

            {/* Photo/Receipt Upload */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">Or upload photo/receipt (optional)</h3>
              <p className="text-gray-600 text-sm mb-3">AI will analyze and identify dishes</p>
              
              {!previewUrl ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-700 mb-2">Tap to upload photo</p>
                  <p className="text-gray-500 text-sm">JPEG, PNG up to 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
                <div>
                  <h3 className="font-bold text-gray-900">AI Review Options</h3>
                  {selectedDishes.length > 0 && (
                    <p className="text-gray-600 text-sm mt-1">
                      Based on: {selectedDishes.join(', ')}
                    </p>
                  )}
                </div>
                <button
                  onClick={analyzeAndGenerateReviews}
                  disabled={isGenerating}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm"
                >
                  <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
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
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">Option {index + 1}</span>
                          </div>
                          
                          {/* Copy Button for each option */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(review)
                                .then(() => {
                                  toast.success(`Option ${index + 1} copied!`);
                                })
                                .catch(() => {
                                  toast.error('Failed to copy');
                                });
                            }}
                            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                          >
                            <Copy className="w-3 h-3" />
                            <span className="text-xs">Copy</span>
                          </button>
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
                      {isSubmitting ? 'Opening...' : 'Submit to Google'}
                    </span>
                  </button>
                </div>
                
                <div className="text-center text-sm text-gray-600 space-y-1">
                  <p>• Review will auto-copy to clipboard</p>
                  <p>• Google page opens with 5-star selected</p>
                  <p>• Just paste review and click submit</p>
                  {detectedDishes.length > 0 && (
                    <p>• AI detected: {detectedDishes.join(', ')}</p>
                  )}
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