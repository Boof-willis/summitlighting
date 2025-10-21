# R&R Solar Repair - Astro + Tailwind + TypeScript

A modern, high-performance solar repair landing page built with Astro, Tailwind CSS, TypeScript, and React islands for interactive components.

## 🚀 Tech Stack

- **Astro** - Static site generation with island architecture
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **React** - Interactive islands for dynamic features
- **Framer Motion** - Smooth animations

## 📦 Project Structure

```
/
├── public/
│   ├── 404.html           # Custom 404 page
│   ├── robots.txt         # Search engine directives
│   └── sitemap.xml        # Site structure for SEO
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── islands/   # React interactive components
│   │       │   ├── HeaderRepair.tsx
│   │       │   ├── SolarRepairQuiz.tsx
│   │       │   ├── FeatureSteps.tsx
│   │       │   └── TestimonialsColumns.tsx
│   │       ├── HeroRepair.astro
│   │       ├── PricingCard.astro
│   │       ├── StepsTimeline.astro
│   │       ├── FaqAccordion.astro
│   │       └── FooterRepair.astro
│   ├── pages/
│   │   └── index.astro    # Main landing page
│   └── styles/
│       └── global.css     # Global styles + Tailwind
├── astro.config.mjs       # Astro configuration
├── tailwind.config.mjs    # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The site will be available at `http://localhost:4321`

## 🎨 Features

### Static-First Architecture
- **SSG (Static Site Generation)** - Pre-rendered HTML for optimal SEO and TTFB
- **React Islands** - Selective hydration for interactive components only
- **Zero JS by default** - JavaScript only loads for interactive sections

### Interactive Components (React Islands)
- ✅ **Header** - Scroll-based styling and smooth navigation
- ✅ **Hero** - Gradient overlay with animated text reveal
- ✅ **Solar Repair Quiz** - Multi-step lead capture form with modal
- ✅ **Feature Steps** - Auto-rotating feature showcase with images
- ✅ **Testimonials** - Column-based testimonial display with initials
- ✅ **FAQ Accordion** - Expandable question/answer sections

### Performance Optimizations
- ✅ Minimal JavaScript footprint
- ✅ Client-side hydration only where needed (`client:load`, `client:visible`)
- ✅ Optimized for Cloudflare Pages deployment
- ✅ Modern build with Vite

## 🚢 Deployment to Cloudflare Pages

### Option 1: GitHub/GitLab Integration (Recommended)

1. Push your code to GitHub or GitLab
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Go to **Pages** → **Create a project**
4. Connect your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 18 or 20

### Option 2: Direct Upload (Wrangler CLI)

```bash
# Install Wrangler globally
npm install -g wrangler

# Build the project
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist
```

### Environment Variables (if needed)

Add any environment variables in the Cloudflare Pages dashboard under:
**Settings** → **Environment variables**

## 🎯 Path Alias

The project uses `@/*` as a path alias pointing to `src/*`:

```typescript
import Header from '@/components/ui/Header.astro';
import { Button } from '@/components/ui/button';
```

## 🖼️ Adding Images

Place images in the `public/` directory:

```
public/
  └── images/
      ├── logo/
      │   ├── rrlogo.png
      │   └── rrlogo-white.png
      └── hero/
          └── 67bff5403e5f1a358c998e13_fit-hero.webp
```

Reference them in your code:

```astro
<img src="/images/logo/rrlogo.png" alt="Logo" />
```

## 🎨 Tailwind Configuration

The project uses custom Tailwind tokens defined in `src/styles/global.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222 84% 4%;
  --primary: 207 57% 54%;
  --primary-foreground: 0 0% 100%;
}
```

Access via Tailwind classes:
```html
<div class="bg-background text-foreground">
  <button class="bg-primary text-primary-foreground">Click me</button>
</div>
```

## 📝 Customization

### Updating Content

1. **Hero Section** - Edit `src/components/ui/HeroRepair.astro`
2. **Solar Quiz** - Edit `src/components/ui/islands/SolarRepairQuiz.tsx`
3. **Features** - Edit `src/components/ui/islands/FeatureSteps.tsx`
4. **Pricing** - Edit `src/components/ui/PricingCard.astro`
5. **Steps Timeline** - Edit `src/components/ui/StepsTimeline.astro`
6. **Testimonials** - Edit `src/components/ui/islands/TestimonialsColumns.tsx`
7. **FAQ** - Edit `src/components/ui/FaqAccordion.astro`
8. **Footer** - Edit `src/components/ui/FooterRepair.astro`

### Adding New Pages

Create a new `.astro` file in `src/pages/`:

```astro
---
// src/pages/about.astro
import '@/styles/global.css';
---

<html>
  <head>
    <title>About Us</title>
  </head>
  <body>
    <h1>About R&R Solar</h1>
  </body>
</html>
```

Access at: `http://localhost:4321/about`

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear Astro cache
rm -rf .astro node_modules/.astro

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Run type checking
npm run astro check
```

## 📚 Resources

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)

## 📄 License

Copyright © 2025 R&R Solar. All rights reserved.

---

**Built with ❤️ using Astro + Tailwind + TypeScript**
