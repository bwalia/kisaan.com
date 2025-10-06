# Banner Images Documentation

## Overview
This document describes all the banner and background images used throughout the Kisaan marketplace. All images are procedurally generated using Python PIL/Pillow for consistency and customization.

---

## Hero Section Banner

### `hero-farmer-banner.jpg`
**Dimensions:** 1920x800px  
**Location:** Homepage hero section  
**Theme:** Farmer working in fields at sunset

**Features:**
- Beautiful sunrise/sunset gradient (warm orange tones)
- Glowing sun in top-right
- Agricultural field rows with perspective
- Farmer silhouette planting crops
- Crop plants in foreground
- Subtle texture overlay
- Vignette effect

**Usage in Code:**
```tsx
// src/components/home/HeroSection.tsx
<div 
  className="absolute inset-0 bg-cover bg-center"
  style={{ backgroundImage: "url('/hero-farmer-banner.jpg')" }}
>
  <div className="absolute inset-0 bg-gradient-to-br from-[#16a34a]/85 via-[#15803d]/80 to-[#14532d]/85" />
</div>
```

**Design Rationale:**
- Connects marketplace to agricultural roots
- Warm, inviting atmosphere
- Emphasizes hard work and authenticity
- Creates emotional connection with farmers

---

### `hero-farmer-banner-blurred.jpg`
**Dimensions:** 1920x800px  
**Location:** Available for alternative layouts  
**Theme:** Softly blurred version of main banner

**Features:**
- Same as main banner but with Gaussian blur (radius: 5)
- Softer, more subtle background
- Better for overlaying text without strong shadows

**Usage:**
Can be swapped in HeroSection for a more subtle look:
```tsx
style={{ backgroundImage: "url('/hero-farmer-banner-blurred.jpg')" }}
```

---

## Feature Page Banners

All feature page banners are **1920x600px** and use abstract geometric patterns matching their page themes.

### `banner-security.jpg`
**Page:** /security (Fast & Secure)  
**Color Scheme:** Blue (#2563eb, #1d4ed8)  
**Theme:** Trust, security, protection

**Design Elements:**
- Blue gradient background
- Circular geometric patterns
- Diagonal line texture
- 30% opacity in hero section

**Usage:**
```tsx
// src/app/security/page.tsx
<div 
  className="absolute inset-0 bg-cover bg-center opacity-30"
  style={{ backgroundImage: "url('/banner-security.jpg')" }}
/>
```

---

### `banner-pricing.jpg`
**Page:** /pricing (Best Prices)  
**Color Scheme:** Green (#16a34a, #15803d)  
**Theme:** Money, savings, value

**Design Elements:**
- Green gradient background
- Abstract circular patterns
- Diagonal texture lines
- Matches brand color scheme

**Usage:**
```tsx
// src/app/pricing/page.tsx
<div 
  className="absolute inset-0 bg-cover bg-center opacity-30"
  style={{ backgroundImage: "url('/banner-pricing.jpg')" }}
/>
```

---

### `banner-returns.jpg`
**Page:** /returns (Easy Returns)  
**Color Scheme:** Purple (#9333ea, #7e22ce)  
**Theme:** Premium service, ease

**Design Elements:**
- Purple gradient background
- Flowing circular shapes
- Diagonal pattern overlay
- Premium, elegant feel

**Usage:**
```tsx
// src/app/returns/page.tsx
<div 
  className="absolute inset-0 bg-cover bg-center opacity-30"
  style={{ backgroundImage: "url('/banner-returns.jpg')" }}
/>
```

---

### `banner-support.jpg`
**Page:** /support (24/7 Support)  
**Color Scheme:** Orange (#ea580c, #c2410c)  
**Theme:** Warmth, accessibility, help

**Design Elements:**
- Orange gradient background
- Dynamic circular patterns
- Diagonal line texture
- Warm, welcoming atmosphere

**Usage:**
```tsx
// src/app/support/page.tsx
<div 
  className="absolute inset-0 bg-cover bg-center opacity-30"
  style={{ backgroundImage: "url('/banner-support.jpg')" }}
/>
```

---

## Subtle Texture Backgrounds

All texture files are **1920x600px** with very light colors, designed for subtle page backgrounds.

### `texture-green-light.jpg`
**Color:** #f0fdf4 (green-50)  
**Use Case:** Pricing/agricultural content sections  
**Features:** Horizontal field rows, organic shapes, soft blur

### `texture-blue-light.jpg`
**Color:** #eff6ff (blue-50)  
**Use Case:** Security/trust content sections  
**Features:** Horizontal rows, organic elements, professional feel

### `texture-purple-light.jpg`
**Color:** #faf5ff (purple-50)  
**Use Case:** Returns/premium content sections  
**Features:** Subtle patterns, elegant atmosphere

### `texture-orange-light.jpg`
**Color:** #fff7ed (orange-50)  
**Use Case:** Support/help content sections  
**Features:** Warm patterns, approachable design

**Usage Example:**
```tsx
<section 
  className="py-16"
  style={{ backgroundImage: "url('/texture-green-light.jpg')" }}
>
  {/* Content */}
</section>
```

---

## Generation Scripts

### Primary Script: `scripts/generate-banner.py`
Generates the main hero farmer banner.

**Run:**
```bash
cd nextjs/scripts
python3 generate-banner.py
```

**Output:**
- hero-farmer-banner.jpg
- hero-farmer-banner-blurred.jpg

---

### Secondary Script: `scripts/generate-feature-banners.py`
Generates all feature page banners and textures.

**Run:**
```bash
cd nextjs/scripts
python3 generate-feature-banners.py
```

**Output:**
- banner-security.jpg
- banner-pricing.jpg
- banner-returns.jpg
- banner-support.jpg
- texture-green-light.jpg
- texture-blue-light.jpg
- texture-purple-light.jpg
- texture-orange-light.jpg

---

## Customization Guide

### Change Banner Colors
Edit the color arrays in the generation scripts:

```python
# In generate-banner.py
colors = [
    (255, 200, 150),  # Top color (RGB)
    (255, 180, 120),  # ...
    # Add more colors for smoother gradient
]
```

### Adjust Opacity
Modify opacity in component files:

```tsx
// Current: 30% opacity
className="... opacity-30"

// Lighter: 20%
className="... opacity-20"

// Darker: 50%
className="... opacity-50"
```

### Change Banner Dimensions
Edit constants in Python scripts:

```python
WIDTH = 1920   # Change to desired width
HEIGHT = 800   # Change to desired height
```

### Adjust Gradient Overlay
Modify the gradient overlay in TSX files:

```tsx
// Current: 80% opacity
from-[#16a34a]/80

// More transparent: 60%
from-[#16a34a]/60

// More opaque: 90%
from-[#16a34a]/90
```

---

## Performance Optimization

### Image Specifications
- **Format:** JPEG (better compression for photos/gradients)
- **Quality:** 85-95% (balanced quality/size)
- **Optimization:** PIL's optimize flag enabled
- **Typical File Size:** 300-500KB per banner

### Loading Strategy
1. **Critical:** Hero banner (above the fold)
2. **Lazy:** Feature page banners (loaded on navigation)
3. **Optional:** Texture backgrounds (progressive enhancement)

### Next.js Image Optimization
Consider using Next.js Image component for automatic optimization:

```tsx
import Image from 'next/image';

<Image
  src="/hero-farmer-banner.jpg"
  alt="Farmer working in fields"
  fill
  className="object-cover"
  priority // For above-the-fold images
/>
```

---

## Accessibility Considerations

### Alt Text
Always provide descriptive alt text when using images as semantic content:

```tsx
<img 
  src="/hero-farmer-banner.jpg"
  alt="Farmer working in agricultural fields at sunset"
/>
```

### Text Contrast
Ensure sufficient contrast between text and background:
- Current implementation uses semi-transparent gradient overlays (80-85% opacity)
- White text on dark gradient overlay meets WCAG AAA standards
- Test with browser dev tools color picker

### Motion Sensitivity
- Avoid parallax effects on banner images
- Use static backgrounds
- Respect `prefers-reduced-motion` media query

---

## Browser Compatibility

All banners use standard CSS background properties:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (desktop & mobile)
- ✅ Opera
- ✅ Samsung Internet

**Fallback:**
```css
/* If image fails to load, gradient shows */
.hero-section {
  background: linear-gradient(to bottom right, #16a34a, #15803d, #14532d);
}
```

---

## Maintenance

### Updating Banners
1. Modify generation scripts as needed
2. Run scripts to regenerate images
3. No code changes required (images overwritten)
4. Clear browser cache for testing

### Adding New Banners
1. Create new generation function in script
2. Define colors, patterns, dimensions
3. Add to `create_all_banners()` function
4. Update components to reference new banner

### Seasonal Variations
Consider creating seasonal versions:
- `hero-farmer-banner-spring.jpg`
- `hero-farmer-banner-summer.jpg`
- `hero-farmer-banner-autumn.jpg`
- `hero-farmer-banner-winter.jpg`

Swap based on current month:
```tsx
const month = new Date().getMonth();
const season = month < 3 ? 'winter' : month < 6 ? 'spring' : month < 9 ? 'summer' : 'autumn';
const banner = `/hero-farmer-banner-${season}.jpg`;
```

---

## Troubleshooting

### Image Not Displaying
1. Check file exists in `public/` folder
2. Verify correct path (no `/public` in URL)
3. Check browser console for 404 errors
4. Clear Next.js cache: `rm -rf .next`

### Poor Quality
1. Increase JPEG quality in script (max 100)
2. Increase image dimensions
3. Reduce compression artifacts

### Slow Loading
1. Reduce image dimensions
2. Lower JPEG quality (min 70)
3. Use progressive JPEG encoding
4. Implement lazy loading

### Text Not Readable
1. Increase gradient overlay opacity
2. Add text shadow: `text-shadow-lg`
3. Use darker overlay colors
4. Position text in clearer areas

---

## Future Enhancements

- [ ] Generate WebP versions for better compression
- [ ] Create responsive image sets (srcset)
- [ ] Add animated SVG overlays
- [ ] Implement parallax scrolling effects
- [ ] A/B test different banner styles
- [ ] Generate banners on-the-fly via API
- [ ] Add user-selectable themes
- [ ] Create dark mode variants

---

**Last Updated:** October 5, 2025  
**Maintained By:** Kisaan Development Team
