# Versions

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [1.0.5] - 2025-11-01
### Fixed
- Guard keyboard listener registration in `custom-fps-controls` and clear key state when the component pauses or is removed to prevent leaks and stale input.

## [1.0.3] - 2025-01-29
### Added
- Example scene in `examples/index.html` to showcase the movement component with interactive environment elements.
### Changed
- Updated README CDN snippet to reference version 1.0.3.

## [1.0.2] - 2025-01-22
### Changed
- Corrected the package metadata and README instructions to point at version 1.0.2 of the published bundle.

## [1.0.1] - 2025-01-22
### Changed
- Expanded the README HTML example with a full document skeleton and clearer usage guidance for the CDN build.

## [1.0.0] - 2025-01-22
### Added
- Initial release of `custom-fps-controls` providing WASD movement, strafing, vertical ascent/descent, and sprint multiplier tied to the camera's orientation.

