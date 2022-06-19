"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerDisconnect = exports.getPlayerState = exports.executeMove = exports.preparePlayersForNextRound = exports.startNewGame = exports.playAgainstRandomPlayerAndReturnRandomPlayerId = exports.addPlayerToRandomPlayersList = exports.initializePlayerState = void 0;
const utils_1 = require("../utils");
const initializePlayerState = () => {
    const playingPlayers = {
        playersMap: new Map(),
        reversedPlayersMap: new Map(),
        playersState: new Map(),
    };
    const waitingPlayers = {
        randomPlayers: [],
        determinedPlayers: [],
    };
    global.players = { playingPlayers, waitingPlayers };
};
exports.initializePlayerState = initializePlayerState;
const addPlayerToRandomPlayersList = (playerSocketId) => {
    //TODO: consider timeout for waitingPlayers for a game
    global.players.waitingPlayers.randomPlayers.push(playerSocketId);
};
exports.addPlayerToRandomPlayersList = addPlayerToRandomPlayersList;
const playAgainstRandomPlayerAndReturnRandomPlayerId = (playerId) => {
    const opponentPlayerId = global.players.waitingPlayers.randomPlayers.shift();
    if (opponentPlayerId == null) {
        console.log(`currntly no waitingPlayers hence adding player ${playerId} to waitingPlayers`);
        (0, exports.addPlayerToRandomPlayersList)(playerId);
        return;
    }
    global.players.playingPlayers.playersMap.set(playerId, opponentPlayerId);
    global.players.playingPlayers.playersMap.set(opponentPlayerId, playerId);
    (0, exports.startNewGame)(playerId, opponentPlayerId);
    return opponentPlayerId;
};
exports.playAgainstRandomPlayerAndReturnRandomPlayerId = playAgainstRandomPlayerAndReturnRandomPlayerId;
const startNewGame = (playerId, opponentPlayerId) => {
    global.players.playingPlayers.playersState.set(playerId, { move: -1, score: 0 });
    global.players.playingPlayers.playersState.set(opponentPlayerId, { move: -1, score: 0 });
};
exports.startNewGame = startNewGame;
const preparePlayersForNextRound = (playerId, opponentPlayerId) => {
    global.players.playingPlayers.playersState.set(playerId, { move: -1, score: (0, exports.getPlayerState)(playerId).score });
    global.players.playingPlayers.playersState.set(opponentPlayerId, { move: -1, score: (0, exports.getPlayerState)(opponentPlayerId).score });
};
exports.preparePlayersForNextRound = preparePlayersForNextRound;
const executeMove = (playerId, move) => {
    var _a;
    const playerstate = global.players.playingPlayers.playersState.get(playerId);
    if (playerstate == null) {
        // TODO: handle error case. maybe disconnect.
        return;
    }
    global.players.playingPlayers.playersState.set(playerId, Object.assign(Object.assign({}, playerstate), { move: move }));
    let opponentPlayerId = undefined;
    if (global.players.playingPlayers.playersMap.has(playerId)) {
        opponentPlayerId = global.players.playingPlayers.playersMap.get(playerId);
    }
    else {
        opponentPlayerId = global.players.playingPlayers.reversedPlayersMap.get(playerId);
    }
    if (opponentPlayerId == null) {
        // TODO: error opponet does not exist - maybe stop game
        return;
    }
    const opponentPlayerMove = (_a = global.players.playingPlayers.playersState.get(opponentPlayerId)) === null || _a === void 0 ? void 0 : _a.move;
    if (opponentPlayerMove == null || opponentPlayerMove === -1) {
        console.log(`opponentPlayerId ${opponentPlayerId} has not move yet`);
        return;
    }
    updateGameState(playerId, opponentPlayerId);
    return opponentPlayerId;
};
exports.executeMove = executeMove;
const getPlayerState = (playerId) => {
    return global.players.playingPlayers.playersState.get(playerId);
};
exports.getPlayerState = getPlayerState;
const playerDisconnect = (playerId) => {
    global.players.waitingPlayers.randomPlayers = global.players.waitingPlayers.randomPlayers.filter((player) => player !== playerId);
    global.players.waitingPlayers.determinedPlayers = global.players.waitingPlayers.determinedPlayers.filter((player) => player !== playerId);
    global.players.playingPlayers.playersState.delete(playerId);
    let opponentPlayerId = undefined;
    if (global.players.playingPlayers.playersMap.has(playerId)) {
        opponentPlayerId = global.players.playingPlayers.playersMap.get(playerId);
        global.players.playingPlayers.playersMap.delete(playerId);
        if (opponentPlayerId != null) {
            global.players.playingPlayers.reversedPlayersMap.delete(opponentPlayerId);
        }
    }
    else {
        opponentPlayerId = global.players.playingPlayers.reversedPlayersMap.get(playerId);
        global.players.playingPlayers.reversedPlayersMap.delete(playerId);
        if (opponentPlayerId != null) {
            global.players.playingPlayers.playersMap.delete(opponentPlayerId);
        }
    }
    if (opponentPlayerId != null) {
        global.players.playingPlayers.playersState.delete(opponentPlayerId);
    }
    return opponentPlayerId;
};
exports.playerDisconnect = playerDisconnect;
const updateGameState = (playerId, opponentPlayerId) => {
    const playersState = global.players.playingPlayers.playersState.get(playerId);
    const opponentState = global.players.playingPlayers.playersState.get(opponentPlayerId);
    const setPlayerWinState = () => {
        global.players.playingPlayers.playersState.set(playerId, Object.assign(Object.assign({}, playersState), { score: ++playersState.score }));
        global.players.playingPlayers.playersState.set(opponentPlayerId, Object.assign(Object.assign({}, opponentState), { score: --opponentState.score }));
    };
    const setOpponentWinState = () => {
        global.players.playingPlayers.playersState.set(playerId, Object.assign(Object.assign({}, playersState), { score: --playersState.score }));
        global.players.playingPlayers.playersState.set(opponentPlayerId, Object.assign(Object.assign({}, opponentState), { score: ++opponentState.score }));
    };
    // TODO: consolidate with client victory state
    if ((playersState === null || playersState === void 0 ? void 0 : playersState.move) === utils_1.Gestures.paper) {
        if ((opponentState === null || opponentState === void 0 ? void 0 : opponentState.move) === utils_1.Gestures.paper) {
            return;
        }
        if ((opponentState === null || opponentState === void 0 ? void 0 : opponentState.move) === utils_1.Gestures.rock) {
            setPlayerWinState();
            return;
        }
        if ((opponentState === null || opponentState === void 0 ? void 0 : opponentState.move) === utils_1.Gestures.scissors) {
            setOpponentWinState();
            return;
        }
    }
    if ((playersState === null || playersState === void 0 ? void 0 : playersState.move) === utils_1.Gestures.rock) {
        if ((opponentState === null || opponentState === void 0 ? void 0 : opponentState.move) === utils_1.Gestures.paper) {
            setOpponentWinState();
            return;
        }
        if ((opponentState === null || opponentState === void 0 ? void 0 : opponentState.move) === utils_1.Gestures.rock) {
            return;
        }
        if ((opponentState === null || opponentState === void 0 ? void 0 : opponentState.move) === utils_1.Gestures.scissors) {
            setPlayerWinState();
            return;
        }
    }
    if ((playersState === null || playersState === void 0 ? void 0 : playersState.move) === utils_1.Gestures.scissors) {
        if ((opponentState === null || opponentState === void 0 ? void 0 : opponentState.move) === utils_1.Gestures.paper) {
            setPlayerWinState();
            return;
        }
        if ((opponentState === null || opponentState === void 0 ? void 0 : opponentState.move) === utils_1.Gestures.rock) {
            setOpponentWinState();
            return;
        }
        if ((opponentState === null || opponentState === void 0 ? void 0 : opponentState.move) === utils_1.Gestures.scissors) {
            return;
        }
    }
};
