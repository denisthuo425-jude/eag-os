# EAG OS
Enterprise Operations System.

## Project Purpose
EAG OS is an internal operating system designed for managing clinical operations, HR, financials, and patient logistics in a centralized platform.

## Prerequisites
- Node.js (v18+)
- npm
- Supabase project for backend data storage.

## Installation
Run the following command to install all exact dependencies (recommended for CI/CD environments):
```bash
npm ci
```

## Environment Variables
Create a `.env.local` file at the root of the project using the `.env.example` file provided:
```bash
cp .env.example .env.local
```
Fill in the values with your active Supabase instance parameters.

## Running the App
To start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing
Run the test suite using Vitest:
```bash
npm test
```

## Architecture
- **Frontend**: Next.js App Router (React), Tailwind CSS, `recharts` for data viz, `lucide-react` for iconography.
- **Backend**: Supabase (PostgreSQL, Auth, Storage).
- **Service Layer**: Database calls are abstracted away from UI components into `src/lib/services/` with strict Zod validation via `src/lib/schemas/`.
- **Testing**: Vitest and React Testing Library for frontend unit tests.