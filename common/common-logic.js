"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineStatus = void 0;
const types_1 = require("./types");
const determineStatus = (state) => {
    if (state.playerGesture === types_1.Gestures.paper) {
        if (state.opponentGesture === types_1.Gestures.paper) {
            return types_1.GameStatus.tie;
        }
        if (state.opponentGesture === types_1.Gestures.rock) {
            return types_1.GameStatus.win;
        }
        if (state.opponentGesture === types_1.Gestures.scissors) {
            return types_1.GameStatus.lose;
        }
    }
    if (state.playerGesture === types_1.Gestures.rock) {
        if (state.opponentGesture === types_1.Gestures.paper) {
            return types_1.GameStatus.lose;
        }
        if (state.opponentGesture === types_1.Gestures.rock) {
            return types_1.GameStatus.tie;
        }
        if (state.opponentGesture === types_1.Gestures.scissors) {
            return types_1.GameStatus.win;
        }
    }
    if (state.playerGesture === types_1.Gestures.scissors) {
        if (state.opponentGesture === types_1.Gestures.paper) {
            return types_1.GameStatus.win;
        }
        if (state.opponentGesture === types_1.Gestures.rock) {
            return types_1.GameStatus.lose;
        }
        if (state.opponentGesture === types_1.Gestures.scissors) {
            return types_1.GameStatus.tie;
        }
    }
    return types_1.GameStatus.tie;
};
exports.determineStatus = determineStatus;
