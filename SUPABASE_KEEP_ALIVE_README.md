# Supabase Pause Prevention Implementation

This implementation prevents your Supabase project from being paused due to inactivity by creating a cron job that makes periodic database calls.

## How it works

1. **Cron Job**: Vercel automatically calls `/api/keep-alive` every 6 hours
2. **Database Call**: The endpoint makes a simple database query to keep your project active
3. **Cleanup**: Optionally inserts and deletes records to maintain a clean database

## Setup Instructions

### 1. Create the Database Table

Run the SQL script in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase-keep-alive-setup.sql
```

### 2. Deploy to Vercel

The implementation is already configured for Vercel deployment:

- `vercel.json` contains the cron job configuration
- The API endpoint is at `/api/keep-alive`
- Runs every 6 hours automatically

### 3. Test the Implementation

You can manually test the endpoint by visiting:
```
https://your-domain.vercel.app/api/keep-alive
```

Expected response:
```json
{
  "success": true,
  "message": "Success - found 0 entries for 'randomstring' | Inserted new record with 'randomstring' | Deleted record with 'randomstring'",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "randomString": "randomstring"
}
```

## Configuration

Edit `config/keep-alive-config.ts` to customize:

- **Table name**: Change `tableName` if you want to use a different table
- **Column name**: Change `columnName` if you want to use a different column
- **Operations**: Enable/disable insertion and deletion
- **Other endpoints**: Add URLs of other Supabase projects to ping

## Files Created

- `app/api/keep-alive/route.ts` - Main API endpoint
- `app/api/keep-alive/helper.ts` - Database operations helper
- `config/keep-alive-config.ts` - Configuration settings
- `vercel.json` - Vercel cron job configuration
- `supabase-keep-alive-setup.sql` - Database setup script

## Monitoring

You can monitor the keep-alive functionality by:

1. Checking Vercel function logs
2. Viewing the database table for activity
3. Manually calling the endpoint to test

## Troubleshooting

### Common Issues

1. **Table doesn't exist**: Run the SQL script in Supabase
2. **Permission errors**: Ensure your Supabase key has the necessary permissions
3. **Cron job not running**: Check Vercel deployment and cron job configuration

### Environment Variables

Make sure these are set in your Vercel environment:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## Alternative: Multiple Projects

If you have multiple Supabase projects, you can:

1. Add their endpoints to `otherEndpoints` in the config
2. The system will ping all of them to keep them active
3. This works around Vercel's free-tier limit of one cron job

## Security Notes

- The endpoint is public but only performs read operations by default
- Insertion/deletion can be disabled in the config
- The random strings are not sensitive data
- Consider adding authentication if needed for your use case 