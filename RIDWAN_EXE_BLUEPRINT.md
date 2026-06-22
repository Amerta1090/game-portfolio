# RIDWAN.EXE — Production Blueprint & Sprint Plan

---

## 1. Executive Summary

**RIDWAN.EXE** transforms a traditional portfolio website into an immersive pseudo-3D exploration game. Visitors navigate a Persona 4-inspired world where each room represents a facet of Abdul Majid Ridwan's career. Through exploration, interaction, and mini-games, visitors discover who Ridwan is rather than passively reading a resume.

**Target completion:** 12-14 weeks (solo developer)
**Tech:** Astro + React + Three.js + Tailwind CSS + Framer Motion
**Core metric:** Time-on-site > 5 minutes, completion rate > 40%

---

## 2. Core Vision

> *"Make visitors feel like they've explored a person, not read a resume."*

- **Tone:** Mysterious, polished, retro-futuristic
- **Vibe:** PS2 title screen meets brutalist yellow design
- **Philosophy:** Every interaction teaches something about Ridwan
- **Constraint:** Must feel complete even with only 3 rooms implemented initially

---

## 3. Product Blueprint

### 3.1 User Journey Map

```
Entry → Title Screen (press Start)
  → Lobby (hub world, choose door)
    → Identity Core (profile)
    → Skill Chamber (skills) 
    → Project Lab (projects)
    → Career Timeline Hall (experience)
    → Achievement Gallery (certs/honors)
    → Hidden Final Room (additional info)
  → Credits / Resume Download
```

### 3.2 Key Features by Priority

**MVP (Sprints 1-4):**
- Title Screen with "Press Start" animation
- Lobby hub with 3 explorable rooms
- WASD movement in pseudo-3D space
- Basic interaction prompts (E key)
- Identity Core Room (profile.json)
- Skill Chamber (skills.json)
- Project Lab (2-3 projects)
- 1 mini-game (Skill Constellation)
- HUD overlay with room name, controls hint
- Sound design placeholder (ambient loop)

**V2 (Sprints 5-6):**
- Career Timeline Hall
- Achievement Gallery
- 2 additional mini-games
- Save/load progress (localStorage)
- Room transition animations
- Full project list

**V3 (Post-launch):**
- Hidden Final Room
- Final narrative sequence
- Resume download + contact sheet unlock
- Achievement system
- Easter eggs

### 3.3 Success Metrics

| Metric | Target |
|---|---|
| Time on site | > 5 min |
| Room completion rate | > 60% |
| Mini-game completion | > 40% |
| Resume download | > 15% of visitors |
| Return visits | > 10% |

---

## 4. Game Design Document

### 4.1 Title Screen

**Visual:**
- Black screen with scanline overlay
- "RIDWAN.EXE" in yellow bold font (centered)
- Subtle particle effect or glitch animation
- "Press ENTER to start" blinking at bottom
- After ENTER → fade to lobby

**Audio:** Low hum → rising synth chord on press

### 4.2 Lobby (Hub World)

**Visual:**
- Pseudo-3D room with hexagonal/brutalist architecture
- Doors on each wall labeled: Identity, Skills, Projects, Career, Achievements
- One door is cracked/hidden (secret room)
- Yellow accent lighting, concrete textures
- Subtle ambient floating particles

**Interactions:**
- Walk up to door → press E → enter room
- Each door shows lock/key icon (locked until condition met)
- HUD shows: room name, key fragments collected, controls hint

### 4.3 Progression Gates

- **Career Hall** unlocks after completing 2 mini-games
- **Achievement Gallery** unlocks after visiting 4 rooms
- **Hidden Room** unlocks after finding 3 lore fragments + all mini-games completed

### 4.4 Room Map

```
┌─────────────────────────────────────────┐
│           TITLE SCREEN                  │
│         "Press ENTER to Start"          │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│               LOBBY                     │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌─────┐│
│  │Identity│  │Skills│  │Proj.│  │Career││
│  │  Core  │  │Chamb.│  │ Lab  │  │ Hall ││
│  └──────┘  └──────┘  └──────┘  └─────┘│
│               ┌──────────┐              │
│               │Achieve.  │              │
│               │Gallery   │              │
│               └──────────┘              │
│               [Hidden] ← secret door    │
└─────────────────────────────────────────┘
```

---

## 5. World Architecture

### 5.1 Room Specifications

#### 5.1.1 Identity Core Room
- **Data:** profile.json
- **Size:** Medium (20x20 units)
- **Atmosphere:** Warm yellow glow, data-terminal aesthetic
- **Objects:** 3 identity terminals, floating text fragments, central pedestal
- **Interactions:**
  - Terminal 1: Name, role, tagline — displayed as boot sequence
  - Terminal 2: Bio + metrics — scrolling text reveal
  - Terminal 3: Contact info — glitch-effect decryption
- **Mini-game:** *Identity Fragment Reconstruct* — Arrange scrambled bio fragments in correct order
- **Unlock reward:** Key Fragment #1 + Profile access

#### 5.1.2 Skill Chamber
- **Data:** skills.json
- **Size:** Large (30x30 units)
- **Atmosphere:** Dark blue/purple with floating skill nodes, constellation aesthetic
- **Objects:** 8 category pedestals, skill node projectors, connection lines
- **Interactions:**
  - Approach category → skill list projects as hologram
  - Click skill node → shows proficiency bar + brief description
- **Mini-game:** *Skill Constellation* — Connect related skills to form valid paths (graph connection puzzle)
- **Unlock reward:** Key Fragment #2

#### 5.1.3 Project Lab
- **Data:** projects.json
- **Size:** Large (30x30 units)
- **Atmosphere:** Industrial lab — concrete, exposed pipes, monitor banks
- **Objects:** Project stations (one per featured project), central console
- **Interactions:**
  - Station shows: title, tech stack, period, description
  - "View Details" button → expands into full project overlay
  - Featured projects glow brighter
- **Mini-game:** *Code Debug* — Find the syntax/logic error in a simplified code block within time limit
- **Unlock reward:** Key Fragment #3

#### 5.1.4 Career Timeline Hall
- **Data:** experience.json + volunteering.json
- **Size:** Long corridor (15x60 units)
- **Atmosphere:** Timeline lights along walls, each role is a checkpoint
- **Objects:** Timeline pillars with dates, interactive milestone displays
- **Interactions:**
  - Walk along timeline → pillars light up sequentially
  - Each pillar shows: company, role, period, highlights
  - Volunteering shown as side branch
- **Mini-game:** *Chronological Order* — Drag roles into correct timeline order
- **Unlock reward:** Key Fragment #4

#### 5.1.5 Achievement Gallery
- **Data:** certifications.json, licenses_certifications.json, honors.json
- **Size:** Large hall (35x35 units)
- **Atmosphere:** Trophy room — display cases, certificate frames on walls
- **Sections:**
  - Certifications Wall — scrolling grid of cert tiles
  - Honors Showcase — 3 pedestals with awards
  - Credential Vault — detailed license view
- **Mini-game:** *Memory Match* — Match certification logos/issuers to titles
- **Unlock reward:** Key Fragment #5

#### 5.1.6 Hidden Final Room
- **Data:** additional_info.json
- **Size:** Small intimate room (15x15 units)
- **Atmosphere:** Warm, personal — desk with lamp, personal artifacts, window
- **Interactions:**
  - Journal entries (lore fragments)
  - Final terminal with personal message
  - Contact card unlock
- **No mini-game** — narrative payoff room
- **Reward:** Full profile reveal + resume download + contact sheet

### 5.2 Room Transition System

```
Lobby → [Walk to door, press E]
  → Cinematic fade (0.5s)
  → Loading overlay (1-2s max, only if assets needed)
  → Room loaded
  → Player spawns at room entrance
  → [Walk to exit door]
  → Cinematic fade back to Lobby
```

All transitions use a shared `<RoomTransition>` component:
- Fade-to-black with yellow border animation
- Room name displayed in large typewriter font
- Optional: portal-style swirl effect for secret rooms

---

## 6. Gameplay Systems

### 6.1 Movement System

**Input:**
- WASD / Arrow keys — move forward/back/strafe
- Mouse — look left/right (y-axis locked, semi-fixed camera)
- E — interact
- ESC — pause menu / cursor unlock

**Camera:**
- Third-person, fixed behind player
- Camera distance: 5 units behind, 2 units up
- Smooth lerp follow (not physics-based)
- On interaction → camera gently focuses on object

**Collision:**
- Simple AABB collision with room boundaries
- No physics engine needed — manual boundary checks
- Objects use invisible collision boxes

**Implementation:**
- Player: `THREE.Mesh` with capsule collider
- Movement: `requestAnimationFrame` loop in `useFrame`
- Input: `useKeyboard` custom hook (keydown/keyup map)

### 6.2 Interaction System

**Prompt:**
- When player is within 3 units of interactable object:
  - Subtle highlight glow on object
  - "Press E" tooltip appears (CSS overlay, not 3D text)
- Pressing E triggers `onInteract` handler

**Object Model:**
```typescript
interface InteractableObject {
  id: string;
  position: THREE.Vector3;
  type: 'terminal' | 'door' | 'node' | 'pedestal' | 'fragment';
  data: any; // reference to JSON data
  onInteract: () => void;
  isLocked: boolean;
}
```

### 6.3 Key Fragment System

- 5 key fragments total (one per mini-game completion)
- Displayed in HUD as 5 yellow hexagonal shards
- When all 5 collected → secret room door unlocks
- Progress persists in localStorage

### 6.4 HUD System

**Components (React + Tailwind + Framer Motion):**

```
┌──────────────────────────────────────┐
│  RIDWAN.EXE    Identity Core  ⬡⬡⬡⬡⬡ │  ← Top bar: game title, room name, fragments
│                                      │
│                                      │
│              [3D WORLD]              │
│                                      │
│                                      │
│         ⬛ [E] Interact              │  ← Context prompt
│                                      │
│  WASD Move | E Interact              │  ← Bottom bar: controls
└──────────────────────────────────────┘
```

- Top bar: Animate on room entry, semi-transparent
- Bottom bar: Fades out after 5s of no movement, reappears on keypress
- Interaction prompt: Appears/disappears with spring animation

### 6.5 Pause Menu

**ESC overlay:**
- Resume
- Controls (keyboard layout)
- Save Progress (manual save)
- Return to Title
- Optional: Settings (music volume, SFX volume)

### 6.6 Save System

**Strategy:** localStorage only (no backend)

```typescript
interface SaveData {
  version: number;
  timestamp: string;
  completedRooms: string[];
  collectedFragments: string[];
  miniGameScores: Record<string, number>;
  unlockedSecretRoom: boolean;
  hasCompletedGame: boolean;
  settings: {
    musicVolume: number;
    sfxVolume: number;
  };
}
```

- Auto-save on room entry/exit
- Manual save in pause menu
- Load on title screen "Continue" option (if save exists)

---

## 7. Technical Blueprint

### 7.1 Architecture Overview

```
┌──────────────────────────────────────────────────┐
│                    Astro SSG                       │
│  (Routing, Layout, Island Architecture)            │
├──────────────────────────────────────────────────┤
│                   React Islands                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │  Title    │ │   HUD    │ │   Mini-Game UI    │  │
│  │  Screen   │ │  System  │ │   Components      │  │
│  └──────────┘ └──────────┘ └──────────────────┘  │
│  ┌──────────────────────────────────────────────┐ │
│  │        Three.js / React Three Fiber           │ │
│  │  (3D World Renderer, Camera, Lighting,        │ │
│  │   Room Scenes, Player Controller)             │ │
│  └──────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────┤
│              State Management (Zustand)            │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │  Game     │ │   Room   │ │   Progress Store  │  │
│  │  State    │ │  State   │ │   (localStorage)   │  │
│  └──────────┘ └──────────┘ └──────────────────┘  │
├──────────────────────────────────────────────────┤
│              Data Layer (TypeScript)               │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │  JSON     │ │  Type    │ │   Data Loader     │  │
│  │  Sources  │ │Defs      │ │   (import.meta)   │  │
│  └──────────┘ └──────────┘ └──────────────────┘  │
└──────────────────────────────────────────────────┘
```

### 7.2 Astro Integration Strategy

- **3D pages** (Title, Lobby, each Room): Astro pages with client:only React island for the Three.js canvas
- **2D pages** (resume download, fallback): Standard Astro pages with React components
- **Data**: JSON files imported at build time via `Astro.glob()`
- **No SSR** needed — fully static export

### 7.3 Three.js Usage Boundaries

| Feature | Tech | Reason |
|---|---|---|
| World rendering | Three.js/R3F | 3D rooms, lighting, objects |
| Player movement | R3F + useFrame | Low-level control |
| Camera system | R3F | Semi-fixed third-person |
| Room transitions | Framer Motion + CSS | Cheaper, smoother |
| All UI overlays | React + Tailwind | Maintainable, accessible |
| Mini-games | React + Framer Motion | Far cheaper to build/iterate |
| Particles (ambient) | Three.js Points | Performance-friendly |
| Menu screens | React + Tailwind | No 3D needed for 2D UI |

### 7.4 Performance Budget

| Asset | Budget |
|---|---|
| 3D model poly count per room | < 5,000 tris |
| Texture size | 1024x1024 max |
| Total JS bundle | < 500 KB (gzip) |
| Three.js bundle | Lazy-loaded, not in main chunk |
| FPS target | 30+ on mid-range mobile |
| Initial load time | < 3s on 3G |

---

## 8. Frontend Architecture

### 8.1 Component Tree

```
App
├── TitleScreen (React island)
│   ├── ScanlineOverlay (CSS)
│   ├── TitleText (Framer Motion)
│   └── StartPrompt (blinking animation)
├── GameCanvas (Three.js / R3F) — client:only
│   ├── Scene
│   │   ├── Lighting (ambient + directional + point)
│   │   ├── Player (capsule mesh, invisible)
│   │   └── Room(active)
│   │       ├── Walls / Floor / Ceiling
│   │       ├── InteractableObjects[]
│   │       │   ├── Terminal
│   │       │   ├── Door
│   │       │   ├── Node
│   │       │   └── Fragment
│   │       └── AmbientParticles
│   ├── CameraController
│   └── PlayerController
├── HUD (React island)
│   ├── TopBar
│   │   ├── GameTitle
│   │   ├── RoomName
│   │   └── FragmentDisplay
│   ├── InteractionPrompt
│   └── BottomBar (controls hint)
├── PauseMenu (React overlay)
├── DialogOverlay (React — mini-games, info panels)
│   ├── MiniGameContainer
│   │   ├── IdentityReconstruct
│   │   ├── SkillConstellation
│   │   ├── CodeDebug
│   │   ├── TimelineOrder
│   │   └── MemoryMatch
│   └── InfoPanel (project details, cert list, etc.)
└── TransitionOverlay (Framer Motion — room transitions)
```

### 8.2 State Management (Zustand)

```typescript
// Stores:

// gameStore.ts — Global game state
interface GameState {
  screen: 'title' | 'lobby' | 'room' | 'pause';
  activeRoom: string | null;
  setScreen: (s) => void;
  setActiveRoom: (r) => void;
}

// playerStore.ts — Player position/rotation
interface PlayerState {
  position: THREE.Vector3;
  rotation: number;
  moveTo: (pos) => void;
  rotateTo: (rot) => void;
}

// progressStore.ts — Persisted game progress
interface ProgressState {
  fragments: string[];
  completedRooms: string[];
  visitedRooms: string[];
  miniGameScores: Record<string, number>;
  addFragment: (id) => void;
  completeRoom: (id) => void;
  save: () => void;
  load: () => void;
}

// interactionStore.ts — Current interaction context
interface InteractionState {
  activeObject: InteractableObject | null;
  isInteracting: boolean;
  setActiveObject: (obj) => void;
  setInteracting: (bool) => void;
}
```

### 8.3 Data Pipeline

```
JSON files in /data/
  → Validated at build time via Zod schemas
  → Imported via Astro.glob() into TypeScript types
  → Transformed into game-ready data (rooms, objects, nodes)
  → Consumed by React components and Three.js scene builders
```

---

## 9. Folder Structure

```
game-porto/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── tailwind.config.mjs
├── data/
│   ├── profile.json
│   ├── skills.json
│   ├── projects.json
│   ├── experience.json
│   ├── certifications.json
│   ├── licenses_certifications.json
│   ├── honors.json
│   ├── volunteering.json
│   └── additional_info.json
├── public/
│   ├── favicon.ico
│   ├── fonts/
│   │   └── (custom retro font, self-hosted)
│   ├── audio/
│   │   ├── bgm-title.mp3
│   │   ├── bgm-lobby.mp3
│   │   ├── bgm-identity.mp3
│   │   ├── bgm-skills.mp3
│   │   ├── bgm-projects.mp3
│   │   ├── sfx-interact.mp3
│   │   ├── sfx-unlock.mp3
│   │   ├── sfx-door.mp3
│   │   └── sfx-transition.mp3
│   └── textures/
│       ├── concrete.jpg
│       ├── grid.png
│       └── scanline.png
└── src/
    ├── env.d.ts
    ├── types/
    │   ├── game.ts          # Game-specific types
    │   ├── data.ts           # Data source Zod schemas
    │   └── index.ts          # Re-exports
    ├── data/
    │   └── loader.ts         # Data loading + validation
    ├── game/
    │   ├── stores/
    │   │   ├── gameStore.ts
    │   │   ├── playerStore.ts
    │   │   ├── progressStore.ts
    │   │   └── interactionStore.ts
    │   ├── systems/
    │   │   ├── MovementSystem.ts
    │   │   ├── InteractionSystem.ts
    │   │   ├── TransitionSystem.ts
    │   │   └── SaveSystem.ts
    │   └── constants.ts
    ├── components/
    │   ├── game/
    │   │   ├── GameCanvas.astro       # Astro wrapper for 3D
    │   │   ├── GameCanvas.tsx         # R3F Canvas setup
    │   │   ├── Scene.tsx              # Scene root, lighting
    │   │   ├── Player.tsx             # Player mesh + controller
    │   │   ├── CameraController.tsx
    │   │   └── InteractableObject.tsx # Generic interactable
    │   ├── rooms/
    │   │   ├── Lobby.tsx              # Hub world
    │   │   ├── IdentityCore.tsx       # Room 1
    │   │   ├── SkillChamber.tsx       # Room 2
    │   │   ├── ProjectLab.tsx         # Room 3
    │   │   ├── CareerHall.tsx         # Room 4
    │   │   ├── AchievementGallery.tsx # Room 5
    │   │   └── HiddenRoom.tsx         # Room 6
    │   ├── ui/
    │   │   ├── HUD.tsx
    │   │   ├── TopBar.tsx
    │   │   ├── BottomBar.tsx
    │   │   ├── InteractionPrompt.tsx
    │   │   ├── PauseMenu.tsx
    │   │   ├── DialogOverlay.tsx
    │   │   ├── InfoPanel.tsx
    │   │   ├── TransitionOverlay.tsx
    │   │   └── FragmentDisplay.tsx
    │   ├── minigames/
    │   │   ├── IdentityReconstruct.tsx
    │   │   ├── SkillConstellation.tsx
    │   │   ├── CodeDebug.tsx
    │   │   ├── TimelineOrder.tsx
    │   │   └── MemoryMatch.tsx
    │   └── screens/
    │       ├── TitleScreen.tsx
    │       └── CreditsScreen.tsx
    ├── layouts/
    │   ├── BaseLayout.astro
    │   └── GameLayout.astro          # Canvas + HUD wrapper
    ├── pages/
    │   ├── index.astro               # Title screen route
    │   ├── game.astro                # Lobby (main game entry)
    │   ├── game/
    │   │   ├── identity.astro
    │   │   ├── skills.astro
    │   │   ├── projects.astro
    │   │   ├── career.astro
    │   │   ├── achievements.astro
    │   │   └── hidden.astro
    │   ├── resume.astro              # Text resume fallback
    │   └── 404.astro
    ├── styles/
    │   ├── global.css                # Base styles, fonts
    │   └── game.css                  # Scanlines, CRT effects
    └── utils/
        ├── keyboard.ts               # useKeyboard hook
        ├── collision.ts              # AABB helpers
        ├── audio.ts                  # Audio manager
        └── formatters.ts             # Date, text formatting
```

---

## 10. Mini-Games Design

### 10.1 Identity Fragment Reconstruct
- **Room:** Identity Core
- **Type:** Drag-and-drop ordering puzzle
- **Scenario:** System boot sequence scrambled — reorder bio fragments
- **Mechanics:** 6 scrambled text fragments → drag into correct order
- **Time limit:** None (exploration-focused)
- **Feedback:** Correct placement snaps with yellow glow, wrong bounces back
- **Completion:** Fragment glows, terminal unlocks

### 10.2 Skill Constellation
- **Room:** Skill Chamber
- **Type:** Graph connection puzzle
- **Scenario:** Connect related skill nodes to form valid "skill trees"
- **Mechanics:** 8-10 skill nodes displayed, draw connections between related skills
- **Logic:** Pre-defined valid connections (e.g., ML → Python, IoT → Embedded)
- **Feedback:** Correct connections light up, wrong ones fade
- **Completion:** Full constellation glows + key fragment awarded

### 10.3 Code Debug
- **Room:** Project Lab
- **Type:** Find-the-bug puzzle
- **Scenario:** "System build failed — find and fix the error"
- **Mechanics:** 4-6 line code snippet displayed, one line has a syntax/logic error
- **Difficulty:** Very easy (e.g., missing semicolon, wrong variable name)
- **Feedback:** Correct fix → "Build successful" animation
- **Completion:** Terminal screen shows project success stats

### 10.4 Timeline Order
- **Room:** Career Hall
- **Type:** Chronological sorting
- **Scenario:** "System timeline corrupted — restore correct order"
- **Mechanics:** Role cards scattered — drag into chronological order
- **Feedback:** Correct position snaps, wrong bounces
- **Completion:** Timeline lights up from start to finish

### 10.5 Memory Match
- **Room:** Achievement Gallery
- **Type:** Card matching
- **Scenario:** "Verify credentials — match certs to issuers"
- **Mechanics:** Grid of facedown cards, match cert titles to their issuers
- **Grid:** 4x4 (8 pairs)
- **Feedback:** Match → yellow glow → card stays revealed
- **Completion:** Gallery fully illuminated

### Mini-Game Design Principles
- Each takes 30-90 seconds to complete
- No fail states (can retry infinitely)
- Rewards key fragment on first completion
- Designed to be intuitive, no instructions needed
- Visual feedback is king — animations communicate state

---

## 11. Performance Strategy

### 11.1 Three.js Optimization
- **Geometry merging** — static room meshes merged into single geometry
- **Texture atlasing** — all room textures in one atlas
- **Low poly aesthetic** — intentional PS2-style low poly (covers performance)
- **Instanced mesh** for repeated objects (nodes, terminals)
- **Frustum culling** — default R3F behavior, verify it's on
- **No real-time shadows** on mobile — baked lighting maps
- **LOD system** for complex objects if needed (unlikely at this poly budget)

### 11.2 Asset Loading
- **Lazy load rooms** — only load current room assets
- **Preload adjacent rooms** — when in lobby, pre-emptively load all rooms
- **Audio:** Howler.js with sprite sheets (single file, multiple cues)
- **Fonts:** System font stack with optional custom font (self-hosted, woff2)

### 11.3 Bundle Strategy
- **Code splitting** — each room is a dynamic import
- **Three.js** — loaded as separate chunk (not in main bundle)
- **R3F** — loaded only on game pages (not on resume/404)
- **Framer Motion** — tree-shakeable, only used features included

### 11.4 Rendering Targets
| Device | Quality | Shadows | Post-processing |
|---|---|---|---|
| Desktop (GPU) | High | On | Bloom, scanline |
| Mobile (GPU) | Medium | Off | Scanline only |
| Mobile (low-end) | Low | Off | Off (CSS scanline) |

All configurable via `performance.ts` module:
```typescript
const quality = detectPerformanceTier(); // 'low' | 'medium' | 'high'
```

### 11.5 Memory Management
- Dispose Three.js geometries/materials on room unload
- Audio pool: max 6 simultaneous SFX channels
- Keep a cache of loaded room data (max 3 rooms)
- Use `React.memo` + `useMemo` for UI components

---

## 12. Accessibility

### 12.1 Core Requirements
- **Keyboard navigation** — full game playable with keyboard only (no mouse needed for movement)
- **Screen reader support** — alt text for all game elements, ARIA labels on UI
- **Color contrast** — Yellow (#FFD700) on dark (#1A1A1A) exceeds WCAG AA
- **Reduced motion** — `prefers-reduced-motion` disables non-essential animations
- **Text scaling** — All UI uses relative units (rem)

### 12.2 Specific Implementations
- **Title Screen** — "Skip to content" link immediately available
- **HUD** — All elements have `role="status"` or `aria-live="polite"`
- **Room transitions** — `aria-hidden` during animation
- **Interaction prompts** — `aria-label` describes the action
- **Mini-games** — Can be completed with keyboard only
- **Pause menu** — Focus trap with Escape to close
- **Fallback route** — `/resume` page is fully accessible text-based portfolio

### 12.3 Game-Specific Accessibility
- Movement can be swapped to numpad if preferred
- Interaction distance increased for ease of use
- No time-limited puzzles that lock content (mini-games are retryable)
- All information revealed through gameplay is also available on `/resume`

---

## 13. Sprint Planning

**Total duration:** 14 weeks
**Sprint length:** 2 weeks
**Team:** Solo developer

### Sprint 1: Foundation (Weeks 1-2)
**Goal:** Project scaffold, data pipeline, title screen

- [ ] Initialize Astro + React + TypeScript + Tailwind
- [ ] Set up R3F + Three.js with basic canvas
- [ ] Define all TypeScript types from JSON schemas (Zod)
- [ ] Create data loader module
- [ ] Implement Title Screen (React + Framer Motion)
- [ ] Set up Zustand stores (game, player, progress, interaction)
- [ ] Create GameLayout.astro (canvas + HUD shell)
- [ ] Basic audio manager (placeholder tones)
- [ ] Deploy to Cloudflare Pages (CI/CD)

**Milestone:** Title screen working. Press ENTER → console log "Start game"

### Sprint 2: Movement + Lobby (Weeks 3-4)
**Goal:** Player can move in 3D space, lobby room built

- [ ] Implement WASD movement + semi-fixed camera
- [ ] Player collision detection (AABB with room boundaries)
- [ ] Lobby 3D scene: floor, walls, doors (placeholder art)
- [ ] Door interactables with highlight + "Press E" prompt
- [ ] HUD: TopBar + BottomBar
- [ ] Room transition system (fade overlay)
- [ ] Interaction system: detect nearby objects, show prompt
- [ ] Basic lighting: ambient + directional (yellow tint)

**Milestone:** Player walks around lobby, approaches doors, presses E → fade transition

### Sprint 3: Identity Core Room (Weeks 5-6)
**Goal:** First room fully playable

- [ ] Identity Core 3D scene (terminals, pedestal, warm lighting)
- [ ] Terminal interactions: boot sequence, bio reveal, contact display
- [ ] Identity Fragment mini-game (drag-and-drop bio ordering)
- [ ] Metrics display (years exp, projects, certs)
- [ ] Mini-game completion → fragment awarded
- [ ] Key Fragment display in HUD
- [ ] Room-specific audio (bgm-identity)

**Milestone:** Player enters Identity Core, interacts with terminals, completes mini-game, gets fragment

### Sprint 4: Skill Chamber + Project Lab (Weeks 7-8)
**Goal:** Two more rooms + their mini-games

- [ ] Skill Chamber 3D scene (constellation aesthetic, dark blue)
- [ ] Skill node holograms and connection lines
- [ ] Skill Constellation mini-game (graph connections)
- [ ] Project Lab 3D scene (industrial, monitors)
- [ ] Project station terminals (featured projects)
- [ ] Code Debug mini-game (find the bug)
- [ ] InfoPanel component (full project details overlay)
- [ ] Data-driven: all projects from projects.json

**Milestone:** 3 rooms playable, 3 mini-games completable

### Sprint 5: Career Hall + Achievement Gallery (Weeks 9-10)
**Goal:** Remaining rooms + polish pass

- [ ] Career Hall 3D scene (timeline corridor)
- [ ] Timeline pillar interactions (company/role/highlights)
- [ ] Timeline Order mini-game (chronological sorting)
- [ ] Achievement Gallery 3D scene (trophy room)
- [ ] Certifications wall (scrolling grid)
- [ ] Honors showcase (3 pedestals with award data)
- [ ] Memory Match mini-game
- [ ] Progression gates: Career + Gallery locked until conditions met

**Milestone:** All 5 main rooms playable

### Sprint 6: Hidden Room + Polish (Weeks 11-12)
**Goal:** Secret room, narrative payoff, full game loop

- [ ] Hidden Room 3D scene (intimate, desk, lamp)
- [ ] Lore fragments (journal entries)
- [ ] Final terminal with personal message
- [ ] Contact card unlock
- [ ] Resume download button (revealed after completion)
- [ ] Credits screen
- [ ] Save/load system (localStorage)
- [ ] Continue option on title screen
- [ ] Pause menu (ESC)
- [ ] All room transitions polished

**Milestone:** Full game loop complete from title to credits

### Sprint 7: Performance + QA (Weeks 13-14)
**Goal:** Ship-ready polish

- [ ] Performance profiling + optimization pass
- [ ] Mobile testing + quality tier detection
- [ ] Asset optimization (textures, audio compression)
- [ ] Bundle analysis + code splitting verification
- [ ] Accessibility audit + fixes
- [ ] Keyboard navigation pass
- [ ] Screen reader testing
- [ ] Edge case handling (no localStorage, small viewport)
- [ ] Lighthouse audit (target: 80+ Performance, 90+ Accessibility)
- [ ] Bug bash + fix queue
- [ ] Final deploy to Cloudflare Pages

**Milestone:** Production-ready release

---

## 14. Risk Analysis

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Three.js performance on mobile | High | High | Low-poly aesthetic, performance tier detection, disable shadows/effects on low end |
| Scope creep — too many rooms | Medium | High | MVP = 3 rooms + lobby. V2 = remaining rooms. Strict sprint boundaries |
| Mini-games too complex to build | Medium | Medium | All mini-games are simplified versions. If behind schedule, ship without mini-games (rooms still explorable) |
| Audio licensing / creation | Low | Medium | Use royalty-free tracks (Free Music Archive, freesound.org). Simple 8-bit style sounds can be generated programmatically |
| Browser compatibility (Safari) | Medium | Medium | Test Safari WebGL early. R3F handles most polyfills. Fallback to non-3D portfolio page if WebGL unavailable |
| Solo developer burnout | Medium | High | Realistic sprint plan (14 weeks). MVP in 8 weeks. Can ship with 3 rooms if needed. Priority: working > complete |
| 3D motion sickness | Low | Medium | Semi-fixed camera (no free look up/down), smooth transitions, option to reduce camera movement |
| Data validation errors | Low | Low | Zod schema validation at build time catches mismatches. CI fails on invalid data |

### Fallback Plan
If at Sprint 4 the project is significantly behind:
1. Ship with Lobby + Identity Core + Skill Chamber only
2. Mini-games become optional (rooms still show data)
3. Hidden Room cut to post-launch
4. Text-based `/resume` remains fully functional as fallback

---

## 15. Future Expansion Plan

### Post-V1 Features (Priority Ordered)

1. **Analytics Integration** — Track room completion, mini-game stats, time spent (privacy-first, no cookies)
2. **Achievement System** — Steam-style achievement popups (e.g., "Speed Runner" — complete all rooms in < 5 min)
3. **Easter Eggs** — Hidden interactions, secret animations, developer jokes
4. **Multi-language Support** — i18n for room text content
5. **Ambient Soundscape** — Dynamic audio that changes per room and player position
6. **Day/Night Cycle** — Lobby lighting changes based on time of day
7. **Visitor Book** — Leave a message after completing the game (read-only, moderated)
8. **Gamepad Support** — Controller support for console-like experience
9. **AR Mode** — Experimental: view the lobby in AR via WebXR
10. **Speedrun Mode** — Timer overlay, leaderboard (local only)

### Content Updates
- New room: **Open Source Contributions** (GitHub activity)
- New room: **Writing & Blog** (if blog content exists)
- Seasonal events: Special room themes for holidays
- Guest mode: Shareable link to a specific room

### Technical Roadmap
- Investigate WebGPU for improved 3D performance (future browsers)
- Service worker for offline play (PWA)
- Image-based room generation from procedural templates (reduce manual 3D work)
- Component library for rapid room creation (drag-and-drop room builder internally)

---

## Appendix A: Data Flow Diagram

```
Build Time                                  Runtime
┌──────────────────────┐           ┌──────────────────────┐
│  data/*.json          │  import   │  Data Loader         │
│  ┌──────────────────┐ │ ────────→│  (Zod validate)      │
│  │ profile.json      │ │          │  ┌────────────────┐  │
│  │ skills.json       │ │          │  │ Typed data     │  │
│  │ projects.json     │ │          │  └────────────────┘  │
│  │ ...               │ │          │         │            │
│  └──────────────────┘ │          │         ▼            │
│                       │          │  ┌────────────────┐  │
│  Astro.glob()         │          │  │ Game State     │  │
│  → validate + type    │          │  │ (Zustand)      │  │
│  → generate pages     │          │  └────────────────┘  │
└──────────────────────┘          │    │         │        │
                                   │    ▼         ▼        │
                                   │ ┌──────┐ ┌──────────┐ │
                                   │ │3D    │ │ React UI │ │
                                   │ │World │ │ (HUD,    │ │
                                   │ │(R3F) │ │ Dialogs) │ │
                                   │ └──────┘ └──────────┘ │
                                   └──────────────────────┘
```

## Appendix B: Room Data Mapping

| Room | JSON Source | 3D Aesthetic | Mini-game | Reward |
|---|---|---|---|---|
| Identity Core | profile.json | Warm terminals, data banks | Fragment reconstruct | Key #1 |
| Skill Chamber | skills.json | Constellation, floating nodes | Connection puzzle | Key #2 |
| Project Lab | projects.json | Industrial, monitor banks | Code debug | Key #3 |
| Career Hall | experience.json + volunteering.json | Timeline corridor | Chronological order | Key #4 |
| Achievement Gallery | certifications.json + licenses_certifications.json + honors.json | Trophy room, frames | Memory match | Key #5 |
| Hidden Room | additional_info.json | Intimate desk + lamp | None (narrative) | Resume + contact |

## Appendix C: Dependency Map

```
Zustand stores
├── gameStore (no deps)
├── playerStore (no deps)
├── progressStore (depends on localStorage)
└── interactionStore (depends on Three.js raycasting)

Systems
├── MovementSystem (depends on playerStore, keyboard.ts)
├── InteractionSystem (depends on interactionStore, player position)
├── TransitionSystem (depends on gameStore, Framer Motion)
└── SaveSystem (depends on progressStore, localStorage)

Rooms
├── Each room imports: Scene layout, InteractableObject[], mini-game component
├── Mini-games import: DialogOverlay (shared), game-specific logic
└── All rooms import data from: src/data/loader.ts
```
