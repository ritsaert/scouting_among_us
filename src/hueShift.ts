import sharp from 'sharp';
import { rgbToHsv, hsvToRgb } from './rgbToHsv';

export async function generateHueShiftedImages(srcFilename: string, destFilenameTemplate: string, imageCount: number): Promise<void> {
  try {
    const sourceImage = sharp(srcFilename);
    const meta = await sourceImage.metadata();
    const { width, height } = meta;
    if (!width || !height) throw new Error('Invalid image metadata');

    for (let i = 0; i < imageCount; i++) {
      const hueShift = (360 / imageCount) * i;
      const shiftedImg = await generateHueShiftedImage(sourceImage, hueShift, i % 2 ? 1 : 0.35, width, height);
      shiftedImg.rotate(180);
      await shiftedImg.toFile(destFilenameTemplate.replace('<id>', i.toString()));
    }
    console.log(`Generated ${imageCount} images successfully.`);
  } catch (error) {
    console.error('Error generating images:', error);
  }
}

export async function generateHueShiftedImage(sourceImage: sharp.Sharp, hueShift: number, saturationFacor: number, width: number, height: number) {
  const imgData = await sourceImage.raw().toBuffer({ resolveWithObject: true });
  const data = imgData.data;
  const channels = imgData.info.channels; 
  for (let idx = 0; idx < data.length; idx += channels) {
    const [r, g, b] = [data[idx], data[idx + 1], data[idx + 2]];
    const [h, s, v] = rgbToHsv(r, g, b);
    [data[idx], data[idx + 1], data[idx + 2]] = hsvToRgb((h + hueShift) % 360, s * saturationFacor, v);
  }
  return await sharp(data, { raw: { width, height, channels }}).png();
}
