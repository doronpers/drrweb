# Design System Documentation

## Overview

This design system follows Dieter Rams' 10 principles of good design, emphasizing clarity, simplicity, and timeless aesthetics. The system provides a comprehensive foundation for consistent, purposeful design across the personal website.

## Design Principles

### 1. Good Design is Innovative
- AI-powered intent detection for intelligent routing
- Audio-visual harmony with real-time synthesis
- Sophisticated mode transitions that respect content hierarchy

### 2. Good Design Makes a Product Useful
- Clear navigation with discoverable mode switching
- Progressive disclosure for dense content
- Mobile-optimized touch targets and spacing

### 3. Good Design is Aesthetic
- Systematic typography scale (Major Third ratio: 1.25)
- Refined color harmony with muted accents
- Consistent 8px-based spacing system

### 4. Good Design Makes a Product Understandable
- Subtle onboarding hints for first-time visitors
- Clear visual hierarchy using size, weight, and spacing
- Enhanced affordances for interactive elements

### 5. Good Design is Unobtrusive
- Reduced visual noise (whispers, grain texture)
- Purposeful animations only
- Subtle ambient elements

### 6. Good Design is Honest
- Transparent loading states
- Clear error messages
- Honest about functionality and limitations

### 7. Good Design is Long-Lasting
- Timeless typography choices
- Classic design patterns
- Design tokens that can evolve without breaking

### 8. Good Design is Thorough Down to the Last Detail
- Polished micro-interactions
- Smooth keyboard navigation
- Comprehensive accessibility support

### 9. Good Design is Environmentally Friendly
- Code splitting for optimal bundle size
- Lazy loading of non-critical resources
- Performance-optimized animations

### 10. Good Design is as Little Design as Possible
- Removed redundant elements
- Simplified navigation
- Streamlined content

## Design Tokens

### Typography Scale

The typography system uses a Major Third ratio (1.25) for consistent scaling:

| Size | Value | Usage |
|------|-------|-------|
| xs | 0.75rem (12px) | Labels, captions |
| sm | 0.875rem (14px) | Secondary text |
| base | 1rem (16px) | Body text |
| lg | 1.125rem (18px) | Emphasized body |
| xl | 1.25rem (20px) | Subheadings |
| 2xl | 1.563rem (25px) | Section headings |
| 3xl | 1.953rem (31px) | Major sections |
| 4xl | 2.441rem (39px) | Page titles |
| 5xl | 3.052rem (49px) | Hero text |
| 6xl | 3.815rem (61px) | Display text |

### Spacing Scale

Based on 8px base unit for consistent rhythm:

| Token | Value | Usage |
|-------|-------|-------|
| 0.5 | 0.125rem (2px) | Tight spacing |
| 1 | 0.25rem (4px) | Minimal spacing |
| 2 | 0.5rem (8px) | Base unit |
| 3 | 0.75rem (12px) | Small spacing |
| 4 | 1rem (16px) | Standard spacing |
| 6 | 1.5rem (24px) | Medium spacing |
| 8 | 2rem (32px) | Large spacing |
| 12 | 3rem (48px) | Section spacing |
| 16 | 4rem (64px) | Major spacing |
| 24 | 6rem (96px) | Hero spacing |

### Color System

#### Architect Mode
- **Background**: `#FAFAFA` - Clean, minimal
- **Text**: `#000000` - High contrast
- **Accent**: `#CC0000` - Muted red (20% less saturation)
- **Borders**: `rgba(0, 0, 0, 0.1)` - Subtle definition

#### Author Mode
- **Background**: `#FFF9F0` - Warm, editorial
- **Text**: `#1A1A1A` - Readable, not pure black
- **Accent**: `#6B3410` - Refined brown
- **Borders**: `rgba(26, 26, 26, 0.15)` - Gentle separation

#### Lab Mode
- **Background**: `#0A0A0A` - Terminal dark
- **Text**: `#00CC00` - Muted green (from #00FF00)
- **Accent**: `#CC00CC` - Muted magenta (from #FF00FF)
- **Borders**: `rgba(0, 204, 0, 0.2)` - Subtle terminal aesthetic

### Transitions

| Type | Duration | Easing | Usage |
|------|---------|--------|-------|
| Smooth | 0.6s | cubic-bezier(0.645, 0.045, 0.355, 1) | Major transitions |
| Normal | 0.3s | cubic-bezier(0.4, 0, 0.2, 1) | Standard interactions |
| Snappy | 0.2s | cubic-bezier(0.4, 0, 0.2, 1) | Micro-interactions |
| Spring | - | stiffness: 300, damping: 30 | Playful elements |

## Component Patterns

### Typography Usage

```typescript
import { getTypography } from '@/lib/styles';

const styles = getTypography('architect');

// Headings
<h1 className={styles.h1}>Main Title</h1>
<h2 className={styles.h2}>Section Title</h2>
<h3 className={styles.h3}>Subsection</h3>

// Body text
<p className={styles.p}>Body content</p>
<span className={styles.small}>Secondary text</span>
```

### Spacing Usage

```tsx
// Use spacing tokens consistently
<div className="space-y-6"> {/* 24px vertical spacing */}
  <section className="mb-8"> {/* 32px bottom margin */}
    <div className="px-4 py-6"> {/* 16px horizontal, 24px vertical */}
```

### Focus States

All interactive elements include enhanced focus states:

```tsx
<button className="focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2">
  Click me
</button>
```

### Reduced Motion Support

The system respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Accessibility

### ARIA Labels
- All interactive elements have descriptive labels
- Navigation uses proper `role` attributes
- Loading states use `aria-live` and `aria-busy`

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus indicators are clearly visible
- Logical tab order throughout

### Screen Reader Support
- Semantic HTML structure
- Descriptive ARIA labels
- Proper heading hierarchy

## Performance

### Code Splitting
- Mode components are lazy-loaded
- Audio module loads on demand
- Reduces initial bundle size

### Optimizations
- Reduced animation complexity
- Optimized re-renders
- Efficient asset loading

## Mobile Considerations

### Touch Targets
- Minimum 44px × 44px for all interactive elements
- Adequate spacing between touch targets
- Responsive spacing adjustments

### Responsive Typography
- Fluid typography using `clamp()`
- Appropriate line heights for mobile
- Readable font sizes at all breakpoints

## Usage Guidelines

### When to Use Each Mode

- **Architect**: Business contexts, professional profiles, data-heavy content
- **Author**: Editorial content, narrative, long-form reading
- **Lab**: Technical documentation, process views, raw information

### Visual Hierarchy

1. Use size, weight, and spacing systematically
2. Maintain consistent ratios (Major Third for type, 8px for spacing)
3. Guide attention through contrast and positioning

### Color Usage

- Use accent colors sparingly for emphasis
- Maintain sufficient contrast (WCAG AA minimum)
- Respect mode-specific color palettes

## Future Considerations

- Design tokens can evolve without breaking existing components
- New modes can be added following the same patterns
- The system supports dark mode considerations
- Accessibility improvements can be made incrementally

---

**Last Updated**: 2025-01-25
**Version**: 1.0.0
