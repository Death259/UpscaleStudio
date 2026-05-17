# Upscale Studio

A fully client-side, offline-capable AI image upscaler built on [ESRGAN](https://github.com/xinntao/ESRGAN) and [TensorFlow.js](https://www.tensorflow.org/js). Upload any image, set a target resolution, and the app runs AI upscaling directly in your browser — no server, no cloud, no data leaves your machine.

## Features

- **AI-powered upscaling** — Uses ESRGAN Slim models for high-quality super-resolution
- **2×, 4×, and 8× scale passes** — Automatically selects the minimum number of passes needed to reach your target size
- **Crop & export** — Interactive crop frame on the upscaled result; drag to reposition, enable free-crop to resize handles; works on touch and mouse
- **PNG or JPEG export** — Toggle between lossless PNG and JPEG with an adjustable quality slider (1–100%)
- **PWA / installable** — Service worker caches all assets for true offline use; add to home screen on mobile or install from desktop Chrome
- **Fully offline after load** — All JS and model weights are bundled locally; no CDN dependencies at runtime
- **No backend required** — Runs entirely in the browser via WebGL-accelerated TensorFlow.js

## How It Works

| Pass | Output scale | Strategy                         |
|------|-------------|----------------------------------|
| 2×   | 2×          | 1 × ESRGAN Slim 2× pass         |
| 4×   | 4×          | 2 × ESRGAN Slim 2× passes       |
| 8×   | 8×          | 3 × ESRGAN Slim 2× passes       |

Repeated 2× passes produce better detail than a single large-factor pass for most photographic and graphic content.

The app analyses your source dimensions versus target dimensions, picks the smallest sufficient pass, warns when the target aspect ratio differs (so you know to use the crop stage), and tells you if the target is unreachable (requires more than 8×).

## File Structure

```
upscale-studio/
├── index.html                   ← Single-file app (HTML + CSS + JS)
├── manifest.json                ← PWA manifest (name, icons, theme colour)
├── sw.js                        ← Service worker — cache-first offline support
├── icon.svg                     ← App icon for PWA install / home screen
├── tf.min.js                    ← TensorFlow.js (bundled locally)
├── upscale-bundle.min.js        ← Upscaler.js + ESRGAN config (bundled locally)
├── upscaler.min.js              ← Upscaler.js runtime
└── models/
    ├── x2/
    │   ├── model.json           ← ESRGAN Slim 2× topology (~13 KB)
    │   └── group1-shard1of1.bin ← ESRGAN Slim 2× weights (~868 KB)
    └── x4/
        ├── model.json           ← ESRGAN Slim 4× topology (~13 KB)
        └── group1-shard1of1.bin ← ESRGAN Slim 4× weights (~912 KB)
```

## Usage

### Local (any static file server)

```bash
# Python
python3 -m http.server 8080

# Node.js (npx)
npx serve .
```

Then open `http://localhost:8080` in Chrome or Edge.

### Deploying to IIS

1. Copy the entire project folder to your IIS site root (e.g. `C:\inetpub\wwwroot\upscale-studio\`).
2. In IIS Manager add a site or virtual directory pointing to that folder.
3. Add a MIME type for `.bin` files if not already present:
   - Extension: `.bin`
   - MIME Type: `application/octet-stream`
4. Navigate to `http://your-server/upscale-studio/`.

### Deploying to any static host (Netlify, GitHub Pages, Vercel, S3, etc.)

Just upload the folder contents — there is no build step. The app is pure static HTML/JS.

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome / Edge | Recommended — best WebGL + TF.js performance |
| Firefox | Supported — may be slower |
| Safari | Partial — TF.js WebGL support varies |

## Internet Requirement

The only external dependency is the Google Fonts stylesheet (`fonts.googleapis.com`) loaded for the Syne and DM Mono typefaces. If your network blocks this the app still works perfectly — it falls back to system fonts. Everything else (JS, model weights) is local.

## UI Walkthrough

1. **Step 01 — Upload Image**: Drag-and-drop or click to browse. Supports PNG, JPG, WEBP, BMP. A thumbnail and file metadata are shown after selection.
2. **Step 02 — Set Target Size**: Enter the desired output width × height in pixels. The analysis panel shows the required scale factor, which ESRGAN pass will be used, and any aspect-ratio or size warnings. Click **Start Upscaling** when ready.
3. **Step 03 — Crop & Download**: After upscaling completes a canvas shows the result. Drag the yellow crop frame to choose the region to export (mouse and touch both work). Toggle **Free crop** to enable resize handles. Choose **PNG** (lossless) or **JPEG** (with a quality slider) then click **Crop & Download** to save the file named `<original>_<scale>x_<WxH>.<ext>`.

## Design Tokens

The UI uses CSS custom properties for easy theming:

| Variable | Default | Purpose |
|----------|---------|---------|
| `--bg` | `#0e0f11` | Page background |
| `--surface` | `#16181c` | Card background |
| `--accent` | `#d4f74b` | Lime green highlight |
| `--text` | `#f0f1f3` | Primary text |
| `--warn` | `#f59e0b` | Warning states |
| `--error` | `#ef4444` | Error states |
