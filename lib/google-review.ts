/**
 * Google Review Submission Utility
 * 
 * This module handles the generation of Google Review links and provides
 * a compliant way to direct users to submit reviews.
 * 
 * IMPORTANT: This tool follows Google's policies by:
 * 1. Not automating review submissions
 * 2. Not offering incentives for reviews
 * 3. Providing genuine customer experiences
 * 4. Allowing users to edit AI-generated content
 */

export interface ReviewData {
  rating: number; // 1-5 stars
  reviewText: string;
  placeId: string; // Google Place ID
  businessName: string;
}

export class GoogleReviewService {
  /**
   * Generate Google Review URL for Xie Bao Crab House
   * Uses the specific Google Maps URL provided
   */
  static generateReviewUrl(data: ReviewData): string {
    const { rating, reviewText } = data;
    
    // URL encode the review text
    const encodedReview = encodeURIComponent(reviewText);
    
    // Use the specific Xie Bao Crab House Google Maps URL
    // This is the exact URL that will open when users scan QR code
    const baseUrl = `https://www.google.com/maps/place/Xie+Bao+Crab+House/@40.5131462,-74.4085894,17z/data=!3m1!5s0x89c3c7df48f8a6a7:0x9199b8e50eabbc2a!4m8!3m7!1s0x89c3c7466ba52f2f:0xc487fc390524a986!8m2!3d40.5131462!4d-74.4060145!9m1!1b1!16s%2Fg%2F11vwz4qcrq`;
    
    // Add review parameters to the URL
    const params = new URLSearchParams({
      authuser: '0',
      entry: 'ttu',
      review: encodedReview,
      rating: rating.toString(),
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Generate alternative URL for Google Maps (simplified version)
   */
  static generateMapsReviewUrl(data: ReviewData): string {
    return this.generateReviewUrl(data);
  }

  /**
   * Get business information from Google Places API
   * Requires Google Places API key
   */
  static async getBusinessInfo(placeId: string): Promise<{
    name: string;
    address: string;
    rating: number;
    totalReviews: number;
  } | null> {
    if (!process.env.GOOGLE_API_KEY) {
      console.warn('Google API key not configured');
      return null;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.GOOGLE_API_KEY}&fields=name,formatted_address,rating,user_ratings_total`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        return {
          name: data.result.name,
          address: data.result.formatted_address,
          rating: data.result.rating || 0,
          totalReviews: data.result.user_ratings_total || 0,
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching business info:', error);
      return null;
    }
  }

  /**
   * Validate review content for compliance
   */
  static validateReview(reviewText: string): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    // Check minimum length
    if (reviewText.length < 10) {
      issues.push('Review is too short (minimum 10 characters)');
    }
    
    // Check maximum length (Google's limit is 4096 characters)
    if (reviewText.length > 4000) {
      issues.push('Review is too long (maximum 4000 characters)');
    }
    
    // Check for inappropriate content (basic check)
    const inappropriateWords = ['spam', 'fake', 'paid', 'bought'];
    inappropriateWords.forEach(word => {
      if (reviewText.toLowerCase().includes(word)) {
        issues.push(`Review contains potentially inappropriate content`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * Generate QR code data for the review URL
   */
  static generateQRCodeData(data: ReviewData): string {
    return this.generateReviewUrl(data);
  }

  /**
   * Get default place ID for testing/demo
   */
  static getDefaultPlaceId(): string {
    // Example: A popular restaurant in NYC
    // You should replace this with your actual business Place ID
    return process.env.GOOGLE_PLACE_ID || 'ChIJN1t_tDeuEmsRUsoyG83frY4';
  }

  /**
   * Create review submission instructions
   */
  static getSubmissionInstructions(): string[] {
    return [
      '1. Click the "Submit Review" button',
      '2. You will be redirected to Google Maps',
      '3. Review will be pre-filled with 5 stars and your text',
      '4. You can edit the review before submitting',
      '5. Click "Post" to submit your review'
    ];
  }
}

// Business configuration for Xie Bao Crab House
export const DEFAULT_BUSINESS = {
  name: 'Xie Bao Crab House',
  placeId: process.env.GOOGLE_PLACE_ID || 'ChIJN1t_tDeuEmsRUsoyG83frY4', // Need actual Place ID for Xie Bao Crab House
  type: 'restaurant',
  categories: ['seafood restaurant', 'crab house', 'chinese cuisine']
};