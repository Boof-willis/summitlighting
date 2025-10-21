# 📁 Complete File Guide

Quick reference for every file in your R&R Solar Repair project.

## 🎯 Configuration Files (Root)

| File | Purpose | When to Edit |
|------|---------|--------------|
| `package.json` | Project dependencies & scripts | Adding new packages |
| `astro.config.mjs` | Astro configuration | Changing build settings |
| `tsconfig.json` | TypeScript config with `@/*` alias | Adding new path aliases |
| `tailwind.config.mjs` | Tailwind CSS customization | Changing colors/fonts |
| `.gitignore` | Files to exclude from git | Adding files to ignore |

## 📄 Pages (`src/pages/`)

| File | Purpose | URL |
|------|---------|-----|
| `index.astro` | Main solar repair landing page | `/` |

To add more pages, create new `.astro` files here:
- `about.astro` → `/about`
- `contact.astro` → `/contact`
- `thank-you.astro` → `/thank-you`

## 🧩 React Islands (`src/components/ui/islands/`)

**Interactive components that hydrate on the client.**

| Component | Feature | Hydration |
|-----------|---------|-----------|
| `HeaderRepair.tsx` | Navigation with scroll effects | `client:load` |
| `SolarRepairQuiz.tsx` | Multi-step lead capture form | `client:load` |
| `FeatureSteps.tsx` | Auto-rotating feature showcase | `client:visible` |
| `TestimonialsColumns.tsx` | Customer review display | `client:visible` |

### When to Edit Islands

- **Content changes**: Edit text/data directly in the component
- **Styling changes**: Use Tailwind classes or add to `global.css`
- **Behavior changes**: Modify React hooks and event handlers

## 🏗️ Static Components (`src/components/ui/`)

**Server-rendered Astro components (no JavaScript).**

| Component | Purpose | Contains |
|-----------|---------|----------|
| `HeroRepair.astro` | Hero section | Hero text, CTA buttons, trust indicators |
| `PricingCard.astro` | Pricing display | Three pricing tiers |
| `StepsTimeline.astro` | Repair process | 4-step timeline |
| `FaqAccordion.astro` | FAQ section | Expandable Q&A |
| `FooterRepair.astro` | Site footer | Contact info, links, legal |

## 🎨 Styles (`src/styles/`)

| File | Purpose | Edit For |
|------|---------|----------|
| `global.css` | Tailwind directives + custom CSS | Colors, animations, global styles |

### Key CSS Classes

```css
/* Primary color (blue) */
.text-\[\#498dcb\]
.bg-\[\#498dcb\]
.border-\[\#498dcb\]

/* Buttons */
.cta-button
.secondary-button

/* Animations */
@keyframes fadeInUp
@keyframes heroBackgroundZoomOut
@keyframes charReveal
```

## 📂 Public Directory (`public/`)

**Static assets served directly (no processing).**

| Path | Purpose |
|------|---------|
| `404.html` | Custom 404 error page |
| `robots.txt` | Search engine directives |
| `sitemap.xml` | Site structure for SEO |
| `favicon.svg` | Site icon (deprecated, use external) |
| `images/logo/rrlogo.png` | Black logo |
| `images/logo/rrlogo-white.png` | White logo |
| `images/hero/67bff5403e5f1a358c998e13_fit-hero.webp` | Hero background |

### Adding New Images

1. Place in `public/images/`
2. Reference with `/images/filename.jpg`
3. No import needed!

```astro
<img src="/images/hero/my-image.jpg" alt="Description" />
```

## ⚙️ Configuration Details

### Astro Config (`astro.config.mjs`)

```javascript
export default defineConfig({
  integrations: [
    react(),        // React islands
    tailwind()      // Tailwind CSS
  ]
});
```

### Tailwind Config (`tailwind.config.mjs`)

```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      }
    }
  }
}
```

### TypeScript Config (`tsconfig.json`)

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## 📦 Key Dependencies

### Production

| Package | Purpose | Version |
|---------|---------|---------|
| `astro` | Core framework | ^4.16.7 |
| `react` | UI library | ^18.3.1 |
| `react-dom` | React renderer | ^18.3.1 |
| `tailwindcss` | CSS framework | ^3.4.14 |
| `framer-motion` | Animations | ^11.18.2 |
| `motion` | Advanced animations | ^12.23.24 |
| `lucide-react` | Icon library | ^0.545.0 |

### Dev Dependencies

| Package | Purpose |
|---------|---------|
| `typescript` | Type checking |
| `@types/react` | React type definitions |
| `@types/node` | Node.js types |

## 🗂️ Component Hierarchy

```
index.astro (Main Page)
├── HeaderRepair (React Island)
├── HeroRepair (Astro)
├── SolarRepairQuiz (React Island)
├── PricingCard (Astro) × 3
├── FeatureSteps (React Island)
├── TestimonialsColumns (React Island)
├── StepsTimeline (Astro)
├── Service Area Section (Astro inline)
├── FaqAccordion (Astro)
└── FooterRepair (Astro)
```

## 🎬 How Components Work Together

### Page Load Flow

1. **SSG Build Time**
   - Astro pre-renders all static components
   - React islands are prepared for hydration
   - HTML generated with minimal JS

2. **Browser Load**
   - HTML loads instantly (static content visible)
   - React islands hydrate based on strategy:
     - `client:load` - Immediately (Header, Quiz)
     - `client:visible` - When scrolled into view (Features, Testimonials)

3. **User Interaction**
   - Quiz opens modal on card click
   - Header changes style on scroll
   - Features auto-rotate every 5 seconds
   - FAQ items expand/collapse

## 📝 Common Editing Tasks

### Change Phone Number

Search and replace `(385) 539-8892` across:
- `src/components/ui/HeroRepair.astro`
- `src/components/ui/islands/HeaderRepair.tsx`
- `src/components/ui/FooterRepair.astro`
- `src/pages/index.astro` (JSON-LD schema)

### Update Email

Search and replace `seth@randrsolarroofs.com` in:
- `src/components/ui/FooterRepair.astro`
- `src/pages/index.astro` (JSON-LD schema)

### Change Primary Color

Edit `src/styles/global.css`:
```css
:root {
  --primary: 207 57% 54%;  /* Change this HSL value */
}
```

Then search/replace `#498dcb` and `#3a7ab5` across components.

### Add FAQ Question

Edit `src/components/ui/FaqAccordion.astro`, add new accordion item in the grid.

### Update Testimonials

Edit `src/components/ui/islands/TestimonialsColumns.tsx`, modify the `testimonials` array.

## 🚀 Build Output

### Development (`npm run dev`)

```
.astro/                    # Astro cache
node_modules/              # Dependencies
```

### Production (`npm run build`)

```
dist/                      # Optimized output
├── index.html             # Pre-rendered page
├── _astro/                # JS/CSS bundles
│   ├── *.js               # React islands
│   └── *.css              # Compiled CSS
├── images/                # Static assets
└── *.xml, *.txt, etc.     # Public files
```

## 📊 File Sizes (Approximate)

| Type | Size | Notes |
|------|------|-------|
| HTML | ~40KB | Main page markup |
| CSS | ~15KB | Tailwind + custom styles |
| JS (islands) | ~100KB | React + Framer Motion |
| Images | ~1MB | Hero + feature images |

## 🔍 Finding Files Quickly

### By Feature

| Feature | Main File(s) |
|---------|-------------|
| Navigation | `src/components/ui/islands/HeaderRepair.tsx` |
| Hero section | `src/components/ui/HeroRepair.astro` |
| Lead capture | `src/components/ui/islands/SolarRepairQuiz.tsx` |
| Pricing | `src/components/ui/PricingCard.astro`, `src/pages/index.astro` |
| Testimonials | `src/components/ui/islands/TestimonialsColumns.tsx` |
| FAQ | `src/components/ui/FaqAccordion.astro` |
| Contact info | `src/components/ui/FooterRepair.astro` |

### By Type

| Type | Location |
|------|----------|
| React components | `src/components/ui/islands/*.tsx` |
| Astro components | `src/components/ui/*.astro` |
| Pages | `src/pages/*.astro` |
| Styles | `src/styles/*.css` |
| Static assets | `public/*` |
| Config | Root `*.mjs`, `*.json` |

## 💡 Pro Tips

1. **Use `@/` alias** instead of `../../../` for imports
2. **Astro components** for static content (faster)
3. **React islands** only when interactivity needed
4. **`client:visible`** for below-fold components
5. **Place images in `public/`** for direct serving

## 🐛 Debugging Files

### Can't find component?
- Check `src/components/ui/` (Astro)
- Check `src/components/ui/islands/` (React)

### Styles not applying?
- Check `src/styles/global.css` for custom classes
- Verify Tailwind classes in `tailwind.config.mjs`

### Image not loading?
- Ensure image is in `public/images/`
- Use `/images/...` path (not `./images/`)

---

**Questions?** Check `README.md` or `QUICKSTART.md` for more help! ☀️
