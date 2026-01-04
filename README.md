# Interactive Installation - Personal Website

A theatrical web design treating the website as an **interactive installation** rather than a traditional portfolio. Built with a focus on atmosphere, sensory feedback, and multi-modal presentation.

## 🆕 What's New

This implementation includes the complete "Prism" architecture with:
- ✅ **AI-Powered Intent Detection** - Uses Google Gemini 1.5 Flash to intelligently route users
- ✅ **FailuresLog Component** - Brutally honest table of failures and lessons
- ✅ **Soundscape Hook** - Mode-specific audio control system
- ✅ **Server Actions** - AI routing with graceful fallbacks
- ✅ **Static Intro Block** - Accessible, indexable text above interactive experience

> **Note:** The homepage now includes a static intro block for accessibility and fast skimming. This server-delivered HTML content appears above the interactive experience, ensuring the site is usable without JavaScript and easily indexed by search engines. The interactive landing prompt remains fully functional below.

📚 **New Documentation:**
- [PRISM_IMPLEMENTATION.md](./PRISM_IMPLEMENTATION.md) - Complete implementation guide
- [PRISM_FEATURES.md](./PRISM_FEATURES.md) - New features guide
- [FILE_TREE.txt](./FILE_TREE.txt) - Project structure
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical summary

## 🎭 The Concept

This website is structured around **"The Prism"** – a metaphor for how a single identity refracts into multiple presentations based on viewer intent:

- **Mode A: The Architect** - Utilitarian, Swiss Style (for recruiters/business)
- **Mode B: The Author** - Editorial, breathable (for students/explorers)
- **Mode C: The Lab** - Brutalist, raw (for makers/process-oriented)

The site uses **AI to detect user intent** and automatically route to the appropriate mode. No traditional navigation - the same URL re-renders based on the viewer's needs.

## 🎵 Audio as a First-Class Citizen

Unlike typical websites, audio is central to the experience:
- Biophilic ambient drone (filtered noise with breathing modulation)
- Mode-specific UI sounds (dry clicks, warm tones, glitches)
- Real-time synthesis using Tone.js (not just file playback)

## 🏗️ Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom utility classes
- **Animation**: Framer Motion (layout animations & transitions)
- **Audio**: Tone.js (synthesis & real-time processing)
- **AI**: Vercel AI SDK with Google Gemini 1.5 Flash (intent detection)
- **Backend**: Supabase (PostgreSQL for Echo Chamber)
- **State**: React Context API (ViewMode management)
- **Validation**: Zod (schema validation for AI outputs)

## 📁 Project Structure

```
drrweb/
├── app/
│   ├── layout.tsx          # Root layout with fonts & providers
│   ├── page.tsx             # Main Prism router
│   └── globals.css          # Global styles & animations
├── actions/                 # Server Actions (NEW)
│   └── detect-intent.ts     # AI-powered intent detection
├── components/
│   ├── canvas/              # Visual/interactive components
│   │   ├── EchoChamber.tsx  # Floating guestbook
│   │   └── EchoEntry.tsx    # Individual floating message
│   ├── modes/               # The three view modes
│   │   ├── Architect.tsx    # Mode A: Business view
│   │   ├── Author.tsx       # Mode B: Editorial view
│   │   └── Lab.tsx          # Mode C: Process view
│   ├── Landing.tsx          # Entry point (Antechamber)
│   ├── AntiPortfolio.tsx    # Failures & uncertainties footer
│   └── FailuresLog.tsx      # Table-style failures (NEW)
├── contexts/
│   └── ViewModeContext.tsx  # The Prism state management
├── lib/
│   ├── audio.ts             # Tone.js audio engine
│   ├── useSoundscape.ts     # Audio mode hook (NEW)
│   └── supabase.ts          # Supabase client & queries
├── public/
│   ├── audio/               # Audio assets (if any)
│   └── textures/            # Grain textures
└── styles/                  # Additional styles (if needed)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```
   
   **Note:** If you encounter npm registry issues (e.g., custom registry errors), you can use the setup script:
   ```bash
   ./setup.sh
   ```
   
   Or manually set the registry:
   ```bash
   npm install --registry=https://registry.npmjs.org/
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your credentials:
   
   ```env
   # Optional: For Echo Chamber (Supabase backend)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   
   # Optional: For AI-powered intent detection (Vercel AI Gateway)
   AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key
   ```
   
   **Get Vercel AI Gateway API Key:** 
   1. Sign in to your Vercel account
   2. Navigate to the AI Gateway section in your dashboard
   3. Create a new API key and copy it
   
   **Note:** Without the AI Gateway API key, the system falls back to keyword matching (still functional).

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Supabase Setup (Optional)

The Echo Chamber feature requires a Supabase backend. If you skip this, the site will work with mock data.

### Database Schema

```sql
CREATE TABLE echoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL CHECK (char_length(text) <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE echoes ENABLE ROW LEVEL SECURITY;

-- Policy for public reads
CREATE POLICY "Public can read approved echoes"
ON echoes FOR SELECT
USING (approved = true);

-- Policy for public inserts (requires moderation)
CREATE POLICY "Anyone can insert echoes for moderation"
ON echoes FOR INSERT
WITH CHECK (true);
```

## 🎨 Key Features

### 1. The Antechamber (Landing)
- Minimal input field: "What do you seek?"
- Keyword mapping routes to appropriate mode
- Audio initialization with user consent

### 2. The Prism (Mode Switcher)
- Three distinct visual/audio aesthetics
- Smooth transitions between modes
- Context-aware content rendering

### 3. The Echo Chamber
- Floating guestbook messages
- Physics-based motion (varying opacity for "distance")
- Moderated submissions via Supabase

### 4. The Anti-Portfolio
- Terminal-style failures log
- Categorized mistakes & lessons
- Active "unknowns" list

## 🎵 Audio System

The audio system uses Tone.js for real-time synthesis:

- **Ambient Drone**: Pink noise → Low-pass filter (LFO modulated) → Volume
- **UI Sounds**:
  - Architect: Sharp sine wave click (800Hz)
  - Author: Warm membrane synth with reverb (200Hz)
  - Lab: White noise burst (glitch)

## 🎨 Design Philosophy

### Show, Don't Tell
Motion and sound convey meaning. Minimal text. High whitespace.

### Variable Fonts
Typography weight indicates hierarchy and mood. Font-variation-settings used extensively.

### Radical Reduction
No clutter. Textures over flat colors. Every element has purpose.

### Theatrical Sensibility
The site is staged, not built. Lighting (via opacity), pacing (via animation), and soundscape create atmosphere.

## 📝 Customization

### Update Content

Edit the following files to customize content:

- **Personal info**: `components/modes/Architect.tsx`, `Author.tsx`, `Lab.tsx`
- **Failures**: Update `public/data/failures.json` or edit `components/AntiPortfolio.tsx` → `FAILURES` array
- **Echoes**: `components/canvas/EchoChamber.tsx` → `INITIAL_ECHOES`
- **Keywords**: `contexts/ViewModeContext.tsx` → `KEYWORD_MAP`

### Adjust AI Routing

To customize intent detection behavior, edit `actions/detect-intent.ts`:
- Modify the prompt to change routing logic
- Adjust audio parameter ranges
- Add new mode detection patterns

### Adjust Styling

- **Colors**: `tailwind.config.ts` → `theme.extend.colors`
- **Animations**: `app/globals.css` → custom keyframes
- **Audio**: `lib/audio.ts` → synthesis parameters

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Tone.js Documentation](https://tonejs.github.io/)
- [Supabase Guides](https://supabase.com/docs)

## 🎓 Academic Context

This codebase is designed for educational use. All code is extensively commented to explain:
- **Why** decisions were made (not just what)
- **How** systems interact (architecture)
- **Where** to extend functionality

Perfect for teaching web development, sound design, or interactive installations.

## 📚 Documentation

Comprehensive documentation is available:

### Manual Documentation
- **[PRISM_IMPLEMENTATION.md](./PRISM_IMPLEMENTATION.md)** - Complete implementation guide with setup instructions, testing checklists, and architecture notes
- **[PRISM_FEATURES.md](./PRISM_FEATURES.md)** - Guide to new features including AI intent detection, FailuresLog, and soundscape hook
- **[FILE_TREE.txt](./FILE_TREE.txt)** - Complete project structure with smart/dumb component classification
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical summary of all changes and deliverables

### Auto-Generated Documentation
- **[docs/generated/](./docs/generated/)** - Auto-generated documentation from code
  - **[COMPONENTS.md](./docs/generated/COMPONENTS.md)** - Component reference with props and dependencies
  - **[API.md](./docs/generated/API.md)** - API reference for functions, hooks, and utilities
  - **[VALIDATION.md](./docs/generated/VALIDATION.md)** - Documentation completeness report

#### Documentation Automation
This project includes automated documentation generation that extracts documentation from code comments and type annotations:

```bash
# Generate all documentation
npm run docs:generate

# Validate documentation completeness
npm run docs:validate

# Generate specific documentation types
npm run docs:components
npm run docs:api
```

See **[scripts/doc-automation/README.md](./scripts/doc-automation/README.md)** for complete documentation automation guide.

## 📄 License

This is a personal project template. Feel free to fork and adapt for your own use.

---

**Built with care for atmosphere, subtext, and sensory feedback.**
