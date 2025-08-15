export const keepAliveConfig = {
  // Database table and column to use for keep-alive operations
  tableName: 'keep-alive',
  columnName: 'name',
  
  // Enable/disable insertion and deletion operations
  enableInsertion: true,
  enableDeletion: true,
  
  // Optional: Add other project endpoints to ping
  // This is useful if you have multiple Supabase projects
  otherEndpoints: [
    // Example: 'https://your-other-project.vercel.app/api/keep-alive'
  ],
  
  // Cron job schedule (configured in vercel.json)
  // Default: runs every 6 hours
  cronSchedule: '0 */6 * * *'
} 