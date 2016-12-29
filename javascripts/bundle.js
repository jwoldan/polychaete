/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createjs = __webpack_require__(1);
	
	var _createjs2 = _interopRequireDefault(_createjs);
	
	var _game = __webpack_require__(2);
	
	var _game2 = _interopRequireDefault(_game);
	
	var _head = __webpack_require__(12);
	
	var _head2 = _interopRequireDefault(_head);
	
	var _segment = __webpack_require__(13);
	
	var _segment2 = _interopRequireDefault(_segment);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	document.addEventListener('DOMContentLoaded', function () {
	
	  var stage = new _createjs2.default.Stage('canvas');
	
	  var game = new _game2.default({ stage: stage });
	
	  game.initialize();
	  game.run();
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = createjs;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _createjs = __webpack_require__(1);
	
	var _createjs2 = _interopRequireDefault(_createjs);
	
	var _jsCookie = __webpack_require__(3);
	
	var _jsCookie2 = _interopRequireDefault(_jsCookie);
	
	var _sprite_sheets = __webpack_require__(4);
	
	var _ui_handler = __webpack_require__(5);
	
	var _ui_handler2 = _interopRequireDefault(_ui_handler);
	
	var _key_handler = __webpack_require__(6);
	
	var _key_handler2 = _interopRequireDefault(_key_handler);
	
	var _board = __webpack_require__(7);
	
	var _board2 = _interopRequireDefault(_board);
	
	var _head = __webpack_require__(12);
	
	var _head2 = _interopRequireDefault(_head);
	
	var _segment = __webpack_require__(13);
	
	var _segment2 = _interopRequireDefault(_segment);
	
	var _sea_sponge = __webpack_require__(14);
	
	var _sea_sponge2 = _interopRequireDefault(_sea_sponge);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var HIGH_SCORE_COOKIE = 'polychaete-high-score';
	
	var Game = function () {
	  function Game(options) {
	    _classCallCheck(this, Game);
	
	    this.stage = options.stage;
	    this.uiHandler = new _ui_handler2.default(this);
	    this.keyHandler = new _key_handler2.default(this);
	    this.board = new _board2.default(options);
	    this.initialStartLength = options.initialStartLength || 12;
	    this.started = false;
	
	    var cookieHighScore = _jsCookie2.default.get(HIGH_SCORE_COOKIE);
	    this.updateHighScore(cookieHighScore ? parseInt(cookieHighScore) : 0);
	
	    this.keyHandler.attachListeners();
	
	    this.updatePositions = this.updatePositions.bind(this);
	    this.checkCollisions = this.checkCollisions.bind(this);
	  }
	
	  _createClass(Game, [{
	    key: 'initialize',
	    value: function initialize(startGame) {
	      this.startLength = this.initialStartLength;
	      this.velocityX = _segment.INITIAL_VELOCITY_X;
	      this.currentScore = 0;
	      this.newHighScore = false;
	      this.uiHandler.updateCurrentScore(this.currentScore);
	      this.keyHandler.reset();
	
	      var board = this.board;
	      board.reset();
	      if (startGame) {
	        board.addDiver();
	        this.started = true;
	      }
	      board.addSeaSponges(20);
	      board.addPolychaete(this.startLength, this.velocityX);
	
	      this.paused = false;
	      _createjs2.default.Ticker.paused = false;
	    }
	  }, {
	    key: 'run',
	    value: function run() {
	      _createjs2.default.Ticker.setFPS(_sprite_sheets.FPS);
	      _createjs2.default.Ticker.on("tick", this.stage);
	      _createjs2.default.Ticker.on("tick", this.keyHandler.handleTick);
	      _createjs2.default.Ticker.on("tick", this.checkCollisions);
	      _createjs2.default.Ticker.on("tick", this.updatePositions);
	    }
	  }, {
	    key: 'moveDiver',
	    value: function moveDiver(xDiff, yDiff) {
	      this.board.diver.changeBoundedPos(xDiff, yDiff);
	    }
	  }, {
	    key: 'fireLaser',
	    value: function fireLaser() {
	      if (this.paused) return;
	      this.board.fireLaser();
	    }
	  }, {
	    key: 'updatePositions',
	    value: function updatePositions(e) {
	      if (e.paused) return;
	
	      var idxsToRemove = [];
	      var board = this.board;
	
	      board.laserBeams.forEach(function (beam, idx) {
	        beam.updatePosition();
	        if (beam.getY() <= -beam.getHeight()) {
	          idxsToRemove.push(idx);
	        }
	      });
	
	      board.segments.forEach(function (segment) {
	        var collided = false;
	        board.sponges.forEach(function (sponge) {
	          if (segment.overlaps(sponge)) {
	            collided = true;
	          }
	        });
	        // if (!collided) {
	        //   board.segments.forEach((otherSegment) => {
	        //     if (segment.direction !== otherSegment.direction &&
	        //         segment.overlaps(otherSegment)) {
	        //       collided = true;
	        //     }
	        //   });
	        // }
	        segment.updatePosition(collided);
	      });
	
	      this.removeLaserBeams(idxsToRemove);
	    }
	  }, {
	    key: 'checkCollisions',
	    value: function checkCollisions(e) {
	      var _this = this;
	
	      if (e.paused) return;
	
	      var board = this.board;
	      var diver = board.diver;
	      var beamIdxsToRemove = [];
	      var segmentIdxsToRemove = [];
	      var spongeIdxsToRemove = [];
	
	      if (this.started) {
	        board.segments.forEach(function (segment) {
	          if (segment.overlaps(diver)) {
	            _this.endGame();
	          }
	        });
	      }
	
	      board.laserBeams.forEach(function (beam, beamIdx) {
	        // only allow a laser beam a single hit
	        var hit = false;
	
	        // check for collision with sea sponges
	        board.sponges.forEach(function (sponge, spongeIdx) {
	          if (beam.overlaps(sponge) && !hit) {
	            beamIdxsToRemove.push(beamIdx);
	            sponge.handleHit();
	            if (sponge.hits === 0) {
	              spongeIdxsToRemove.push(spongeIdx);
	              _this.incrementScore(1);
	            }
	            hit = true;
	          }
	        });
	
	        // check for collision with Polychaete segments
	        board.segments.forEach(function (segment, segmentIdx) {
	          if (beam.overlaps(segment) && !hit) {
	            if (segment instanceof _head2.default) {
	              _this.incrementScore(100);
	            } else {
	              _this.incrementScore(10);
	            }
	            beamIdxsToRemove.push(beamIdx);
	            segmentIdxsToRemove.push(segmentIdx);
	            hit = true;
	          }
	        });
	      });
	
	      this.removeLaserBeams(beamIdxsToRemove);
	      this.removeSegments(segmentIdxsToRemove);
	      this.removeSeaSponges(spongeIdxsToRemove);
	
	      if (board.segments.length === 0) {
	        this.startLength -= 1;
	        if (this.startLength === 0) {
	          this.startLength = this.initialStartLength;
	          if (this.velocityX < 4) this.velocityX *= 2;
	          console.log(this.velocityX);
	        }
	        board.addPolychaete(this.startLength, this.velocityX);
	        if (this.startLength !== this.initialStartLength) {
	          window.setTimeout(function () {
	            board.addPolychaete(1, _this.velocityX + 1);
	          }, Math.random() * 1000 + 500);
	        }
	      }
	    }
	  }, {
	    key: 'removeSeaSponges',
	    value: function removeSeaSponges(idxsToRemove) {
	      var _this2 = this;
	
	      idxsToRemove.sort().reverse().forEach(function (idx) {
	        _this2.board.removeSeaSpongeAtIdx(idx);
	      });
	    }
	  }, {
	    key: 'removeSegments',
	    value: function removeSegments(idxsToRemove) {
	      var board = this.board;
	      var segmentsToReplace = [];
	      idxsToRemove.sort().reverse().forEach(function (idx) {
	        var segment = board.segments[idx];
	        var sponge = new _sea_sponge2.default({
	          x: segment.getX(),
	          y: segment.getY()
	        });
	        board.addSeaSponge(sponge);
	        if (segment.next) {
	          segmentsToReplace.push(segment.next);
	        }
	
	        board.removeSegmentAtIdx(idx);
	      });
	
	      if (segmentsToReplace.length > 0) {
	        this.replaceSegmentsWithHeads(segmentsToReplace);
	      }
	    }
	  }, {
	    key: 'removeLaserBeams',
	    value: function removeLaserBeams(idxsToRemove) {
	      var _this3 = this;
	
	      idxsToRemove.sort().reverse().forEach(function (idx) {
	        _this3.board.removeLaserBeamAtIdx(idx);
	      });
	    }
	  }, {
	    key: 'replaceSegmentsWithHeads',
	    value: function replaceSegmentsWithHeads(segmentsToReplace) {
	      var board = this.board;
	      segmentsToReplace.forEach(function (segment) {
	        var idx = board.segments.indexOf(segment);
	        board.stage.removeChild(segment.sprite);
	        var newHead = _head2.default.createHeadFromSegment(segment);
	        segment.destroy();
	        board.segments.splice(idx, 1);
	        board.addSegment(newHead);
	      });
	    }
	  }, {
	    key: 'incrementScore',
	    value: function incrementScore(addlScore) {
	      this.currentScore += addlScore;
	      this.uiHandler.updateCurrentScore(this.currentScore);
	
	      if (this.currentScore > this.highScore) {
	        this.updateHighScore(this.currentScore);
	      }
	    }
	  }, {
	    key: 'updateHighScore',
	    value: function updateHighScore(newHighScore) {
	      this.highScore = newHighScore;
	      this.uiHandler.updateHighScore(this.highScore);
	      this.newHighScore = true;
	    }
	  }, {
	    key: 'setPaused',
	    value: function setPaused(paused) {
	      this.paused = paused;
	      _createjs2.default.Ticker.paused = paused;
	      this.board.pauseAnimations(paused);
	    }
	  }, {
	    key: 'endGame',
	    value: function endGame() {
	      var _this4 = this;
	
	      this.setPaused(true);
	      this.started = false;
	      _jsCookie2.default.set(HIGH_SCORE_COOKIE, this.highScore);
	      window.setTimeout(function () {
	        return _this4.uiHandler.showGameOverPopup(_this4.newHighScore);
	      }, 100);
	    }
	  }]);
	
	  return Game;
	}();
	
	exports.default = Game;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * JavaScript Cookie v2.1.3
	 * https://github.com/js-cookie/js-cookie
	 *
	 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
	 * Released under the MIT license
	 */
	;(function (factory) {
		var registeredInModuleLoader = false;
		if (true) {
			!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
			registeredInModuleLoader = true;
		}
		if (true) {
			module.exports = factory();
			registeredInModuleLoader = true;
		}
		if (!registeredInModuleLoader) {
			var OldCookies = window.Cookies;
			var api = window.Cookies = factory();
			api.noConflict = function () {
				window.Cookies = OldCookies;
				return api;
			};
		}
	}(function () {
		function extend () {
			var i = 0;
			var result = {};
			for (; i < arguments.length; i++) {
				var attributes = arguments[ i ];
				for (var key in attributes) {
					result[key] = attributes[key];
				}
			}
			return result;
		}
	
		function init (converter) {
			function api (key, value, attributes) {
				var result;
				if (typeof document === 'undefined') {
					return;
				}
	
				// Write
	
				if (arguments.length > 1) {
					attributes = extend({
						path: '/'
					}, api.defaults, attributes);
	
					if (typeof attributes.expires === 'number') {
						var expires = new Date();
						expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
						attributes.expires = expires;
					}
	
					try {
						result = JSON.stringify(value);
						if (/^[\{\[]/.test(result)) {
							value = result;
						}
					} catch (e) {}
	
					if (!converter.write) {
						value = encodeURIComponent(String(value))
							.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
					} else {
						value = converter.write(value, key);
					}
	
					key = encodeURIComponent(String(key));
					key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
					key = key.replace(/[\(\)]/g, escape);
	
					return (document.cookie = [
						key, '=', value,
						attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
						attributes.path ? '; path=' + attributes.path : '',
						attributes.domain ? '; domain=' + attributes.domain : '',
						attributes.secure ? '; secure' : ''
					].join(''));
				}
	
				// Read
	
				if (!key) {
					result = {};
				}
	
				// To prevent the for loop in the first place assign an empty array
				// in case there are no cookies at all. Also prevents odd result when
				// calling "get()"
				var cookies = document.cookie ? document.cookie.split('; ') : [];
				var rdecode = /(%[0-9A-Z]{2})+/g;
				var i = 0;
	
				for (; i < cookies.length; i++) {
					var parts = cookies[i].split('=');
					var cookie = parts.slice(1).join('=');
	
					if (cookie.charAt(0) === '"') {
						cookie = cookie.slice(1, -1);
					}
	
					try {
						var name = parts[0].replace(rdecode, decodeURIComponent);
						cookie = converter.read ?
							converter.read(cookie, name) : converter(cookie, name) ||
							cookie.replace(rdecode, decodeURIComponent);
	
						if (this.json) {
							try {
								cookie = JSON.parse(cookie);
							} catch (e) {}
						}
	
						if (key === name) {
							result = cookie;
							break;
						}
	
						if (!key) {
							result[name] = cookie;
						}
					} catch (e) {}
				}
	
				return result;
			}
	
			api.set = api;
			api.get = function (key) {
				return api.call(api, key);
			};
			api.getJSON = function () {
				return api.apply({
					json: true
				}, [].slice.call(arguments));
			};
			api.defaults = {};
	
			api.remove = function (key, attributes) {
				api(key, '', extend(attributes, {
					expires: -1
				}));
			};
	
			api.withConverter = init;
	
			return api;
		}
	
		return init(function () {});
	}));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createSeaSpongeSpriteSheet = exports.createSegmentSpriteSheet = exports.createHeadSpriteSheet = exports.createLaserBeamSpriteSheet = exports.createDiverSpriteSheet = exports.ANIMATION_RATE = exports.FPS = undefined;
	
	var _createjs = __webpack_require__(1);
	
	var _createjs2 = _interopRequireDefault(_createjs);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var FPS = exports.FPS = 120;
	var ANIMATION_RATE = exports.ANIMATION_RATE = 10;
	
	var createDiverSpriteSheet = exports.createDiverSpriteSheet = function createDiverSpriteSheet() {
	  var frameRate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ANIMATION_RATE;
	  return new _createjs2.default.SpriteSheet({
	    frames: {
	      width: 16,
	      height: 18
	    },
	    images: ['./assets/diver.png'],
	    animations: {
	      default: 0
	    }
	  });
	};
	
	var createLaserBeamSpriteSheet = exports.createLaserBeamSpriteSheet = function createLaserBeamSpriteSheet() {
	  var frameRate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ANIMATION_RATE;
	  return new _createjs2.default.SpriteSheet({
	    frames: {
	      width: 2,
	      height: 12
	    },
	    images: ['./assets/laser_beam.png'],
	    animations: {
	      default: 0
	    }
	  });
	};
	
	var createHeadSpriteSheet = exports.createHeadSpriteSheet = function createHeadSpriteSheet() {
	  var frameRate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ANIMATION_RATE;
	  return new _createjs2.default.SpriteSheet({
	    frames: [
	    // move left
	    [0, 0, 16, 20], [16, 0, 16, 20], [32, 0, 16, 20],
	    // move right
	    [0, 20, 16, 20], [16, 20, 16, 20], [32, 20, 16, 20],
	    // move down
	    [0, 40, 20, 20], [20, 40, 20, 20], [40, 40, 20, 20],
	    // move up
	    [0, 60, 20, 20], [20, 60, 20, 20], [40, 60, 20, 20]],
	    images: ['./assets/head.png'],
	    animations: {
	      moveLeft: [0, 2],
	      moveRight: [3, 5],
	      moveDown: [6, 8],
	      moveUp: [9, 11]
	    },
	    framerate: frameRate
	  });
	};
	
	var createSegmentSpriteSheet = exports.createSegmentSpriteSheet = function createSegmentSpriteSheet() {
	  var frameRate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ANIMATION_RATE;
	  return new _createjs2.default.SpriteSheet({
	    frames: [
	    // left/right
	    [0, 0, 16, 20], [16, 0, 16, 20], [32, 0, 16, 20],
	    // up/down
	    [0, 20, 20, 20], [20, 20, 20, 20], [40, 20, 20, 20]],
	    images: ['./assets/segment.png'],
	    animations: {
	      moveLeft: [0, 2],
	      moveDown: 4,
	      moveRight: {
	        frames: [2, 1, 0]
	      },
	      moveUp: {
	        frames: 4
	      }
	    },
	    framerate: frameRate
	  });
	};
	
	var createSeaSpongeSpriteSheet = exports.createSeaSpongeSpriteSheet = function createSeaSpongeSpriteSheet() {
	  var frameRate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ANIMATION_RATE;
	  return new _createjs2.default.SpriteSheet({
	    frames: {
	      width: 16,
	      height: 20
	    },
	    images: ['./assets/sea_sponge.png'],
	    animations: {
	      new: 0,
	      oneHit: 1,
	      twoHits: 2
	    },
	    framerate: frameRate
	  });
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var UIHandler = function () {
	  function UIHandler(game) {
	    _classCallCheck(this, UIHandler);
	
	    this.game = game;
	    this.currentScoreElement = document.getElementById('current-score');
	    this.highScoreElement = document.getElementById('high-score');
	    this.startGamePopup = document.getElementById('popup-start');
	    this.startButton = document.getElementById('button-start');
	    this.gameOverPopup = document.getElementById('popup-gameover');
	    this.restartButton = document.getElementById('button-restart');
	    this.gameOverScore = document.getElementById('gameover-score');
	    this.gameOverHighScoreMessage = document.getElementById('gameover-high-score-message');
	    this.aboutPopup = document.getElementById('popup-about');
	    this.aboutButton = document.getElementById('button-about');
	    this.aboutCloseButton = document.getElementById('button-about-close');
	
	    this.startGame = this.startGame.bind(this);
	    this.toggleAboutPopup = this.toggleAboutPopup.bind(this);
	
	    this.startButton.addEventListener('click', this.startGame);
	    this.restartButton.addEventListener('click', this.startGame);
	    this.aboutButton.addEventListener('click', this.toggleAboutPopup);
	    this.aboutCloseButton.addEventListener('click', this.toggleAboutPopup);
	  }
	
	  _createClass(UIHandler, [{
	    key: 'updateCurrentScore',
	    value: function updateCurrentScore(newCurrentScore) {
	      if (this.currentScoreElement) {
	        this.currentScoreElement.innerText = newCurrentScore;
	      }
	    }
	  }, {
	    key: 'updateHighScore',
	    value: function updateHighScore(newHighScore) {
	      if (this.highScoreElement) {
	        this.highScoreElement.innerText = newHighScore;
	      }
	    }
	  }, {
	    key: 'hideStartGamePopup',
	    value: function hideStartGamePopup() {
	      this.startGamePopup.className = "popup hidden";
	    }
	  }, {
	    key: 'showGameOverPopup',
	    value: function showGameOverPopup(newHighScore) {
	      this.gameOverPopup.className = "popup";
	      this.gameOverScore.innerText = this.currentScoreElement.innerText;
	      if (newHighScore) {
	        this.gameOverHighScoreMessage.innerText = "New High Score!";
	      }
	    }
	  }, {
	    key: 'hideGameOverPopup',
	    value: function hideGameOverPopup() {
	      this.gameOverPopup.className = "popup hidden";
	    }
	  }, {
	    key: 'toggleAboutPopup',
	    value: function toggleAboutPopup() {
	      if (this.aboutPopup.className === "popup") {
	        this.game.setPaused(false);
	        this.aboutPopup.className = "popup hidden";
	      } else {
	        this.game.setPaused(true);
	        this.aboutPopup.className = "popup";
	      }
	    }
	  }, {
	    key: 'startGame',
	    value: function startGame() {
	      this.game.initialize(true);
	      this.hideStartGamePopup();
	      this.hideGameOverPopup();
	    }
	  }]);
	
	  return UIHandler;
	}();
	
	exports.default = UIHandler;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _diver = __webpack_require__(9);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var KEYCODE_LEFT = 37,
	    KEYCODE_A = 65,
	    KEYCODE_RIGHT = 39,
	    KEYCODE_D = 68,
	    KEYCODE_UP = 38,
	    KEYCODE_W = 87,
	    KEYCODE_DOWN = 40,
	    KEYCODE_S = 83,
	    KEYCODE_SPACE = 32;
	
	var controlKeys = [KEYCODE_LEFT, KEYCODE_A, KEYCODE_RIGHT, KEYCODE_D, KEYCODE_UP, KEYCODE_W, KEYCODE_DOWN, KEYCODE_S, KEYCODE_SPACE];
	
	var DIAG_MOVE_AMOUNT = Math.sqrt(_diver.DIVER_MOVE_AMOUNT * _diver.DIVER_MOVE_AMOUNT / 2);
	
	var KeyHandler = function () {
		function KeyHandler(game, stage) {
			_classCallCheck(this, KeyHandler);
	
			this.game = game;
			this.stage = stage;
			this.reset();
	
			this.handleKeyDown = this.handleKeyDown.bind(this);
			this.handleKeyUp = this.handleKeyUp.bind(this);
			this.handleTick = this.handleTick.bind(this);
		}
	
		_createClass(KeyHandler, [{
			key: 'reset',
			value: function reset() {
				var _this = this;
	
				this.keysDown = {};
				controlKeys.forEach(function (key) {
					_this.keysDown[key] = false;
				});
			}
		}, {
			key: 'handleKeyDown',
			value: function handleKeyDown(e) {
				if (this.game.started) {
					if (e.keyCode === KEYCODE_SPACE && !this.keysDown[e.keyCode]) {
						this.game.fireLaser();
					}
					if (controlKeys.includes(e.keyCode)) {
						e.preventDefault();
						this.keysDown[e.keyCode] = true;
					}
				}
			}
		}, {
			key: 'handleKeyUp',
			value: function handleKeyUp(e) {
				if (this.game.started) {
					if (controlKeys.includes(e.keyCode)) {
						e.preventDefault();
						this.keysDown[e.keyCode] = false;
					}
				}
			}
		}, {
			key: 'handleTick',
			value: function handleTick(e) {
				if (e.paused) return;
	
				var diagMove = false;
				if (this.leftUpPressed()) {
					this.game.moveDiver(-DIAG_MOVE_AMOUNT, -DIAG_MOVE_AMOUNT);
					diagMove = true;
				}
				if (this.rightUpPressed()) {
					this.game.moveDiver(DIAG_MOVE_AMOUNT, -DIAG_MOVE_AMOUNT);
					diagMove = true;
				}
				if (this.leftDownPressed()) {
					this.game.moveDiver(-DIAG_MOVE_AMOUNT, DIAG_MOVE_AMOUNT);
					diagMove = true;
				}
				if (this.rightDownPressed()) {
					this.game.moveDiver(DIAG_MOVE_AMOUNT, DIAG_MOVE_AMOUNT);
					diagMove = true;
				}
	
				if (!diagMove) {
					if (this.leftPressed()) {
						this.game.moveDiver(-_diver.DIVER_MOVE_AMOUNT, 0);
					}
					if (this.rightPressed()) {
						this.game.moveDiver(_diver.DIVER_MOVE_AMOUNT, 0);
					}
	
					if (this.upPressed()) {
						this.game.moveDiver(0, -_diver.DIVER_MOVE_AMOUNT);
					}
	
					if (this.downPressed()) {
						this.game.moveDiver(0, _diver.DIVER_MOVE_AMOUNT);
					}
				}
			}
		}, {
			key: 'leftPressed',
			value: function leftPressed() {
				return this.keysDown[KEYCODE_LEFT] || this.keysDown[KEYCODE_A];
			}
		}, {
			key: 'rightPressed',
			value: function rightPressed() {
				return this.keysDown[KEYCODE_RIGHT] || this.keysDown[KEYCODE_D];
			}
		}, {
			key: 'upPressed',
			value: function upPressed() {
				return this.keysDown[KEYCODE_UP] || this.keysDown[KEYCODE_W];
			}
		}, {
			key: 'downPressed',
			value: function downPressed() {
				return this.keysDown[KEYCODE_DOWN] || this.keysDown[KEYCODE_S];
			}
		}, {
			key: 'leftUpPressed',
			value: function leftUpPressed() {
				return this.leftPressed() && this.upPressed();
			}
		}, {
			key: 'rightUpPressed',
			value: function rightUpPressed() {
				return this.rightPressed() && this.upPressed();
			}
		}, {
			key: 'leftDownPressed',
			value: function leftDownPressed() {
				return this.leftPressed() && this.downPressed();
			}
		}, {
			key: 'rightDownPressed',
			value: function rightDownPressed() {
				return this.rightPressed() && this.downPressed();
			}
		}, {
			key: 'attachListeners',
			value: function attachListeners() {
				document.addEventListener('keydown', this.handleKeyDown);
				document.addEventListener('keyup', this.handleKeyUp);
			}
		}, {
			key: 'removeListeners',
			value: function removeListeners() {
				document.removeEventListener('keydown', this.handleKeyDown);
				document.removeEventListener('keyup', this.handleKeyUp);
			}
		}]);
	
		return KeyHandler;
	}();
	
	exports.default = KeyHandler;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _createjs = __webpack_require__(1);
	
	var _createjs2 = _interopRequireDefault(_createjs);
	
	var _sprite_sheets = __webpack_require__(4);
	
	var _util = __webpack_require__(8);
	
	var _diver = __webpack_require__(9);
	
	var _diver2 = _interopRequireDefault(_diver);
	
	var _head = __webpack_require__(12);
	
	var _head2 = _interopRequireDefault(_head);
	
	var _segment = __webpack_require__(13);
	
	var _segment2 = _interopRequireDefault(_segment);
	
	var _sea_sponge = __webpack_require__(14);
	
	var _sea_sponge2 = _interopRequireDefault(_sea_sponge);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Board = function () {
	  function Board(options) {
	    _classCallCheck(this, Board);
	
	    this.stage = options.stage;
	
	    this.laserBeams = [];
	    this.segments = [];
	    this.sponges = [];
	
	    this.setBackground();
	  }
	
	  _createClass(Board, [{
	    key: 'reset',
	    value: function reset() {
	      this.removeDiver();
	      this.removeAllSeaSponges();
	      this.removeAllSegments();
	      this.removeAllLaserBeams();
	    }
	  }, {
	    key: 'addDiver',
	    value: function addDiver() {
	      this.diver = new _diver2.default();
	      this.diver.setStage(this.stage);
	      this.stage.addChild(this.diver.sprite);
	    }
	  }, {
	    key: 'removeDiver',
	    value: function removeDiver() {
	      if (this.diver) {
	        this.stage.removeChild(this.diver.sprite);
	        this.diver.destroy();
	        this.diver = null;
	      }
	    }
	  }, {
	    key: 'setBackground',
	    value: function setBackground() {
	      var background = new _createjs2.default.Shape();
	      background.graphics.beginFill('black').drawRect(0, 0, this.stage.canvas.width, this.stage.canvas.height);
	      this.stage.addChild(background);
	      this.stage.setChildIndex(background, 0);
	      this.stage.update();
	    }
	  }, {
	    key: 'addSeaSponges',
	    value: function addSeaSponges(numSponges) {
	      var _this = this;
	
	      var spongesPlaced = 0;
	
	      var _loop = function _loop() {
	        var x = 16 * (0, _util.getRandomInt)(0, 25);
	        var y = 20 * (0, _util.getRandomInt)(1, 25);
	
	        var collision = false;
	        _this.sponges.forEach(function (sponge) {
	          if (sponge.getX() === x && sponge.getY() === y) {
	            collision = true;
	          }
	        });
	
	        if (!collision) {
	          var sponge = new _sea_sponge2.default({ x: x, y: y });
	          _this.addSeaSponge(sponge);
	          spongesPlaced++;
	        }
	      };
	
	      while (spongesPlaced < numSponges) {
	        _loop();
	      }
	    }
	  }, {
	    key: 'addPolychaete',
	    value: function addPolychaete(length, velocityX) {
	      var startLeft = Math.random() < .5;
	
	      var headX = void 0;
	      var direction = void 0;
	      var xIncrement = void 0;
	      if (startLeft) {
	        headX = 0;
	        direction = _segment.RIGHT;
	        xIncrement = -16;
	      } else {
	        headX = this.stage.canvas.width - 16;
	        direction = _segment.LEFT;
	        xIncrement = 16;
	      }
	
	      var head = new _head2.default({ x: headX, direction: direction, velocityX: velocityX });
	      this.addSegment(head);
	
	      var lastSegment = head;
	      for (var i = 1; i < length; i++) {
	        var segment = new _segment2.default({
	          x: headX + xIncrement * i,
	          direction: direction,
	          velocityX: velocityX
	        });
	        lastSegment.connectNext(segment);
	        this.addSegment(segment);
	        lastSegment = segment;
	      }
	    }
	  }, {
	    key: 'addSegment',
	    value: function addSegment(segment) {
	      segment.setStage(this.stage);
	      this.stage.addChild(segment.sprite);
	      this.segments.push(segment);
	    }
	  }, {
	    key: 'addSeaSponge',
	    value: function addSeaSponge(sponge) {
	      sponge.setStage(this.stage);
	      this.stage.addChild(sponge.sprite);
	      this.sponges.push(sponge);
	    }
	  }, {
	    key: 'addLaserBeam',
	    value: function addLaserBeam(beam) {
	      beam.setStage(this.stage);
	      this.stage.addChild(beam.sprite);
	      this.laserBeams.push(beam);
	    }
	  }, {
	    key: 'fireLaser',
	    value: function fireLaser() {
	      this.addLaserBeam(this.diver.fireLaser());
	    }
	  }, {
	    key: 'removeSeaSpongeAtIdx',
	    value: function removeSeaSpongeAtIdx(idx) {
	      var sponge = this.sponges[idx];
	      this.stage.removeChild(sponge.sprite);
	      sponge.destroy();
	      this.sponges.splice(idx, 1);
	    }
	  }, {
	    key: 'removeAllSeaSponges',
	    value: function removeAllSeaSponges() {
	      var _this2 = this;
	
	      this.sponges.forEach(function (sponge) {
	        _this2.stage.removeChild(sponge.sprite);
	        sponge.destroy();
	      });
	      this.sponges = [];
	    }
	  }, {
	    key: 'removeSegmentAtIdx',
	    value: function removeSegmentAtIdx(idx) {
	      var segment = this.segments[idx];
	      this.stage.removeChild(segment.sprite);
	      segment.destroy();
	      this.segments.splice(idx, 1);
	    }
	  }, {
	    key: 'removeAllSegments',
	    value: function removeAllSegments() {
	      var _this3 = this;
	
	      this.segments.forEach(function (segment) {
	        _this3.stage.removeChild(segment.sprite);
	        segment.destroy();
	      });
	      this.segments = [];
	    }
	  }, {
	    key: 'removeLaserBeamAtIdx',
	    value: function removeLaserBeamAtIdx(idx) {
	      var laserBeam = this.laserBeams[idx];
	      this.stage.removeChild(laserBeam.sprite);
	      laserBeam.destroy();
	      this.laserBeams.splice(idx, 1);
	    }
	  }, {
	    key: 'removeAllLaserBeams',
	    value: function removeAllLaserBeams() {
	      var _this4 = this;
	
	      this.laserBeams.forEach(function (beam) {
	        _this4.stage.removeChild(beam.sprite);
	        beam.destroy();
	      });
	      this.laserBeams = [];
	    }
	  }, {
	    key: 'pauseAnimations',
	    value: function pauseAnimations(paused) {
	      this.segments.forEach(function (segment) {
	        segment.sprite.paused = paused;
	      });
	    }
	  }]);
	
	  return Board;
	}();
	
	exports.default = Board;

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var getRandomInt = exports.getRandomInt = function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DIVER_MOVE_AMOUNT = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _createjs = __webpack_require__(1);
	
	var _createjs2 = _interopRequireDefault(_createjs);
	
	var _game_object = __webpack_require__(10);
	
	var _game_object2 = _interopRequireDefault(_game_object);
	
	var _sprite_sheets = __webpack_require__(4);
	
	var _laser_beam = __webpack_require__(11);
	
	var _laser_beam2 = _interopRequireDefault(_laser_beam);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var DIVER_MOVE_AMOUNT = exports.DIVER_MOVE_AMOUNT = 3;
	
	var DIVER_SHEET = (0, _sprite_sheets.createDiverSpriteSheet)();
	
	var Diver = function (_GameObject) {
	  _inherits(Diver, _GameObject);
	
	  function Diver(options) {
	    _classCallCheck(this, Diver);
	
	    var diverSprite = new _createjs2.default.Sprite(DIVER_SHEET);
	
	    var defaultOptions = {
	      x: 200,
	      y: 580,
	      width: 16,
	      height: 18,
	      sprite: diverSprite
	    };
	    return _possibleConstructorReturn(this, (Diver.__proto__ || Object.getPrototypeOf(Diver)).call(this, Object.assign(defaultOptions, options), { minY: 520 }));
	  }
	
	  _createClass(Diver, [{
	    key: 'fireLaser',
	    value: function fireLaser() {
	      var laserBeam = new _laser_beam2.default({
	        x: this.centerX() - 1,
	        y: this.getY() - 12
	      });
	      return laserBeam;
	    }
	  }]);
	
	  return Diver;
	}(_game_object2.default);
	
	exports.default = Diver;

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var GameObject = function () {
	  function GameObject(options, moveBounds) {
	    _classCallCheck(this, GameObject);
	
	    this.moveBounds = Object.assign({
	      minX: 0,
	      minY: 0,
	      maxX: 0,
	      maxY: 0
	    }, moveBounds);
	
	    this.sprite = options.sprite;
	    this.sprite.x = options.x;
	    this.sprite.y = options.y;
	    this.sprite.setBounds(options.x, options.y, options.width, options.height);
	  }
	
	  _createClass(GameObject, [{
	    key: "setStage",
	    value: function setStage(stage) {
	      this.stage = stage;
	      if (this.moveBounds.maxX === 0) this.moveBounds.maxX = stage.canvas.width;
	      if (this.moveBounds.maxY === 0) this.moveBounds.maxY = stage.canvas.height;
	    }
	  }, {
	    key: "setX",
	    value: function setX(x) {
	      this.sprite.x = x;
	    }
	  }, {
	    key: "setY",
	    value: function setY(y) {
	      this.sprite.y = y;
	    }
	  }, {
	    key: "changeX",
	    value: function changeX(xDiff) {
	      this.sprite.x += xDiff;
	    }
	  }, {
	    key: "changeY",
	    value: function changeY(yDiff) {
	      this.sprite.y += yDiff;
	    }
	  }, {
	    key: "setBoundedX",
	    value: function setBoundedX(x) {
	      this.sprite.x = this.withinMoveBoundsX(x);
	    }
	  }, {
	    key: "setBoundedY",
	    value: function setBoundedY(y) {
	      this.sprite.y = this.withinMoveBoundsY(y);
	    }
	  }, {
	    key: "changeBoundedX",
	    value: function changeBoundedX(xDiff) {
	      this.setBoundedX(this.sprite.x + xDiff);
	    }
	  }, {
	    key: "changeBoundedY",
	    value: function changeBoundedY(yDiff) {
	      this.setBoundedY(this.sprite.y + yDiff);
	    }
	  }, {
	    key: "changeBoundedPos",
	    value: function changeBoundedPos(xDiff, yDiff) {
	      this.changeBoundedX(xDiff);
	      this.changeBoundedY(yDiff);
	    }
	  }, {
	    key: "getX",
	    value: function getX() {
	      return this.sprite.x;
	    }
	  }, {
	    key: "getY",
	    value: function getY() {
	      return this.sprite.y;
	    }
	  }, {
	    key: "getWidth",
	    value: function getWidth() {
	      return this.sprite.getBounds().width;
	    }
	  }, {
	    key: "getHeight",
	    value: function getHeight() {
	      return this.sprite.getBounds().height;
	    }
	  }, {
	    key: "getMaxX",
	    value: function getMaxX() {
	      return this.getX() + this.getWidth() - 1;
	    }
	  }, {
	    key: "getMaxY",
	    value: function getMaxY() {
	      return this.getY() + this.getHeight() - 1;
	    }
	  }, {
	    key: "centerX",
	    value: function centerX() {
	      return this.sprite.x + this.sprite.getBounds().width / 2;
	    }
	  }, {
	    key: "centerY",
	    value: function centerY() {
	      return this.sprite.y + this.sprite.getBounds().height / 2;
	    }
	  }, {
	    key: "withinCanvas",
	    value: function withinCanvas(posX, posY) {
	      var bounds = this.sprite.getBounds();
	      return posX >= 0 && posX + bounds.width <= this.canvas.width && posY >= 0 && posY + bounds.height <= this.canvas.height;
	    }
	  }, {
	    key: "withinMoveBoundsX",
	    value: function withinMoveBoundsX(newX) {
	      var bounds = this.sprite.getBounds();
	      if (newX < this.moveBounds.minX) newX = this.moveBounds.minX;
	      if (newX + bounds.width > this.moveBounds.maxX) {
	        newX = this.moveBounds.maxX - bounds.width;
	      }
	      return newX;
	    }
	  }, {
	    key: "withinMoveBoundsY",
	    value: function withinMoveBoundsY(newY) {
	      var bounds = this.sprite.getBounds();
	      if (newY < this.moveBounds.minY) newY = this.moveBounds.minY;
	      if (newY + bounds.height > this.moveBounds.maxY) {
	        newY = this.moveBounds.maxY - bounds.height;
	      }
	      return newY;
	    }
	  }, {
	    key: "destroySprite",
	    value: function destroySprite() {
	      this.sprite = null;
	    }
	  }, {
	    key: "destroy",
	    value: function destroy() {
	      this.destroySprite();
	    }
	  }, {
	    key: "overlaps",
	    value: function overlaps(other) {
	      if (this.getMaxX() < other.getX() || other.getMaxX() < this.getX() || this.getMaxY() < other.getY() || other.getMaxY() < this.getY()) {
	        return false;
	      } else {
	        return true;
	      }
	    }
	  }]);
	
	  return GameObject;
	}();
	
	exports.default = GameObject;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _createjs = __webpack_require__(1);
	
	var _createjs2 = _interopRequireDefault(_createjs);
	
	var _game_object = __webpack_require__(10);
	
	var _game_object2 = _interopRequireDefault(_game_object);
	
	var _sprite_sheets = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var VELOCITY_Y = -8;
	var LASER_BEAM_SHEET = (0, _sprite_sheets.createLaserBeamSpriteSheet)();
	
	var LaserBeam = function (_GameObject) {
	  _inherits(LaserBeam, _GameObject);
	
	  function LaserBeam(options) {
	    _classCallCheck(this, LaserBeam);
	
	    var laserBeamSprite = new _createjs2.default.Sprite(LASER_BEAM_SHEET);
	
	    var defaultOptions = {
	      width: 2,
	      height: 12,
	      sprite: laserBeamSprite
	    };
	
	    return _possibleConstructorReturn(this, (LaserBeam.__proto__ || Object.getPrototypeOf(LaserBeam)).call(this, Object.assign(defaultOptions, options)));
	  }
	
	  _createClass(LaserBeam, [{
	    key: 'updatePosition',
	    value: function updatePosition() {
	      this.changeY(VELOCITY_Y);
	    }
	  }]);
	
	  return LaserBeam;
	}(_game_object2.default);
	
	exports.default = LaserBeam;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _createjs = __webpack_require__(1);
	
	var _createjs2 = _interopRequireDefault(_createjs);
	
	var _segment = __webpack_require__(13);
	
	var _segment2 = _interopRequireDefault(_segment);
	
	var _sprite_sheets = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var HEAD_SHEET = (0, _sprite_sheets.createHeadSpriteSheet)();
	
	var Head = function (_Segment) {
	  _inherits(Head, _Segment);
	
	  function Head(options, moveBounds) {
	    _classCallCheck(this, Head);
	
	    var startFrame = options.direction === _segment.LEFT ? "moveLeft" : "moveRight";
	    var headSprite = new _createjs2.default.Sprite(HEAD_SHEET, startFrame);
	
	    return _possibleConstructorReturn(this, (Head.__proto__ || Object.getPrototypeOf(Head)).call(this, options, moveBounds, headSprite));
	  }
	
	  _createClass(Head, null, [{
	    key: 'createHeadFromSegment',
	    value: function createHeadFromSegment(segment) {
	      var head = new Head({
	        x: segment.getX(),
	        y: segment.getY(),
	        direction: segment.direction,
	        verticalDirection: segment.verticalDirection,
	        velocityX: segment.velocityX
	      }, Object.assign({}, segment.moveBounds));
	      if (segment.next) head.connectNext(segment.next);
	      return head;
	    }
	  }]);
	
	  return Head;
	}(_segment2.default);
	
	exports.default = Head;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.INITIAL_VELOCITY_X = exports.LEFT = exports.RIGHT = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _createjs = __webpack_require__(1);
	
	var _createjs2 = _interopRequireDefault(_createjs);
	
	var _game_object = __webpack_require__(10);
	
	var _game_object2 = _interopRequireDefault(_game_object);
	
	var _sprite_sheets = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SEGMENT_SHEET = (0, _sprite_sheets.createSegmentSpriteSheet)();
	
	var RIGHT = exports.RIGHT = 'RIGHT';
	var LEFT = exports.LEFT = 'LEFT';
	var DOWN = 'DOWN';
	var UP = 'UP';
	var VERTICAL_FROM_RIGHT = 'VERTICAL_FROM_RIGHT';
	var VERTICAL_FROM_LEFT = 'VERTICAL_FROM_LEFT';
	
	var INITIAL_VELOCITY_X = exports.INITIAL_VELOCITY_X = 2;
	var VELOCITY_Y = 10;
	
	var Segment = function (_GameObject) {
	  _inherits(Segment, _GameObject);
	
	  function Segment(options, moveBounds, alternateSprite) {
	    _classCallCheck(this, Segment);
	
	    var segmentSprite = void 0;
	    if (alternateSprite) {
	      segmentSprite = alternateSprite;
	    } else {
	      var startFrame = options.direction === LEFT ? "moveLeft" : "moveRight";
	      segmentSprite = alternateSprite ? alternateSprite : new _createjs2.default.Sprite(SEGMENT_SHEET, startFrame);
	    }
	
	    var defaultOptions = {
	      x: 0,
	      y: 0,
	      width: 16,
	      height: 20,
	      sprite: segmentSprite
	    };
	
	    var _this = _possibleConstructorReturn(this, (Segment.__proto__ || Object.getPrototypeOf(Segment)).call(this, Object.assign(defaultOptions, options), moveBounds));
	
	    _this.direction = options.direction || RIGHT;
	    _this.verticalDirection = options.verticalDirection || DOWN;
	    _this.velocityX = options.velocityX || INITIAL_VELOCITY_X;
	
	    _this.prev = null;
	    _this.next = null;
	    return _this;
	  }
	
	  _createClass(Segment, [{
	    key: 'updatePosition',
	    value: function updatePosition() {
	      var collided = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	
	      switch (this.direction) {
	        case RIGHT:
	          if (this.moveBounds.maxX - this.getMaxX() > this.velocityX && !collided) {
	            this.moveRight();
	          } else {
	            this.moveVerticalFromRight();
	          }
	          break;
	        case LEFT:
	          if (this.getX() - this.moveBounds.minX > this.velocityX && !collided) {
	            this.moveLeft();
	          } else {
	            this.moveVerticalFromLeft();
	          }
	          break;
	        case VERTICAL_FROM_RIGHT:
	          this.moveLeftFromVertical();
	          break;
	        case VERTICAL_FROM_LEFT:
	          this.moveRightFromVertical();
	          break;
	      }
	      if (this.verticalDirection === DOWN && this.moveBounds.maxY - this.getMaxY() < 10) {
	        this.verticalDirection = UP;
	        this.moveBounds.minY = 520;
	      } else if (this.verticalDirection === UP && this.getY() - this.moveBounds.minY < 10) {
	        this.verticalDirection = DOWN;
	      }
	    }
	  }, {
	    key: 'moveRight',
	    value: function moveRight() {
	      this.changeX(this.velocityX);
	      this.direction = RIGHT;
	    }
	  }, {
	    key: 'moveLeft',
	    value: function moveLeft() {
	      this.changeX(-this.velocityX);
	      this.direction = LEFT;
	    }
	  }, {
	    key: 'moveVerticalFromRight',
	    value: function moveVerticalFromRight() {
	      var vertChange = void 0;
	      if (this.verticalDirection === DOWN) {
	        vertChange = VELOCITY_Y;
	        this.sprite.gotoAndPlay('moveDown');
	      } else {
	        vertChange = -VELOCITY_Y;
	        this.sprite.gotoAndPlay('moveUp');
	      }
	      this.changeX(this.velocityX);
	      this.changeY(vertChange);
	      this.direction = VERTICAL_FROM_RIGHT;
	    }
	  }, {
	    key: 'moveVerticalFromLeft',
	    value: function moveVerticalFromLeft() {
	      var vertChange = void 0;
	      if (this.verticalDirection === DOWN) {
	        vertChange = VELOCITY_Y;
	        this.sprite.gotoAndPlay('moveDown');
	      } else {
	        vertChange = -VELOCITY_Y;
	        this.sprite.gotoAndPlay('moveUp');
	      }
	      this.changeX(-this.velocityX);
	      this.changeY(vertChange);
	      this.direction = VERTICAL_FROM_LEFT;
	    }
	  }, {
	    key: 'moveRightFromVertical',
	    value: function moveRightFromVertical() {
	      var vertChange = this.verticalDirection === DOWN ? VELOCITY_Y : -VELOCITY_Y;
	      this.sprite.gotoAndPlay('moveRight');
	      this.changeX(this.velocityX);
	      this.changeY(vertChange);
	      this.direction = RIGHT;
	    }
	  }, {
	    key: 'moveLeftFromVertical',
	    value: function moveLeftFromVertical() {
	      var vertChange = this.verticalDirection === DOWN ? VELOCITY_Y : -VELOCITY_Y;
	      this.sprite.gotoAndPlay('moveLeft');
	      this.changeX(-this.velocityX);
	      this.changeY(vertChange);
	      this.direction = LEFT;
	    }
	  }, {
	    key: 'connectNext',
	    value: function connectNext(segment) {
	      var oldNext = this.next;
	      this.next = segment;
	      if (segment.prev) segment.prev.next = null;
	      segment.prev = this;
	      if (oldNext) {
	        oldNext.prev = segment;
	        segment.next = oldNext;
	      }
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      if (this.next) this.next.prev = null;
	      if (this.prev) this.prev.next = null;
	      this.next = null;
	      this.prev = null;
	      this.destroySprite();
	    }
	  }]);
	
	  return Segment;
	}(_game_object2.default);
	
	exports.default = Segment;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _createjs = __webpack_require__(1);
	
	var _createjs2 = _interopRequireDefault(_createjs);
	
	var _game_object = __webpack_require__(10);
	
	var _game_object2 = _interopRequireDefault(_game_object);
	
	var _sprite_sheets = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SEA_SPONGE_SHEET = (0, _sprite_sheets.createSeaSpongeSpriteSheet)();
	
	var SeaSponge = function (_GameObject) {
	  _inherits(SeaSponge, _GameObject);
	
	  function SeaSponge(options) {
	    _classCallCheck(this, SeaSponge);
	
	    var seaSpongeSprite = new _createjs2.default.Sprite(SEA_SPONGE_SHEET);
	
	    var defaultOptions = {
	      x: 0,
	      y: 0,
	      width: 16,
	      height: 20,
	      sprite: seaSpongeSprite
	    };
	
	    var _this = _possibleConstructorReturn(this, (SeaSponge.__proto__ || Object.getPrototypeOf(SeaSponge)).call(this, Object.assign(defaultOptions, options)));
	
	    _this.hits = 3;
	    return _this;
	  }
	
	  _createClass(SeaSponge, [{
	    key: 'handleHit',
	    value: function handleHit() {
	      this.hits -= 1;
	
	      switch (this.hits) {
	        case 2:
	          this.sprite.gotoAndStop("oneHit");
	          break;
	        case 1:
	          this.sprite.gotoAndStop("twoHits");
	          break;
	      }
	    }
	  }]);
	
	  return SeaSponge;
	}(_game_object2.default);
	
	exports.default = SeaSponge;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map