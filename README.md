# Likvidea - Swedish B2B Financial Services Landing Page

A modern, high-converting landing page for Likvidea's Swedish B2B financial services, inspired by Lendo's clean design aesthetic.

## A/B Testing Configuration

The application includes built-in A/B testing variants for key conversion elements:

### Headline Variants
- **v1**: "Sälj dina fakturor – frigör likviditet på timmar"
- **v2**: "Få bud på dina fakturor – snabbt och tryggt"
- **v3**: "Fakturaköp för bättre kassaflöde"

### Primary CTA Variants
- **v1**: "Sälj fakturor nu"
- **v2**: "Begär bud"
- **v3**: "Kom igång"
- **v4**: "Sälj faktura nu"

### Secondary CTA Variants
- **v1**: "Få kostnadsfritt bud"
- **v2**: "Bli uppringd"
- **v3**: "Skicka intresse"

## How to Configure A/B Tests

1. Open `src/components/Hero.tsx`
2. Change the variant selection:
   ```typescript
   const currentHeadline = headlineVariants.v2; // Change v1 to v2, v3, etc.
   const currentPrimaryCta = primaryCtaVariants.v2;
   const currentSecondaryCta = secondaryCtaVariants.v2;
   ```
3. Save and the changes will be reflected immediately

## Features

- **Responsive Design**: Mobile-first approach with proper breakpoints
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels
- **Multi-step Form**: Progressive form with validation and file upload
- **Swedish Localization**: All content in Swedish for B2B market
- **Performance Optimized**: Fast loading with optimized assets
- **SEO Ready**: Proper meta tags and semantic HTML

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling

## Getting Started

```bash
npm install
npm run dev
```

## Deployment

The application is optimized for static hosting and can be deployed to any CDN or static hosting service.

```bash
npm run build
```