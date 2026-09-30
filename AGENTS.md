# Titanic 3D Viewer

This repo contains a single `titanic.glb` 3D model file. The app is a Vite + Three.js viewer that renders it.

## Setup
- `docker compose -f docker-compose.base44.yml up -d --build` starts the Vite dev server on port 5173 (mapped to host 3000).
- Dependencies install automatically on container startup via `npm install`.
- No external credentials or services required.

## Stack
- Vite 6 dev server with Three.js for GLB rendering.
- The model is served from the public root (`/titanic.glb`).

## Verify
- Open the preview — the Titanic model loads with orbit/zoom/pan controls.
- Check `docker compose -f docker-compose.base44.yml logs web` if the page is blank.
