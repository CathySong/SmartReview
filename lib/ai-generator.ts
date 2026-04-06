import OpenAI from 'openai';

// Fallback reviews if OpenAI API is not available
const FALLBACK_REVIEWS = [
  "The food was absolutely delicious! Fresh ingredients and perfect seasoning. The atmosphere was cozy and welcoming, and the service was attentive without being intrusive. Will definitely be back!",
  "Amazing experience from start to finish. The staff was friendly and knowledgeable, the ambiance was perfect for a relaxing meal, and every dish we tried was exceptional. Highly recommend!",
  "What a fantastic place! Great food, excellent service, and a wonderful atmosphere. The attention to detail really shows. Can't wait to visit again soon!",
  "Exceptional quality and service. The food was cooked to perfection, the presentation was beautiful, and the staff made us feel right at home. A truly memorable dining experience.",
  "Loved everything about this place! The menu had great variety, everything we ordered was delicious, and the service was prompt and friendly. The ambiance was perfect too!",
  "Outstanding in every way. From the moment we walked in, we were treated like family. The food was incredible, the drinks were creative, and the overall experience was top-notch.",
  "A hidden gem! The food was fresh and flavorful, the service was impeccable, and the atmosphere was just right. We'll definitely be regulars from now on.",
  "Perfect spot for a great meal. The staff went above and beyond to make our visit special. Every dish was a delight and the overall experience was wonderful.",
  "Absolutely loved our visit! The food was creative and delicious, the service was friendly and efficient, and the ambiance was warm and inviting. Highly recommended!",
  "One of the best dining experiences we've had. Everything from the appetizers to dessert was exceptional. The staff was attentive and the atmosphere was lovely."
];

// Categories for AI to focus on
const REVIEW_CATEGORIES = [
  'food quality',
  'service experience', 
  'atmosphere/ambiance',
  'value for money',
  'overall experience'
];

// Business types for context
const BUSINESS_TYPES = [
  'restaurant',
  'cafe',
  'retail store',
  'service business',
  'hotel',
  'attraction'
];

export class ReviewGenerator {
  private openai: OpenAI | null = null;

  constructor() {
    // Initialize OpenAI only if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  async generateReview(businessType: string = 'restaurant'): Promise<string> {
    // If OpenAI is not available, use fallback reviews
    if (!this.openai) {
      return this.getRandomFallbackReview();
    }

    try {
      const category = this.getRandomCategory();
      const prompt = this.buildPrompt(businessType, category);

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates authentic, natural-sounding Google reviews. Reviews should be 15-25 words, sound like real customer feedback, and avoid repetitive patterns."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 60,
        temperature: 0.8, // Higher temperature for more varied responses
      });

      const review = completion.choices[0]?.message?.content?.trim();
      
      if (review && review.length > 10) {
        return review;
      } else {
        return this.getRandomFallbackReview();
      }
    } catch (error) {
      console.error('Error generating AI review:', error);
      return this.getRandomFallbackReview();
    }
  }

  private buildPrompt(businessType: string, category: string): string {
    return `Generate a natural, authentic Google review for a ${businessType}. 
    Focus on: ${category}.
    Requirements:
    - 15-25 words maximum
    - Sound like real customer feedback
    - Mention specific positive aspects
    - Avoid generic phrases like "great service" or "good food"
    - Include personal experience details
    - End with intention to return or recommend
    
    Example format: "The [specific dish] was incredible - perfectly cooked and full of flavor. The staff was attentive and the atmosphere was cozy. Will definitely be back!"`;
  }

  private getRandomCategory(): string {
    return REVIEW_CATEGORIES[Math.floor(Math.random() * REVIEW_CATEGORIES.length)];
  }

  private getRandomFallbackReview(): string {
    return FALLBACK_REVIEWS[Math.floor(Math.random() * FALLBACK_REVIEWS.length)];
  }

  // Generate multiple review options for user to choose from
  async generateReviewOptions(businessType: string = 'restaurant', count: number = 3): Promise<string[]> {
    const promises = Array(count).fill(null).map(() => this.generateReview(businessType));
    return Promise.all(promises);
  }
}

// Singleton instance
export const reviewGenerator = new ReviewGenerator();