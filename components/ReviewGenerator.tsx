'use client';

import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Copy, Check, Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { reviewGenerator } from '@/lib/ai-generator';

interface ReviewGeneratorProps {
  businessType?: string;
  dishName?: string;
  photoDescription?: string;
  onReviewGenerated?: (review: string) => void;
}

export default function ReviewGenerator({ 
  businessType = 'seafood restaurant',
  dishName = '',
  photoDescription = '',
  onReviewGenerated 
}: ReviewGeneratorProps) {
  const [reviews, setReviews] = useState<string[]>([]);
  const [selectedReview, setSelectedReview] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

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
    }, 300);
    
    return () => clearTimeout(timer);
  }, [businessType, isClient]);

  // Initialize with empty reviews for better UX (client-side only)
  useEffect(() => {
    if (!isClient) return;
    
    if (reviews.length === 0) {
      // Show loading state
      setReviews(['Loading review options...', 'Please wait...', 'Generating AI reviews...']);
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
      
      if (onReviewGenerated) {
        onReviewGenerated(newReviews[0]);
      }
      
      const contextMessage = dishName || photoDescription 
        ? ` based on ${dishName ? `"${dishName}"` : ''}${dishName && photoDescription ? ' and ' : ''}${photoDescription ? 'photo' : ''}`
        : '';
      
      toast.success(`Generated new review options${contextMessage}!`);
    } catch (error) {
      console.error('Error generating reviews:', error);
      toast.error('Failed to generate reviews');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyReview = () => {
    if (!selectedReview) return;
    
    navigator.clipboard.writeText(selectedReview)
      .then(() => {
        setCopied(true);
        toast.success('Review copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy review');
      });
  };

  const handleSelectReview = (review: string) => {
    setSelectedReview(review);
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
      
      if (index === reviews.findIndex(r => r === selectedReview)) {
        setSelectedReview(newReview);
        if (onReviewGenerated) {
          onReviewGenerated(newReview);
        }
      }
      
      toast.success('Regenerated this option!');
    } catch (error) {
      console.error('Error regenerating review:', error);
      toast.error('Failed to regenerate review');
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-primary-600" />
            AI-Generated Review
          </h3>
          <p className="text-gray-600 mt-1">
            Choose your favorite or generate new options
          </p>
        </div>
        
        <button
          onClick={generateNewReviews}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Generating...' : 'New Options'}</span>
        </button>
      </div>

      {/* Review Options */}
      <div className="space-y-4 mb-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              selectedReview === review
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => handleSelectReview(review)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
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
                <p className="text-gray-800">{review}</p>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegenerateSingle(index);
                  }}
                  className="p-1.5 text-gray-500 hover:text-primary-600 transition-colors"
                  title="Regenerate this option"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                {selectedReview === review && (
                  <div className="p-1.5 text-primary-600">
                    <ThumbsUp className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Review Actions */}
      {selectedReview && (
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-gray-900">Selected Review</h4>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-600 flex items-center">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {wordCount} words
                </span>
                <span className="text-sm text-gray-600 flex items-center">
                  <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                  5-star rating
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
                  <span className="text-success-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600">Copy Text</span>
                </>
              )}
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-800 italic">"{selectedReview}"</p>
          </div>
          
          {/* Review Quality Indicators */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="text-center p-3 bg-success-50 rounded-lg border border-success-100">
              <p className="text-sm font-medium text-success-800">Natural Language</p>
              <p className="text-xs text-success-600">Sounds like real feedback</p>
            </div>
            <div className="text-center p-3 bg-primary-50 rounded-lg border border-primary-100">
              <p className="text-sm font-medium text-primary-800">Specific Details</p>
              <p className="text-xs text-primary-600">Mentions actual experience</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <p className="text-sm font-medium text-yellow-800">Compliant</p>
              <p className="text-xs text-yellow-600">Follows Google policies</p>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center">
          <Sparkles className="w-4 h-4 mr-2" />
          Pro Tips for Best Results
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Choose the review that sounds most authentic to your experience</li>
          <li>• Feel free to edit the text to add personal details</li>
          <li>• Keep reviews between 15-25 words for best engagement</li>
          <li>• Mention specific aspects like food, service, or atmosphere</li>
        </ul>
      </div>
    </div>
  );
}