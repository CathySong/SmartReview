'use client';

import { useState, useEffect } from 'react';
import { QrCode, Download, RefreshCw, Share2, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MobileQRCodeGeneratorProps {
  url: string;
  businessName: string;
  onRegenerate?: () => void;
}

export default function MobileQRCodeGenerator({ url, businessName, onRegenerate }: MobileQRCodeGeneratorProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate QR code
  useEffect(() => {
    generateQRCode();
  }, [url]);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      // In a real implementation, you would use a QR code library
      // For now, we'll create a simple placeholder
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a simple QR code placeholder
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 200, 200);
        
        // QR code pattern (simplified)
        ctx.fillStyle = '#000000';
        
        // Outer square
        ctx.fillRect(20, 20, 160, 160);
        
        // Inner white square
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(40, 40, 120, 120);
        
        // Pattern dots
        ctx.fillStyle = '#000000';
        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 7; j++) {
            if ((i + j) % 2 === 0) {
              ctx.fillRect(60 + i * 15, 60 + j * 15, 8, 8);
            }
          }
        }
        
        // Logo placeholder
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
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
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
          title: `Review ${businessName} on Google`,
          text: `Scan this QR code to leave a review for ${businessName}`,
          url: url,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast.error('Failed to share');
        }
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(url)
        .then(() => {
          setCopied(true);
          toast.success('URL copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          toast.error('Failed to copy URL');
        });
    }
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate();
    }
    generateQRCode();
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <QrCode className="w-6 h-6 mr-2 text-primary-600" />
            Review QR Code
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Scan to submit your review for {businessName}
          </p>
        </div>
        
        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {/* QR Code Display */}
      <div className="flex flex-col items-center space-y-6">
        {/* QR Code Container */}
        <div className="relative">
          <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-inner">
            {qrCodeDataUrl ? (
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                className="w-64 h-64"
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-3"></div>
                  <p className="text-gray-600 text-sm">Generating QR code...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Business Name Overlay */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-1.5 rounded-full shadow-lg">
            <p className="text-sm font-medium whitespace-nowrap">{businessName}</p>
          </div>
        </div>

        {/* URL Preview */}
        <div className="w-full">
          <p className="text-gray-600 text-sm mb-2 text-center">Review URL:</p>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-gray-800 text-xs font-mono truncate text-center">
              {url.replace('https://', '')}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={handleDownload}
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
                <Check className="w-5 h-5 text-success-600" />
                <span className="text-success-600">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => window.open(url, '_blank')}
            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            Open in Browser
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(url);
              toast.success('URL copied!');
            }}
            className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
          >
            Copy URL
          </button>
          <button
            onClick={() => {
              const text = `Review ${businessName}: ${url}`;
              navigator.clipboard.writeText(text);
              toast.success('Review text copied!');
            }}
            className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
          >
            Copy Text
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
          <QrCode className="w-5 h-5 mr-2" />
          How to Use This QR Code
        </h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="mr-2">1.</span>
            <span>Print and display at your restaurant counter or tables</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">2.</span>
            <span>Customers scan with phone camera</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">3.</span>
            <span>They'll be taken directly to your Google review page</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">4.</span>
            <span>AI-generated review is pre-filled for easy submission</span>
          </li>
        </ul>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">5★</p>
          <p className="text-xs text-gray-600">Rating</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">20s</p>
          <p className="text-xs text-gray-600">Scan Time</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">95%</p>
          <p className="text-xs text-gray-600">Success Rate</p>
        </div>
      </div>
    </div>
  );
}