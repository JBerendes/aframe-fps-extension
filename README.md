# A-Frame FPS Extension

A custom A-Frame component for smooth WASD movement, including strafe, up/down, and shift to run, all in the camera's local space.

## Installation and Usage

Include A-Frame and the component script. Make an entity that wraps your camera, then add `custom-fps-controls`.

Or load from `unpkg` in an HTML file:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/aframe@1.4.0/dist/aframe.min.js"></script>
    <script src="https://unpkg.com/aframe-fps-extension@1.0.1/index.js"></script>
  </head>
  <body>
    <a-scene>
      <a-entity id="rig"
                custom-fps-controls="speed: 3.0; runMultiplier: 2.0"
                position="0 1.6 0">
        <a-entity camera look-controls="pointerLockEnabled: true"></a-entity>
      </a-entity>
    </a-scene>
  </body>
</html>
```

## Controls

- Press W/S = forward/backward
- Press A/D = strafe left/right
- Press Space = move up (local up)
- Press Ctrl = move down (local down)
- Press Shift = run multiplier

