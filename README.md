This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# GreenCart

Full-stack grocery delivery marketplace built with Next.js App Router, Clerk, Supabase, Cloudinary, Tailwind CSS, Zod, and Zustand.

## Local setup

1. Copy `.env.example` to `.env.local` and set every value.
2. Create a Supabase project and run `supabase/migrations/001_initial_schema.sql` in its SQL Editor.
3. Create a Cloudinary product-images folder implicitly through the seller upload flow. Add the Cloudinary cloud name, API key, and API secret to `.env.local`.
4. In Clerk, create a test seller by setting the user's **public metadata** to `{ "role": "seller" }`.
5. Run `npm run dev`.

## Required environment variables

```dotenv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Keep `CLERK_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `CLOUDINARY_API_SECRET` server-only. Never prefix them with `NEXT_PUBLIC_`.

## Seller order scoping

Order line snapshots include `seller_id` in addition to the requested product fields. This keeps the specified JSONB order model while allowing the server to safely show sellers only the orders containing their products.

## Deploy to Vercel

1. Push this project to a Git repository and import it into Vercel.
2. Add all required environment variables in Vercel Project Settings.
3. Set `NEXT_PUBLIC_BASE_URL` to the production URL.
4. Add the production URL to Clerk's allowed redirect/origin settings.
5. Deploy, then run the smoke test below.

## Smoke test

1. Sign up as a customer, add an address, add a product to the cart, and place a COD order.
2. Sign in as the seller, publish a product with one or more images, toggle its stock status, and update an order status.
3. Confirm the customer sees the COD label and status update in **My orders**.
