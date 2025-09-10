"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCurrentUser, signOut } from '@/lib/server-actions';

export default function DebugPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { user, error } = await getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Debug page error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div>
              <p><strong>Logged in:</strong> Yes</p>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <Button onClick={handleSignOut} className="mt-4">
                Sign Out
              </Button>
            </div>
          ) : (
            <div>
              <p><strong>Logged in:</strong> No</p>
              <a href="/login" className="text-blue-500 underline">
                Go to Login
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Server-side env vars:</strong> Only accessible server-side (SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_USER_ID)</p>
            <p><strong>Note:</strong> Sensitive environment variables are not exposed to client-side code</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-x-4">
            <a href="/es/login" className="text-blue-500 underline">Login Page</a>
            <a href="/admin" className="text-blue-500 underline">Admin Dashboard</a>
            <a href="/" className="text-blue-500 underline">Home Page</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}