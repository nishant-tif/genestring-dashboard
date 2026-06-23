# Genestring Lab

A comprehensive AI governance dashboard built with Next.js, TypeScript, Material UI, Tailwind CSS, and Redux Toolkit. This application provides a production-ready solution for monitoring and managing AI systems, policies, models, and organizations.

## Features

- 🔐 **Secure Authentication** - Login system with token-based authentication
- 📊 **Dashboard** - Comprehensive overview with health scores, risk assessments, and compliance metrics
- 📋 **Policy Management** - Create, read, update, and delete AI governance policies
- 🤖 **Model Management** - Track and manage AI models with risk categorization
- 🏢 **Organization Management** - Manage organizations and their details
- 📱 **Responsive Design** - Fully responsive layout that works on all devices
- 🧪 **Comprehensive Testing** - Jest test suite with React Testing Library
- 🔒 **Security Best Practices** - Security headers, CSRF protection, and secure API integration
- 🔄 **State Management** - Redux Toolkit for efficient state management
- 🎨 **Modern UI** - Material UI components with Tailwind CSS styling

## Tech Stack

- **Framework**: Next.js 16.1.3 (App Router)
- **Language**: TypeScript
- **UI Library**: Material UI (MUI) 7.3.7
- **Styling**: Tailwind CSS 4
- **State Management**: Redux Toolkit 2.11.2
- **Testing**: Jest 30.2.0 with React Testing Library
- **HTTP Client**: Axios 1.13.2

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd gauri-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and update the API base URL:

```env
NEXT_PUBLIC_API_URL=https://devapi.normah.ai
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [https://localhost:3000](https://localhost:3000) in your browser.

### Default Login Credentials

For development with dummy data, any email and password will work. In production, use your actual credentials.

## Project Structure

```
normah/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard page
│   │   ├── policy/             # Policy management page
│   │   ├── model/              # Model management page
│   │   ├── organizations/      # Organizations page
│   │   ├── profile/            # Profile page
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Login page
│   ├── components/             # Reusable components
│   │   ├── layout/             # Layout components (Sidebar, Header, Layout)
│   │   └── modals/             # Modal components
│   ├── config/                 # Configuration files
│   │   └── api.ts              # API configuration
│   ├── services/               # API services
│   │   ├── api.ts              # Axios instance with interceptors
│   │   └── dummyData.ts        # Dummy data service (replace with real API)
│   ├── store/                  # Redux store
│   │   ├── slices/             # Redux slices
│   │   └── index.ts            # Store configuration
│   ├── types/                  # TypeScript type definitions
│   ├── middleware.ts           # Next.js middleware (security headers)
│   └── test/                   # Test utilities
├── public/                     # Static assets
├── jest.config.mts             # Jest configuration
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## Switching to Real API

The application currently uses dummy data services. To switch to your real API:

### Step 1: Update API Configuration

Edit `src/config/api.ts` and update the `baseURL`:

```typescript
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://your-api-url.com",
  // ...
};
```

Or set it in your `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

### Step 2: Replace Dummy Services

Replace the dummy data functions in `src/services/dummyData.ts` with actual API calls using the `apiClient`:

```typescript
// Before (dummy data)
export const policyService = {
  getAll: async (): Promise<Policy[]> => {
    await delay(300);
    return [...dummyPolicies];
  },
};

// After (real API)
export const policyService = {
  getAll: async (): Promise<Policy[]> => {
    const response = await apiClient.get(API_ENDPOINTS.POLICIES);
    return response.data;
  },
};
```

The API endpoints are already defined in `src/config/api.ts`. Just uncomment and modify the API calls in `src/services/dummyData.ts`.

### Step 3: Update API Endpoints

Ensure your API endpoints match the structure defined in `src/config/api.ts`. If not, update the `API_ENDPOINTS` object.

## Testing

Run the test suite:

```bash
npm test
# or
yarn test
# or
pnpm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Building for Production

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Security Features

- **Security Headers**: Implemented via Next.js middleware
  - X-Frame-Options
  - X-Content-Type-Options
  - X-XSS-Protection
  - Strict-Transport-Security
  - Content-Security-Policy
- **CSRF Protection**: CSRF token handling in API requests
- **Authentication**: Token-based authentication with secure storage
- **Input Validation**: Form validation on all inputs
- **Secure API Calls**: Axios interceptors for adding auth tokens and security headers

## Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 768px (xs)
- **Tablet**: 768px - 1024px (md)
- **Desktop**: > 1024px (lg)

Sidebar is hidden on mobile and shown on tablet/desktop. All tables and cards adapt to screen size.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

## Best Practices Implemented

- ✅ TypeScript for type safety
- ✅ Component-based architecture
- ✅ Separation of concerns (services, components, store)
- ✅ Error handling and loading states
- ✅ Accessible UI components
- ✅ Production-ready security measures
- ✅ Comprehensive test coverage
- ✅ Code organization and maintainability
- ✅ Environment variable configuration
- ✅ API abstraction layer for easy switching

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Submit a pull request

## License

[Your License Here]

## Support

For issues and questions, please open an issue in the repository.
