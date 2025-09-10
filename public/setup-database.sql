-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  original_id TEXT, -- Store the original ID from projects.ts
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  category TEXT,
  category_en TEXT,
  category_es TEXT,
  category_label TEXT,
  category_label_en TEXT,
  category_label_es TEXT,
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  image TEXT,
  year TEXT,
  video TEXT,
  images JSONB DEFAULT '[]', -- Store additional images as JSON
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_technologies ON projects USING GIN(technologies);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to published projects" ON projects;
DROP POLICY IF EXISTS "Allow admin users to manage projects" ON projects;

-- Allow public read access to published projects
CREATE POLICY "Allow public read access to published projects" ON projects
  FOR SELECT USING (status = 'published');

-- Allow admin users to manage all projects
CREATE POLICY "Allow admin users to manage projects" ON projects
  FOR ALL USING (
    auth.uid()::text = '233104f5-c92e-41ca-8f3f-0800fa6b2314'
  );

-- Grant necessary permissions
GRANT SELECT ON projects TO anon;
GRANT ALL ON projects TO authenticated;

-- Update content table to be more focused on page content
-- Add content_type to distinguish between different types of content
ALTER TABLE content ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'page';
ALTER TABLE content ADD COLUMN IF NOT EXISTS content_key TEXT; -- e.g., 'bio', 'footer', 'hero_title'
ALTER TABLE content ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Create index for content queries
CREATE INDEX IF NOT EXISTS idx_content_type_key ON content(content_type, content_key);
CREATE INDEX IF NOT EXISTS idx_content_published ON content(is_published);

-- Update RLS policies for content table
DROP POLICY IF EXISTS "Allow public read access to content" ON content;
DROP POLICY IF EXISTS "Allow public read access to published content" ON content;
CREATE POLICY "Allow public read access to published content" ON content
  FOR SELECT USING (is_published = true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for projects table
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
