# 🚀 Quick Start Guide

Get your R&R Solar Repair website up and running in minutes!

## Step 1: Install Dependencies

```bash
npm install
```

This will install:
- Astro
- React
- Tailwind CSS
- TypeScript
- Framer Motion
- All other dependencies

## Step 2: Start Development Server

```bash
npm run dev
```

Your site will be live at: **http://localhost:4321**

## Step 3: Make Changes

### Update Content

1. **Hero Text** → `src/components/ui/HeroRepair.astro`
2. **Solar Quiz** → `src/components/ui/islands/SolarRepairQuiz.tsx`
3. **Testimonials** → `src/components/ui/islands/TestimonialsColumns.tsx`
4. **FAQs** → `src/components/ui/FaqAccordion.astro`
5. **Footer Info** → `src/components/ui/FooterRepair.astro`

### Update Images

Replace images in `public/images/`:
- Hero background
- Feature section images
- Logo files

## Step 4: Build for Production

```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

## Step 5: Deploy to Cloudflare Pages

### Option A: GitHub Connection (Recommended)

1. Push code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Pages → Create Project → Connect to Git
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Click Deploy!

### Option B: Direct Upload

```bash
# Install Wrangler
npm install -g wrangler

# Deploy
npx wrangler pages deploy dist
```

## 🎨 Customization Tips

### Change Colors

Edit `src/styles/global.css`:

```css
:root {
  --background: 0 0% 100%;      /* White */
  --foreground: 222 84% 4%;     /* Dark Gray */
  --primary: 222 84% 54%;       /* Blue */
  --primary-foreground: 0 0% 100%; /* White */
}
```

### Add New Sections

Create a new component in `src/components/ui/` and import it in `src/pages/index.astro`.

### Mobile Responsive?

✅ **Yes!** All components are mobile-responsive. Test by resizing your browser.

## 🐛 Common Issues

### Port 4321 already in use?

```bash
# Kill the process or use a different port
npm run dev -- --port 3000
```

### Build errors?

```bash
# Clear cache and reinstall
rm -rf .astro node_modules
npm install
```

### TypeScript errors?

```bash
# Check for type errors
npx astro check
```

## 📱 Test on Mobile

1. Start dev server: `npm run dev`
2. Find your local IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
3. Open on mobile: `http://YOUR_IP:4321`

## 🎯 What's Next?

- [ ] Replace placeholder images with real photos
- [ ] Update contact information in Footer
- [ ] Test all interactive features (carousel, FAQ, etc.)
- [ ] Run `npm run build` to check for errors
- [ ] Deploy to Cloudflare Pages
- [ ] Set up custom domain (if needed)

## 💡 Need Help?

- [Astro Docs](https://docs.astro.build)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)

---

**Happy coding! ☀️**

