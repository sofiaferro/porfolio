"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  Image, 
  List, 
  ListOrdered,
  Quote,
  Code,
  Eye,
  Save,
  Upload,
  X
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showPreview?: boolean;
  multilang?: boolean;
  locales?: string[];
}

interface MarkdownToolbarProps {
  onFormat: (format: string) => void;
  onInsert: (insert: string) => void;
}

const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ onFormat, onInsert }) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const handleLinkInsert = () => {
    if (linkUrl && linkText) {
      onInsert(`[${linkText}](${linkUrl})`);
      setLinkUrl('');
      setLinkText('');
      setIsLinkModalOpen(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormat('bold')}
        className="h-8 w-8 p-0"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormat('italic')}
        className="h-8 w-8 p-0"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormat('underline')}
        className="h-8 w-8 p-0"
      >
        <Underline className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormat('heading')}
        className="h-8 px-2 text-xs"
      >
        H1
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormat('heading2')}
        className="h-8 px-2 text-xs"
      >
        H2
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormat('list')}
        className="h-8 w-8 p-0"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormat('orderedList')}
        className="h-8 w-8 p-0"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormat('quote')}
        className="h-8 w-8 p-0"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormat('code')}
        className="h-8 w-8 p-0"
      >
        <Code className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsLinkModalOpen(true)}
        className="h-8 w-8 p-0"
      >
        <Link className="h-4 w-4" />
      </Button>
      
      {isLinkModalOpen && (
        <div className="absolute top-12 left-0 bg-white border rounded-lg shadow-lg p-4 z-10 min-w-64">
          <div className="space-y-2">
            <Label htmlFor="linkText">Link Text</Label>
            <Input
              id="linkText"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Link text"
            />
            <Label htmlFor="linkUrl">URL</Label>
            <Input
              id="linkUrl"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleLinkInsert}>
                Insert
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsLinkModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MarkdownPreview: React.FC<{ content: string }> = ({ content }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="p-4 text-gray-500">Loading preview...</div>;
  }

  // Simple markdown to HTML conversion (you might want to use a proper markdown library)
  const htmlContent = content
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
    .replace(/`(.*?)`/gim, '<code class="bg-gray-100 px-1 rounded">$1</code>')
    .replace(/\n/gim, '<br>');

  return (
    <div 
      className="prose max-w-none p-4"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  className = "",
  showPreview = true,
  multilang = false,
  locales = ['en', 'es']
}) => {
  const [activeTab, setActiveTab] = useState('write');
  const [localizedContent, setLocalizedContent] = useState<Record<string, string>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (multilang) {
      // Initialize localized content
      const content: Record<string, string> = {};
      locales.forEach(locale => {
        content[locale] = localizedContent[locale] || '';
      });
      setLocalizedContent(content);
    }
  }, [multilang, locales]);

  const insertText = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + text + value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const formatText = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText || 'underlined text'}</u>`;
        break;
      case 'heading':
        formattedText = `# ${selectedText || 'Heading'}`;
        break;
      case 'heading2':
        formattedText = `## ${selectedText || 'Subheading'}`;
        break;
      case 'list':
        formattedText = `- ${selectedText || 'List item'}`;
        break;
      case 'orderedList':
        formattedText = `1. ${selectedText || 'List item'}`;
        break;
      case 'quote':
        formattedText = `> ${selectedText || 'Quote'}`;
        break;
      case 'code':
        formattedText = `\`${selectedText || 'code'}\``;
        break;
    }

    insertText(formattedText);
  };

  const handleContentChange = (locale: string, content: string) => {
    if (multilang) {
      setLocalizedContent(prev => ({
        ...prev,
        [locale]: content
      }));
    } else {
      onChange(content);
    }
  };

  const getCurrentContent = () => {
    if (multilang) {
      return localizedContent[locales[0]] || '';
    }
    return value;
  };

  if (multilang) {
    return (
      <div className={className}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="write" className="space-y-4">
            <Tabs value="en" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                {locales.map(locale => (
                  <TabsTrigger key={locale} value={locale}>
                    {locale.toUpperCase()}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {locales.map(locale => (
                <TabsContent key={locale} value={locale} className="space-y-2">
                  <Label htmlFor={`content-${locale}`}>
                    Content ({locale.toUpperCase()})
                  </Label>
                  <div className="border rounded-lg">
                    <MarkdownToolbar 
                      onFormat={formatText}
                      onInsert={insertText}
                    />
                    <Textarea
                      id={`content-${locale}`}
                      ref={textareaRef}
                      value={localizedContent[locale] || ''}
                      onChange={(e) => handleContentChange(locale, e.target.value)}
                      placeholder={`${placeholder} (${locale.toUpperCase()})`}
                      className="min-h-[300px] border-0 resize-none focus:ring-0"
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="border rounded-lg min-h-[300px]">
              <MarkdownPreview content={getCurrentContent()} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="write">
          <div className="border rounded-lg">
            <MarkdownToolbar 
              onFormat={formatText}
              onInsert={insertText}
            />
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="min-h-[300px] border-0 resize-none focus:ring-0"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="preview">
          <div className="border rounded-lg min-h-[300px]">
            <MarkdownPreview content={value} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
