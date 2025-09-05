# Kisaan.com - Multi-Tenant E-Commerce Platform

A modern multi-tenant e-commerce platform built with Next.js that enables users to register as sellers and buyers. Sellers can list and manage their products while buyers can browse and purchase items from multiple vendors.

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

### Platform Features

- Multi-tenant architecture
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Modern React 19 with Next.js 15
- RESTful API integration

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
├── kisaan.com/           # Legacy PHP frontend
├── kisaan.com-devops/    # DevOps configurations
└── README.md
```

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
   NEXT_PUBLIC_APP_NAME=Multi-Tenant Ecommerce
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

## API Configuration

The application expects a backend API running on `http://127.0.0.1:4010`. Make sure your API server is running and accessible at this endpoint.

**Note**: This is a multi-tenant e-commerce platform where sellers and buyers can interact seamlessly. Make sure to configure your backend API properly for full functionality.
