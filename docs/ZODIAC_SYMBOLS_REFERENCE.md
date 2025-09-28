# Zodiac Symbols Reference - Premium Icons

## Overview
This document defines the premium zodiac symbols used throughout the Salamene Horoscope app. Each sign has been carefully selected with meaningful emojis that represent the essence and personality of each zodiac sign.

## Premium Symbol System

### Fire Signs - Dynamic & Energetic
1. **Aries (🐏)** - The Ram
   - Symbol: ♈
   - Element: Fire
   - Ruling Planet: Mars
   - Accent Color: #E91E63 (Deep Pink)
   - Description: Bold, ambitious, and energetic pioneer
   - Dates: Mar 21 – Apr 19

2. **Leo (🦁)** - The Lion
   - Symbol: ♌
   - Element: Fire
   - Ruling Planet: Sun
   - Accent Color: #FF9800 (Orange)
   - Description: Confident, generous, and natural-born leader
   - Dates: Jul 23 – Aug 22

3. **Sagittarius (🏹)** - The Archer
   - Symbol: ♐
   - Element: Fire
   - Ruling Planet: Jupiter
   - Accent Color: #FF5722 (Deep Orange)
   - Description: Adventurous, philosophical, and optimistic
   - Dates: Nov 22 – Dec 21

### Earth Signs - Grounded & Practical
4. **Taurus (🐂)** - The Bull
   - Symbol: ♉
   - Element: Earth
   - Ruling Planet: Venus
   - Accent Color: #4CAF50 (Green)
   - Description: Reliable, patient, and practical builder
   - Dates: Apr 20 – May 20

5. **Virgo (👑)** - The Maiden
   - Symbol: ♍
   - Element: Earth
   - Ruling Planet: Mercury
   - Accent Color: #8BC34A (Light Green)
   - Description: Analytical, helpful, and detail-oriented
   - Dates: Aug 23 – Sep 22

6. **Capricorn (🐐)** - The Goat
   - Symbol: ♑
   - Element: Earth
   - Ruling Planet: Saturn
   - Accent Color: #607D8B (Blue Grey)
   - Description: Responsible, disciplined, and self-controlled
   - Dates: Dec 22 – Jan 19

### Air Signs - Intellectual & Social
7. **Gemini (👯‍♂️)** - The Twins
   - Symbol: ♊
   - Element: Air
   - Ruling Planet: Mercury
   - Accent Color: #00BCD4 (Cyan)
   - Description: Curious, adaptable, and communicative
   - Dates: May 21 – Jun 20

8. **Libra (⚖️)** - The Scales
   - Symbol: ♎
   - Element: Air
   - Ruling Planet: Venus
   - Accent Color: #9C27B0 (Purple)
   - Description: Diplomatic, fair-minded, and social
   - Dates: Sep 23 – Oct 22

9. **Aquarius (🏺)** - The Water Bearer
   - Symbol: ♒
   - Element: Air
   - Ruling Planet: Uranus
   - Accent Color: #03A9F4 (Light Blue)
   - Description: Progressive, original, and independent
   - Dates: Jan 20 – Feb 18

### Water Signs - Emotional & Intuitive
10. **Cancer (🦀)** - The Crab
    - Symbol: ♋
    - Element: Water
    - Ruling Planet: Moon
    - Accent Color: #2196F3 (Blue)
    - Description: Intuitive, protective, and nurturing
    - Dates: Jun 21 – Jul 22

11. **Scorpio (🦂)** - The Scorpion
    - Symbol: ♏
    - Element: Water
    - Ruling Planet: Mars
    - Accent Color: #673AB7 (Deep Purple)
    - Description: Passionate, brave, and mysterious
    - Dates: Oct 23 – Nov 21

12. **Pisces (🐟)** - The Fish
    - Symbol: ♓
    - Element: Water
    - Ruling Planet: Neptune
    - Accent Color: #3F51B5 (Indigo)
    - Description: Artistic, intuitive, and gentle
    - Dates: Feb 19 – Mar 20

## Design Implementation Guidelines

### Symbol Usage Rules
1. **Primary Display**: Use the emoji (🐏, 🐂, etc.) for main UI elements
2. **Secondary Display**: Use the Unicode symbol (♈, ♉, etc.) for compact displays
3. **Consistent Sizing**:
   - Large: 32sp for card headers and main displays
   - Medium: 24sp for selector buttons and lists
   - Small: 16sp for inline text and metadata

### Color Application
- **Background Accents**: Use accent color with 20% opacity for backgrounds
- **Border Highlights**: Use accent color with 40% opacity for borders
- **Active States**: Use full accent color for selected/active elements
- **Text Colors**: Use accent color for emphasized text elements

### Accessibility Standards
- All symbols must maintain 4.5:1 contrast ratio against backgrounds
- Provide text alternatives for screen readers
- Use both emoji and text descriptions for comprehensive accessibility

### Animation Guidelines
- **Scale Animations**: 1.0 → 1.2 → 1.0 for selection feedback
- **Color Transitions**: 300ms duration with easing for accent color changes
- **Opacity Effects**: Use for hover/press states with accent colors

## Technical Implementation

### Constants Structure
```typescript
{
  emoji: string;        // Primary visual symbol
  symbol: string;       // Unicode astrological symbol
  name: string;         // Display name
  dateRange: string;    // Date range text
  element: string;      // Fire, Earth, Air, Water
  rulingPlanet: string; // Astrological ruling planet
  accent: string;       // Hex color code
  description: string;  // Character description
}
```

### Usage Examples
- **Sign Cards**: Show emoji + name + description
- **Sign Selectors**: Show emoji + name in horizontal scroll
- **Profile Display**: Show emoji + name + element + ruling planet
- **Compatibility**: Show both emojis with accent color backgrounds

## Quality Standards
1. **Emoji Consistency**: All emojis must render clearly on iOS and Android
2. **Color Harmony**: Accent colors follow Material Design principles
3. **Cultural Sensitivity**: Symbols respect astrological traditions
4. **Brand Alignment**: Maintains mystical, premium app aesthetic

## Future Considerations
- Custom SVG icons for enhanced brand consistency
- Animated symbol variations for premium features
- Seasonal color variants for special events
- Accessibility improvements with custom icon fonts

This symbol system is **LOCKED** and forms the foundation of the Salamene Horoscope app's visual identity.