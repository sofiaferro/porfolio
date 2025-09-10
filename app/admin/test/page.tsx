"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    database: boolean | null;
    projects: boolean | null;
    content: boolean | null;
  }>({
    database: null,
    projects: null,
    content: null
  });

  const runTests = async () => {
    setIsLoading(true);
    setTestResults({ database: null, projects: null, content: null });

    try {
      // Test database connection
      const dbResponse = await fetch('/api/admin/test-db');
      const dbResult = await dbResponse.ok;
      setTestResults(prev => ({ ...prev, database: dbResult }));

      // Test projects endpoint
      const projectsResponse = await fetch('/api/admin/projects');
      const projectsResult = await projectsResponse.ok;
      setTestResults(prev => ({ ...prev, projects: projectsResult }));

      // Test content endpoint
      const contentResponse = await fetch('/api/admin/test-content');
      const contentResult = await contentResponse.ok;
      setTestResults(prev => ({ ...prev, content: contentResult }));

      toast.success('Tests completed');
    } catch (error) {
      console.error('Test error:', error);
      toast.error('Tests failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <Loader2 className="h-5 w-5 animate-spin text-gray-400" />;
    if (status) return <CheckCircle className="h-5 w-5 text-green-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getStatusText = (status: boolean | null) => {
    if (status === null) return 'Testing...';
    if (status) return 'Working';
    return 'Failed';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Database Test</h1>
        <Button 
          onClick={runTests} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
          Run Tests
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(testResults.database)}
                <div>
                  <div className="font-medium">Database Connection</div>
                  <div className="text-sm text-gray-600">Tests basic Supabase connectivity</div>
                </div>
              </div>
              <div className="text-sm font-medium">
                {getStatusText(testResults.database)}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(testResults.projects)}
                <div>
                  <div className="font-medium">Projects API</div>
                  <div className="text-sm text-gray-600">Tests projects endpoint functionality</div>
                </div>
              </div>
              <div className="text-sm font-medium">
                {getStatusText(testResults.projects)}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(testResults.content)}
                <div>
                  <div className="font-medium">Content Management</div>
                  <div className="text-sm text-gray-600">Tests content CRUD operations</div>
                </div>
              </div>
              <div className="text-sm font-medium">
                {getStatusText(testResults.content)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>• <strong>Run Tests:</strong> Check if all database connections and APIs are working</p>
            <p>• <strong>Migrate Projects:</strong> Go to the Migrate page to import your existing projects</p>
            <p>• <strong>View Content:</strong> Go to the Content page to manage your migrated content</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}