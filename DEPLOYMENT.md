# MedAI Deployment Guide

## Vercel Deployment (Current Setup)

Your app is configured to work with Vercel using serverless functions.

### Project Structure:
```
├── api/
│   ├── chat.js          # Main AI chat endpoint
│   └── health.js        # Health check endpoint
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies
```

### Environment Variables in Vercel:
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add: `GEMINI_API_KEY` = `AIzaSyC2qN_TrBQITilmz65a_mkPVo3zZ1871FY`

### Deployment:
1. Push changes to GitHub
2. Vercel will auto-deploy
3. Your app will be available at your existing Vercel URL

### API Endpoints:
- `https://your-vercel-url.vercel.app/api/chat` - Main chat endpoint
- `https://your-vercel-url.vercel.app/api/health` - Health check

### Testing:
Visit `https://your-vercel-url.vercel.app/api/health` to test if backend is working.
