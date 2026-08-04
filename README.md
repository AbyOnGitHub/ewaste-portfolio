# Ewaste Portfolio

This is a Next.js portfolio showcasing projects on a 3D globe. The repository is prepared for deployment to Vercel and includes a CI workflow for GitHub Actions.

Quick checklist before publishing
- Node 18+ or 20 (recommended)
- Commit all local changes
- Add any secret environment variables in the Vercel dashboard if required

How to push this project to your GitHub account

1. Create a new GitHub repository (replace <owner> and <repo> below):

```bash
# from your project root
git init
git add .
git commit -m "Initial commit"
# create remote (use your own GitHub username and repo)
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

Alternatives: use `gh` CLI to create a repo then `git push`:

```bash
gh repo create <your-username>/<your-repo> --public --source=. --remote=origin --push
```

Deploy to Vercel (recommended)

1. Web UI: go to https://vercel.com/new, import your GitHub repository, select the `main` branch and deploy.

2. CLI: install Vercel CLI and run from project root:

```bash
npm i -g vercel
vercel login
vercel --prod
```

Notes for Vercel
- The project uses Next.js App Router and should work out of the box on Vercel.
- Static textures are stored in `public/textures/earth/` — keep them committed to the repository for reliable rendering.

CI
- A basic GitHub Actions workflow is included at `.github/workflows/ci.yml` that runs `npm ci` and `npm run build` on pushes to `main`.

If you want, I can:
- Create the GitHub repo for you (you must provide a GitHub token with repo permissions),
- Or push directly if you run the `git` commands locally and paste the remote URL here so I can push via an authenticated remote.
# EcoPulse — E-Waste Awareness & Sustainability Portfolio

A state-of-the-art, immersive portfolio website built with **Next.js 14 (App Router)**, **React Three Fiber (R3F)**, **GSAP ScrollTrigger**, and **Tailwind CSS**. Designed around a "Nature Meets Circuit" aesthetic to showcase e-waste research posters, interactive prototypes, mini documentaries, vertical social reels, certificates, and sustainability campaigns.

---

## 🌟 Key Features

1. **Interactive 3D Earth Centerpiece**:
   - Built with React Three Fiber (`@react-three/fiber`) and `@react-three/drei`.
   - Draggable & spinnable globe with damped inertia controls.
   - Pinned bioluminescent glowing node markers representing project assignments across the globe.
   - Hover tooltips and camera smooth zoom transitions to selected project nodes using GSAP.

2. **GSAP ScrollTrigger Animation**:
   - Hero text reveals, typing quotes, staggered section scroll triggers, and bioluminescent ambient background particle canvases.

3. **Nature Meets Circuit Design System**:
   - Harmonious palette: Deep Forest Green (`#0B3D2E`), Moss/Sage (`#4C7C59`, `#87A96B`), Teal (`#0E7490`), Mint Glow (`#A7F3D0`), and Warm Amber (`#D4A373`).
   - Custom organic blob profile masks, circuit grid textures, and glassmorphic panels.

4. **Multi-Media Project Detail Modal**:
   - **Posters / Images**: High-res lightbox viewer with zoom & pan.
   - **PDFs / Documents**: Embedded PDF viewer with page controls & direct download buttons.
   - **Certificates**: Framed eco-credential card view.
   - **Prototypes & Live Websites**: Interactive HTML iframe sandbox with fallback to direct opening.
   - **Video & Reels**: Custom player supporting both 16:9 documentaries and 9:16 vertical reels.

5. **100% Serverless Architecture**:
   - Built for instant zero-server deployment on **Vercel** with Next.js App Router Route Handlers (`app/api/upload/route.ts`).

---

## 📁 Directory Structure

```text
ewaste-portfolio/
├── app/
│   ├── api/
│   │   └── upload/route.ts    # Vercel Blob signed upload API route handler
│   ├── projects/[slug]/       # Dynamic project detail page for direct shareable URLs
│   ├── globals.css            # Nature Meets Circuit color tokens & custom utility classes
│   ├── layout.tsx             # Root layout with Inter & Fraunces fonts
│   └── page.tsx               # Main portfolio landing page
├── components/
│   ├── 3d/
│   │   ├── EarthCanvas.tsx    # R3F Canvas container with camera tweening & stars
│   │   ├── EarthModel.tsx     # Procedural 3D Earth sphere, glow shell & nodes
│   │   ├── FibonacciSphere.ts # Lat/Lng & Fibonacci sphere distribution coordinate math
│   │   └── ProjectNode.tsx    # 3D glowing project pin with hover tooltips & click handlers
│   ├── modals/
│   │   └── ProjectDetailModal.tsx # Multi-tab media modal viewer
│   ├── sections/
│   │   ├── HeroSection.tsx    # Animated typing quotes, GSAP reveals & particle canvas
│   │   ├── AboutSection.tsx   # Bio, organic leaf mask avatar & focus area tags
│   │   ├── EarthSection.tsx   # Pinned 3D Earth section container
│   │   ├── ProjectsGridSection.tsx # Filterable search grid catalog
│   │   └── ContactFooter.tsx  # Wave SVG divider, contact form & social links
│   └── viewers/
│       ├── CertificateViewer.tsx
│       ├── MediaLightbox.tsx
│       ├── PdfViewer.tsx
│       ├── PrototypeViewer.tsx
│       └── VideoReelPlayer.tsx
├── content/
│   └── projects.json          # Structured dataset of assignments & attachments
├── lib/
│   └── projects.ts            # Content fetching utilities
├── types/
│   └── project.ts             # TypeScript definitions for projects & attachments
├── tailwind.config.js
└── package.json
```

---

## 🛠️ Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 How to Add a New Project / Assignment

All project content is stored in `content/projects.json`. To add a new assignment poster, research paper, certificate, or video reel:

1. Open `content/projects.json`.
2. Add a new JSON object adhering to the `Project` schema:

```json
{
  "slug": "my-new-project",
  "title": "My Eco-Design Title",
  "subtitle": "Short Tagline",
  "description": "Brief summary...",
  "category": "Poster", // Poster | PDF & Research | Prototype | Video & Reel | Certificate | Campaign
  "date": "2026-03",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060,
    "regionName": "New York, USA"
  },
  "coverImage": "https://images.unsplash.com/photo-...",
  "tags": ["E-Waste", "Infographic"],
  "attachments": [
    {
      "id": "att-unique-1",
      "type": "image", // image | pdf | certificate | prototype | video | reel | document
      "title": "Poster High-Res",
      "url": "https://..."
    }
  ]
}
```

---

## 🚀 Deploying to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the project into **Vercel**.
3. (Optional) To enable dynamic file uploads via Vercel Blob Storage:
   - Go to your Vercel Project Dashboard -> **Storage** -> **Create Blob Database**.
   - Copy the `BLOB_READ_WRITE_TOKEN` environment variable into your Vercel environment settings.
4. Click **Deploy**.
