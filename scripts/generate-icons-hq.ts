import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { fal } from "@fal-ai/client";
import * as fs from "fs";
import * as path from "path";

const MODEL_ID = "fal-ai/recraft-v3";
const OUTPUT_DIR = path.join(process.cwd(), "public/images/values");

const STYLE_SUFFIX =
  ", flat digital illustration, centered on dark navy (#1a1a2e) background, bold clean lines, icon style, no text, single centered subject, vibrant colors";

const PROMPT_MAP: Record<string, string> = {
  // Tier 1
  adventure:
    "A golden compass overlaid on snow-capped mountain peaks, warm sunrise glow behind",
  assertiveness:
    "A confident raised fist gripping a bright lightning bolt, electric blue and gold",
  creativity:
    "A vibrant artist's paint palette with a glowing lightbulb emerging from the center",
  curiosity:
    "A magnifying glass revealing a swirling galaxy portal of stars and nebulae",
  excitement:
    "A brilliant firework burst in hot pink, orange, and gold, radiating energy",
  fitness:
    "A muscular anatomical heart with a glowing EKG pulse line running through it, red and electric blue",
  flexibility:
    "A graceful bamboo stalk bending in a strong wind without breaking, green and gold",
  freedom:
    "A majestic eagle soaring with outstretched wings against an open golden sky",
  fun: "A colorful jester hat with bells surrounded by bursting confetti, playful and bright",
  honesty:
    "A transparent crystal prism splitting a beam of white light into a clean rainbow spectrum",
  humour:
    "A glowing golden comedy mask alongside a dimmed tragedy mask, theatrical and warm",
  independence:
    "A proud wolf standing alone on a rocky mountain summit under a full moon, silver and blue",
  mindfulness:
    "A luminous lotus flower floating on perfectly still water, soft pink and teal glow",
  "open-mindedness":
    "An ornate open door revealing multiple branching illuminated pathways beyond, warm light",
  "self-awareness":
    "An ornate mirror reflecting a single all-seeing eye with concentric golden iris rings",
  "self-development":
    "A spiral staircase ascending toward a brilliant light source at the top, gold and white",
  skilfulness:
    "Expert hands carefully faceting a brilliant glowing diamond, precision and mastery",

  // Tier 2
  acceptance:
    "Open welcoming arms forming a circle around a warm glowing orb, soft orange and blue",
  authenticity:
    "A decorative mask being removed to reveal a genuine glowing face beneath, warm tones",
  beauty:
    "A single perfect rose with crystal dewdrops catching prismatic light, deep red and gold",
  caring:
    "Gentle hands cupping a small green seedling with roots visible, warm earth tones",
  challenge:
    "A silhouette reaching upward toward a distant glowing mountain summit, dramatic lighting",
  compassion:
    "Two cupped hands tenderly holding a softly radiant warm heart, orange and soft gold",
  connection:
    "Two interlocking puzzle pieces connecting with a burst of light at the junction, warm colors",
  cooperation:
    "Multiple diverse hands stacked together in a circle formation from above, vibrant colors",
  courage:
    "A bold golden lion head facing forward with a flowing mane, deep amber and gold",
  encouragement:
    "An uplifted hand releasing a bright rising star upward, warm gold and white",
  equality:
    "A perfectly balanced golden scale with equal weight on both sides, symmetrical and clean",
  fairness:
    "A blindfolded figure holding perfectly balanced scales, blue and silver, classical style",
  forgiveness:
    "Broken chain links falling apart with warm golden light streaming through the gap",
  friendliness:
    "Two hands clasped in a friendly handshake with a warm glow between them, inviting",
  generosity:
    "A golden cornucopia overflowing with fruits, coins, and flowers, abundant and warm",
  gratitude:
    "Hands pressed together in gratitude with soft rays of light emanating outward, warm gold",
  humility:
    "A graceful tree bending humbly with strong deep roots visible below, green and earth tones",
  justice:
    "A golden gavel beside balanced scales of justice, authoritative blue and gold",
  kindness:
    "A delicate butterfly gently landing on an open human palm, soft pastels and warm light",
  love: "Two hearts intertwined and radiating soft warm light, deep red and pink, intimate",
  order:
    "Perfectly aligned geometric shapes in harmonious grid pattern, clean blue and white",
  pleasure:
    "Warm golden sun rays falling on a serene upturned face, blissful expression, soft orange",
  reciprocity:
    "A yin-yang symbol with two curved arrows flowing between the halves, balanced blue and gold",
  respect:
    "A dignified figure in a respectful bow with a floating crown above, regal purple and gold",
  responsibility:
    "Strong shoulders carrying a glowing globe, sturdy and dependable, earth tones and blue",
  safety:
    "A strong ornate shield emanating a protective dome of blue light, secure and solid",
  "self-care":
    "A serene figure resting in a steaming natural hot spring surrounded by stones, calming teal",
  "self-control":
    "A steady hand held calmly above a flickering flame without flinching, cool blue and warm orange",
  sensuality:
    "Flowing silk ribbons in rich jewel tones ruby sapphire and gold with tactile texture",
  sexuality:
    "An elegant flame and a blooming flower intertwined together, passionate red and soft pink",
  spirituality:
    "A luminous cosmic eye surrounded by stars galaxies and nebulae, deep purple and gold",
  supportiveness:
    "A strong pillar supporting a graceful arch with warm light passing through, steady and reliable",
  trust:
    "An ornate golden key fitting perfectly into a glowing lock, warm amber light at the keyhole",

  // Tier 3
  conformity:
    "A uniform row of identical silhouette figures standing in perfect formation, muted blue-gray",
  contribution:
    "Hands carefully placing a glowing brick into a growing wall structure, warm collaborative feel",
  industry:
    "Interlocking metallic gears turning in precise mechanical harmony, steel gray and copper",
  intimacy:
    "Two silhouetted faces touching forehead-to-forehead with warm light between, intimate soft glow",
  patience:
    "An elegant hourglass with golden sand flowing gently through, calm and unhurried, warm amber",
  persistence:
    "Water drops steadily carving a groove through solid stone, patient erosion, blue and gray",
  power:
    "A bold crown crackling with electric lightning bolts radiating outward, regal gold and electric blue",
  romance:
    "Two elegant roses intertwined with a flowing red silk ribbon, romantic deep red and gold",
};

async function generateImage(
  slug: string,
  prompt: string,
  index: number,
  total: number
): Promise<boolean> {
  const outputPath = path.join(OUTPUT_DIR, `${slug}.png`);
  const fullPrompt = prompt + STYLE_SUFFIX;

  try {
    console.log(`[${index}/${total}] Generating: ${slug}...`);

    const result = await fal.subscribe(MODEL_ID, {
      input: {
        prompt: fullPrompt,
        style: "digital_illustration",
        image_size: { width: 512, height: 512 },
      },
    });

    const imageUrl = (result as any).data?.images?.[0]?.url;
    if (!imageUrl) {
      console.error(`[${index}/${total}] No image URL for: ${slug}`);
      return false;
    }

    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(
        `[${index}/${total}] Download failed for ${slug}: ${response.status}`
      );
      return false;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    console.log(`[${index}/${total}] Generated: ${slug}.png`);
    return true;
  } catch (error) {
    console.error(
      `[${index}/${total}] Error generating ${slug}:`,
      error instanceof Error ? error.message : error
    );
    return false;
  }
}

async function runWithConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < tasks.length) {
      const currentIndex = nextIndex++;
      results[currentIndex] = await tasks[currentIndex]();
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, tasks.length) },
    () => worker()
  );
  await Promise.all(workers);
  return results;
}

async function main() {
  // Parse CLI args: pass slug names to generate only those, or "all" for everything
  const args = process.argv.slice(2);

  let slugsToGenerate: string[];

  if (args.length === 0 || args[0] === "all") {
    slugsToGenerate = Object.keys(PROMPT_MAP);
  } else {
    slugsToGenerate = args;
    const invalid = slugsToGenerate.filter((s) => !PROMPT_MAP[s]);
    if (invalid.length > 0) {
      console.error("Unknown slugs:", invalid.join(", "));
      console.error("Available:", Object.keys(PROMPT_MAP).join(", "));
      process.exit(1);
    }
  }

  console.log(
    `Generating ${slugsToGenerate.length} icon(s) with Recraft V3 (digital_illustration)...`
  );
  console.log(`Estimated cost: $${(slugsToGenerate.length * 0.04).toFixed(2)}`);
  console.log();

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fal.config({ credentials: process.env.FAL_KEY });

  const startTime = Date.now();

  const tasks = slugsToGenerate.map((slug, i) => {
    return () =>
      generateImage(slug, PROMPT_MAP[slug], i + 1, slugsToGenerate.length);
  });

  const results = await runWithConcurrency(tasks, 2);

  const succeeded = results.filter(Boolean).length;
  const failed = results.filter((r) => !r).length;
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const cost = (succeeded * 0.04).toFixed(2);

  console.log("\n--- Generation Complete ---");
  console.log(
    `Total: ${slugsToGenerate.length} | Success: ${succeeded} | Failed: ${failed}`
  );
  console.log(`Time: ${elapsed}s | Cost: $${cost}`);

  if (failed > 0) {
    const failedSlugs = slugsToGenerate.filter((_, i) => !results[i]);
    console.log("Failed:", failedSlugs.join(", "));
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
