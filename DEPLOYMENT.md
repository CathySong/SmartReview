# 🚀 Deployment Guide

This guide will help you deploy the QuickReview Google Review Generator to Vercel.

## Prerequisites

1. **GitHub Account** - For hosting your code
2. **Vercel Account** - For deployment (free tier available)
3. **API Keys** - You'll need:
   - OpenAI API key
   - Google API key
   - Google Place ID

## Step-by-Step Deployment

### Step 1: Get API Keys

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Click "Create new secret key"
5. Copy the key (you won't see it again)

#### Google API Key & Place ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Google Maps JavaScript API
   - Google Places API
4. Go to Credentials → Create Credentials → API Key
5. Copy the API key
6. Get your Place ID:
   - Open Google Maps
   - Find your business
   - Click on it
   - In the URL, find the part after `place_id=`
   - Example: `ChIJN1t_tDeuEmsRUsoyG83frY4`

### Step 2: Push to GitHub

```bash
# Initialize git
cd google-review-generator
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Google Review Generator"

# Create GitHub repository
# Go to https://github.com/new
# Create repository without README

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/google-review-generator.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

1. **Go to [Vercel](https://vercel.com/)**
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next
   - **Install Command**: `npm install`

### Step 4: Add Environment Variables

In Vercel project settings:

1. Go to **Settings → Environment Variables**
2. Add these variables:

```
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_PLACE_ID=your_google_place_id_here
BUSINESS_NAME="Your Business Name"
BUSINESS_TYPE="restaurant"
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate_random_string_here
```

3. Click "Save"

### Step 5: Deploy

1. Go back to **Deployments**
2. Click "Redeploy" to apply environment variables
3. Wait for deployment to complete
4. Click "Visit" to see your live site

## Post-Deployment Setup

### 1. Test Your Deployment
- Visit your Vercel URL
- Test QR code generation
- Test review generation
- Test Google Review submission

### 2. Configure Custom Domain (Optional)
1. Go to **Settings → Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### 3. Set Up Monitoring
1. Enable Vercel Analytics
2. Set up error tracking
3. Monitor API usage

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI review generation | `sk-...` |
| `GOOGLE_API_KEY` | Yes | Google Maps/Places API key | `AIza...` |
| `GOOGLE_PLACE_ID` | Yes | Your business Google Place ID | `ChIJ...` |
| `BUSINESS_NAME` | No | Your business name | `"Luna Art Studio"` |
| `BUSINESS_TYPE` | No | Type of business | `"art studio"` |
| `NEXTAUTH_URL` | No | Your deployment URL | `https://app.vercel.app` |
| `NEXTAUTH_SECRET` | No | NextAuth secret | `random_string` |
| `GOOGLE_ANALYTICS_ID` | No | Google Analytics ID | `G-...` |

## Troubleshooting

### Common Issues

#### 1. Build Fails
- Check Node.js version (requires 18+)
- Verify all dependencies are installed
- Check for TypeScript errors

#### 2. API Keys Not Working
- Verify keys are correctly set in Vercel
- Check API key permissions
- Ensure billing is enabled (for Google APIs)

#### 3. QR Codes Not Scanning
- Test with different QR scanners
- Ensure URL is not too long
- Check image quality

#### 4. Google Review Link Not Working
- Verify Place ID is correct
- Test the Place ID in Google Maps
- Check if business is verified on Google

### Debugging Steps

1. **Check Vercel Logs**
   - Go to Deployments → Select deployment → Logs

2. **Test Locally**
   ```bash
   npm run build
   npm start
   ```

3. **Verify Environment Variables**
   ```bash
   # In Vercel Functions
   console.log(process.env.OPENAI_API_KEY ? 'Set' : 'Not set')
   ```

## Maintenance

### Regular Updates
1. Update dependencies monthly
   ```bash
   npm update
   ```

2. Monitor API usage
   - OpenAI usage dashboard
   - Google Cloud billing

3. Backup configuration
   - Export environment variables
   - Save custom configurations

### Security
1. Rotate API keys quarterly
2. Monitor for unauthorized access
3. Keep dependencies updated
4. Review access logs

## Scaling

### For High Traffic
1. Upgrade Vercel plan
2. Implement caching
3. Use CDN for static assets
4. Monitor API rate limits

### Multiple Locations
1. Duplicate environment variables per location
2. Use database for business configurations
3. Implement location selector

## Support

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/YOUR_USERNAME/google-review-generator/issues)
2. Review Vercel documentation
3. Contact support with deployment logs

---

**Note**: Always test thoroughly before sharing with customers. Ensure compliance with Google's review policies.