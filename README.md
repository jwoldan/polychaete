# Polychaete

[Polychaete Live](http://jwoldan/polychaete)

## Features and Implementation

### Technologies

Polychaete is primarily written in "vanilla" ES6 JavaScript.  [Webpack](https://webpack.github.io) and [Babel](https://babeljs.io) are used to transpile from ES6 for greater browser compatibility.  External dependencies include [EaselJS](http://www.createjs.com/easeljs) for sprite animation and movement, [Tone.js](https://github.com/Tonejs/Tone.js) for synth-based sounds, and [js-cookie](https://github.com/js-cookie/js-cookie) for easier cookie handling.

### Game Objects

All in-game characters/objects extend the `GameObject` base class.  This provides base size, movement/positioning, and sprite functionality.  Functionality unique to specific subclasses includes the following:

- `Diver`: Laser firing ability.
- `LaserBeam`: laser beam-specific vertical movement.
- `SeaSponge`: Handling of multiple laser beam hits.
- `Segment`: Polychaete segment movement and connection to adjacent segments (linked-list style).
- `Head`: Class/static method to create a new Head based on an existing Segment.

### User Interface

- The `Game` class manages the overall game state, including movement and collision detection.  
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
