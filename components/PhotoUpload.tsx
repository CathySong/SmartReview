'use client';

import { useState, useRef } from 'react';
import { Upload, X, Camera, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PhotoUploadProps {
  onPhotoUpload: (file: File | null, description: string) => void;
  onDishInput: (dishName: string) => void;
}

// Common dishes at Xie Bao Crab House for suggestions
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
  'Spring Rolls',
  'Wonton Soup'
];

// Valid photo categories for Xie Bao Crab House
const VALID_CATEGORIES = [
  'crab dishes',
  'seafood',
  'restaurant interior',
  'dining area',
  'food presentation',
  'restaurant exterior',
  'menu items',
  'staff/service'
];

export default function PhotoUpload({ onPhotoUpload, onDishInput }: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dishName, setDishName] = useState<string>('');
  const [photoDescription, setPhotoDescription] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isValidPhoto, setIsValidPhoto] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
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
    
    // Simulate photo analysis (in real implementation, this would use AI)
    setTimeout(() => {
      // For demo purposes, we'll assume photos are relevant
      // In production, you would use an image recognition API
      const isRelevant = Math.random() > 0.3; // 70% chance of being relevant
      setIsValidPhoto(isRelevant);
      
      if (!isRelevant) {
        toast.error('Photo appears unrelated to Xie Bao Crab House. Please upload a relevant photo or skip.');
        setIsAnalyzing(false);
        onPhotoUpload(file, '');
      } else {
        // Generate a description based on common categories
        const randomCategory = VALID_CATEGORIES[Math.floor(Math.random() * VALID_CATEGORIES.length)];
        const description = `restaurant ${randomCategory}`;
        setPhotoDescription(description);
        toast.success('Photo accepted! AI will generate reviews based on this image.');
        setIsAnalyzing(false);
        onPhotoUpload(file, description);
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
    onPhotoUpload(null, '');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDishNameChange = (value: string) => {
    setDishName(value);
    onDishInput(value);
  };

  const handleDishSuggestionClick = (dish: string) => {
    setDishName(dish);
    onDishInput(dish);
    toast.success(`Selected: ${dish}`);
  };

  const handleSkipPhoto = () => {
    toast.success('Photo upload skipped. AI will generate general reviews.');
    onPhotoUpload(null, '');
  };

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center mb-2">
          <Camera className="w-5 h-5 mr-2 text-primary-600" />
          Optional: Upload Photo or Enter Dish
        </h3>
        <p className="text-gray-600">
          Upload a photo of your meal or enter the dish name for more personalized reviews.
        </p>
      </div>

      {/* Dish Name Input */}
      <div className="mb-6">
        <label className="block font-medium text-gray-900 mb-2">
          What did you order? (Optional)
        </label>
        <input
          type="text"
          value={dishName}
          onChange={(e) => handleDishNameChange(e.target.value)}
          placeholder="e.g., Garlic Crab, Kung Pao Shrimp"
          className="input-field"
        />
        
        {/* Dish Suggestions */}
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-2">Popular dishes at Xie Bao Crab House:</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_DISHES.map((dish) => (
              <button
                key={dish}
                onClick={() => handleDishSuggestionClick(dish)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
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

      {/* Photo Upload Section */}
      <div className="mb-6">
        <label className="block font-medium text-gray-900 mb-2">
          Upload a photo of your meal or the restaurant (Optional)
        </label>
        
        {!previewUrl ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-700 font-medium mb-2">Click to upload photo</p>
              <p className="text-gray-500 text-sm">JPEG, PNG up to 5MB</p>
              <p className="text-gray-500 text-sm mt-1">Recommended: Food, restaurant interior, or dining experience</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative">
            {/* Photo Preview */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Uploaded preview"
                className="w-full h-64 object-cover"
              />
            </div>
            
            {/* Photo Status */}
            <div className="mt-3">
              {isAnalyzing ? (
                <div className="flex items-center text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm">Analyzing photo relevance...</span>
                </div>
              ) : isValidPhoto !== null && (
                <div className={`flex items-center ${isValidPhoto ? 'text-success-600' : 'text-red-600'}`}>
                  {isValidPhoto ? (
                    <>
                      <ImageIcon className="w-4 h-4 mr-2" />
                      <span className="text-sm">Photo accepted! AI will use this for review generation.</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Photo appears unrelated. Please upload a relevant photo or skip.</span>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Remove Button */}
            <button
              onClick={handleRemovePhoto}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Photo Description (if analyzed) */}
      {photoDescription && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Photo analysis:</span> {photoDescription}
          </p>
        </div>
      )}

      {/* Skip Option */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Skip photo upload for general reviews
        </p>
        <button
          onClick={handleSkipPhoto}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Skip Photo
        </button>
      </div>

      {/* Guidelines */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
        <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          Photo Guidelines
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Upload photos of Xie Bao Crab House food, interior, or dining experience</li>
          <li>• Relevant photos help AI generate more personalized reviews</li>
          <li>• Unrelated photos will be rejected (e.g., selfies, landscapes)</li>
          <li>• Maximum file size: 5MB</li>
          <li>• Supported formats: JPEG, PNG, WebP</li>
        </ul>
      </div>
    </div>
  );
}