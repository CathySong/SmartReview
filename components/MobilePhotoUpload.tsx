'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, ImageIcon, AlertCircle, X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MobilePhotoUploadProps {
  onPhotoUpload: (file: File | null, description: string) => void;
  onDishInput: (dish: string) => void;
}

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

export default function MobilePhotoUpload({ onPhotoUpload, onDishInput }: MobilePhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dishName, setDishName] = useState<string>('');
  const [photoDescription, setPhotoDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isValidPhoto, setIsValidPhoto] = useState<boolean | null>(null);
  const [showDishSuggestions, setShowDishSuggestions] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large (max 5MB)');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setIsValidPhoto(null);
    setPhotoDescription('');

    // Analyze photo for relevance
    analyzePhotoRelevance(file);
  };

  const analyzePhotoRelevance = async (file: File) => {
    setIsAnalyzing(true);
    
    // Simulate photo analysis
    setTimeout(() => {
      const isRelevant = Math.random() > 0.3; // 70% chance
      setIsValidPhoto(isRelevant);
      
      if (!isRelevant) {
        toast.error('Photo appears unrelated. Please upload a relevant photo or skip.');
        setIsAnalyzing(false);
        onPhotoUpload(file, '');
      } else {
        const randomCategory = VALID_CATEGORIES[Math.floor(Math.random() * VALID_CATEGORIES.length)];
        const description = `restaurant ${randomCategory}`;
        setPhotoDescription(description);
        toast.success('Photo accepted!');
        setIsAnalyzing(false);
        onPhotoUpload(file, description);
      }
    }, 1000);
  };

  const handleRemovePhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsValidPhoto(null);
    setPhotoDescription('');
    onPhotoUpload(null, '');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDishNameChange = (value: string) => {
    setDishName(value);
    onDishInput(value);
    setShowDishSuggestions(value.length > 0);
  };

  const handleDishSuggestionClick = (dish: string) => {
    setDishName(dish);
    onDishInput(dish);
    setShowDishSuggestions(false);
    toast.success(`Selected: ${dish}`);
  };

  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSkipPhoto = () => {
    toast.success('Photo upload skipped');
    onPhotoUpload(null, '');
  };

  return (
    <div className="space-y-6">
      {/* Dish Input Section */}
      <div>
        <label className="block font-medium text-gray-900 mb-3 text-lg">
          What did you order?
        </label>
        <div className="relative">
          <input
            type="text"
            value={dishName}
            onChange={(e) => handleDishNameChange(e.target.value)}
            placeholder="e.g., Garlic Crab, Kung Pao Shrimp"
            className="w-full px-4 py-4 border border-gray-300 rounded-xl text-base bg-white"
          />
          {dishName && (
            <button
              onClick={() => {
                setDishName('');
                onDishInput('');
                setShowDishSuggestions(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Dish Suggestions */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-3">Quick select:</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_DISHES.slice(0, 5).map((dish) => (
              <button
                key={dish}
                onClick={() => handleDishSuggestionClick(dish)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  dishName === dish
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dish}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowDishSuggestions(!showDishSuggestions)}
            className="mt-3 text-primary-600 text-sm font-medium"
          >
            {showDishSuggestions ? 'Show less' : 'Show all dishes...'}
          </button>
        </div>

        {/* All Dish Suggestions */}
        {showDishSuggestions && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-3">All dishes:</p>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_DISHES.map((dish) => (
                <button
                  key={dish}
                  onClick={() => handleDishSuggestionClick(dish)}
                  className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                    dishName === dish
                      ? 'bg-primary-100 text-primary-700 border border-primary-300'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {dish}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Photo Upload Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="font-medium text-gray-900 text-lg">
            Upload Photo (Optional)
          </label>
          {!selectedFile && (
            <button
              onClick={handleSkipPhoto}
              className="text-primary-600 text-sm font-medium"
            >
              Skip
            </button>
          )}
        </div>

        {!previewUrl ? (
          <div className="space-y-4">
            {/* Camera Button */}
            <button
              onClick={handleTakePhoto}
              className="w-full py-4 bg-primary-600 text-white rounded-xl font-medium flex items-center justify-center space-x-3"
            >
              <Camera className="w-6 h-6" />
              <span>Take Photo with Camera</span>
            </button>

            {/* Or Upload Button */}
            <div className="relative">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">Or upload from gallery</p>
                <p className="text-gray-500 text-sm">JPEG, PNG up to 5MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Photo Preview */}
            <div className="relative">
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Uploaded preview"
                  className="w-full h-48 object-cover"
                />
              </div>
              
              {/* Remove Button */}
              <button
                onClick={handleRemovePhoto}
                className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Status */}
            <div className="space-y-3">
              {isAnalyzing ? (
                <div className="flex items-center justify-center space-x-3 py-3 bg-blue-50 rounded-xl">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-blue-700 font-medium">Analyzing photo...</span>
                </div>
              ) : isValidPhoto !== null && (
                <div className={`flex items-center justify-center space-x-3 py-3 rounded-xl ${
                  isValidPhoto ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  {isValidPhoto ? (
                    <>
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-medium">Photo accepted!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-700 font-medium">Photo appears unrelated</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Photo Description */}
            {photoDescription && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-blue-800 text-sm">
                  <span className="font-medium">Photo analysis:</span> {photoDescription}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Guidelines */}
      <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
        <h4 className="font-medium text-yellow-900 mb-3 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Photo Guidelines
        </h4>
        <ul className="text-sm text-yellow-800 space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Upload photos of Xie Bao Crab House food or interior</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Relevant photos help AI generate better reviews</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Max file size: 5MB (JPEG, PNG, WebP)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}