# Project Architecture

## System Overview

```mermaid
graph TB
    subgraph "Project Structure"
        HTML["index.html<br/>(Canvas Container)"]
        JS["main.js<br/>(Game Logic)"]
        PKG["package.json<br/>(Dependencies)"]
    end

    subgraph "Game Components"
        CANVAS["Canvas 2D Context<br/>(1263x780)"]
        INPUT["Input Handler<br/>(Keyboard & Mouse)"]
        RENDER["Renderer<br/>(Grid, Player, Points)"]
        GAME_LOOP["Game Loop<br/>(requestAnimationFrame)"]
    end

    subgraph "Game State"
        PLAYER["Player<br/>(Position, Direction)"]
        GRID["Grid System<br/>(100x100)"]
        POINTS["Point Objects<br/>(10 random points)"]
        MOUSE["Mouse State<br/>(Lock, Position)"]
    end

    subgraph "Input Events"
        KEYS["Keyboard<br/>(W/A/S/D + Space)"]
        MOUSE_EVENTS["Mouse Events<br/>(Move, Click, Lock)"]
    end

    HTML --> CANVAS
    JS --> CANVAS
    CANVAS --> GAME_LOOP
    GAME_LOOP --> INPUT
    GAME_LOOP --> RENDER
    INPUT --> KEYS
    INPUT --> MOUSE_EVENTS
    INPUT --> PLAYER
    INPUT --> MOUSE
    RENDER --> GRID
    RENDER --> PLAYER
    RENDER --> POINTS
    KEYS --> PLAYER
    MOUSE_EVENTS --> MOUSE
    MOUSE_EVENTS --> PLAYER

    PKG -.-> JS
    CANVAS -.-> RENDER
```

## Components

### Project Structure
- **index.html** - HTML entry point with canvas container (1263x780)
- **main.js** - Core game logic and rendering engine
- **package.json** - Build configuration using Vite with Prettier for formatting

### Game Components
- **Canvas 2D Context** - Renders all game visuals
- **Input Handler** - Processes keyboard and mouse events
- **Renderer** - Draws grid, player, and point objects each frame
- **Game Loop** - Uses `requestAnimationFrame` for smooth 60+ FPS updates

### Game State
- **Player** - Position (playerX, playerY) and direction (playerDir)
- **Grid System** - 100x100 procedurally generated grid with walls
- **Point Objects** - 10 randomly placed point objects in world space
- **Mouse State** - Tracks lock status and position

### Input Events
- **Keyboard** - WASD for movement, Space to toggle mouse lock
- **Mouse Events** - Move for camera control, click to lock pointer, context menu disabled
