# Sonotheia → drrweb Integration Roadmap

## Overview

This document outlines the artful integration of elements from [Website-Sonotheia](https://github.com/doronpers/Website-Sonotheia-v251120) into the drrweb personal website. These integrations leverage Sonotheia's detection modules and audio processing patterns to enhance the theatrical, immersive experience of the Prism architecture.

---

## Integration Priority Matrix

| Priority | Element | Target | Status | Artistic Purpose |
|----------|---------|--------|--------|------------------|
| 🥇 P1 | Analysis Phases | Mode transitions | 🚧 In Progress | Theatrical pacing, dramatic tension |
| 🥇 P1 | Waveform Visualization | Lab mode | ⏳ Planned | Process exposure, brutalist aesthetic |
| 🥈 P2 | DetectorChat Pattern | Author mode | ⏳ Planned | Interrogative engagement with text |
| 🥈 P2 | Evidence Grid | Architect mode | ⏳ Planned | Competency fingerprint visualization |
| 🥉 P3 | Audio Processing | audio.ts | ⏳ Planned | Deeper reactive soundscape |
| 🥉 P3 | Trust Signals | Echo Chamber | ⏳ Planned | Intimacy and transparency |

---

## P1: Analysis Phases → Mode Transitions

### Concept
Transform Sonotheia's analysis phase progression into poetic mode transitions. When a user selects a mode in the Antechamber, the transition includes a brief "tuning" sequence that builds anticipation.

### Source Reference
```javascript
// From Website-Sonotheia/frontend/src/components/Demo.jsx
const ANALYSIS_PHASES = [
  "Establishing secure connection...",
  "Analyzing audio patterns...",
  "Running forensic sensors...",
  "Generating verdict..."
];
```

### Implementation
- Create `PrismTransition.tsx` component
- Add mode-specific phase sequences
- Integrate with existing Framer Motion transitions
- Trigger mode-specific audio cues during phases

### Files to Modify/Create
- `components/PrismTransition.tsx` (new)
- `app/page.tsx` (integrate transition)
- `lib/audio.ts` (add transition sounds)

---

## P1: Waveform Visualization → Lab Mode

### Concept
Add a real-time audio waveform monitor to Lab mode that visualizes the ambient Tone.js synthesis. Reinforces the "process exposed" brutalist aesthetic.

### Source Reference
```jsx
// From Website-Sonotheia/frontend/src/components/Demo.jsx
<div className="waveform-container">
  {[...Array(12)].map((_, i) => (
    <div key={`waveform-bar-${i}`} className="waveform-bar"></div>
  ))}
</div>
```

### Implementation
- Create `AudioWaveformMonitor.tsx` component
- Connect to existing `audioManager` singleton
- Use Tone.Analyser for real-time data
- Style with Lab mode's brutalist aesthetic

### Files to Modify/Create
- `components/canvas/AudioWaveformMonitor.tsx` (new)
- `components/modes/Lab.tsx` (integrate monitor)
- `lib/audio.ts` (expose analyser)

---

## P2: DetectorChat → "Ask the Artist"

### Concept
Adapt Sonotheia's conversational DetectorChat into an "Interrogate the Text" feature for Author mode. Visitors can ask questions about essays/writing, powered by AI.

### Source Reference
```jsx
// From Website-Sonotheia/frontend/src/components/DetectorChat.jsx
function DetectorChat({ detectionResult }) {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  // ...
}
```

### Implementation
- Create `AskTheArtist.tsx` component
- Integrate with existing Gemini API (actions/detect-intent.ts)
- Context-aware prompts based on current content
- Maintain Author mode's serif, editorial aesthetic

### Files to Modify/Create
- `components/AskTheArtist.tsx` (new)
- `components/modes/Author.tsx` (integrate)
- `actions/ask-artist.ts` (new server action)

---

## P2: Evidence Grid → Competency Fingerprint

### Concept
Transform Sonotheia's sensor evidence display into a visual "competency fingerprint" for Architect mode, showing skills and domains with confidence indicators.

### Mapping
| Sonotheia Sensor | drrweb Equivalent |
|-----------------|-------------------|
| Vocal Tract Analysis | Sound Design |
| Phase Coherence | Code Architecture |
| Coarticulation | Cross-domain Synthesis |
| Bandwidth Detection | Technical Range |
| Liveness Detection | Active Projects |

### Implementation
- Create `CompetencyFingerprint.tsx` component
- Animated reveal with Framer Motion
- Click to expand domain details

---

## P3: Enhanced Audio Processing

### Concept
Extend the existing Tone.js audio engine with Sonotheia-inspired reactive soundscapes.

### Features
- Engagement harmonics (depth-based complexity)
- Mode resolution sounds (musical confirmation)
- Spectral layers tied to scroll position

---

## P3: Trust Signals → Echo Chamber

### Concept
Add Sonotheia-style trust messaging to the Echo Chamber guestbook.

### Implementation
- Subtle privacy/moderation notes
- Matches intimate, floating aesthetic

---

## Implementation Order

1. **Phase 1 (Current Sprint)**
   - [x] Create roadmap document
   - [ ] Implement PrismTransition component
   - [ ] Add transition phases to mode switching

2. **Phase 2**
   - [ ] AudioWaveformMonitor for Lab mode
   - [ ] Expose Tone.Analyser in audio.ts

3. **Phase 3**
   - [ ] AskTheArtist component
   - [ ] Server action for AI responses

4. **Phase 4**
   - [ ] CompetencyFingerprint component
   - [ ] Enhanced audio processing

---

## Design Principles

All integrations should maintain drrweb's core aesthetic:

- **Show, Don't Tell**: Motion and sound convey meaning
- **Radical Reduction**: Every element has purpose
- **Theatrical Sensibility**: Staged, not built
- **Variable Typography**: Weight indicates hierarchy

---

## References

- [Website-Sonotheia Repository](https://github.com/doronpers/Website-Sonotheia-v251120)
- [drrweb Architecture](./ARCHITECTURE.md)
- [Prism Features](./PRISM_FEATURES.md)