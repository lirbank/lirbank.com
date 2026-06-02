import { existsSync, readFileSync } from "node:fs";
import satori from "satori";
import sharp from "sharp";
import { HEIGHT, WIDTH } from "./og";

const FONT_URL = "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin";
const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

async function loadFonts() {
  const buffers = await Promise.all(
    WEIGHTS.map((weight) =>
      fetch(`${FONT_URL}-${weight}-normal.woff`).then((response) =>
        response.arrayBuffer(),
      ),
    ),
  );

  return WEIGHTS.map((weight, index) => ({
    name: "Inter",
    data: buffers[index],
    weight,
    style: "normal" as const,
  }));
}

const fontsPromise = loadFonts();
const sourceLogo = new URL("../../public/brand/icon.svg", import.meta.url);
const prerenderLogo = new URL(
  "../../../public/brand/icon.svg",
  import.meta.url,
);

export const logoPromise = sharp(
  readFileSync(existsSync(sourceLogo) ? sourceLogo : prerenderLogo),
)
  .resize(128, 128)
  .png()
  .toBuffer()
  .then((buffer) => new Uint8Array(buffer).buffer as ArrayBuffer);

export async function renderToPng(markup: Parameters<typeof satori>[0]) {
  const fonts = await fontsPromise;
  const svg = await satori(markup, { width: WIDTH, height: HEIGHT, fonts });

  return sharp(Buffer.from(svg))
    .resize(WIDTH * 2, HEIGHT * 2)
    .png()
    .toBuffer();
}
