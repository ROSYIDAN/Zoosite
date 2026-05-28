import path from "path";
import fs from "fs/promises";
import { IMAGES_DIR, SUPPORTED_EXTENSIONS } from "./constants";

/**
 * Builds the local API URL for an animal image based on its slug.
 */
export function buildLocalImageUrl(slug: string | null | undefined): string | null {
  if (!slug) return null;
  return `/api/animals/${slug}/image`;
}

/**
 * Checks if a local image file exists for a given animal ID.
 */
export async function checkLocalImageExists(animalId: string): Promise<boolean> {
  for (const ext of SUPPORTED_EXTENSIONS) {
    try {
      await fs.access(path.join(IMAGES_DIR, `${animalId}${ext}`));
      return true;
    } catch {
      continue;
    }
  }
  return false;
}

/**
 * Uploads a local image file to ImgBB and returns the URL.
 */
export async function uploadToImgbb(filePath: string): Promise<string> {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("IMGBB_API_KEY is not defined in environment variables.");
  }

  const fileBuffer = await fs.readFile(filePath);
  const base64Image = fileBuffer.toString("base64");

  const formData = new URLSearchParams();
  formData.append("image", base64Image);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ImgBB upload failed: ${errorText}`);
  }

  const json = await response.json() as any;
  if (!json.success || !json.data || !json.data.url) {
    throw new Error(`ImgBB upload failed: ${JSON.stringify(json)}`);
  }

  return json.data.url;
}

/**
 * Uploads an image buffer to ImgBB and returns the URL.
 */
export async function uploadBufferToImgbb(buffer: Buffer): Promise<string> {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("IMGBB_API_KEY is not defined in environment variables.");
  }

  const base64Image = buffer.toString("base64");

  const formData = new URLSearchParams();
  formData.append("image", base64Image);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ImgBB upload failed: ${errorText}`);
  }

  const json = await response.json() as any;
  if (!json.success || !json.data || !json.data.url) {
    throw new Error(`ImgBB upload failed: ${JSON.stringify(json)}`);
  }

  return json.data.url;
}
