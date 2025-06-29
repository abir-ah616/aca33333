/*
  # Create demo admin user

  1. Insert demo admin user
    - Email: admin@golpohub.com
    - This will be used for demo purposes
*/

-- Note: In a real application, you would create the user through Supabase Auth
-- and then add them to the admin_users table. For demo purposes, we'll create
-- a placeholder that can be updated when the actual user is created.

-- This is just a placeholder - the actual admin user will be created through
-- the Supabase Auth system and then added to admin_users table
INSERT INTO admin_users (id, email) 
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  'admin@golpohub.com'
) ON CONFLICT (email) DO NOTHING;