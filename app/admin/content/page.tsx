"use client";

import React, { useState, useEffect } from 'react';
// Removed useTranslations since admin is outside locale structure
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContentForm } from '@/components/admin/content-form';
import { getProjects, getBlogPosts, createContent, updateContent, deleteContent, searchContent } from '@/lib/server-actions';
import { Content, ProjectContent, BlogContent } from '@/lib/content-types';
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function ContentManagementPage() {
  // Admin page - no translations needed
  const [content, setContent] = useState<Content[]>([]);
  const [filteredContent, setFilteredContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState<'all' | 'project' | 'blog'>('all');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [content, searchQuery, contentType]);

  const loadContent = async () => {
    setIsLoading(true);
    try {
      const [projects, blogs] = await Promise.all([
        getProjects(),
        getBlogPosts()
      ]);
      
      setContent([...projects, ...blogs]);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };

  const filterContent = () => {
    let filtered = content;

    // Filter by type
    if (contentType !== 'all') {
      filtered = filtered.filter(item => item.type === contentType);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        Object.values(item.title).some(title => 
          title.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        Object.values(item.content).some(content => 
          content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredContent(filtered);
  };

  const handleCreate = (type: 'project' | 'blog') => {
    setSelectedContent(null);
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleEdit = (item: Content) => {
    setSelectedContent(item);
    setIsCreating(false);
    setIsEditing(true);
  };

  const handleSave = async (savedContent: Content) => {
    await loadContent();
    setIsCreating(false);
    setIsEditing(false);
    setSelectedContent(null);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedContent(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      try {
        const success = await deleteContent(id);
        if (success) {
          toast.success('Content deleted successfully');
          await loadContent();
        } else {
          toast.error('Failed to delete content');
        }
      } catch (error) {
        console.error('Error deleting content:', error);
        toast.error('An error occurred while deleting');
      }
    }
  };

  const togglePublished = async (item: Content) => {
    try {
      const updated = await updateContent(item.id, {
        published: !item.published
      });
      
      if (updated) {
        toast.success(`Content ${updated.published ? 'published' : 'unpublished'}`);
        await loadContent();
      } else {
        toast.error('Failed to update content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('An error occurred while updating');
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-blue-100 text-blue-800';
      case 'blog': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isCreating || isEditing) {
    return (
      <ContentForm
        type={selectedContent?.type as 'project' | 'blog' || 'project'}
        content={selectedContent as ProjectContent | BlogContent}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <div className="flex gap-2">
          <Button onClick={() => handleCreate('project')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
          <Button onClick={() => handleCreate('blog')} variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Blog Post
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Content</SelectItem>
                  <SelectItem value="project">Projects</SelectItem>
                  <SelectItem value="blog">Blog Posts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading content...</p>
        </div>
      ) : filteredContent.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              {searchQuery ? 'No content found matching your search.' : 'No content available.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredContent.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getContentTypeColor(item.type)}>
                        {item.type}
                      </Badge>
                      <Badge variant={item.published ? "default" : "secondary"}>
                        {item.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">
                      {item.title.en || item.title[Object.keys(item.title)[0]] || 'Untitled'}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Created: {new Date(item.createdAt).toLocaleDateString()}
                      {item.updatedAt !== item.createdAt && (
                        <span> • Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublished(item)}
                    >
                      {item.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3">
                  {item.excerpt?.en || item.excerpt?.[Object.keys(item.excerpt)[0]] || 
                   item.content.en?.substring(0, 200) || 
                   item.content[Object.keys(item.content)[0]]?.substring(0, 200) || 
                   'No content available...'}
                </p>
                {item.metadata && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.metadata.technologies?.map((tech: string) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {item.metadata.tags?.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
