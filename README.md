# Jai N. Clarke-Binns Portfolio

A minimal, sophisticated portfolio website with chrome accents and sparkly cursor.

## Quick Deploy to Vercel

### Method 1: GitHub (Recommended)

1. **Create a GitHub account** (if you don't have one)
   - Go to https://github.com
   - Click "Sign up"
   - Follow the steps

2. **Create a new repository**
   - Click the "+" icon in top right
   - Click "New repository"
   - Name it: `portfolio` (or whatever you like)
   - Make it Public
   - Click "Create repository"

3. **Upload your files**
   - Click "uploading an existing file"
   - Drag and drop ALL the files from this folder
   - Scroll down and click "Commit changes"

4. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Click "Import" next to your GitHub repository
   - Click "Deploy"
   - Done! Your site is live

### Method 2: Vercel CLI (Alternative)

If you're comfortable with terminal:

```bash
npm install -g vercel
cd portfolio-folder
vercel
```

Follow the prompts and you're done!

## Local Development

If you want to run it locally:

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Making Updates

After any changes:
- **If using GitHub**: Just upload the changed files to GitHub, Vercel auto-deploys
- **If using CLI**: Run `vercel --prod` in the folder

## Custom Domain

Once deployed, you can add your own domain in Vercel dashboard:
1. Go to your project settings
2. Click "Domains"
3. Add your domain
4. Follow DNS instructions

## Support

If you run into issues, the Vercel docs are great: https://vercel.com/docs
