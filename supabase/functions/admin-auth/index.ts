import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple hash function using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Create a simple token
function createToken(userId: string, username: string): string {
  const payload = {
    userId,
    username,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    iat: Date.now(),
  };
  return btoa(JSON.stringify(payload));
}

// Verify token
function verifyToken(token: string): { valid: boolean; payload?: any; error?: string } {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) {
      return { valid: false, error: 'Token expired' };
    }
    return { valid: true, payload };
  } catch {
    return { valid: false, error: 'Invalid token' };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { action, username, password, token } = await req.json();

    console.log(`Admin auth action: ${action}`);

    switch (action) {
      case 'check-registration': {
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'admin_registration_enabled')
          .single();

        if (error) {
          console.error('Error checking registration:', error);
          return new Response(
            JSON.stringify({ enabled: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ enabled: data.value === 'true' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'register': {
        // Check if registration is enabled
        const { data: settings } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'admin_registration_enabled')
          .single();

        if (settings?.value !== 'true') {
          return new Response(
            JSON.stringify({ error: 'Registration is disabled' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate input
        if (!username || username.length < 3) {
          return new Response(
            JSON.stringify({ error: 'Username must be at least 3 characters' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!password || password.length < 6) {
          return new Response(
            JSON.stringify({ error: 'Password must be at least 6 characters' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create admin user
        const { data: adminUser, error: createError } = await supabase
          .from('admin_users')
          .insert({ username, password_hash: passwordHash })
          .select()
          .single();

        if (createError) {
          console.error('Error creating admin:', createError);
          if (createError.code === '23505') {
            return new Response(
              JSON.stringify({ error: 'Username already exists' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          return new Response(
            JSON.stringify({ error: 'Failed to create admin user' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Assign admin role
        await supabase
          .from('user_roles')
          .insert({ admin_user_id: adminUser.id, role: 'admin' });

        // Disable registration after first admin
        await supabase
          .from('app_settings')
          .update({ value: 'false' })
          .eq('key', 'admin_registration_enabled');

        // Create token
        const newToken = createToken(adminUser.id, adminUser.username);

        console.log(`Admin registered: ${username}`);

        return new Response(
          JSON.stringify({
            success: true,
            user: { id: adminUser.id, username: adminUser.username },
            token: newToken,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'login': {
        if (!username || !password) {
          return new Response(
            JSON.stringify({ error: 'Username and password required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Hash the provided password
        const passwordHash = await hashPassword(password);

        // Find admin user
        const { data: adminUser, error } = await supabase
          .from('admin_users')
          .select('id, username, password_hash')
          .eq('username', username)
          .single();

        if (error || !adminUser) {
          console.log(`Login failed: user not found - ${username}`);
          return new Response(
            JSON.stringify({ error: 'Invalid username or password' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Compare password hashes
        if (adminUser.password_hash !== passwordHash) {
          console.log(`Login failed: wrong password - ${username}`);
          return new Response(
            JSON.stringify({ error: 'Invalid username or password' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check if user has admin role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('admin_user_id', adminUser.id)
          .eq('role', 'admin')
          .single();

        if (!roleData) {
          return new Response(
            JSON.stringify({ error: 'User does not have admin privileges' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create token
        const newToken = createToken(adminUser.id, adminUser.username);

        console.log(`Admin logged in: ${username}`);

        return new Response(
          JSON.stringify({
            success: true,
            user: { id: adminUser.id, username: adminUser.username },
            token: newToken,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'verify': {
        if (!token) {
          return new Response(
            JSON.stringify({ valid: false, error: 'No token provided' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const result = verifyToken(token);

        if (!result.valid) {
          return new Response(
            JSON.stringify({ valid: false, error: result.error }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Verify user still exists
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('id, username')
          .eq('id', result.payload.userId)
          .single();

        if (!adminUser) {
          return new Response(
            JSON.stringify({ valid: false, error: 'User not found' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({
            valid: true,
            user: { id: adminUser.id, username: adminUser.username },
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error: unknown) {
    console.error('Admin auth error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
