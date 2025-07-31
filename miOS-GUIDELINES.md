# miOS Creation Protocol

**This document serves as the canonical reference for all development on miOS. Any AI or developer working on this project must adhere to these principles.**

## 1. Philosophy

miOS is a living personal brain/OS. Every UI element, interaction, sound, and animation has intent. Evoke nostalgia (classic macOS Aqua, early polished OSes) while feeling crisp and slightly futuristic.

- Design is warm, tactile, with subtle depth (shadows, layered interfaces), pleasing micro-interactions, and responsive feedback.
- Default theme is "old macOS Aqua": soft translucent bars, rounded corners (2xl), vibrant but restrained accent colors, glossy highlight touches, smooth typography.

## 2. Technical Constraints

- **Entirely client-side.** Use localStorage or indexedDB for persistence. No server calls except optionally for AI later.
- **Stack:** Vite + React + TypeScript + Tailwind CSS.
- **State management:** via Zustand. Keep stores small, composable, and serializable.
- **Accessibility:** and keyboard navigation should be considered by default (focus outlines, aria labels, escape to close windows, cmd/ctrl usage for common actions).

## 3. Design & UI Rules

- **Global layout:** desktop background, top menu bar (macOS-style), window system with title bar, close/minimize, and z-ordering. Include subtle window shadows and layering.
- **Consistent elements:** Use consistent spacing, font hierarchy, and micro-animations (fade in/out, scale on click lightly, hover glows) without specifying heavy libraries—implement lightweight transitions manually (CSS transitions or Framer Motion later).
- **Theme system:** Provide theme fallback and easy extension for future themes.

## 4. Interaction Rules

- **Sound feedback:** Every actionable element has a sound: open, close, click, error, hover (optional subtle), inspired by classic Aqua/system sounds but tasteful (no harsh noises). Preload sounds and debounce repeated plays appropriately.
- **Window focus:** brings it to front, with a visual highlight on active window border/title.
- **Desktop icons:** are draggable, support multi-select with click-drag rectangle, and clicking is primary action to open apps.
- **Custom context menus:** Override browser right-click menus with miOS-styled context menus throughout the system.

## 5. Extensibility

- **App architecture:** Each app is a React component plugged into the WindowManager. Apps register themselves declaratively into a central app registry with metadata (name, icon, default size, initial content).
- **Command palette:** Provide command palette (Cmd+Space) to open apps via keyboard.
- **Multi-select:** Icons can be selected individually or via drag rectangle, moved as groups.

## 6. OS Completeness Requirements

- **Everything is interactive:** All elements respond to mouse/keyboard interaction with appropriate feedback.
- **Real desktop behavior:** Click-drag selection, multi-select icons, drag to reposition, double-click to open.
- **Window management:** Full drag/resize/focus/close/minimize functionality with keyboard shortcuts.
- **Custom context menus:** Right-click shows miOS menus, not browser defaults.
- **System-wide shortcuts:** Esc to close, Cmd+W to close focused window, Cmd+Space for launcher.

## 7. Fallback Principles

- If any behavior or detail is not specified, infer from high quality examples: classic macOS Human Interface Guidelines (Aqua look), ryOS behavior, and modern best practices in small modular UI systems.
- Strive for clarity, performance, and minimal jank. Lazy load non-critical pieces but keep initial interactions instant.

## Core Architecture Requirements

### State Management
- **Windows store:** each window has id, title, appKey, position, size, open/closed, zIndex, minimized state.
- **System settings store:** theme, wallpaper choice, volume/mute toggle, time, UI preferences.
- **Desktop store:** icon positions, selection state, drag operations.
- **File system store:** entities with name, type (file/folder), content, created/updated timestamps, path. Persist everything to localStorage on change with debounced sync.

### Component Structure
- **Desktop:** Fullscreen component with animated wallpaper, icon management, selection rectangle, context menu.
- **WindowManager:** Handles all window rendering, dragging, resizing, focus management.
- **MenuBar:** macOS-style top bar with system indicators, live clock, and dropdown menus.
- **Apps:** Self-contained React components that register with the system.

### Core System Apps (Required)
- **Finder/Explorer:** File and folder browser with navigation
- **TextEdit:** Markdown editor with live preview
- **MacPaint:** Simple pixel/canvas painting with brush and tools
- **Videos:** YouTube playlist player with retro VCR frame
- **iPod:** Music/video player with click-wheel control
- **Soundboard:** Load and play audio snippets
- **Synth:** Basic synthesizer with oscillators and filters
- **Photo Booth:** Webcam capture with filters and gallery
- **Terminal:** Shell interface with commands and AI agent placeholder
- **Minesweeper:** Classic game with grid and logic
- **Virtual PC:** Emulator placeholder with boot screen
- **Settings:** System preferences and configuration

### Sound System
- Load retro-style UI sounds from generated tones
- Sound manager hook/service to play named sounds
- Trigger sounds on all major interactions

### Theming
- Default "Aqua Classic" theme with light backgrounds, subtle gradients, accent colors
- Theme switcher capability for dark/alternate themes
- All theme values defined in Tailwind config

## Performance & Quality Standards

- Keep code modular; avoid giant components
- Each logical feature lives in its own file with clear props/types
- TypeScript interfaces must be defined for all major data structures
- Maintain 60fps animations and instant response to user interactions
- Lazy load non-critical components but keep core interactions instant

---

*This protocol is the foundation of miOS. All features, enhancements, and modifications must respect these principles to maintain the system's coherence and vision.*