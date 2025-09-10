import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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

export async function POST(request: NextRequest) {
  try {
    const content: ProfileContent = await request.json();
    
    // Update English messages
    const enPath = path.join(process.cwd(), 'messages', 'en.json');
    const enData = JSON.parse(await fs.readFile(enPath, 'utf8'));
    
    // Update all profile fields in English
    enData.home.title = content.title;
    enData.home.name = content.name;
    enData.home.email = content.email;
    enData.home.linkedin = content.linkedin;
    enData.home.description1 = content.description1_en;
    enData.home.description2 = content.description2_en;
    
    await fs.writeFile(enPath, JSON.stringify(enData, null, 2));
    
    // Update Spanish messages
    const esPath = path.join(process.cwd(), 'messages', 'es.json');
    const esData = JSON.parse(await fs.readFile(esPath, 'utf8'));
    
    // Update all profile fields in Spanish (some fields are the same)
    esData.home.title = content.title;
    esData.home.name = content.name;
    esData.home.email = content.email;
    esData.home.linkedin = content.linkedin;
    esData.home.description1 = content.description1_es;
    esData.home.description2 = content.description2_es;
    
    await fs.writeFile(esPath, JSON.stringify(esData, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Profile content updated successfully' 
    });
    
  } catch (error) {
    console.error('Error updating profile content:', error);
    return NextResponse.json(
      { error: 'Failed to update profile content' },
      { status: 500 }
    );
  }
}
