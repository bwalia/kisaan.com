# 🎨 Kisaan Design System Quick Reference

## Color Variables

### CSS Variables (globals.css)
```css
--primary: #16a34a           /* Main brand green */
--primary-dark: #15803d      /* Darker green for gradients */
--primary-light: #22c55e     /* Light green accents */
--primary-50: #f0fdf4        /* Very light green backgrounds */
--primary-100: #dcfce7       /* Light backgrounds */
--primary-600: #15803d       /* Medium dark */
--primary-700: #14532d       /* Very dark green */
```

## Component Patterns

### Button Styles

#### Primary Button (Gradient)
```tsx
className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
```

#### Secondary Button (Outlined)
```tsx
className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#16a34a] transition-all duration-300"
```

### Card Styles

#### Product Card
```tsx
className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-[#16a34a]/30 transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1"
```

#### Feature Card
```tsx
className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl border border-gray-100 hover:border-[#16a34a]/30 transition-all duration-300 transform hover:-translate-y-2"
```

### Icon Container Styles

#### Logo Container
```tsx
className="w-10 h-10 bg-gradient-to-br from-[#16a34a] to-[#15803d] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"
```

#### Feature Icon
```tsx
className="w-16 h-16 bg-gradient-to-br from-[color1] to-[color2] rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg"
```

## Typography Scale

### Headings
```css
/* Hero Heading */
text-5xl md:text-6xl lg:text-7xl font-extrabold

/* Section Heading */
text-3xl md:text-4xl font-bold

/* Card Heading */
text-xl font-bold

/* Subheading */
text-xl md:text-2xl font-light
```

### Body Text
```css
/* Large body */
text-lg leading-relaxed

/* Regular body */
text-base leading-relaxed

/* Small text */
text-sm
```

## Spacing System

### Container Padding
```css
/* Page container */
container mx-auto px-6

/* Section spacing */
py-16 md:py-20 lg:py-28

/* Card padding */
p-5 md:p-6
```

### Grid Gaps
```css
/* Feature grid */
gap-8

/* Product grid */
gap-6

/* Navigation items */
gap-3 md:gap-4
```

## Border Radius Scale

```css
rounded-lg    /* 0.5rem - Small cards */
rounded-xl    /* 0.75rem - Medium elements */
rounded-2xl   /* 1rem - Large cards */
rounded-full  /* Buttons, badges */
```

## Shadow Scale

```css
shadow-sm     /* Subtle elevation */
shadow-md     /* Default card shadow */
shadow-lg     /* Emphasized elements */
shadow-xl     /* Important CTAs */
shadow-2xl    /* Hover states */
```

## Animation Durations

```css
duration-200  /* Quick interactions (buttons) */
duration-300  /* Standard transitions (cards) */
duration-500  /* Slower animations (images) */
```

## Transform Patterns

### Hover Lift
```css
transform hover:-translate-y-1
```

### Hover Scale
```css
transform hover:scale-105
```

### Active Scale
```css
transform scale-105
```

## Gradient Patterns

### Background Gradients
```css
/* Primary gradient */
bg-gradient-to-r from-[#16a34a] to-[#15803d]

/* Hero gradient */
bg-gradient-to-br from-[#16a34a] via-[#15803d] to-[#14532d]

/* Text gradient */
bg-gradient-to-r from-emerald-200 via-green-100 to-emerald-300 bg-clip-text text-transparent
```

### Color Feature Gradients
```css
/* Blue */
from-blue-500 to-blue-600

/* Green */
from-[#16a34a] to-[#15803d]

/* Purple */
from-purple-500 to-purple-600

/* Orange */
from-orange-500 to-orange-600
```

## Loading States

### Spinner
```tsx
<div className="w-4 h-4 border-2 border-[#16a34a] border-t-transparent rounded-full animate-spin"></div>
```

### Skeleton
```tsx
<div className="h-11 w-28 bg-gray-200 rounded-xl animate-pulse"></div>
```

### Pulse Badge
```tsx
<span className="flex h-2 w-2 relative">
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-100"></span>
</span>
```

## Backdrop Effects

```css
/* Navbar backdrop */
backdrop-blur-lg bg-opacity-95

/* Card backdrop */
backdrop-blur-sm bg-white/10
```

## Border Patterns

```css
/* Subtle border */
border border-gray-200

/* Emphasized border */
border-2 border-gray-200

/* Hover border */
hover:border-[#16a34a]

/* Semi-transparent border */
border border-white/20
```

## Responsive Patterns

### Grid Layouts
```css
/* Features */
grid-cols-1 md:grid-cols-2 lg:grid-cols-4

/* Products */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

/* Two column */
grid-cols-1 lg:grid-cols-2
```

### Flexbox
```css
/* Stack to row */
flex-col sm:flex-row

/* Center on mobile, space on desktop */
justify-center lg:justify-between
```

## Icon Sizes

```css
w-4 h-4    /* Small inline icons */
w-5 h-5    /* Regular icons */
w-6 h-6    /* Navigation icons */
w-8 h-8    /* Feature icons (in container) */
w-16 h-16  /* Large feature icons */
```

## Usage Examples

### Modern Button
```tsx
<button className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
  Click Me
</button>
```

### Product Card
```tsx
<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-[#16a34a]/30 transition-all duration-300 transform hover:-translate-y-1">
  {/* Content */}
</div>
```

### Section Header
```tsx
<div className="text-center mb-12">
  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
    Why Choose <span className="text-[#16a34a]">Kisaan</span>?
  </h2>
  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
    Description text here
  </p>
</div>
```

---

**Quick Tip**: Use browser DevTools to inspect live examples of these patterns in the application!
