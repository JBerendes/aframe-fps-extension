/* global AFRAME, THREE */

// Register your custom component under a unique name:
AFRAME.registerComponent('custom-fps-controls', {
  schema: {
    speed: {type: 'number', default: 3.0}, // base speed (m/s)
    runMultiplier: {type: 'number', default: 2.0} // SHIFT multiplier
  },

  init: function () {
    this.keys = {};
    this.isListening = false;
    this.forwardVec = new THREE.Vector3();
    this.rightVec = new THREE.Vector3();
    this.localUpVec = new THREE.Vector3();
    this.worldUp = new THREE.Vector3(0, 1, 0);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    this.warnedNoCamera = false;
    this.cameraEl = this.resolveCameraEl();
    if (!this.cameraEl) {
      this.logMissingCamera();
    }
  },

  play: function () {
    if (this.isListening) return;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.isListening = true;
  },

  pause: function () {
    if (!this.isListening) return;
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.isListening = false;
    this.clearKeys();
  },

  remove: function () {
    this.pause();
  },

  onKeyDown: function (event) {
    this.keys[event.code] = true;
  },

  onKeyUp: function (event) {
    this.keys[event.code] = false;
  },

  clearKeys: function () {
    this.keys = {};
  },

  tick: function (time, timeDelta) {
    if (!this.cameraEl) {
      this.cameraEl = this.resolveCameraEl();
      if (!this.cameraEl) {
        this.logMissingCamera();
        return;
      }
    }

    // base movement distance this frame:
    let moveDistance = (this.data.speed * timeDelta) / 1000;

    // If SHIFT is held, multiply speed
    if (this.keys['ShiftLeft'] || this.keys['ShiftRight']) {
      moveDistance *= this.data.runMultiplier;
    }

    // 1) Get forward vector from the camera
    this.cameraEl.object3D.getWorldDirection(this.forwardVec);
    this.forwardVec.negate();  // Invert if needed to make "forward" face -Z

    // 2) Compute right vector via cross(forward, worldUp)
    this.rightVec.crossVectors(this.forwardVec, this.worldUp).normalize();

    // 3) Compute local up (for SPACE/CTRL) via cross(right, forward)
    this.localUpVec.crossVectors(this.rightVec, this.forwardVec).normalize();

    // Move in each direction
    if (this.keys['KeyW']) {
      this.el.object3D.position.addScaledVector(this.forwardVec, moveDistance);
    }
    if (this.keys['KeyS']) {
      this.el.object3D.position.addScaledVector(this.forwardVec, -moveDistance);
    }
    if (this.keys['KeyA']) {
      this.el.object3D.position.addScaledVector(this.rightVec, -moveDistance);
    }
    if (this.keys['KeyD']) {
      this.el.object3D.position.addScaledVector(this.rightVec, moveDistance);
    }
    // Space -> up
    if (this.keys['Space']) {
      this.el.object3D.position.addScaledVector(this.localUpVec, moveDistance);
    }
    // Ctrl -> down
    if (this.keys['ControlLeft'] || this.keys['ControlRight']) {
      this.el.object3D.position.addScaledVector(this.localUpVec, -moveDistance);
    }
  },

  resolveCameraEl: function () {
    var cameraChild = this.el.querySelector('[camera]');
    if (cameraChild) {
      return cameraChild;
    }

    if (this.el.components && this.el.components.camera) {
      return this.el;
    }

    var sceneEl = this.el.sceneEl;
    if (sceneEl && sceneEl.camera && sceneEl.camera.el) {
      return sceneEl.camera.el;
    }

    return null;
  },

  logMissingCamera: function () {
    if (this.warnedNoCamera) {
      return;
    }
    console.warn('No camera found for custom-fps-controls. Movement will not be relative to view direction.');
    this.warnedNoCamera = true;
  }
});
