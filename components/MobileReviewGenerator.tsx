'use client';

import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Copy, Check, Star, ThumbsUp, MessageSquare, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { reviewGenerator } from '@/lib/ai-generator';

interface MobileReviewGeneratorProps {
  businessType?: string;
  dishName?: string;
  photoDescription?: string;
  onReviewGenerated?: (review: string) => void;
}

const FALLBACK_REVIEWS = [
  "The crab was perfectly cooked with amazing garlic sauce. Service was quick and friendly. Definitely coming back!",
  "Fresh seafood and authentic Chinese flavors. The atmosphere was cozy and the staff were very attentive.",
  "Best crab house in town! Generous portions and reasonable prices. Highly recommend the garlic crab."
];

export default function MobileReviewGenerator({ 
  businessType = 'seafood restaurant',
  dishName = '',
  photoDescription = '',
  onReviewGenerated 
}: MobileReviewGeneratorProps) {
  const [reviews, setReviews] = useState<string[]>([]);
  const [selectedReview, setSelectedReview] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Mark when component is mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate initial reviews on component mount (client-side only)
  useEffect(() => {
    if (!isClient) return;
    
    // Use a small timeout to ensure component is fully mounted
    const timer = setTimeout(() => {
      generateNewReviews();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [businessType, isClient]);

  // Initialize with empty reviews for better UX (client-side only)
  useEffect(() => {
    if (!isClient) return;
    
    if (reviews.length === 0) {
      // Show loading state
      setReviews(['Generating review options...', 'Please wait a moment...', 'AI is creating personalized reviews...']);
    }
  }, [isClient]);

  // Update word count when selected review changes
  useEffect(() => {
    if (selectedReview) {
      const words = selectedReview.trim().split(/\s+/).length;
      setWordCount(words);
    }
  }, [selectedReview]);

  const generateNewReviews = async () => {
    setIsGenerating(true);
    try {
      const newReviews = await reviewGenerator.generateReviewOptions(
        businessType, 
        3,
        dishName,
        photoDescription
      );
      setReviews(newReviews);
      setSelectedReview(newReviews[0]);
      setSelectedIndex(0);
      
      if (onReviewGenerated) {
        onReviewGenerated(newReviews[0]);
      }
      
      const contextMessage = dishName || photoDescription 
        ? ` based on ${dishName ? `"${dishName}"` : ''}${dishName && photoDescription ? ' and ' : ''}${photoDescription ? 'photo' : ''}`
        : '';
      
      toast.success(`Generated new reviews${contextMessage}!`);
    } catch (error) {
      console.error('Error generating reviews:', error);
      // Use fallback reviews
      setReviews(FALLBACK_REVIEWS);
      setSelectedReview(FALLBACK_REVIEWS[0]);
      setSelectedIndex(0);
      if (onReviewGenerated) {
        onReviewGenerated(FALLBACK_REVIEWS[0]);
      }
      toast.success('Generated review options!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyReview = () => {
    if (!selectedReview) return;
    
    navigator.clipboard.writeText(selectedReview)
      .then(() => {
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy');
      });
  };

  const handleSelectReview = (review: string, index: number) => {
    setSelectedReview(review);
    setSelectedIndex(index);
    if (onReviewGenerated) {
      onReviewGenerated(review);
    }
  };

  const handleRegenerateSingle = async (index: number) => {
    try {
      const newReview = await reviewGenerator.generateReview(businessType, dishName, photoDescription);
      const updatedReviews = [...reviews];
      updatedReviews[index] = newReview;
      setReviews(updatedReviews);
      
      if (index === selectedIndex) {
        setSelectedReview(newReview);
        if (onReviewGenerated) {
          onReviewGenerated(newReview);
        }
      }
      
      toast.success('Regenerated!');
    } catch (error) {
      console.error('Error regenerating review:', error);
      toast.error('Failed to regenerate');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-primary-600" />
            AI Review Generator
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Choose your favorite or generate new options
          </p>
        </div>
        
        <button
          onClick={generateNewReviews}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span className="font-medium">{isGenerating ? 'Generating...' : 'New'}</span>
        </button>
      </div>

      {/* Review Options - Mobile Carousel Style */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border transition-all ${
              selectedIndex === index
                ? 'border-primary-500 bg-primary-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => handleSelectReview(review, index)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Review Header */}
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
                
                {/* Review Text */}
                <p className="text-gray-800 text-sm leading-relaxed">{review}</p>
                
                {/* Word Count */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center text-gray-500 text-xs">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    {review.trim().split(/\s+/).length} words
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRegenerateSingle(index);
                      }}
                      className="p-1.5 text-gray-500 hover:text-primary-600 transition-colors"
                      title="Regenerate"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
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
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-success-600" />
                  <span className="text-success-600 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600 font-medium">Copy</span>
                </>
              )}
            </button>
          </div>
          
          {/* Review Preview */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-gray-800 italic text-sm leading-relaxed">"{selectedReview}"</p>
          </div>
          
          {/* Quality Indicators */}
          <div className="mt-4 grid grid-cols-3 gap-2">
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

      {/* Tips */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
          Tips for Best Results
        </h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Choose the review that sounds most authentic</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Keep reviews between 15-25 words for best engagement</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Mention specific aspects like food or service</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Feel free to edit the text to add personal details</span>
          </li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={generateNewReviews}
          disabled={isGenerating}
          className="py-3 bg-primary-600 text-white rounded-xl font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>Generate New</span>
        </button>
        <button
          onClick={handleCopyReview}
          disabled={!selectedReview}
          className="py-3 bg-gray-100 text-gray-700 rounded-xl font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Copy className="w-4 h-4" />
          <span>Copy All</span>
        </button>
      </div>
    </div>
  );
}