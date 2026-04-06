import OpenAI from 'openai';

// Fallback reviews for Xie Bao Crab House (if OpenAI API is not available)
const FALLBACK_REVIEWS = [
  "The crab was absolutely incredible - fresh, perfectly seasoned, and cooked to perfection. The service was attentive and the atmosphere was lively yet comfortable. Will definitely return!",
  "Amazing seafood experience! The crab dishes were outstanding, the staff was knowledgeable about the menu, and the restaurant had a great vibe. Highly recommend the garlic crab!",
  "What a fantastic crab house! The seafood was fresh and flavorful, the service was excellent, and the portions were generous. Can't wait to come back for more!",
  "Exceptional Chinese seafood restaurant. Every dish we tried was delicious, especially the crab preparations. The staff made us feel welcome and the overall experience was memorable.",
  "Loved everything about Xie Bao Crab House! The crab was cooked perfectly, the sauces were amazing, and the service was friendly and efficient. Great spot for seafood lovers!",
  "Outstanding crab house! From the moment we walked in, the aroma was incredible. The food lived up to the smell - fresh, flavorful, and beautifully presented. Top-notch experience!",
  "A hidden gem for seafood! The crab was fresh and delicious, the service was impeccable, and the restaurant had a great atmosphere. We'll definitely be regulars!",
  "Perfect spot for crab lovers! The staff went above and beyond to make our visit special. Every crab dish was a delight - fresh, flavorful, and perfectly cooked.",
  "Absolutely loved our dining experience! The seafood was fresh and creative, the service was friendly, and the ambiance was perfect for a family meal. Highly recommended!",
  "One of the best seafood restaurants we've tried. The crab was exceptional, the other dishes were equally delicious, and the service made the experience wonderful."
];

// Categories for AI to focus on (restaurant specific)
const REVIEW_CATEGORIES = [
  'food quality and freshness',
  'seafood preparation and taste', 
  'service experience and attentiveness',
  'restaurant atmosphere and cleanliness',
  'value for money and portion sizes',
  'overall dining experience'
];

// Business types for context (restaurant focused)
const BUSINESS_TYPES = [
  'seafood restaurant',
  'chinese restaurant',
  'crab house',
  'asian cuisine',
  'fine dining',
  'casual dining'
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
    return `Generate a natural, authentic Google review for Xie Bao Crab House, a seafood and Chinese restaurant. 
    Focus on: ${category}.
    Requirements:
    - 15-25 words maximum
    - Sound like real customer feedback from a seafood restaurant
    - Mention specific dishes like crab, seafood, or Chinese cuisine
    - Avoid generic phrases like "great service" or "good food"
    - Include personal experience details about the dining experience
    - End with intention to return or recommend to friends
    
    Example format: "The garlic crab was incredible - fresh, perfectly seasoned, and full of flavor. The staff was attentive and the restaurant had a great atmosphere. Will definitely be back!"`;
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