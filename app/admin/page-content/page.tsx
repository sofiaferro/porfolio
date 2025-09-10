"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ProfileContent {
  title: string;
  name: string;
  description1_en: string;
  description1_es: string;
  description2_en: string;
  description2_es: string;
  email: string;
  linkedin: string;
}

export default function ProfileContentEditor() {
  const [content, setContent] = useState<ProfileContent>({
    title: 'SVF',
    name: 'Sofía Ferro',
    description1_en: "I'm passionate about building things, from applications to digital experiences that connect technology with the sensitive. I enjoy the process of imagining an idea and working it until it finds its most precise form.",
    description1_es: "Me apasiona construir cosas, desde aplicaciones hasta experiencias digitales que conecten la tecnología con lo sensible. Disfruto el proceso de imaginar una idea y trabajarla hasta que encuentre su forma más precisa.",
    description2_en: "I develop projects that combine functionality, design and art, exploring the intersection between software development, artificial intelligence and electronics.",
    description2_es: "Desarrollo proyectos que combinan funcionalidad, diseño y arte, explorando la intersección entre desarrollo de software, inteligencia artificial y electrónica.",
    email: 'svf.inbox@gmail.com',
    linkedin: 'https://www.linkedin.com/in/sofiaferro'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load current content from messages files
  useEffect(() => {
    loadCurrentContent();
  }, []);

  const loadCurrentContent = async () => {
    try {
      // Load content from messages files
      const [enResponse, esResponse] = await Promise.all([
        fetch('/messages/en.json'),
        fetch('/messages/es.json')
      ]);
      
      if (enResponse.ok && esResponse.ok) {
        const enData = await enResponse.json();
        const esData = await esResponse.json();
        
        setContent(prev => ({
          ...prev,
          description1_en: enData.home?.description1 || prev.description1_en,
          description1_es: esData.home?.description1 || prev.description1_es,
          description2_en: enData.home?.description2 || prev.description2_en,
          description2_es: esData.home?.description2 || prev.description2_es,
        }));
      }
    } catch (error) {
      console.error('Error loading current content:', error);
      toast.error('Failed to load current content');
    }
  };

  const handleInputChange = (field: keyof ProfileContent, value: string) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update messages files
      const response = await fetch('/api/admin/update-profile-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        toast.success('Profile content updated successfully!');
        setHasChanges(false);
      } else {
        const error = await response.text();
        toast.error(`Failed to update content: ${error}`);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    loadCurrentContent();
    setHasChanges(false);
    toast.success('Content reset to current values');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Profile Content Editor</h1>
          <p className="text-gray-600 mt-2">
            Edit the content that appears in the first column of your portfolio
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={!hasChanges || isLoading}
          >
            Reset
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title/Display Name</Label>
            <Input
              id="title"
              value={content.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="SVF"
            />
          </div>
          
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={content.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Sofía Ferro"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={content.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="svf.inbox@gmail.com"
            />
          </div>
          
          <div>
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              value={content.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              placeholder="https://www.linkedin.com/in/sofiaferro"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bio Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="es">Español</TabsTrigger>
            </TabsList>
            
            <TabsContent value="en" className="space-y-4">
              <div>
                <Label htmlFor="description1_en">First Paragraph (English)</Label>
                <Textarea
                  id="description1_en"
                  value={content.description1_en}
                  onChange={(e) => handleInputChange('description1_en', e.target.value)}
                  rows={3}
                  placeholder="I'm passionate about building things..."
                />
              </div>
              
              <div>
                <Label htmlFor="description2_en">Second Paragraph (English)</Label>
                <Textarea
                  id="description2_en"
                  value={content.description2_en}
                  onChange={(e) => handleInputChange('description2_en', e.target.value)}
                  rows={3}
                  placeholder="I develop projects that combine..."
                />
              </div>
            </TabsContent>
            
            <TabsContent value="es" className="space-y-4">
              <div>
                <Label htmlFor="description1_es">Primer Párrafo (Español)</Label>
                <Textarea
                  id="description1_es"
                  value={content.description1_es}
                  onChange={(e) => handleInputChange('description1_es', e.target.value)}
                  rows={3}
                  placeholder="Me apasiona construir cosas..."
                />
              </div>
              
              <div>
                <Label htmlFor="description2_es">Segundo Párrafo (Español)</Label>
                <Textarea
                  id="description2_es"
                  value={content.description2_es}
                  onChange={(e) => handleInputChange('description2_es', e.target.value)}
                  rows={3}
                  placeholder="Desarrollo proyectos que combinan..."
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="mb-6">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                {content.title}
              </h1>
            </div>
            
            <div className="mb-6">
              <h2 className="text-sm font-mono text-gray-600 mb-4 uppercase">
                ABOUT
              </h2>
              <div className="space-y-3 text-sm text-gray-800">
                <p>{content.description1_en}</p>
                <p>{content.description2_en}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-mono text-gray-600 mb-4 uppercase">
                CONTACT
              </h3>
              <div className="text-gray-800">{content.name}</div>
              <div className="space-y-2 text-sm">
                <div>
                  <a href={`mailto:${content.email}`} className="text-gray-800 hover:text-gray-600">
                    {content.email}
                  </a>
                </div>
                <div>
                  <a href={content.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-600">
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}