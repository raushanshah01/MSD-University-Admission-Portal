# 🚀 Deployment Guide - Render.com

This guide explains how to deploy both the frontend (React) and backend (Express) together on Render using a single web service.

## 📁 Project Structure

```
uni_admission_prototype/
├── client/          # React app (Vite)
│   ├── package.json
│   ├── .env         # Local development
│   ├── .env.production  # Production (empty - uses same domain)
│   └── src/
├── server/          # Express backend
│   ├── index.js
│   ├── package.json
│   ├── scripts/
│   │   └── copy-build.js  # Cross-platform build copy script
│   └── public/      # React build will be copied here
└── README.md
```

## ⚙️ How It Works

1. **Build Process**: 
   - React app builds to `client/dist/`
   - Build files are copied to `server/public/`
   - Express serves static files from `public/`

2. **API & Frontend**:
   - All API routes are under `/api/*`
   - Frontend routes are handled by React Router
   - Both served from the same domain

## 🧪 Test Locally Before Deploying

### Step 1: Build the Project

From the root folder:

```bash
cd server
npm run build
```

This will:
- Navigate to client folder
- Install client dependencies
- Build the React app (creates `client/dist/`)
- Copy build files to `server/public/`

### Step 2: Run the Server

```bash
npm start
```

### Step 3: Test

Open `http://localhost:5000` in your browser. You should see:
- ✅ Frontend loads at `/`
- ✅ APIs work at `/api/*`

## 🚀 Deploy on Render.com

### Step 1: Push to GitHub

Make sure all changes are committed and pushed:

```bash
git add .
git commit -m "Setup for Render deployment with unified frontend/backend"
git push origin main
```

### Step 2: Create Web Service on Render

1. Go to [Render.com](https://render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

   **Basic Settings:**
   - **Name**: `msd-university-admission-portal` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server` ⚠️ IMPORTANT
   - **Runtime**: `Node`

   **Build & Deploy:**
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

### Step 3: Add Environment Variables

Click **Environment** → **Add Environment Variable** and add:

```
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### Step 4: Deploy

Click **Create Web Service** 🎉

Render will:
1. Install server dependencies
2. Run `npm run build` (builds React + copies to public/)
3. Start the server with `npm start`

## 🌐 Access Your Application

After deployment completes:

```
https://your-app-name.onrender.com
```

- **Frontend**: `https://your-app-name.onrender.com/`
- **API**: `https://your-app-name.onrender.com/api/*`

## 🔧 Troubleshooting

### Build Fails on Render

**Issue**: "Client dist folder not found"
**Solution**: Make sure the build command is `npm run build` and root directory is `server`

### API 404 Errors

**Issue**: API calls return 404
**Solution**: Check that all API routes are prefixed with `/api/` in your backend

### Frontend Shows Blank Page

**Issue**: White screen after deployment
**Solution**: 
1. Check browser console for errors
2. Verify `public/index.html` exists in server folder
3. Check build logs on Render

### Static Files Not Loading

**Issue**: CSS/JS files return 404
**Solution**: Verify the build was copied correctly to `server/public/`

## 📝 Scripts Reference

### Server Scripts (`server/package.json`)

```json
{
  "scripts": {
    "start": "node index.js",           // Start production server
    "dev": "nodemon index.js",          // Local development with auto-reload
    "build": "cd ../client && npm install && npm run build && node ../server/scripts/copy-build.js",  // Full build process
    "build:client": "cd ../client && npm install && npm run build",  // Build client only
    "copy:client": "node scripts/copy-build.js"  // Copy build files
  }
}
```

### Client Scripts (`client/package.json`)

```json
{
  "scripts": {
    "dev": "vite",              // Start Vite dev server
    "build": "vite build",      // Build for production
    "preview": "vite preview"   // Preview production build
  }
}
```

## 🔄 Update Deployment

To deploy changes:

```bash
# Make your changes
git add .
git commit -m "Your commit message"
git push origin main
```

Render will automatically rebuild and redeploy! 🚀

## ✅ Success Checklist

- [ ] Server `package.json` has correct build script
- [ ] `server/scripts/copy-build.js` exists
- [ ] Server `index.js` serves static files from `public/`
- [ ] Server `index.js` has catch-all route after API routes
- [ ] Client API config uses correct base URL
- [ ] All environment variables set on Render
- [ ] Root directory set to `server` on Render
- [ ] Build tested locally before deploying

## 🎯 Key Points

1. **Root Directory = `server`** on Render
2. **Build Command = `npm run build`** (installs + builds client + copies to public)
3. **Start Command = `npm start`**
4. **Environment variables** must be set on Render
5. **Frontend uses same domain** in production (no CORS issues!)

---

Need help? Check the logs on Render dashboard or review the configuration above! 🚀
