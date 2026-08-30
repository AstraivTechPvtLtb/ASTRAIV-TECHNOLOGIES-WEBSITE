# Astraiv Technologies - Client Website & Portal

Production client-facing website and customer portal for Astraiv Technologies.

## 🌐 Domains
- Production: `https://www.astraivtechnologies.com`

## 🛠️ Tech Stack
- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Prisma ORM (PostgreSQL / Supabase)
- next-intl (Multi-language Support)
- Better Auth
- Framer Motion & Lucide Icons

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.x
- PostgreSQL database (or Supabase instance)

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env` file with the following variables:
```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Database Setup
```bash
npx prisma generate
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### Production Build
```bash
npm run build
npm start
```
