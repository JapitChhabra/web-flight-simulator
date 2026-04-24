# Web Flight Simulator

A lightweight web-based flight simulator that combines **CesiumJS** global terrain with **Three.js** cockpit/aircraft rendering.

This repository is a streamlined release focused on smooth spawn-to-flight gameplay, clean UI, and minimal runtime complexity.

## Overview

Web Flight Simulator lets you:
- Choose a spawn location anywhere on Earth
- Fly over real-world Cesium terrain and imagery
- Control a single F-15 aircraft with responsive arcade-style handling
- Use a minimal HUD for heading, speed, altitude, and coordinates

## Feature Set

- **Single-aircraft experience** (F-15 model)
- **Cesium world terrain** via Ion (`fromWorldTerrain`)
- **Spawn selection flow** (map click + optional search)
- **Core flight loop** (throttle, pitch, roll, yaw, boost)
- **Minimal audio** (engine, boost, spawn, crash, transition)
- **In-game settings** for:
  - Graphics quality
  - Anti-aliasing (FXAA)
  - Master audio toggle

## Tech Stack

- [Three.js](https://threejs.org/)
- [CesiumJS](https://cesium.com/platform/cesiumjs/)
- [Vite](https://vitejs.dev/)
- Vanilla JavaScript (ES modules)

## Getting Started

### 1) Prerequisites

- Node.js 18+
- npm
- A Cesium Ion access token

### 2) Install dependencies

```bash
npm install
```

### 3) Configure environment

Create a `.env.local` file in the project root:

```bash
VITE_CESIUM_ION_TOKEN=your_cesium_ion_token
```

### 4) Run locally

```bash
npm run dev
```

### 5) Production build

```bash
npm run build
```

## Controls

| Action | Input |
|---|---|
| Pitch up / down | `Arrow Down` / `Arrow Up` |
| Roll left / right | `Arrow Left` / `Arrow Right` |
| Yaw left / right | `A` / `D` |
| Throttle up / down | `W` / `S` |
| Boost | `Space` |
| Look around | `Mouse Left Drag` |
| Pause / Resume | `Esc` or `P` |

## Project Structure

```text
src/
  main.js                 # App lifecycle, game states, spawn/flight flow
  world/cesiumWorld.js    # Cesium viewer initialization and camera bridge
  plane/planePhysics.js   # Flight physics update model
  plane/planeController.js# Input mapping and camera look controls
  ui/hud.js               # Minimal in-flight HUD rendering
  utils/soundManager.js   # Audio loading and playback abstraction
```

## Performance Notes

- The simulator is tuned for simplicity and predictable behavior.
- Settings are persisted in `localStorage`.
- If visuals are jagged, enable anti-aliasing in settings.
- If FPS drops on lower-end GPUs, reduce graphics quality.