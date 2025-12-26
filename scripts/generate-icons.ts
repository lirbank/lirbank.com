/**
 * Icon generator for social platforms
 *
 * Generates platform-specific icons from the base SVG with appropriate
 * backgrounds, padding, and sizing for each platform's requirements.
 *
 * Usage: bun run scripts/generate-icons.ts
 */

import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Colors from the design system (stone palette, RGB format for Sharp)
const colors = {
  stone50: { r: 250, g: 250, b: 249 },
  stone100: { r: 245, g: 245, b: 244 },
  stone800: { r: 41, g: 37, b: 36 },
};

// Platform icon variants
interface IconVariant {
  /** Output filename (without extension) */
  name: string;
  /** Output directory relative to public/ */
  outputDir: string;
  /** Output size in pixels */
  size: number;
  /** Padding around the icon (pixels) */
  padding: number;
  /** Background color (null for transparent) */
  background: { r: number; g: number; b: number } | null;
  /** Description for logging */
  description: string;
}

const variants: IconVariant[] = [
  {
    name: "apple-touch-icon",
    outputDir: "brand",
    size: 180,
    padding: 28, // 15.5%
    background: colors.stone50,
    description: "Apple touch icon (iOS home screen)",
  },
  {
    name: "icon-400",
    outputDir: "brand",
    size: 400,
    padding: 0,
    background: null,
    description: "LinkedIn icon (light bg for dark mode visibility)",
  },
];

async function generateIcon(
  sourcePath: string,
  outputPath: string,
  variant: IconVariant,
): Promise<void> {
  const { size, padding, background } = variant;
  const iconSize = size - padding * 2;

  // Render the SVG at the target size
  const icon = await sharp(sourcePath)
    .resize(iconSize, iconSize, { fit: "contain" })
    .toBuffer();

  if (background) {
    // Create background and composite icon on top
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { ...background, alpha: 1 },
      },
    })
      .composite([{ input: icon, gravity: "center" }])
      .png()
      .toFile(outputPath);
  } else {
    // Transparent background: extend the icon with padding
    await sharp(icon)
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(outputPath);
  }
}

async function main() {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const projectRoot = join(scriptDir, "..");
  const publicDir = join(projectRoot, "public");
  const sourceSvg = join(publicDir, "brand/icon.svg");

  console.log("🎨 Generating platform icons...\n");

  for (const variant of variants) {
    const outputDir = join(publicDir, variant.outputDir);
    const outputPath = join(outputDir, `${variant.name}.png`);

    try {
      await generateIcon(sourceSvg, outputPath, variant);
      console.log(`✓ ${variant.name}.png  (${variant.size}px)`);
      console.log(`  ${variant.description}\n`);
    } catch (error) {
      console.error(`✗ Failed to generate ${variant.name}.png`);
      throw error;
    }
  }

  console.log("Done! 🎉");
}

main();
