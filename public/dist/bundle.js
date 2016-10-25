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

	"use strict";
	var React = __webpack_require__(1);
	var ReactDOM = __webpack_require__(2);
	var main_1 = __webpack_require__(3);
	ReactDOM.render(React.createElement(main_1.Main, null), document.getElementById("root"));


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var client_1 = __webpack_require__(4);
	var game_1 = __webpack_require__(5);
	var Main = (function (_super) {
	    __extends(Main, _super);
	    function Main(props) {
	        var _this = this;
	        _super.call(this, props);
	        this.handleClick = function (e) {
	            _this.ioSendAwnser(8);
	        };
	        this.ioNewRound = function (data) {
	            _this.state.connection.round = data.round;
	            _this.state.connection.clients.forEach(function (client) {
	                if (client.username === data.winner.username) {
	                    client.score = data.winner.score;
	                }
	            });
	            _this.setState({ connection: _this.state.connection });
	        };
	        this.ioNewScore = function (data) {
	            _this.state.connection.round = data.round;
	            _this.state.connection.clientData.score = data.score;
	            _this.setState({ connection: _this.state.connection });
	        };
	        this.ioNoRoom = function (data) {
	            _this.setState({ connection: data });
	        };
	        this.ioConnected = function (data) {
	            _this.setState({ connection: data });
	        };
	        this.ioClientConnected = function (data) {
	            _this.state.connection.clients.push(data);
	            _this.setState({ connection: _this.state.connection });
	        };
	        this.ioClientDisconnected = function (data) {
	            _this.state.connection.clients = _this.state.connection.clients.filter(function (el) {
	                return el.username !== data.username;
	            });
	            _this.setState({ connection: _this.state.connection });
	        };
	        this.ioSocket = io();
	        this.ioSocket.on('noRoom', this.ioNoRoom);
	        this.ioSocket.on('connected', this.ioConnected);
	        this.ioSocket.on('clientConnected', this.ioClientConnected);
	        this.ioSocket.on('clientDisconnected', this.ioClientDisconnected);
	        this.ioSocket.on('newRound', this.ioNewRound);
	        this.ioSocket.on('newScore', this.ioNewScore);
	        this.state = {
	            connection: {
	                isEnabled: false,
	                round: 0,
	                clientData: {
	                    score: 0,
	                    username: "unknown"
	                },
	                clients: []
	            }
	        };
	    }
	    Main.prototype.componentDidMount = function () {
	    };
	    Main.prototype.componentWillUnmount = function () {
	    };
	    Main.prototype.render = function () {
	        return (React.createElement("div", null, 
	            React.createElement("div", {className: "row"}, 
	                React.createElement("div", {className: "col-sm-6 offset-sm-1"}, 
	                    React.createElement("h1", {className: "display-1 text-primary"}, "fastmath")
	                ), 
	                React.createElement("div", {className: "col-sm-4"}, 
	                    React.createElement("h1", {className: "display-3 text-primary"}, 
	                        React.createElement("span", {className: "text-nowrap"}, 
	                            "round: ", 
	                            this.state.connection.round), 
	                        React.createElement("br", null), 
	                        React.createElement("span", {className: "text-nowrap"}, 
	                            "score: ", 
	                            this.state.connection.clientData.score))
	                )), 
	            React.createElement("div", {className: "row"}, 
	                React.createElement("div", {className: "col-sm-6 offset-sm-1"}, 
	                    this.state.connection.isEnabled &&
	                        React.createElement("div", null, 
	                            React.createElement("h2", {className: "display-4"}, 
	                                "Hello ", 
	                                React.createElement("strong", null, this.state.connection.clientData.username), 
	                                "!"), 
	                            React.createElement(game_1.Game, {add: 2, handleClick: this.handleClick})), 
	                    !this.state.connection.isEnabled && this.state.connection.clientData.username != "unknown" &&
	                        React.createElement("div", null, 
	                            React.createElement("h2", {className: "display-4"}, 
	                                "Sorry... ", 
	                                React.createElement("br", null), 
	                                "No room for you ", 
	                                React.createElement("strong", null, this.state.connection.clientData.username), 
	                                "!"), 
	                            React.createElement("h3", {className: "display-6"}, "Please wait for someone to leave the game"))), 
	                this.state.connection.clients.length > 0 &&
	                    React.createElement("div", {className: "col-sm-4"}, 
	                        React.createElement("ul", {className: "list-group"}, 
	                            React.createElement("li", {href: "#", className: "list-group-item active"}, 
	                                React.createElement("h5", {className: "list-group-item-heading"}, 
	                                    this.state.connection.clients.length, 
	                                    this.state.connection.clients.length === 1 &&
	                                        React.createElement("span", null, " player also playing"), 
	                                    this.state.connection.clients.length > 1 &&
	                                        React.createElement("span", null, " players also playing"), 
	                                    React.createElement("span", null, "..."))
	                            ), 
	                            this.state.connection.clients.map(function (client) {
	                                return React.createElement(client_1.Client, {key: client.username, username: client.username, score: client.score});
	                            }))
	                    ))));
	    };
	    Main.prototype.ioSendAwnser = function (value) {
	        this.ioSocket.emit("answer", { round: this.state.connection.round, value: value });
	    };
	    return Main;
	}(React.Component));
	exports.Main = Main;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var Client = (function (_super) {
	    __extends(Client, _super);
	    function Client() {
	        _super.apply(this, arguments);
	    }
	    Client.prototype.render = function () {
	        return (React.createElement("li", {className: "list-group-item"}, 
	            React.createElement("span", {className: "tag tag-default tag-pill float-xs-right"}, this.props.score), 
	            this.props.username));
	    };
	    return Client;
	}(React.Component));
	exports.Client = Client;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(1);
	var Game = (function (_super) {
	    __extends(Game, _super);
	    function Game() {
	        var _this = this;
	        _super.apply(this, arguments);
	        this.handleClick = function (e) {
	            e.preventDefault();
	            _this.props.handleClick(e);
	        };
	    }
	    Game.prototype.render = function () {
	        return (React.createElement("div", null, 
	            React.createElement("h1", null, this.props.add), 
	            React.createElement("a", {href: "#", className: "btn btn-primary", onClick: this.handleClick}, "Click me")));
	    };
	    return Game;
	}(React.Component));
	exports.Game = Game;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map