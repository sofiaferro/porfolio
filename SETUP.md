# Portfolio Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration (REQUIRED)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Admin Configuration (optional - if not set, any authenticated user can access admin)
ADMIN_USER_ID=your_admin_user_id_here
```

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL schema from `lib/database-schema.sql`
4. This will create the content table and necessary functions

## Authentication Setup

### Option 1: Allow Any Authenticated User (Development)
- Don't set `ADMIN_USER_ID` in your environment variables
- Any user who logs in will have admin access

### Option 2: Specific Admin User (Production)
- Set up a user account in Supabase Auth
- Copy the user ID from the Supabase dashboard
- Set `ADMIN_USER_ID` to that user ID

## Getting Started

1. **Set up environment variables** (see above)
2. **Run the database schema** in Supabase
3. **Start the development server**: `npm run dev`
4. **Visit `/login`** to authenticate
5. **Visit `/admin/migrate`** to migrate your existing content
6. **Visit `/admin/content`** to manage your content

## Troubleshooting

### 307 Redirect Issues
- Make sure you're logged in at `/login`
- Check that your Supabase configuration is correct
- Verify the database schema has been run

### Database Connection Issues
- Use `/admin/test` to test your database connection
- Check your Supabase URL and API key
- Ensure the content table exists

### Migration Issues
- Check the browser console for error messages
- Verify your existing project data is valid
- Make sure the database schema is properly set up
