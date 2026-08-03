# Supabase setup

1. Create a Supabase project and open its **SQL Editor**.
2. Run `migrations/001_initial_schema.sql` in full.
3. In Supabase, configure the Clerk third-party auth integration/JWT so the token includes the Clerk subject as `sub`. The RLS policies use that value to scope customer data.
4. Copy the project URL, publishable key, and service-role key into `.env.local` using the variable names that will be added in Step 4.
5. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` to `.env.local`. Product image uploads are performed only by the server and saved to Cloudinary.

Product writes use the service-role client only from server-side seller routes. Clerk's `publicMetadata.role` remains the single source of truth for seller authorization without granting direct database writes to browsers.
