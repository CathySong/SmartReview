# QuickReview - AI-Powered Google Review Generator

A complete solution for businesses to collect authentic Google reviews through QR/NFC scanning, AI-generated review suggestions, and one-click submission.

## 🚀 Features

### Core Features
- **QR Code & NFC Integration**: Customers scan to instantly access review page
- **AI Review Generation**: Natural, authentic reviews generated in seconds
- **One-Click Google Submission**: Direct submission with pre-filled 5-star reviews
- **Multiple Review Options**: Choose from AI-generated variations
- **Regulatory Compliance**: Follows Google and FTC guidelines

### Technical Features
- **Next.js 14**: Modern React framework with App Router
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **OpenAI Integration**: GPT-powered review generation
- **Google APIs**: Places API integration
- **Responsive Design**: Works on all devices
- **Vercel Ready**: One-click deployment

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- OpenAI API key (for AI features)
- Google API key (for Places integration)
- Google Place ID (for your business)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/google-review-generator.git
   cd google-review-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   GOOGLE_PLACE_ID=your_google_place_id_here
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms
The app is compatible with any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Docker

## 📱 Usage Workflow

### For Businesses
1. **Generate QR Codes**: Create QR codes for your location
2. **Place QR Codes**: Display at checkout, tables, or entrance
3. **Customers Scan**: Customers scan with phone camera
4. **AI Generates Review**: System suggests authentic review text
5. **One-Click Submit**: Customer submits 5-star review to Google

### For Customers
1. Scan QR code with phone camera
2. Choose from AI-generated review options
3. Click "Submit Review" button
4. Review opens in Google Maps (pre-filled with 5 stars)
5. Edit if desired, then click "Post"

## 🔧 Configuration

### Business Settings
Edit `lib/google-review.ts` to configure:
- Default business information
- Google Place ID
- Business type
- Review categories

### AI Settings
Edit `lib/ai-generator.ts` to configure:
- Review length (default: 15-25 words)
- Business type focus
- Review categories
- Fallback reviews

### Styling
Edit `tailwind.config.js` to customize:
- Color scheme
- Fonts
- Spacing
- Animations

## ⚖️ Regulatory Compliance

This tool is designed to be fully compliant with:

### Google Review Policies
- ✅ No automated review submissions
- ✅ No incentives for reviews
- ✅ Authentic customer experiences only
- ✅ Users can edit AI-generated content
- ✅ Transparent about AI assistance

### FTC Guidelines
- ✅ Clear disclosure of AI assistance
- ✅ No misleading or fake reviews
- ✅ Genuine customer feedback
- ✅ No paid or incentivized reviews

### Data Privacy
- ✅ No personal data collection
- ✅ No tracking of individual users
- ✅ All processing happens client-side
- ✅ No database required

## 📊 Analytics Integration

Optional analytics can be added:

### Google Analytics
Add your GA ID to `.env.local`:
```env
GOOGLE_ANALYTICS_ID=your_ga_id_here
```

### Custom Analytics
Edit `app/layout.tsx` to add your analytics script.

## 🛡️ Security

- API keys are stored in environment variables
- No sensitive data stored in client-side code
- HTTPS required for production
- Regular dependency updates
- Security headers configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- Create an issue on GitHub
- Check the documentation
- Contact: your-email@example.com

## 🙏 Acknowledgments

- OpenAI for GPT API
- Google for Maps and Places APIs
- Next.js team for the amazing framework
- Vercel for hosting platform

---

**Disclaimer**: This tool is designed to assist with review generation while maintaining compliance with all relevant policies. Users are responsible for ensuring their use complies with Google's review policies and local regulations.