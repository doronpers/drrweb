# Interactive Installation - Personal Website

A theatrical web design treating the website as an **interactive installation** rather than a traditional portfolio. Built with a focus on atmosphere, sensory feedback, and multi-modal presentation.

## ✨ Features

This implementation includes the complete "Prism" architecture with:

- ✅ **AI-Powered Intent Detection** - Uses Anthropic Claude 3.5 Sonnet (primary) or Google Gemini 1.5 Flash (fallback) to intelligently route users
- ✅ **Voice-Generated Whispers** - ElevenLabs voice synthesis for ambient text fragments with user-selectable voices
- ✅ **FailuresLog Component** - Brutally honest table of failures and lessons
- ✅ **Soundscape Hook** - Mode-specific audio control system
- ✅ **Server Actions** - AI routing with graceful fallbacks
- ✅ **Whispers Chamber** - AI-generated ambient text fragments (with optional voice playback)
- ✅ **Echo Chamber** - User-submitted floating guestbook messages

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
- Voice-generated whispers with subtle audio ducking (ElevenLabs integration)

## 🏗️ Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom utility classes
- **Animation**: Framer Motion (layout animations & transitions)
- **Audio**: Tone.js (synthesis & real-time processing)
- **AI**: Vercel AI SDK with Anthropic Claude 3.5 Sonnet (primary) or Google Gemini 1.5 Flash (fallback)
- **Voice**: ElevenLabs API for text-to-speech generation
- **Backend**: Supabase (PostgreSQL for Echo Chamber)
- **State**: React Context API (ViewMode management)
- **Validation**: Zod (schema validation for AI outputs)
- **Caching**: IndexedDB for voice audio persistence

## 📁 Project Structure

```text
drrweb/
├── app/
│   ├── layout.tsx          # Root layout with fonts & providers
│   ├── page.tsx             # Main Prism router
│   └── globals.css          # Global styles & animations
├── actions/                 # Server Actions
│   ├── detect-intent.ts     # AI-powered intent detection
│   ├── generate-whisper.ts  # AI whisper generation
│   └── generate-voice.ts    # ElevenLabs voice generation
├── components/
│   ├── canvas/              # Visual/interactive components
│   │   ├── EchoChamber.tsx  # Floating guestbook
│   │   ├── EchoEntry.tsx    # Individual floating message
│   │   ├── Whisper.tsx      # Individual whisper display
│   │   └── WhispersChamber.tsx # AI-generated ambient text
│   ├── modes/               # The three view modes
│   │   ├── Architect.tsx    # Mode A: Business view
│   │   ├── Author.tsx       # Mode B: Editorial view
│   │   └── Lab.tsx          # Mode C: Process view
│   ├── Landing.tsx          # Entry point (Antechamber)
│   ├── AntiPortfolio.tsx    # Failures & uncertainties footer
│   ├── FailuresLog.tsx      # Table-style failures
│   └── VoiceSelector.tsx    # ElevenLabs voice selection UI
├── contexts/
│   └── ViewModeContext.tsx  # The Prism state management
├── lib/
│   ├── ai-gateway.ts        # Shared AI Gateway configuration
│   ├── audio.ts             # Tone.js audio engine
│   ├── useSoundscape.ts     # Audio mode hook
│   ├── supabase.ts          # Supabase client & queries
│   ├── voice.ts             # Voice manager (ElevenLabs playback & caching)
│   └── whispers.ts          # Whisper engine & curation
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
   
   # Optional: For AI-powered intent detection (choose one):
   # Option 1: Anthropic Claude (recommended)
   ANTHROPIC_API_KEY=your_anthropic_api_key
   
   # Option 2: Vercel AI Gateway (fallback)
   AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key
   
   # Optional: For voice generation (ElevenLabs)
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ```

   **Get API Keys:**

   - **Anthropic**: <https://console.anthropic.com/> → API Keys
   - **Vercel AI Gateway**: Vercel Dashboard → AI Gateway section
   - **ElevenLabs**: <https://elevenlabs.io> → Profile → API Keys

   **Note:** Without an AI API key, the system falls back to keyword matching (still functional). Without ElevenLabs API key, whispers will display as text only.

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

- Minimal input field: "How may I inform your journey?"
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

### 4. Voice-Generated Whispers

- ElevenLabs text-to-speech for ambient text fragments
- User-selectable voice preferences
- Hybrid caching (IndexedDB + memory)
- Subtle audio ducking during playback

### 5. The Anti-Portfolio

- Terminal-style failures log
- Categorized mistakes & lessons
- Active "unknowns" list

## 🎵 Audio System

The audio system uses Tone.js for real-time synthesis:

- **Ambient Drone**: Pink noise → Low-pass filter (LFO modulated) → Volume
- **UI Sounds**:
  - Architect: Musical pentatonic tones (dry, precise)
  - Author: Warm musical tones with reverb (spacious)
  - Lab: Musical tones with filtering (experimental)
- **Voice Playback**:
  - ElevenLabs text-to-speech for whispers
  - Subtle audio ducking (-2dB) during voice playback
  - IndexedDB caching for persistent audio storage
  - Sequential playback queue for natural pacing

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
- **Voice Selection**: `components/VoiceSelector.tsx` → User preference stored in localStorage

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
- [ElevenLabs API](https://elevenlabs.io/docs)

## 🎓 Academic Context

This codebase is designed for educational use. All code is extensively commented to explain:

- **Why** decisions were made (not just what)
- **How** systems interact (architecture)
- **Where** to extend functionality

Perfect for teaching web development, sound design, or interactive installations.

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System architecture, component hierarchy, and technical design
- **[SETUP.md](./docs/SETUP.md)** - Complete setup guide including environment variables and Supabase configuration
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Deployment instructions for Vercel, Netlify, Railway, and self-hosted options
- **[DESIGN.md](./docs/DESIGN.md)** - Design system, typography, spacing, and visual principles
- **[FEATURES.md](./docs/FEATURES.md)** - Detailed feature documentation including AI intent detection and voice generation

For detailed API documentation, see `docs/generated/` (auto-generated from source code).

Historical documentation and summaries are archived in `archive/` for reference.

## 📄 License

This is a personal project template. Feel free to fork and adapt for your own use.

---

**Built with care for atmosphere, subtext, and sensory feedback.**
