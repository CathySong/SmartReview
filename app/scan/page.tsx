'use client';

import { useState, useEffect } from 'react';
import { QrCode, Camera, Sparkles, Star, CheckCircle, ArrowRight, Smartphone, Upload, MessageSquare, ThumbsUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function ScanLandingPage() {
  const router = useRouter();
  const [scanStep, setScanStep] = useState(0);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // Simulate scanning animation
  useEffect(() => {
    if (showQRScanner) {
      const timer = setTimeout(() => {
        setScanComplete(true);
        toast.success('QR Code scanned successfully!');
        
        // Auto navigate after scan
        setTimeout(() => {
          router.push('/scan/generator');
        }, 1500);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showQRScanner, router]);

  const steps = [
    {
      icon: <QrCode className="w-8 h-8" />,
      title: 'Scan QR Code',
      description: 'Point your camera at the QR code at Xie Bao Crab House'
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: 'Upload Photo',
      description: 'Take a photo of your meal or upload from gallery'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI Review Generator',
      description: 'Get personalized 20-word review suggestions'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Submit Review',
      description: 'One-click submission to Google Maps'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Congratulations',
      description: 'Thank you for your 5-star review!'
    }
  ];

  const handleStartScan = () => {
    setShowQRScanner(true);
    setScanStep(1);
    
    // Simulate scanning progress
    const progressTimer = setInterval(() => {
      setScanStep(prev => {
        if (prev >= 4) {
          clearInterval(progressTimer);
          return 4;
        }
        return prev + 1;
      });
    }, 500);
  };

  const handleSkipToGenerator = () => {
    router.push('/scan/generator');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-900 to-primary-700 text-white">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Xie Bao Crab House</h1>
                <p className="text-primary-200 text-sm">QR Code Review System</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-200">Step 1 of 5</p>
              <p className="text-lg font-bold">Scan QR Code</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to <span className="text-yellow-300">Xie Bao Crab House</span>
            </h1>
            <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
              Scan the QR code to leave a review and help us improve!
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold">4.8★</div>
                <div className="text-primary-200 text-sm">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1,200+</div>
                <div className="text-primary-200 text-sm">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-primary-200 text-sm">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* QR Scanner Simulation */}
          <div className="mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Scan Restaurant QR Code</h2>
                <p className="text-primary-200">
                  Point your camera at the QR code displayed at Xie Bao Crab House
                </p>
              </div>

              {!showQRScanner ? (
                <div className="flex flex-col items-center space-y-8">
                  {/* QR Code Placeholder */}
                  <div className="relative">
                    <div className="w-64 h-64 bg-white rounded-2xl p-4 shadow-2xl">
                      <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <div className="text-primary-700 font-bold text-2xl">XBH</div>
                          </div>
                          <p className="text-white text-sm font-medium">Xie Bao Crab House</p>
                          <p className="text-white/80 text-xs">Review Generator</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Scan Animation Guide */}
                    <div className="absolute -top-2 -right-2 animate-pulse">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Camera className="w-3 h-3 text-black" />
                      </div>
                    </div>
                  </div>

                  {/* Start Scan Button */}
                  <button
                    onClick={handleStartScan}
                    className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg flex items-center space-x-3"
                  >
                    <Camera className="w-6 h-6" />
                    <span>Start Camera Scan</span>
                  </button>

                  {/* Skip Option */}
                  <button
                    onClick={handleSkipToGenerator}
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    Skip to review generator →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-8">
                  {/* Scanning Animation */}
                  <div className="relative">
                    <div className="w-64 h-64 bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-primary-500">
                      {/* Scanner Lines */}
                      <div className="absolute inset-0">
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-green-500 ${scanComplete ? 'animate-none' : 'animate-pulse'}`}></div>
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-green-500 ${scanComplete ? 'animate-none' : 'animate-pulse'}`}></div>
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-green-500 ${scanComplete ? 'animate-none' : 'animate-pulse'}`}></div>
                        <div className={`absolute right-0 top-0 bottom-0 w-1 bg-green-500 ${scanComplete ? 'animate-none' : 'animate-pulse'}`}></div>
                        
                        {/* Scanning Line */}
                        {!scanComplete && (
                          <div className="absolute top-1/2 left-0 right-0 h-1 bg-green-400 animate-scan"></div>
                        )}
                      </div>
                      
                      {/* QR Code in Scanner */}
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-40 h-40 bg-white rounded-lg p-3">
                          <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 rounded flex items-center justify-center">
                            <div className="text-white font-bold text-xl">XBH</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Indicator */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${
                        scanComplete ? 'bg-green-500' : 'bg-blue-500'
                      }`}>
                        {scanComplete ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Scan Complete!</span>
                          </>
                        ) : (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span className="text-sm font-medium">Scanning...</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Message */}
                  <div className="text-center">
                    <p className="text-lg font-medium mb-2">
                      {scanComplete ? 'QR Code recognized!' : 'Align QR code within frame'}
                    </p>
                    <p className="text-primary-200 text-sm">
                      {scanComplete 
                        ? 'Redirecting to review generator...' 
                        : 'Hold steady for automatic scan'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Process Steps */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Your Review Journey</h2>
            
            <div className="relative">
              {/* Connection Lines */}
              <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/20 hidden md:block"></div>
              
              <div className="grid md:grid-cols-5 gap-6">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`relative text-center p-4 rounded-xl transition-all ${
                      index <= scanStep 
                        ? 'bg-white/10 backdrop-blur-sm border border-white/20' 
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    {/* Step Number */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      index <= scanStep 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black' 
                        : 'bg-white/10 text-white/60'
                    }`}>
                      {index <= scanStep ? (
                        index === scanStep && !scanComplete && index > 0 ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                        ) : (
                          <span className="font-bold">{index + 1}</span>
                        )
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    
                    {/* Step Icon */}
                    <div className={`mb-3 flex justify-center ${
                      index <= scanStep ? 'text-yellow-300' : 'text-white/40'
                    }`}>
                      {step.icon}
                    </div>
                    
                    {/* Step Title */}
                    <h3 className={`font-bold mb-2 ${
                      index <= scanStep ? 'text-white' : 'text-white/60'
                    }`}>
                      {step.title}
                    </h3>
                    
                    {/* Step Description */}
                    <p className={`text-sm ${
                      index <= scanStep ? 'text-primary-200' : 'text-white/40'
                    }`}>
                      {step.description}
                    </p>
                    
                    {/* Active Indicator */}
                    {index === scanStep && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-yellow-300 mb-4">
                <Smartphone className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">Mobile Optimized</h3>
              <p className="text-primary-200 text-sm">
                Designed specifically for smartphone users with touch-friendly interface
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-yellow-300 mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">AI Powered</h3>
              <p className="text-primary-200 text-sm">
                Generate authentic 20-word reviews based on your dining experience
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-yellow-300 mb-4">
                <ThumbsUp className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg mb-2">Easy Submission</h3>
              <p className="text-primary-200 text-sm">
                One-click submission to Google Maps with pre-filled 5-star review
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-primary-200 mb-6">
              Help Xie Bao Crab House improve by sharing your experience
            </p>
            <button
              onClick={handleStartScan}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg flex items-center space-x-3 mx-auto"
            >
              <Camera className="w-6 h-6" />
              <span>Start Scanning Now</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary-200 text-sm">
            © 2024 Xie Bao Crab House. All rights reserved.
          </p>
          <p className="text-white/60 text-xs mt-2">
            Scan QR code to leave a review and help us serve you better
          </p>
        </div>
      </footer>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10%, 90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }
        
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}