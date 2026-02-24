# fal.ai Image Generation API Research

> Research date: 2026-02-23

## Table of Contents

- [Best Models for Our Use Case](#best-models-for-our-use-case)
- [API Authentication](#api-authentication)
- [SDK Usage (TypeScript/JavaScript)](#sdk-usage-typescriptjavascript)
- [Recommended Image Sizes](#recommended-image-sizes)
- [Pricing](#pricing)
- [Rate Limits](#rate-limits)
- [Batch Generation](#batch-generation)
- [Prompt Engineering Tips](#prompt-engineering-tips)

---

## Best Models for Our Use Case

We need to generate clear, distinct images that represent abstract "values" (personality traits, principles, etc.) as tier list card thumbnails. The ideal model should produce **iconic, symbolic, visually distinct images** at small sizes (100-200px display) that read well as thumbnails.

### Recommendation Tiers

#### 1. FLUX.1 [schnell] -- BEST PICK for speed + cost

- **Model ID**: `fal-ai/flux/schnell`
- **Why**: Ultra-fast (sub-second, 1-4 inference steps), cheapest option ($0.003/MP), commercial use allowed. At 512x512 (0.26 MP, rounds up to 1 MP) = **$0.003 per image**. Perfect for generating many images quickly and cheaply.
- **Trade-off**: Slightly lower quality than dev/pro, but at 100-200px display size the difference is negligible.

#### 2. Recraft V3 -- BEST PICK for icon/symbolic quality

- **Model ID**: `fal-ai/recraft-v3` (or `fal-ai/recraft/v3/text-to-image`)
- **Why**: Has `vector_illustration` and `digital_illustration` style presets that produce clean, iconic, design-focused outputs. Native vector art support, superior text rendering, brand color control via `colors` parameter. $0.04/image flat rate.
- **Style presets**: `realistic_image`, `digital_illustration`, `vector_illustration`
- **Size presets**: `square`, `square_hd`, `portrait_4_3`, `portrait_16_9`, `landscape_4_3`, `landscape_16_9`
- **Best for**: Producing clean, professional, icon-like symbolic images for abstract concepts.

#### 3. Recraft V4 -- Premium icon/symbolic quality

- **Model ID**: `fal-ai/recraft/v4/text-to-image` (standard) or `fal-ai/recraft/v4/pro/text-to-image` (pro)
- **Why**: Latest version with improved design capabilities, color palette control (RGB), background color control. Purpose-built for professional design and marketing.
- **Cost**: $0.04/image (standard), $0.25/image (pro)
- **Also available**: `fal-ai/recraft/v4/pro/text-to-vector` for SVG output ($0.30/image)

#### 4. FLUX.1 [dev] -- Good balance of quality and cost

- **Model ID**: `fal-ai/flux/dev`
- **Why**: 12B parameter model, higher quality than schnell, good for detailed symbolic images. $0.025/MP.
- **Cost at 512x512**: ~$0.025/image (1 MP rounded up)

#### 5. FLUX.2 [dev] -- Latest FLUX generation

- **Model ID**: `fal-ai/flux-2`
- **Why**: Enhanced realism, crisper text generation, LoRA training ready. $0.012/MP. Supports streaming for real-time generation preview.
- **Cost at 512x512**: ~$0.012/image

#### 6. FLUX.2 [pro] -- Highest quality FLUX

- **Model ID**: `fal-ai/flux-2-pro`
- **Why**: Zero-configuration quality, production-optimized. JSON structured prompts for precise control. Prompt enhancement built-in.
- **Cost**: $0.03/MP. At 512x512 = ~$0.03/image

### Model Comparison Summary

| Model | Cost/Image (512x512) | Speed | Quality | Best For |
|-------|---------------------|-------|---------|----------|
| FLUX.1 schnell | $0.003 | Fastest (sub-second) | Good | Bulk generation, prototyping |
| FLUX.1 dev | $0.025 | Fast | Very Good | Detailed symbolic images |
| FLUX.2 dev | $0.012 | Fast | Very Good | Balance of cost and quality |
| FLUX.2 pro | $0.03 | Medium | Excellent | Production, zero-config |
| Recraft V3 | $0.04 (flat) | Fast | Excellent (icons) | Icon/symbolic design |
| Recraft V4 | $0.04 (flat) | Fast | Excellent (icons) | Professional design |
| Recraft V4 Pro | $0.25 (flat) | Medium | Premium | Premium brand assets |

### Recommended Strategy

**Primary**: Use **Recraft V3** with `digital_illustration` or `vector_illustration` style for the best iconic/symbolic image quality at a reasonable price ($0.04/image).

**Budget alternative**: Use **FLUX.1 [schnell]** at $0.003/image for rapid prototyping and bulk generation, then selectively upgrade to Recraft for final assets.

**Cost estimate for 50 values**: Recraft V3 = $2.00, FLUX.1 schnell = $0.15

---

## API Authentication

### API Key Setup

1. Create an account at https://fal.ai/login
2. Generate an API key at https://fal.ai/dashboard/keys
3. The key is used via the `FAL_KEY` environment variable or client configuration

### Authentication Methods

**Environment variable (recommended for server-side)**:
```bash
export FAL_KEY="YOUR_API_KEY"
```

**Client configuration**:
```typescript
import { fal } from "@fal-ai/client";

fal.config({
  credentials: "FAL_KEY_VALUE"
});
```

**HTTP header (REST API)**:
```
Authorization: Key YOUR_API_KEY
```

### Client-Side Security

Never expose `FAL_KEY` in client-side code. Use a proxy or token provider pattern:

```typescript
// Client-side: use a token provider
import { fal, type TokenProvider } from "@fal-ai/client";

const myTokenProvider: TokenProvider = async (app) => {
  const response = await fetch(`/api/fal/token?app=${app}`);
  const { token } = await response.json();
  return token;
};

fal.config({
  tokenProvider: myTokenProvider,
});
```

**Server-side proxy (Next.js)**:
```typescript
// pages/api/fal/proxy.ts (or app router equivalent)
export { handler as default } from "@fal-ai/server-proxy/nextjs";
```

Then configure the client:
```typescript
fal.config({
  proxyUrl: "/api/fal/proxy",
});
```

---

## SDK Usage (TypeScript/JavaScript)

### Installation

```bash
npm install --save @fal-ai/client
```

For Next.js proxy support:
```bash
npm install --save @fal-ai/server-proxy
```

### Basic Usage: Generate a Single Image

```typescript
import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY,
});

// Using subscribe (recommended - handles queue automatically)
const result = await fal.subscribe("fal-ai/flux/schnell", {
  input: {
    prompt: "A glowing golden compass on a deep blue background, flat illustration style, minimalist, symbolic of guidance and direction",
    image_size: "square",       // 512x512
    num_images: 1,
    num_inference_steps: 4,
    output_format: "png",
    enable_safety_checker: true,
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});

// Access generated image
const imageUrl = result.data.images[0].url;
const width = result.data.images[0].width;
const height = result.data.images[0].height;
console.log(`Generated image: ${imageUrl} (${width}x${height})`);
```

### Using Recraft V3 with Style Presets

```typescript
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/recraft-v3", {
  input: {
    prompt: "A shield with a heart emblem, representing courage and compassion, bold clean lines",
    style: "digital_illustration",  // or "vector_illustration", "realistic_image"
    size: "square",                 // "square", "square_hd", "portrait_4_3", etc.
    colors: ["#4A90D9", "#E74C3C", "#F1C40F"],  // Optional brand colors (hex)
  },
});

console.log(result.data.images[0].url);
```

### Using Recraft V4

```typescript
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/recraft/v4/text-to-image", {
  input: {
    prompt: "A minimalist icon of an open hand releasing a glowing butterfly, symbolizing trust and letting go",
    image_size: "square",
    colors: [
      { r: 74, g: 144, b: 217 },   // Blue
      { r: 231, g: 76, b: 60 },    // Red
    ],
    background_color: { r: 245, g: 245, b: 245 },  // Light gray
    enable_safety_checker: true,
  },
});

console.log(result.data.images[0].url);
```

### Using FLUX.2 [pro] with JSON Structured Prompts

```typescript
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/flux-2-pro", {
  input: {
    prompt: JSON.stringify({
      scene: "Single iconic symbol centered on a clean gradient background",
      subjects: [{
        type: "Symbol",
        description: "A radiant golden key with intricate patterns",
        position: "centered"
      }],
      style: "Flat digital illustration, clean lines, bold colors",
      color_palette: ["#FFD700", "#1A1A2E", "#E94560"],
      lighting: "Soft ambient glow emanating from the subject",
      mood: "Hopeful, empowering",
      composition: "centered",
    }),
    image_size: "square",
    output_format: "png",
    enable_prompt_expansion: true,
  },
});
```

### Queue Management (for batch workflows)

```typescript
import { fal } from "@fal-ai/client";

// Submit without waiting
const { request_id } = await fal.queue.submit("fal-ai/flux/schnell", {
  input: {
    prompt: "A mountain peak icon symbolizing ambition",
    image_size: "square",
  },
  webhookUrl: "https://your-app.com/api/webhooks/fal",  // Optional
});

// Check status later
const status = await fal.queue.status("fal-ai/flux/schnell", {
  requestId: request_id,
  logs: true,
});
console.log(status.status);  // "IN_QUEUE", "IN_PROGRESS", "COMPLETED"

// Get result when done
const result = await fal.queue.result("fal-ai/flux/schnell", {
  requestId: request_id,
});
```

### Streaming (FLUX.2 dev)

```typescript
import { fal } from "@fal-ai/client";

const stream = await fal.stream("fal-ai/flux-2", {
  input: {
    prompt: "An open book with light rays, symbolizing knowledge and wisdom",
    image_size: "square",
  },
});

for await (const event of stream) {
  console.log("Progressive result:", event);
}

const finalResult = await stream.done();
```

### Direct Execution (bypass queue)

```typescript
import { fal } from "@fal-ai/client";

// fal.run() calls the endpoint directly (not via queue)
const result = await fal.run("fal-ai/flux/schnell", {
  input: {
    prompt: "A flame icon, symbolizing passion",
    image_size: "square",
  },
});
```

### File Upload

```typescript
import { fal } from "@fal-ai/client";

// Upload a file and get a URL to use in requests
const file = new File(["..."], "reference.png", { type: "image/png" });
const uploadedUrl = await fal.storage.upload(file);
```

---

## Recommended Image Sizes

For tier list card thumbnails displayed at 100-200px:

### Generation Sizes

| Approach | Generate At | Display At | Notes |
|----------|-----------|------------|-------|
| **Recommended** | 512x512 (`square`) | 128x128 or 200x200 | Good balance of quality and cost. Downscaling adds sharpness. |
| Budget | 256x256 (custom) | 128x128 | Minimum viable, may look blurry on retina |
| High quality | 1024x1024 (`square_hd`) | 200x200 | Best for retina displays, costs ~4x more (4 MP) |

### Size Parameters by Model

**FLUX models** support both presets and custom sizes:
```typescript
// Preset
image_size: "square"      // 512x512
image_size: "square_hd"   // 1024x1024

// Custom dimensions
image_size: { width: 512, height: 512 }
image_size: { width: 256, height: 256 }
```

**Recraft models** support presets:
```typescript
size: "square"      // ~512x512
size: "square_hd"   // ~1024x1024
// Also: portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9
// Or custom: image_size: { width: 512, height: 512 }
```

### Recommendation

Generate at **512x512** (`square`) and serve at display size. This:
- Keeps costs low (1 MP per image)
- Provides enough detail for 2x retina at 200px display
- Downscaled images appear crisper than native small renders
- Gives room for CSS object-fit cropping if needed

---

## Pricing

### Pay-per-use, No Subscription

fal.ai uses pure pay-per-use pricing. No subscription fees, no minimum commitments.

### Image Generation Pricing

| Model | Price | Billing Unit | Cost for 512x512 | Cost for 50 images |
|-------|-------|-------------|-------------------|-------------------|
| FLUX.1 [schnell] | $0.003/MP | Per megapixel (rounded up) | $0.003 | $0.15 |
| FLUX.2 [dev] | $0.012/MP | Per megapixel (rounded up) | $0.012 | $0.60 |
| FLUX.1 [dev] | $0.025/MP | Per megapixel (rounded up) | $0.025 | $1.25 |
| FLUX.2 [pro] | $0.03/MP | Per megapixel (rounded up) | $0.03 | $1.50 |
| FLUX.1 Pro v1.1 | $0.04/MP | Per megapixel (rounded up) | $0.04 | $2.00 |
| FLUX.1 Pro Ultra | $0.06/image | Per image (flat) | $0.06 | $3.00 |
| Recraft V3 | $0.04/image | Per image (flat) | $0.04 | $2.00 |
| Recraft V3 (vector) | $0.08/image | Per image (flat) | $0.08 | $4.00 |
| Recraft V4 | $0.04/image | Per image (flat) | $0.04 | $2.00 |
| Recraft V4 Pro | $0.25/image | Per image (flat) | $0.25 | $12.50 |
| Recraft V4 Pro (vector/SVG) | $0.30/image | Per image (flat) | $0.30 | $15.00 |
| Ideogram V3 (turbo) | $0.03/image | Per image (flat) | $0.03 | $1.50 |
| Ideogram V3 (quality) | $0.09/image | Per image (flat) | $0.09 | $4.50 |
| Google Imagen 3 | $0.05/image | Per image (flat) | $0.05 | $2.50 |
| Google Imagen 3 Fast | $0.025/image | Per image (flat) | $0.025 | $1.25 |

### Megapixel Billing Explained

For models billed per megapixel, the image area is rounded up to the nearest megapixel:
- 512x512 = 0.26 MP, rounds up to 1 MP
- 1024x1024 = 1.05 MP, rounds up to 2 MP
- 256x256 = 0.065 MP, rounds up to 1 MP

This means generating at 256x256 vs 512x512 costs the **same** for MP-billed models. There is no cost benefit to going below 512x512.

### Additional Notes

- Credits purchased expire in 365 days
- Free credits/coupons have variable expiration (1 week to never)
- Failed requests from server errors (5xx) are not charged
- Failed requests from input errors (422) are charged
- Generated files are retained for at least 7 days (download and store your own)

---

## Rate Limits

### Concurrency Limits

| Tier | Concurrent Tasks | How to Get |
|------|-----------------|------------|
| Free/Standard | 2 | Default for all accounts |
| Upgraded | 40 | Add $1,000+ in credits |
| Enterprise | Custom (higher) | Contact sales |

### Behavior When Limit Hit

- Requests are **not rejected** -- they are automatically queued
- Queued requests process as soon as a running task completes
- Playground UI requests are deprioritized vs API requests
- No explicit requests-per-minute limit; only concurrent task limit

### Error Handling

- **429 Too Many Requests**: Implement exponential backoff (wait 2^attempt seconds between retries)
- Use the Queue API (`fal.queue.submit`) for batch workflows to avoid blocking
- Webhook support for async notification when results are ready

---

## Batch Generation

### Approach 1: Parallel Queue Submissions

Submit multiple requests to the queue and collect results asynchronously:

```typescript
import { fal } from "@fal-ai/client";

interface ValueItem {
  name: string;
  prompt: string;
}

const values: ValueItem[] = [
  { name: "Courage", prompt: "A bold lion silhouette with a glowing mane, flat illustration, symbolic" },
  { name: "Wisdom", prompt: "An owl perched on an ancient book, clean lines, iconic style" },
  { name: "Compassion", prompt: "Two hands cupped together holding a glowing heart, minimalist" },
  // ... more values
];

async function generateBatch(values: ValueItem[], modelId: string) {
  // Submit all requests to the queue
  const submissions = await Promise.all(
    values.map(async (value) => {
      const { request_id } = await fal.queue.submit(modelId, {
        input: {
          prompt: value.prompt,
          image_size: "square",
          num_images: 1,
        },
      });
      return { ...value, request_id };
    })
  );

  // Poll for results (respecting concurrency limits)
  const results = await Promise.all(
    submissions.map(async (sub) => {
      const result = await fal.subscribe(modelId, {
        input: { prompt: sub.prompt, image_size: "square" },
      });
      return {
        name: sub.name,
        imageUrl: result.data.images[0].url,
      };
    })
  );

  return results;
}

// Usage
const images = await generateBatch(values, "fal-ai/flux/schnell");
```

### Approach 2: Controlled Concurrency

To respect rate limits and avoid overwhelming the queue:

```typescript
import { fal } from "@fal-ai/client";

async function generateWithConcurrencyLimit(
  prompts: { name: string; prompt: string }[],
  modelId: string,
  concurrency = 2  // Match your rate limit tier
) {
  const results: { name: string; imageUrl: string }[] = [];
  const queue = [...prompts];

  async function processNext(): Promise<void> {
    const item = queue.shift();
    if (!item) return;

    const result = await fal.subscribe(modelId, {
      input: {
        prompt: item.prompt,
        image_size: "square",
      },
    });

    results.push({
      name: item.name,
      imageUrl: result.data.images[0].url,
    });

    return processNext();
  }

  // Start N concurrent workers
  const workers = Array.from({ length: concurrency }, () => processNext());
  await Promise.all(workers);

  return results;
}
```

### Approach 3: Webhook-based (for large batches)

For large batches where you do not want to hold connections open:

```typescript
import { fal } from "@fal-ai/client";

// Submit all -- fal will queue them automatically
const requestIds = await Promise.all(
  values.map(async (value) => {
    const { request_id } = await fal.queue.submit("fal-ai/flux/schnell", {
      input: {
        prompt: value.prompt,
        image_size: "square",
      },
      webhookUrl: "https://your-app.com/api/webhooks/fal-result",
    });
    return { name: value.name, request_id };
  })
);

// Store requestIds in your database
// Results arrive via webhook POST to your endpoint
```

### num_images Parameter

Some FLUX models support generating multiple images per request:

```typescript
const result = await fal.subscribe("fal-ai/flux/schnell", {
  input: {
    prompt: "Abstract concept of integrity, geometric style",
    image_size: "square",
    num_images: 4,  // Generate 4 variations in one request
  },
});

// result.data.images is an array of 4 images
result.data.images.forEach((img, i) => {
  console.log(`Variation ${i}: ${img.url}`);
});
```

Note: You are billed per image, not per request, so `num_images: 4` costs 4x.

---

## Prompt Engineering Tips

### General Principles for Symbolic/Iconic Images

1. **Use concrete visual metaphors, not abstract words**: Instead of "generate an image of courage," describe the visual symbol: "a bold lion silhouette with a golden mane against a deep blue background."

2. **Specify the art style explicitly**: Include style direction like "flat illustration," "minimalist icon," "clean vector style," "bold geometric shapes," or "symbolic emblem."

3. **Describe composition**: "centered on a clean background," "single subject with no clutter," "icon-style with simple shapes."

4. **Control the color palette**: Use specific colors. For fal models, use the `colors` parameter where available (Recraft V3/V4).

5. **Keep prompts focused**: One clear central symbol per image. Avoid complex scenes -- these are thumbnails.

### Prompt Templates for Abstract Values

#### Template 1: Object Metaphor
```
A [concrete object] symbolizing [value], [art style], centered on a [color] background,
clean lines, bold colors, no text, icon style
```

#### Template 2: Action/Scene Metaphor
```
[Simple scene or action] representing [value], flat digital illustration,
minimalist composition, [color palette], symbolic, emblem style
```

#### Template 3: Recraft-optimized (using digital_illustration style)
```
Iconic symbol of [value]: [visual description]. Bold, clean design with [colors].
Professional icon style, centered composition, simple background.
```

### Example Prompts for Common Values

| Value | Prompt |
|-------|--------|
| **Courage** | "A bold golden lion head facing forward, flat illustration style, deep navy background, minimalist emblem, clean geometric shapes" |
| **Wisdom** | "An owl silhouette perched on a stack of books, purple and gold color scheme, clean vector illustration, iconic, centered" |
| **Integrity** | "A perfectly balanced scale made of light, geometric minimalist style, white and gold on dark blue, symbolic emblem" |
| **Compassion** | "Two open hands cradling a glowing heart, warm orange and soft blue, flat digital illustration, centered, icon style" |
| **Resilience** | "A single tree growing through cracked stone, strong roots visible, green and earth tones, flat illustration, symbolic" |
| **Innovation** | "A glowing lightbulb with circuit patterns inside, electric blue and white, clean vector style, dark background, futuristic icon" |
| **Teamwork** | "Interlocking puzzle pieces forming a circle, each piece a different vibrant color, flat design, centered, clean" |
| **Honesty** | "A transparent crystal prism refracting a beam of white light into a rainbow, minimalist, clean lines, centered" |
| **Leadership** | "A compass rose with a golden north star, navy and gold, emblem style, clean geometric design, dark background" |
| **Empathy** | "Two overlapping silhouette profiles facing each other with a bridge of light between them, warm tones, flat illustration" |

### Tips for Consistency Across a Set

1. **Use a consistent style suffix**: Append the same style instructions to every prompt:
   ```
   ", flat digital illustration, centered on dark navy (#1A1A2E) background, bold clean lines, icon style, no text"
   ```

2. **Use Recraft's color parameter**: Pass the same `colors` array to every request to maintain a unified palette.

3. **Use seeds for reproducibility**: Set a consistent seed when you want deterministic outputs.

4. **Generate multiple variations**: Use `num_images: 4` and pick the best from each batch.

5. **Avoid these common mistakes**:
   - Do not use abstract words alone ("generate love") -- always provide a concrete visual
   - Do not include text in the prompt unless you specifically want text rendered in the image
   - Do not describe complex scenes -- keep it to one focal subject
   - Do not mix too many styles in one prompt

### Recraft-Specific Tips

- Use `style: "digital_illustration"` for the cleanest icon-like results
- Use `style: "vector_illustration"` if you want SVG-ready clean output (costs more: $0.08)
- Use the `colors` parameter (array of hex strings) to enforce brand consistency
- Recraft excels at clean, design-focused output -- lean into that with "professional," "clean," "bold" in prompts

### FLUX-Specific Tips

- FLUX.2 Pro supports JSON structured prompts for granular control over scene elements
- Use `guidance_scale` (default 3.5) to control how closely the model follows the prompt -- higher = more literal
- FLUX schnell works best with 4 inference steps (default)
- FLUX Pro supports HEX color codes directly in prompts: `"the icon in color #FFD700"`
- Use `enable_prompt_expansion: true` (FLUX.2 Pro) to let the model enhance simple prompts

---

## File Retention Policy

Generated images are guaranteed available for at least **7 days**. After that, they may be deleted. Always download and store generated images in your own storage (S3, local filesystem, etc.) shortly after generation.

---

## Quick Start: Minimal Working Example

```typescript
import { fal } from "@fal-ai/client";

// 1. Configure (uses FAL_KEY env var automatically if set)
fal.config({ credentials: process.env.FAL_KEY });

// 2. Generate an image
const result = await fal.subscribe("fal-ai/flux/schnell", {
  input: {
    prompt: "A golden compass rose symbolizing guidance, flat illustration, centered, dark blue background, clean bold lines, icon style",
    image_size: "square",
    num_images: 1,
    output_format: "png",
  },
});

// 3. Use the result
const { url, width, height } = result.data.images[0];
console.log(`Image: ${url} (${width}x${height})`);

// 4. Download and save (images expire after 7 days)
const response = await fetch(url);
const buffer = await response.arrayBuffer();
await Bun.write("output.png", buffer);  // or fs.writeFile for Node.js
```

---

## Decision Matrix

| Factor | FLUX.1 schnell | Recraft V3 | Recraft V4 |
|--------|---------------|------------|------------|
| Cost per image | $0.003 | $0.04 | $0.04 |
| Icon/symbolic quality | Good | Excellent | Excellent |
| Speed | Sub-second | Fast | Fast |
| Style control | Prompt only | Style presets + colors | Colors + background |
| Vector output | No | Yes ($0.08) | Yes ($0.30 Pro) |
| Commercial use | Yes | Yes | Yes |
| Best for prototyping | Yes | No (more expensive) | No |
| Best for final assets | No | Yes | Yes |

**Recommended approach**: Prototype with FLUX.1 schnell ($0.003/image), finalize with Recraft V3 ($0.04/image) using `digital_illustration` style for the cleanest iconic results.
