# Polychaete

[Polychaete Live](http://jwoldan.net/polychaete)

## Features and Implementation

### Technologies

Polychaete is primarily written in "vanilla" ES6 JavaScript.  [Webpack](https://webpack.github.io) and [Babel](https://babeljs.io) are used to transpile from ES6 for greater browser compatibility.  External dependencies include [EaselJS](http://www.createjs.com/easeljs) for sprite animation and movement, [Tone.js](https://github.com/Tonejs/Tone.js) for synth-based sounds, and [js-cookie](https://github.com/js-cookie/js-cookie) for easier cookie handling.

See the [Development README](docs/development-readme.md) to learn more about the development process.

### Game Objects

All in-game characters/objects extend the `GameObject` base class.  This provides base size, movement/positioning, and sprite functionality.  Objects that move automatically based on time extend `MovingObject`, a subclass of `GameObject`.  This provides direction and velocity attributes and a generic `updatePosition` method.  Functionality unique to specific subclasses includes the following:

- `Diver`: Laser firing ability.
- `Bubble`: Supports three different bubble sizes and randomly changing x direction.  Uses the `updatePosition` method inherited from `MovingObject`.
- `LaserBeam`: Laser beams move vertically in a straight line, they use the `updatePosition` method inherited from `MovingObject`.
- `SeaSponge`: Handling of multiple laser beam hits.
- `Shrimp`: Provides a `dropSeaSponge` method which can be called to drop a sea sponge at the shrimp's current position. (Shrimps move vertically in a straight line, so they use the `updatePosition` method inherited from `MovingObject`.)
- `Crab`: Provides a custom `updatePosition` method with helper methods to change direction and velocity semi-randomly at 'decision points'.
- `Segment`: Polychaete segment movement and connection to adjacent segments (linked-list style).
- `Head`: Class/static method to create a new Head based on an existing Segment.

### User Interface

- The `Game` class manages the overall game state.  Due to the complexity of the associated code, position updates and collision detection were moved into separate classes:
  - The `PositionHandler` class updates the positions of all `MovingObject`s.
  - The `CollisionHandler` class handles collision detection for in game objects.
- The `Board` class maintains position and rendering of the various game objects on the Canvas, as well as addition and removal of those objects.
- The `KeyHandler` provides a keyboard-based user interface to move the diver and fire laser beams.
- The `UIHandler` manages state and interactivity of dynamic HTML elements other than the canvas itself, such as popups and buttons.
- The `SoundHandler` implements sounds for various in-game actions.

## Running Polychaete

### Prerequisites

An up to date version of [npm](https://www.npmjs.com).

### Project Setup

1. `git clone https://github.com/jwoldan/polychaete.git`
2. `cd polychaete`
3. `npm install`
4. `npm run webpack-once`

### Starting a Local Server
1. `npm install -g http-server` (This globally installs a simple web server to serve the page locally)
2. `http-server`
3. Visit `http://localhost:8080/`
