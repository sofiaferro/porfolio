"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RichTextEditor } from './rich-text-editor';
import { ProjectContent, BlogContent } from '@/lib/content-types';
import { createContent, updateContent } from '@/lib/server-actions';
// Removed useTranslations since admin is outside locale structure
import { toast } from 'sonner';

// Form schemas
const ProjectFormSchema = z.object({
  title: z.record(z.string().min(1, 'Title is required')),
  content: z.record(z.string().min(1, 'Content is required')),
  excerpt: z.record(z.string()).optional(),
  category: z.string().min(1, 'Category is required'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  year: z.string().min(1, 'Year is required'),
  published: z.boolean().default(true),
  images: z.array(z.object({
    src: z.string().url('Invalid image URL'),
    alt: z.string().min(1, 'Alt text is required'),
    caption: z.string().optional(),
  })).optional(),
  links: z.object({
    live: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
    video: z.string().url().optional().or(z.literal('')),
  }).optional(),
});

const BlogFormSchema = z.object({
  title: z.record(z.string().min(1, 'Title is required')),
  content: z.record(z.string().min(1, 'Content is required')),
  excerpt: z.record(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

type ProjectFormData = z.infer<typeof ProjectFormSchema>;
type BlogFormData = z.infer<typeof BlogFormSchema>;

interface ContentFormProps {
  type: 'project' | 'blog';
  content?: ProjectContent | BlogContent;
  onSave: (content: ProjectContent | BlogContent) => void;
  onCancel: () => void;
  locales?: string[];
}

const PROJECT_CATEGORIES = [
  'literatura',
  'bots',
  'iot',
  'hardware',
  'creative-coding',
  'instalacion',
  'installation'
];

const COMMON_TECHNOLOGIES = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS',
  'Tailwind CSS', 'Node.js', 'Python', 'Arduino', 'ESP32', 'IoT',
  'Bluetooth', 'Thermal Printer', 'Electronics', 'Creative Coding',
  'Markov Chains', 'API', 'Supabase', 'Vercel'
];

export const ContentForm: React.FC<ContentFormProps> = ({
  type,
  content,
  onSave,
  onCancel,
  locales = ['en', 'es']
}) => {
  // Admin component - no translations needed
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localizedData, setLocalizedData] = useState<Record<string, any>>({});
  const [currentLocale, setCurrentLocale] = useState(locales[0]);

  const isEdit = !!content;
  const schema = type === 'project' ? ProjectFormSchema : BlogFormSchema;

  const form = useForm<ProjectFormData | BlogFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: {},
      content: {},
      excerpt: {},
      published: true,
      ...(type === 'project' ? {
        category: '',
        technologies: [],
        year: new Date().getFullYear().toString(),
        images: [],
        links: {}
      } : {
        tags: [],
        featured: false
      })
    }
  });

  // Initialize form with existing content
  useEffect(() => {
    if (content) {
      const formData = {
        title: content.title || {},
        content: content.content || {},
        excerpt: content.excerpt || {},
        published: content.published ?? true,
        ...(type === 'project' && 'category' in content ? {
          category: content.category || '',
          technologies: content.technologies || [],
          year: content.year || new Date().getFullYear().toString(),
          images: content.images || [],
          links: content.links || {}
        } : {
          tags: 'tags' in content ? content.tags || [] : [],
          featured: 'featured' in content ? content.featured || false : false
        })
      };
      
      form.reset(formData);
      setLocalizedData(formData);
    }
  }, [content, form, type]);

  const handleLocaleChange = (locale: string) => {
    setCurrentLocale(locale);
  };

  const handleLocalizedFieldChange = (field: string, locale: string, value: any) => {
    setLocalizedData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [locale]: value
      }
    }));
  };

  const onSubmit = async (data: ProjectFormData | BlogFormData) => {
    setIsSubmitting(true);
    
    try {
      const contentData = {
        ...data,
        type,
        slug: generateSlug(data.title[locales[0]] || data.title[Object.keys(data.title)[0]]),
        metadata: {
          ...(type === 'project' && 'images' in data ? {
            images: data.images,
            links: data.links
          } : {}),
          ...(type === 'blog' && 'tags' in data ? {
            tags: data.tags
          } : {})
        }
      };

      let result;
      if (isEdit) {
        result = await updateContent(content.id, contentData);
      } else {
        result = await createContent(contentData);
      }

      if (result) {
        toast.success(isEdit ? 'Content updated successfully' : 'Content created successfully');
        onSave(result);
      } else {
        toast.error('Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('An error occurred while saving');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const addImage = () => {
    const currentImages = form.getValues('images') || [];
    form.setValue('images', [...currentImages, { src: '', alt: '', caption: '' }]);
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues('images') || [];
    form.setValue('images', currentImages.filter((_, i) => i !== index));
  };

  const addTechnology = (tech: string) => {
    const currentTechs = form.getValues('technologies') || [];
    if (!currentTechs.includes(tech)) {
      form.setValue('technologies', [...currentTechs, tech]);
    }
  };

  const removeTechnology = (tech: string) => {
    const currentTechs = form.getValues('technologies') || [];
    form.setValue('technologies', currentTechs.filter(t => t !== tech));
  };

  const addTag = (tag: string) => {
    if (type === 'blog') {
      const currentTags = form.getValues('tags') || [];
      if (!currentTags.includes(tag)) {
        form.setValue('tags', [...currentTags, tag]);
      }
    }
  };

  const removeTag = (tag: string) => {
    if (type === 'blog') {
      const currentTags = form.getValues('tags') || [];
      form.setValue('tags', currentTags.filter(t => t !== tag));
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEdit ? `Edit ${type}` : `Create New ${type}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Language Tabs */}
          <Tabs value={currentLocale} onValueChange={handleLocaleChange}>
            <TabsList className="grid w-full grid-cols-2">
              {locales.map(locale => (
                <TabsTrigger key={locale} value={locale}>
                  {locale.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>

            {locales.map(locale => (
              <TabsContent key={locale} value={locale} className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor={`title-${locale}`}>
                    Title ({locale.toUpperCase()})
                  </Label>
                  <Input
                    id={`title-${locale}`}
                    value={form.watch(`title.${locale}`) || ''}
                    onChange={(e) => {
                      form.setValue(`title.${locale}`, e.target.value);
                      handleLocalizedFieldChange('title', locale, e.target.value);
                    }}
                    placeholder={`Enter title in ${locale.toUpperCase()}`}
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label>
                    Content ({locale.toUpperCase()})
                  </Label>
                  <RichTextEditor
                    value={form.watch(`content.${locale}`) || ''}
                    onChange={(value) => {
                      form.setValue(`content.${locale}`, value);
                      handleLocalizedFieldChange('content', locale, value);
                    }}
                    placeholder={`Write content in ${locale.toUpperCase()}`}
                    multilang={false}
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <Label htmlFor={`excerpt-${locale}`}>
                    Excerpt ({locale.toUpperCase()})
                  </Label>
                  <Textarea
                    id={`excerpt-${locale}`}
                    value={form.watch(`excerpt.${locale}`) || ''}
                    onChange={(e) => {
                      form.setValue(`excerpt.${locale}`, e.target.value);
                      handleLocalizedFieldChange('excerpt', locale, e.target.value);
                    }}
                    placeholder={`Enter excerpt in ${locale.toUpperCase()}`}
                    rows={3}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Project-specific fields */}
          {type === 'project' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={form.watch('category')}
                    onValueChange={(value) => form.setValue('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={form.watch('year')}
                    onChange={(e) => form.setValue('year', e.target.value)}
                    placeholder="2024"
                  />
                </div>
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <Label>Technologies</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.watch('technologies')?.map((tech) => (
                    <Badge key={tech} variant="secondary" className="cursor-pointer" onClick={() => removeTechnology(tech)}>
                      {tech} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {COMMON_TECHNOLOGIES.filter(tech => !form.watch('technologies')?.includes(tech)).map(tech => (
                    <Button
                      key={tech}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addTechnology(tech)}
                    >
                      + {tech}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label>Images</Label>
                {form.watch('images')?.map((image, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Input
                        placeholder="Image URL"
                        value={image.src}
                        onChange={(e) => {
                          const images = form.getValues('images') || [];
                          images[index] = { ...image, src: e.target.value };
                          form.setValue('images', images);
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Alt text"
                        value={image.alt}
                        onChange={(e) => {
                          const images = form.getValues('images') || [];
                          images[index] = { ...image, alt: e.target.value };
                          form.setValue('images', images);
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Caption (optional)"
                        value={image.caption || ''}
                        onChange={(e) => {
                          const images = form.getValues('images') || [];
                          images[index] = { ...image, caption: e.target.value };
                          form.setValue('images', images);
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addImage}>
                  Add Image
                </Button>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="liveLink">Live Link</Label>
                  <Input
                    id="liveLink"
                    type="url"
                    value={form.watch('links.live') || ''}
                    onChange={(e) => {
                      const links = form.getValues('links') || {};
                      form.setValue('links', { ...links, live: e.target.value });
                    }}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="githubLink">GitHub Link</Label>
                  <Input
                    id="githubLink"
                    type="url"
                    value={form.watch('links.github') || ''}
                    onChange={(e) => {
                      const links = form.getValues('links') || {};
                      form.setValue('links', { ...links, github: e.target.value });
                    }}
                    placeholder="https://github.com/user/repo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="videoLink">Video Link</Label>
                  <Input
                    id="videoLink"
                    type="url"
                    value={form.watch('links.video') || ''}
                    onChange={(e) => {
                      const links = form.getValues('links') || {};
                      form.setValue('links', { ...links, video: e.target.value });
                    }}
                    placeholder="https://vimeo.com/123456"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Blog-specific fields */}
          {type === 'blog' && (
            <div className="space-y-4">
              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.watch('tags')?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add tag and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (value) {
                        addTag(value);
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
              </div>

              {/* Featured */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={form.watch('featured')}
                  onCheckedChange={(checked) => form.setValue('featured', !!checked)}
                />
                <Label htmlFor="featured">Featured post</Label>
              </div>
            </div>
          )}

          {/* Published */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={form.watch('published')}
              onCheckedChange={(checked) => form.setValue('published', !!checked)}
            />
            <Label htmlFor="published">Published</Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
