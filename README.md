# Kisaan.com - Kisaan.com Multi-Tenancy E-Commerce E-Commerce Platform

A modern Kisaan.com Multi-Tenancy E-Commerce e-commerce platform built with Next.js that enables users to register as sellers and buyers. Sellers can list and manage their products while buyers can browse and purchase items from multiple vendors.

## Features

### For Sellers

- User registration and authentication
- Seller dashboard for product management
- Add, edit, and delete products
- Order management and tracking
- Sales analytics and reporting

### For Buyers

- Browse products from multiple sellers
- Search and filter functionality
- Shopping cart and checkout process
- Order history and tracking
- User profile management
- 24/7 customer support
- Easy returns and refunds
- Secure payment processing
- Best price guarantee

### Platform Features

- Kisaan.com Multi-Tenancy E-Commerce architecture
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Modern React 19 with Next.js 15
- RESTful API integration
- UK GDPR compliant privacy policy
- Cookie consent management (PECR compliant)
- Dedicated feature pages (Security, Pricing, Returns, Support)
- Custom-generated banner images with farmer theme
- Procedurally generated page backgrounds

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context
- **Icons**: Lucide React
- **Deployment**: Docker support included

## Project Structure

```
kisaan.com/
├── kisaan-next/          # Next.js application (main codebase)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── security/             # Fast & Secure page
│   │   │   ├── pricing/              # Best Prices page
│   │   │   ├── returns/              # Easy Returns page
│   │   │   ├── support/              # 24/7 Support page
│   │   │   ├── privacy/              # Privacy Policy (UK GDPR)
│   │   │   ├── cookies/              # Cookie Policy (UK PECR)
│   │   │   ├── cart/                 # Shopping cart
│   │   │   ├── checkout/             # Checkout process
│   │   │   └── seller/               # Seller dashboard
│   │   ├── components/               # Reusable components
│   │   └── lib/                      # Utility functions
├── kisaan.com/           # Legacy PHP frontend
├── kisaan-devops/    # DevOps configurations
└── README.md
```

## Key Pages

### Customer Information Pages
- **`/security`** - Fast & Secure: SSL encryption, PCI DSS compliance, fraud protection
- **`/pricing`** - Best Prices: Price guarantee, discounts, bulk pricing, loyalty rewards
- **`/returns`** - Easy Returns: 30-day return policy, free return shipping, exchange process
- **`/support`** - 24/7 Support: Live chat, email support, phone support, knowledge base

### Legal & Compliance Pages
- **`/privacy`** - Privacy Policy: UK GDPR compliant, data protection rights, ICO information
- **`/cookies`** - Cookie Policy: UK PECR compliant, cookie types, consent management

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd kisaan.com
   ```

2. **Navigate to the Next.js application**

   ```bash
   cd kisaan-next
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Environment Configuration**

   The `.env.local` file is already configured with:

   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:4010
   NEXT_PUBLIC_APP_NAME=Kisaan.com Multi-Tenancy E-Commerce Ecommerce
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Access the application**

   Open your browser and navigate to: `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Docker Setup (Optional)

For containerized development:

```bash
cd kisaan-next

# Development
docker build -f Dockerfile.dev -t kisaan-dev .
docker run -p 3000:3000 kisaan-dev

# Production
docker build -f Dockerfile -t kisaan-prod .
docker run -p 3000:3000 kisaan-prod
```

## Banner Images

The platform features custom-generated banner images created with Python PIL/Pillow:

### Generate Banners

```bash
# Main hero banner (farmer in fields)
cd kisaan-next/scripts
python3 generate-banner.py

# Feature page banners (security, pricing, returns, support)
python3 generate-feature-banners.py
```

### Requirements

```bash
pip3 install Pillow --user
```

### Generated Images

- **Hero Banner**: `hero-farmer-banner.jpg` (1920x800px) - Farmer at sunset
- **Feature Banners**: Abstract geometric patterns for each feature page
- **Textures**: Light background textures for content sections

See `kisaan-next/public/BANNERS.md` for complete documentation.

## API Configuration

The application expects a backend API running on `http://127.0.0.1:4010`. Make sure your API server is running and accessible at this endpoint.

**Note**: This is a Kisaan.com Multi-Tenancy E-Commerce e-commerce platform where sellers and buyers can interact seamlessly. Make sure to configure your backend API properly for full functionality.
