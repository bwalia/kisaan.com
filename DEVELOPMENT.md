# 🚀 Kisaan Frontend - Development Guide

## Getting Started

### Running the Development Server
```bash
cd kisaan-next
npm install
npm run dev
```

Visit `http://localhost:3000` to see your changes.

## File Structure

```
kisaan-next/src/
├── app/
│   ├── page.tsx                 # Home page (Updated ✅)
│   ├── globals.css              # Global styles (Updated ✅)
│   └── layout.tsx               # Root layout
├── components/
│   ├── Navbar.tsx               # Navigation bar (Updated ✅)
│   ├── Footer.tsx               # Footer (Updated ✅)
│   ├── ProductCard.tsx          # Product cards (Updated ✅)
│   └── home/
│       ├── HeroSection.tsx      # Hero banner (Updated ✅)
│       ├── FeaturesSection.tsx  # Features grid (NEW ✅)
│       ├── CategoryFilter.tsx   # Category tabs (Updated ✅)
│       └── ...other components
└── lib/
    └── utils.ts                 # Utility functions
```

## Making Changes

### Adding a New Component

1. Create component file in `src/components/`
2. Follow the design system patterns (see DESIGN_SYSTEM.md)
3. Import and use in your page

Example:
```tsx
// src/components/NewComponent.tsx
export default function NewComponent() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      {/* Your content */}
    </div>
  );
}
```

### Modifying Colors

All colors are centralized:
- Primary brand colors in `globals.css` CSS variables
- Tailwind colors used directly in className props
- Main green: `#16a34a`, `text-[#16a34a]`, `bg-[#16a34a]`

### Adding Animations

Use Tailwind's built-in transitions:
```tsx
className="transition-all duration-300 hover:scale-105"
```

Or create custom animations in `globals.css`:
```css
@keyframes your-animation {
  from { /* start state */ }
  to { /* end state */ }
}

.animate-your-animation {
  animation: your-animation 1s ease-in-out;
}
```

## Component Patterns

### Card Component Pattern
```tsx
<div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
  {/* Content */}
</div>
```

### Button Pattern
```tsx
<button className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
  Button Text
</button>
```

### Icon Pattern
```tsx
<div className="w-16 h-16 bg-gradient-to-br from-[#16a34a] to-[#15803d] rounded-2xl flex items-center justify-center text-white shadow-lg">
  {/* Icon SVG */}
</div>
```

## Common Tasks

### 1. Adding a New Page

```tsx
// src/app/new-page/page.tsx
export default function NewPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your content */}
    </div>
  );
}
```

### 2. Updating the Hero Section

Edit `src/components/home/HeroSection.tsx`:
- Change heading text
- Update search placeholder
- Modify CTA buttons
- Adjust statistics

### 3. Adding New Features

Edit `src/components/home/FeaturesSection.tsx`:
- Add/remove features from the `features` array
- Update icons, titles, descriptions
- Change gradient colors

### 4. Customizing Product Cards

Edit `src/components/ProductCard.tsx`:
- Modify card styling
- Change quick-add button behavior
- Update price display format

## Styling Guidelines

### DO ✅
- Use Tailwind utility classes
- Follow the spacing scale (p-4, p-6, p-8)
- Use consistent border radius (rounded-xl, rounded-2xl)
- Apply hover states to interactive elements
- Use transitions for smooth animations
- Follow the color palette

### DON'T ❌
- Write custom CSS unless absolutely necessary
- Use inline styles
- Mix different design patterns
- Forget hover states
- Skip responsive modifiers (md:, lg:)
- Use arbitrary colors outside the palette

## Responsive Design

Always test at these breakpoints:
- Mobile: 375px (iPhone)
- Tablet: 768px (iPad)
- Desktop: 1280px
- Large Desktop: 1920px

Use Tailwind breakpoints:
```tsx
className="text-sm md:text-base lg:text-lg"
```

## Testing Your Changes

### Visual Testing
1. Check all breakpoints (mobile, tablet, desktop)
2. Test hover states
3. Verify animations are smooth
4. Check loading states
5. Test with different content lengths

### Browser Testing
- Chrome/Edge (Chromium)
- Firefox
- Safari (if on Mac)

## Performance Tips

### Images
Use Next.js Image component for optimization:
```tsx
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={500}
  height={300}
  className="rounded-xl"
/>
```

### Code Splitting
Use dynamic imports for heavy components:
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

## Debugging

### Common Issues

**Issue**: Styles not applying
- **Solution**: Check Tailwind class names for typos
- **Solution**: Ensure classes are not being purged

**Issue**: Animations not working
- **Solution**: Check for conflicting transitions
- **Solution**: Verify animation classes are defined in globals.css

**Issue**: Layout shifts
- **Solution**: Use fixed dimensions for images
- **Solution**: Add loading skeletons

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: description of changes"

# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## Build for Production

```bash
# Build the application
npm run build

# Test production build locally
npm run start
```

## Useful Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- DESIGN_SYSTEM.md - Component patterns
- DESIGN_UPDATES.md - Recent changes

## Design System Files

- `DESIGN_UPDATES.md` - Comprehensive changelog
- `DESIGN_SYSTEM.md` - Quick reference for patterns
- `DEVELOPMENT.md` - This file

## Questions?

If you're unsure about:
- **Styling**: Check DESIGN_SYSTEM.md
- **Recent changes**: Check DESIGN_UPDATES.md
- **Component structure**: Look at existing components
- **Tailwind classes**: Visit tailwindcss.com/docs

## Best Practices

1. **Consistency**: Follow existing patterns
2. **Accessibility**: Add alt text, ARIA labels
3. **Performance**: Optimize images, lazy load
4. **Responsive**: Test all breakpoints
5. **Clean Code**: Keep components focused and small
6. **Documentation**: Comment complex logic

---

Happy coding! 🎉
