/* global AFRAME, THREE */

// Register your custom component under a unique name:
AFRAME.registerComponent('custom-fps-controls', {
  schema: {
    speed: {type: 'number', default: 3.0}, // base speed (m/s)
    runMultiplier: {type: 'number', default: 2.0} // SHIFT multiplier
  },

  init: function () {
    this.keys = {};
    this.forwardVec = new THREE.Vector3();
    this.rightVec = new THREE.Vector3();
    this.localUpVec = new THREE.Vector3();
    this.worldUp = new THREE.Vector3(0, 1, 0);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    // Expect a camera child for look-controls
    this.cameraEl = this.el.querySelector('[camera]');
    if (!this.cameraEl) {
      console.warn('No <a-entity camera> found as a child of this rig!');
    }
  },

  play: function () {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  },

  pause: function () {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
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
    if (!this.cameraEl) return;

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
  }
});
