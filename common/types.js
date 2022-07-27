"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStatus = exports.GesturesNumber = exports.Gestures = void 0;
var Gestures;
(function (Gestures) {
    Gestures[Gestures["noMove"] = -1] = "noMove";
    Gestures[Gestures["rock"] = 0] = "rock";
    Gestures[Gestures["paper"] = 1] = "paper";
    Gestures[Gestures["scissors"] = 2] = "scissors";
})(Gestures = exports.Gestures || (exports.Gestures = {}));
;
exports.GesturesNumber = 3;
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["pendingGameModeSelection"] = -2] = "pendingGameModeSelection";
    GameStatus[GameStatus["pendingOpponentToJoin"] = -1] = "pendingOpponentToJoin";
    GameStatus[GameStatus["pendingPlayerGesture"] = 0] = "pendingPlayerGesture";
    GameStatus[GameStatus["playerGestureSelected"] = 1] = "playerGestureSelected";
    GameStatus[GameStatus["opponentGestureSelected"] = 2] = "opponentGestureSelected";
    GameStatus[GameStatus["win"] = 3] = "win";
    GameStatus[GameStatus["lose"] = 4] = "lose";
    GameStatus[GameStatus["tie"] = 5] = "tie";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));
;
