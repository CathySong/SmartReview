'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Star, PartyPopper, Gift, Share2, Home, Heart, Users, TrendingUp, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function CongratulationsPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [showConfetti, setShowConfetti] = useState(true);

  // Confetti effect
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Countdown for auto-redirect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      router.push('/');
    }
  }, [countdown, router]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'I just reviewed Xie Bao Crab House!',
          text: 'Check out this amazing seafood restaurant!',
          url: 'https://www.google.com/maps/place/Xie+Bao+Crab+House',
        });
        toast.success('Shared successfully!');
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast.error('Failed to share');
        }
      }
    } else {
      navigator.clipboard.writeText('https://www.google.com/maps/place/Xie+Bao+Crab+House')
        .then(() => {
          toast.success('Link copied to clipboard!');
        })
        .catch(() => {
          toast.error('Failed to copy link');
        });
    }
  };

  const handleReturnHome = () => {
    router.push('/');
  };

  const handleLeaveAnotherReview = () => {
    router.push('/scan');
  };

  const rewards = [
    {
      icon: <Gift className="w-6 h-6" />,
      title: '10% Off Next Visit',
      description: 'Show this screen for discount',
      code: 'REVIEW10'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Free Appetizer',
      description: 'On your next order',
      code: 'FREEAPP'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Loyalty Points',
      description: '100 points added to account',
      code: 'LOYAL100'
    }
  ];

  const stats = [
    { icon: <Users className="w-5 h-5" />, label: 'Happy Customers', value: '1,200+' },
    { icon: <Star className="w-5 h-5" />, label: 'Average Rating', value: '4.8★' },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Review Growth', value: '300%' },
    { icon: <Clock className="w-5 h-5" />, label: 'Response Time', value: '<24h' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Xie Bao Crab House</h1>
                <p className="text-gray-600 text-sm">Review Submitted Successfully</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Step 5 of 5</p>
              <p className="text-lg font-bold text-green-600">Congratulations!</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <PartyPopper className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 animate-bounce">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-black" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Thank You for Your <span className="text-green-600">5-Star Review!</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your feedback helps us improve and serve you better. We truly appreciate your support!
            </p>
            
            {/* Auto Redirect */}
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-8">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Returning to homepage in {countdown} seconds...
              </span>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Your Rewards & Thank You Gifts
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {rewards.map((reward, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                  <div className="text-green-600 mb-4">
                    {reward.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{reward.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <p className="text-gray-800 font-mono text-center font-bold">{reward.code}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-center text-gray-600 text-sm mt-6">
              Show these codes at Xie Bao Crab House to claim your rewards
            </p>
          </div>

          {/* Stats */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Your Impact on Our Community
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                  <div className="text-green-600 mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-xl p-1 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                What's Next?
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Share2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-2">Share the Love</h3>
                  <p className="text-green-100 text-sm">
                    Tell your friends about your experience
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-2">Visit Again</h3>
                  <p className="text-green-100 text-sm">
                    Use your rewards on your next visit
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-2">Join Community</h3>
                  <p className="text-green-100 text-sm">
                    Follow us for updates and specials
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={handleShare}
              className="py-4 bg-white border-2 border-green-600 text-green-600 rounded-xl font-bold hover:bg-green-50 transition-colors flex items-center justify-center space-x-3"
            >
              <Share2 className="w-5 h-5" />
              <span>Share with Friends</span>
            </button>
            
            <button
              onClick={handleLeaveAnotherReview}
              className="py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center space-x-3"
            >
              <Star className="w-5 h-5" />
              <span>Leave Another Review</span>
            </button>
          </div>

          {/* Return Home Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleReturnHome}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <Home className="w-4 h-4 mr-2" />
              <span>Return to Homepage</span>
            </button>
          </div>

          {/* Thank You Message */}
          <div className="mt-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                From the Xie Bao Crab House Team
              </h3>
              <p className="text-gray-600 italic mb-4">
                "Thank you for taking the time to share your experience. Your feedback is invaluable 
                to us and helps us continue providing the best seafood dining experience. We look 
                forward to serving you again soon!"
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">- The Xie Bao Crab House Family</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 text-sm">
            © 2024 Xie Bao Crab House. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Thank you for being a valued customer. Your support means everything to us.
          </p>
        </div>
      </footer>

      {/* Confetti Animation */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
}