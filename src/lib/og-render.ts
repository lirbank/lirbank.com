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
export async function renderToPng(markup: Parameters<typeof satori>[0]) {
  const fonts = await fontsPromise;
  const svg = await satori(markup, { width: WIDTH, height: HEIGHT, fonts });

  return sharp(Buffer.from(svg))
    .resize(WIDTH * 2, HEIGHT * 2)
    .png()
    .toBuffer();
}
