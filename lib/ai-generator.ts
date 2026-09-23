import OpenAI from 'openai';

// Fallback review prompts for Xie Bao Crab House (if OpenAI API is not available).
// They are deliberately balanced instead of always glowing; customers should
// edit the final text so it reflects their real experience.
const FALLBACK_REVIEWS = [
  "I visited Xie Bao Crab House and especially noticed the crab, service, and atmosphere. I would describe my experience as...",
  "My meal at Xie Bao Crab House included seafood and Chinese dishes. The part I appreciated most was...",
  "I tried Xie Bao Crab House recently. The food, service, and overall experience made me feel...",
  "After eating at Xie Bao Crab House, I would tell another customer this about the visit...",
  "My honest impression of Xie Bao Crab House is based on the dish I ordered, the service, and the atmosphere..."
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

  constructor(apiKey?: string) {
    // Use provided API key or environment variable
    // In Vercel, environment variables are available at runtime
    const key = apiKey || process.env.OPENAI_API_KEY;
    
    if (key && key.startsWith('sk-')) {
      this.openai = new OpenAI({
        apiKey: key,
      });
    } else if (process.env.NODE_ENV === 'development') {
      console.warn('OpenAI API key not configured or invalid. Using fallback reviews.');
    }
  }

  async generateReview(
    businessType: string = 'seafood restaurant',
    dishName?: string,
    photoDescription?: string
  ): Promise<string> {
    // If OpenAI is not available, use fallback reviews
    if (!this.openai) {
      return this.getRandomFallbackReview();
    }

    try {
      const category = this.getRandomCategory();
      const prompt = this.buildPrompt(businessType, category, dishName, photoDescription);

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You help customers draft honest first-person review text based only on their real experience. Never guarantee a positive rating, never invent facts, and encourage the customer to edit before posting."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 50,
        temperature: 0.7, // Slightly lower temperature for more consistent quality
      });

      const review = completion.choices[0]?.message?.content?.trim();
      
      if (review && review.length > 15) {
        return review;
      } else {
        return this.getRandomFallbackReview();
      }
    } catch (error: any) {
      console.error('Error generating AI review:', {
        error: error.message,
        code: error.code,
        type: error.type,
        status: error.status
      });
      return this.getRandomFallbackReview();
    }
  }

  private buildPrompt(
    businessType: string, 
    category: string,
    dishName?: string,
    photoDescription?: string
  ): string {
    let context = '';
    
    if (dishName) {
      context += `The customer ordered: ${dishName}. `;
    }
    
    if (photoDescription) {
      context += `Based on the photo showing: ${photoDescription}. `;
    }
    
    return `Draft a natural first-person Google review for Xie Bao Crab House, a seafood and Chinese restaurant.
    ${context}
    Focus on: ${category}.
    
    Requirements:
    - 18-28 words
    - Sound like real customer feedback
    - Do not assume a 5-star rating
    - Do not invent details not provided
    - Use concrete sensory or service details when available
    - Make it easy for the customer to edit before posting

    Example style: "I tried the garlic crab and liked the seasoning and lively atmosphere. I would come back for seafood with friends."`;
  }

  private getRandomCategory(): string {
    return REVIEW_CATEGORIES[Math.floor(Math.random() * REVIEW_CATEGORIES.length)];
  }

  private getRandomFallbackReview(): string {
    return FALLBACK_REVIEWS[Math.floor(Math.random() * FALLBACK_REVIEWS.length)];
  }

  // Generate multiple review options for user to choose from
  async generateReviewOptions(
    businessType: string = 'seafood restaurant', 
    count: number = 3,
    dishName?: string,
    photoDescription?: string
  ): Promise<string[]> {
    try {
      const promises = Array(count).fill(null).map(() => 
        this.generateReview(businessType, dishName, photoDescription)
      );
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error generating review options:', error);
      // Return fallback reviews if API fails
      return FALLBACK_REVIEWS.slice(0, count);
    }
  }
}

// Singleton instance
export const reviewGenerator = new ReviewGenerator();
