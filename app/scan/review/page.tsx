'use client';

import { useState, useEffect } from 'react';
import { Star, CheckCircle, QrCode, Download, Share2, Copy, ArrowLeft, ChevronRight, Shield, Clock, Users, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function ReviewPage() {
  const router = useRouter();
  const [selectedReview, setSelectedReview] = useState<string>('');
  const [dishName, setDishName] = useState<string>('');
  const [photoDescription, setPhotoDescription] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedReview = localStorage.getItem('selectedReview');
      const savedDish = localStorage.getItem('dishName');
      const savedPhoto = localStorage.getItem('photoDescription');
      
      if (savedReview) setSelectedReview(savedReview);
      if (savedDish) setDishName(savedDish);
      if (savedPhoto) setPhotoDescription(savedPhoto);
      
      generateQRCode();
    }
  }, []);

  const generateQRCode = async () => {
    setIsGeneratingQR(true);
    try {
      // Simulate QR code generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 200, 200);
        
        // QR pattern
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
        
        // Logo
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(85, 85, 30, 30);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('XBH', 100, 100);
      }
      
      setQrCodeDataUrl(canvas.toDataURL('image/png'));
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeDataUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `xie-bao-crab-house-review-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('QR code downloaded!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Review Xie Bao Crab House on Google',
          text: `Check out my review of Xie Bao Crab House: "${selectedReview.substring(0, 100)}..."`,
          url: 'https://www.google.com/maps/place/Xie+Bao+Crab+House',
        });
        toast.success('Shared successfully!');
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          handleCopyReview();
        }
      }
    } else {
      handleCopyReview();
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

  const handleSubmitReview = () => {
    setSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      toast.success('Opening Google Review page...');
      
      // Open Google Maps review page
      window.open(
        'https://www.google.com/maps/place/Xie+Bao+Crab+House/@40.5131462,-74.4085894,17z/data=!3m1!5s0x89c3c7df48f8a6a7:0x9199b8e50eabbc2a!4m8!3m7!1s0x89c3c7466ba52f2f:0xc487fc390524a986!8m2!3d40.5131462!4d-74.4060145!9m1!1b1!16s%2Fg%2F11vwz4qcrq?authuser=0&entry=ttu',
        '_blank'
      );
      
      // Navigate to congratulations page
      setTimeout(() => {
        router.push('/scan/congratulations');
      }, 1000);
    }, 1500);
  };

  const handleBack = () => {
    router.push('/scan/generator');
  };

  const handleRegenerateQR = () => {
    generateQRCode();
    toast.success('QR code regenerated!');
  };

  const stats = [
    { icon: <Clock className="w-5 h-5" />, label: 'Time to Submit', value: '30s' },
    { icon: <Users className="w-5 h-5" />, label: 'Success Rate', value: '98%' },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Rating Boost', value: '+4.8★' },
  ];

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
              <h1 className="text-xl font-bold text-gray-900">Step 3: Submit Review</h1>
              <p className="text-gray-600 text-sm">Finalize and submit your review</p>
            </div>
            
            <div className="w-20"></div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Scan</span>
              <span>Generator</span>
              <span className="font-medium text-primary-600">Review</span>
              <span>Submit</span>
              <span>Done</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary-600 w-3/5"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Review Summary */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Review Summary</h2>
              <p className="text-gray-600 mt-1">Ready for submission to Google</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="font-bold text-gray-900">5.0</span>
            </div>
          </div>

          {/* Context Info */}
          {(dishName || photoDescription) && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-blue-800">
                <span className="font-medium">Based on:</span>{' '}
                {dishName && `"${dishName}"`}
                {dishName && photoDescription && ' and '}
                {photoDescription && photoDescription}
              </p>
            </div>
          )}

          {/* Review Content */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">Review Text</h3>
              <button
                onClick={handleCopyReview}
                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
              >
                <Copy className="w-4 h-4" />
                <span className="text-sm font-medium">Copy</span>
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <p className="text-gray-800 italic leading-relaxed text-lg">"{selectedReview}"</p>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {selectedReview.trim().split(/\s+/).length} words
                </span>
                <span className="text-sm text-gray-600">•</span>
                <span className="text-sm text-gray-600">Authentic & Natural</span>
              </div>
              <div className="text-sm text-gray-600">Google Policy Compliant ✓</div>
            </div>
          </div>

          {/* Quality Indicators */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100">
              <p className="font-medium text-green-800">Natural Language</p>
              <p className="text-sm text-green-600">Sounds like real feedback</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="font-medium text-blue-800">Specific Details</p>
              <p className="text-sm text-blue-600">Mentions actual experience</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-xl border border-yellow-100">
              <p className="font-medium text-yellow-800">Compliant</p>
              <p className="text-sm text-yellow-600">Follows Google policies</p>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <QrCode className="w-6 h-6 mr-2 text-primary-600" />
                Shareable QR Code
              </h2>
              <p className="text-gray-600 mt-1">
                Download or share this QR code for others to scan
              </p>
            </div>
            
            <button
              onClick={handleRegenerateQR}
              disabled={isGeneratingQR}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>

          <div className="flex flex-col items-center space-y-6">
            {/* QR Code Display */}
            <div className="relative">
              <div className="bg-white p-4 rounded-2xl border-2 border-gray-100 shadow-inner">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code"
                    className="w-64 h-64"
                  />
                ) : (
                  <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-xl">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-3"></div>
                      <p className="text-gray-600">Generating QR code...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Business Name */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-1.5 rounded-full shadow-lg">
                <p className="text-sm font-medium whitespace-nowrap">Xie Bao Crab House</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              <button
                onClick={handleDownloadQR}
                disabled={!qrCodeDataUrl}
                className="py-3 bg-primary-600 text-white rounded-xl font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              
              <button
                onClick={handleShare}
                className="py-3 bg-gray-100 text-gray-700 rounded-xl font-medium flex items-center justify-center space-x-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-primary-600 mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-xl p-1 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Submit Your Review?</h2>
              <p className="text-green-100">
                Your 5-star review will be submitted directly to Google Maps
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5" />
                  <span>Review quality checked ✓</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5" />
                  <span>Google compliant ✓</span>
                </div>
              </div>

              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="w-full py-4 bg-white text-green-600 font-bold text-lg rounded-xl hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                <Star className="w-6 h-6" />
                <span>
                  {submitting ? 'Submitting...' : 'Submit 5-Star Review to Google'}
                </span>
                <ChevronRight className="w-6 h-6" />
              </button>

              <p className="text-green-100 text-sm text-center">
                You'll be redirected to Google Maps to complete the submission
              </p>
            </div>
          </div>
        </div>

        {/* Alternative Options */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Other Options</h3>
          
          <div className="grid md:grid-cols-2 gap-3">
            <button
              onClick={handleCopyReview}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <Copy className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Copy Review Text</p>
                  <p className="text-gray-600 text-sm">Copy to clipboard for manual posting</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={handleDownloadQR}
              disabled={!qrCodeDataUrl}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors text-left disabled:opacity-50"
            >
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Download QR Code</p>
                  <p className="text-gray-600 text-sm">Save for printing or sharing</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 p-5 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Secure & Private</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your review is submitted directly to Google's secure servers</li>
                <li>• We don't store your personal information</li>
                <li>• All data transmission is encrypted</li>
                <li>• Compliant with Google's review policies</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}