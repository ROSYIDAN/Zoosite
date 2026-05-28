import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  try {
    // Fetch latest 20 images from Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: '', // Can filter by folder if needed
      max_results: 20,
    });

    const images = result.resources.map((resource: any) => ({
      public_id: resource.public_id,
      secure_url: resource.secure_url,
      format: resource.format,
      width: resource.width,
      height: resource.height,
      created_at: resource.created_at,
    }));

    return NextResponse.json({
      success: true,
      count: images.length,
      images,
    });
  } catch (error) {
    console.error('Cloudinary Mock API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Cloudinary assets' },
      { status: 500 }
    );
  }
}
