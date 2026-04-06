'use client';

import { useState, useEffect } from 'react';
import { Camera, Sparkles, Star, Upload, ImageIcon, AlertCircle, X, Check, ChevronRight, ArrowLeft, MessageSquare, ThumbsUp, RefreshCw, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function GeneratorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'photo' | 'dish'>('photo');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dishName, setDishName] = useState<string>('');
  const [photoDescription, setPhotoDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isValidPhoto, setIsValidPhoto] = useState<boolean | null>(null);
  const [reviews, setReviews] = useState<string[]>([]);
  const [selectedReview, setSelectedReview] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  const VALID_CATEGORIES = [
    'crab dishes',
    'seafood',
    'restaurant interior',
    'dining area',
    'food presentation',
  ];

  // Generate initial reviews
  useEffect(() => {
    generateReviews();
  }, []);

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
    setIsValidPhoto(null);
    setPhotoDescription('');

    analyzePhotoRelevance(file);
  };

  const analyzePhotoRelevance = async (file: File) => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const isRelevant = Math.random() > 0.3;
      setIsValidPhoto(isRelevant);
      
      if (!isRelevant) {
        toast.error('Photo appears unrelated. Please upload a relevant photo.');
        setIsAnalyzing(false);
      } else {
        const randomCategory = VALID_CATEGORIES[Math.floor(Math.random() * VALID_CATEGORIES.length)];
        const description = `restaurant ${randomCategory}`;
        setPhotoDescription(description);
        toast.success('Photo accepted! Generating reviews...');
        setIsAnalyzing(false);
        generateReviews();
      }
    }, 1500);
  };

  const handleRemovePhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsValidPhoto(null);
    setPhotoDescription('');
  };

  const handleDishSuggestionClick = (dish: string) => {
    setDishName(dish);
    toast.success(`Selected: ${dish}`);
    generateReviews();
  };

  const generateReviews = async () => {
    setIsGenerating(true);
    
    // Simulate AI review generation
    setTimeout(() => {
      const sampleReviews = [
        "The crab was perfectly cooked with amazing garlic sauce. Service was quick and friendly. Definitely coming back!",
        "Fresh seafood and authentic Chinese flavors. The atmosphere was cozy and the staff were very attentive.",
        "Best crab house in town! Generous portions and reasonable prices. Highly recommend the garlic crab.",
        "Excellent dining experience. The seafood was fresh and the service was exceptional. Will visit again soon!",
        "Loved the authentic Chinese cuisine. The crab dishes were particularly outstanding. Great value for money."
      ];
      
      // Select 3 random reviews
      const shuffled = [...sampleReviews].sort(() => 0.5 - Math.random());
      const selectedReviews = shuffled.slice(0, 3);
      
      setReviews(selectedReviews);
      setSelectedReview(selectedReviews[0]);
      setSelectedIndex(0);
      setWordCount(selectedReviews[0].trim().split(/\s+/).length);
      
      const context = dishName || photoDescription 
        ? ` based on ${dishName ? `"${dishName}"` : ''}${dishName && photoDescription ? ' and ' : ''}${photoDescription ? 'photo' : ''}`
        : '';
      
      toast.success(`Generated review options${context}!`);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSelectReview = (review: string, index: number) => {
    setSelectedReview(review);
    setSelectedIndex(index);
    setWordCount(review.trim().split(/\s+/).length);
  };

  const handleCopyReview = () => {
    if (!selectedReview) return;
    
    navigator.clipboard.writeText(selectedReview)
      .then(() => {
        toast.success('Copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy');
      });
  };

  const handleContinue = () => {
    if (!selectedReview) {
      toast.error('Please select a review first');
      return;
    }
    
    // Save review to localStorage for next page
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedReview', selectedReview);
      localStorage.setItem('dishName', dishName);
      localStorage.setItem('photoDescription', photoDescription);
    }
    
    router.push('/scan/review');
  };

  const handleBack = () => {
    router.push('/scan');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">Step 2: Review Generator</h1>
              <p className="text-gray-600 text-sm">Create your personalized review</p>
            </div>
            
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Scan</span>
              <span className="font-medium text-primary-600">Generator</span>
              <span>Review</span>
              <span>Submit</span>
              <span>Done</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary-600 w-2/5"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('photo')}
              className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors ${
                activeTab === 'photo'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>Upload Photo</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('dish')}
              className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors ${
                activeTab === 'dish'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Enter Dish</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="mb-8">
          {activeTab === 'photo' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Your Meal Photo</h2>
                <p className="text-gray-600 mb-6">
                  Upload a photo of your meal for personalized AI review generation
                </p>
                
                {!previewUrl ? (
                  <div className="border-3 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-primary-500 transition-colors">
                    <div className="flex flex-col items-center">
                      <Upload className="w-16 h-16 text-gray-400 mb-6" />
                      <p className="text-gray-700 font-medium text-lg mb-2">Click to upload photo</p>
                      <p className="text-gray-500">JPEG, PNG up to 5MB</p>
                      <p className="text-gray-500 text-sm mt-2">Recommended: Food, restaurant interior, or dining experience</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="border border-gray-200 rounded-2xl overflow-hidden">
                        <img
                          src={previewUrl}
                          alt="Uploaded preview"
                          className="w-full h-64 object-cover"
                        />
                      </div>
                      
                      <button
                        onClick={handleRemovePhoto}
                        className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center space-x-3 py-4 bg-blue-50 rounded-xl">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-blue-700 font-medium">Analyzing photo relevance...</span>
                      </div>
                    ) : isValidPhoto !== null && (
                      <div className={`flex items-center justify-center space-x-3 py-4 rounded-xl ${
                        isValidPhoto ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        {isValidPhoto ? (
                          <>
                            <Check className="w-6 h-6 text-green-600" />
                            <span className="text-green-700 font-medium">Photo accepted! Generating reviews...</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-6 h-6 text-red-600" />
                            <span className="text-red-700 font-medium">Photo appears unrelated. Please upload a relevant photo.</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Skip Option */}
              {!previewUrl && (
                <div className="text-center">
                  <button
                    onClick={() => setActiveTab('dish')}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Skip photo upload and enter dish name instead →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">What Did You Order?</h2>
                <p className="text-gray-600 mb-6">
                  Enter the dish name for personalized AI review generation
                </p>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    placeholder="e.g., Garlic Crab, Kung Pao Shrimp, Crispy Duck"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                  
                  {/* Quick Suggestions */}
                  <div>
                    <p className="text-gray-600 mb-3">Quick select popular dishes:</p>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_DISHES.map((dish) => (
                        <button
                          key={dish}
                          onClick={() => handleDishSuggestionClick(dish)}
                          className={`px-4 py-2 rounded-full transition-colors ${
                            dishName === dish
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {dish}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Back to Photo Option */}
              <div className="text-center">
                <button
                  onClick={() => setActiveTab('photo')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  ← Upload photo instead
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Review Generator */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-primary-600" />
                AI-Generated Review Options
              </h2>
              <p className="text-gray-600 mt-1">
                Choose your favorite or generate new options
              </p>
            </div>
            
            <button
              onClick={generateReviews}
              disabled={isGenerating}
              className="flex items-center space-x-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span className="font-medium">{isGenerating ? 'Generating...' : 'New Options'}</span>
            </button>
          </div>

          {/* Review Options */}
          <div className="space-y-4 mb-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedIndex === index
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelectReview(review, index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          Option {index + 1}
                        </span>
                      </div>
                      
                      {selectedIndex === index && (
                        <div className="text-primary-600">
                          <ThumbsUp className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-800 leading-relaxed">{review}</p>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center text-gray-500 text-sm">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {review.trim().split(/\s+/).length} words
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(review);
                          toast.success('Copied!');
                        }}
                        className="p-1.5 text-gray-500 hover:text-primary-600 transition-colors"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Review Summary */}
          {selectedReview && (
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-5 border border-primary-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Selected Review</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600 flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      {wordCount} words
                    </span>
                    <span className="text-sm text-gray-600 flex items-center">
                      <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                      5-star
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleCopyReview}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600 font-medium">Copy</span>
                </button>
              </div>
              
              {/* Review Preview */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                <p className="text-gray-800 italic leading-relaxed">"{selectedReview}"</p>
              </div>
              
              {/* Quality Indicators */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-xs font-medium text-green-800">Natural</p>
                  <p className="text-xs text-green-600">Sounds real</p>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs font-medium text-blue-800">Specific</p>
                  <p className="text-xs text-blue-600">Real details</p>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded-lg border border-yellow-100">
                  <p className="text-xs font-medium text-yellow-800">Compliant</p>
                  <p className="text-xs text-yellow-600">Google safe</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="sticky bottom-6 bg-white rounded-2xl shadow-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Ready to continue?</p>
              <p className="text-gray-600 text-sm">Proceed to review submission</p>
            </div>
            
            <button
              onClick={handleContinue}
              disabled={!selectedReview}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>Continue to Review</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 p-5 bg-blue-50 rounded-2xl border border-blue-100">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Tips for Best Results
          </h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Choose the review that sounds most authentic to your experience</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Feel free to edit the text to add personal details</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Keep reviews between 15-25 words for best engagement</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Mention specific aspects like food, service, or atmosphere</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}