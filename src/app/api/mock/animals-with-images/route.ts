import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { MOCK_ANIMALS } from '@/mocks/animals.mock';

export async function GET() {
  try {
    // 1. Fetch resources from Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 10,
    });

    const cloudinaryImages = result.resources.map((r: any) => r.secure_url);

    // 3. Assign images randomly (or sequentially) to animals
    const data = MOCK_ANIMALS.map((animal, index) => ({
      ...animal,
      imageUrl: cloudinaryImages[index % cloudinaryImages.length] || null,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Animal Mockup API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate mock animal data' },
      { status: 500 }
    );
  }
}
