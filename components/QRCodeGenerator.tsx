'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Copy, Download, RefreshCw, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface QRCodeGeneratorProps {
  url: string;
  businessName: string;
  onRegenerate?: () => void;
}

export default function QRCodeGenerator({ url, businessName, onRegenerate }: QRCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [qrSize, setQrSize] = useState(256);

  // Adjust QR size based on screen width
  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) {
        setQrSize(200);
      } else if (window.innerWidth < 1024) {
        setQrSize(256);
      } else {
        setQrSize(300);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        toast.success('URL copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy URL');
      });
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = qrSize;
      canvas.height = qrSize;
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${businessName.toLowerCase().replace(/\s+/g, '-')}-review-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    toast.success('QR code downloaded!');
  };

  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Scan to Review</h3>
        <p className="text-gray-600">Scan this QR code with your phone camera to submit your review</p>
      </div>

      {/* QR Code Display */}
      <div className="flex justify-center mb-6">
        <div className="relative p-4 bg-white rounded-lg border border-gray-200">
          <QRCode
            id="qr-code-svg"
            value={url}
            size={qrSize}
            level="H" // High error correction
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
          
          {/* Center logo overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">5★</span>
            </div>
          </div>
        </div>
      </div>

      {/* URL Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
          <code className="text-sm text-gray-700 truncate flex-1 mr-2">
            {url.length > 50 ? `${url.substring(0, 50)}...` : url}
          </code>
          <button
            onClick={handleCopyUrl}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-success-600" />
                <span className="text-sm text-success-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Copy</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Or copy the URL above and open it on your phone
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownloadQR}
          className="flex items-center justify-center space-x-2 btn-secondary flex-1"
        >
          <Download className="w-4 h-4" />
          <span>Download QR</span>
        </button>
        
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="flex items-center justify-center space-x-2 btn-primary flex-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New QR Code</span>
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">How to use:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">1.</span>
            Open your phone camera and point it at the QR code
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">2.</span>
            Tap the notification/link that appears
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">3.</span>
            Review will open in Google Maps with 5 stars pre-filled
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">4.</span>
            Edit if needed, then click "Post" to submit
          </li>
        </ul>
      </div>

      {/* NFC Note */}
      <div className="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-100">
        <p className="text-sm text-primary-800">
          <strong>NFC Option:</strong> For physical locations, consider NFC tags that 
          customers can tap with their phones for instant review access.
        </p>
      </div>
    </div>
  );
}