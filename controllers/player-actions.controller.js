"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerDisconnect = exports.getPlayerState = exports.executeMove = exports.preparePlayersForNextRound = exports.startNewGame = exports.playAgainstDeterminedPlayerAndReturnOpponentPlayerId = exports.playAgainstRandomPlayerAndReturnRandomPlayerId = exports.addPlayerToRandomPlayersList = exports.addPlayerToDeterminedPlayersList = exports.getWaitingDeterminedPlayersList = exports.initializePlayerState = void 0;
const types_1 = require("../common/types");
const common_logic_1 = require("../common/common-logic");
const initializePlayerState = () => {
    const playingPlayers = {
        playersMap: new Map(),
        reversedPlayersMap: new Map(),
        playersState: new Map(),
    };
    const waitingPlayers = {
        randomPlayers: [],
        determinedPlayers: new Map,
    };
    global.players = { playingPlayers, waitingPlayers };
};
exports.initializePlayerState = initializePlayerState;
const getWaitingDeterminedPlayersList = () => {
    return [...global.players.waitingPlayers.determinedPlayers.keys()];
};
exports.getWaitingDeterminedPlayersList = getWaitingDeterminedPlayersList;
const addPlayerToDeterminedPlayersList = (playerName, playerSocketId) => {
    if (global.players.waitingPlayers.determinedPlayers.has(playerName)) {
        console.log(`player ${playerName} already registered to the game`);
        return false;
    }
    //TODO: consider timeout for waitingPlayers for a game
    global.players.waitingPlayers.determinedPlayers.set(playerName, playerSocketId);
    console.log(`player ${playerName} registered successfully`);
    return true;
};
exports.addPlayerToDeterminedPlayersList = addPlayerToDeterminedPlayersList;
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
    (0, exports.startNewGame)(playerId, opponentPlayerId);
    return opponentPlayerId;
};
exports.playAgainstRandomPlayerAndReturnRandomPlayerId = playAgainstRandomPlayerAndReturnRandomPlayerId;
const playAgainstDeterminedPlayerAndReturnOpponentPlayerId = (playerId, opponentPlayerName) => {
    const opponentPlayerId = global.players.waitingPlayers.determinedPlayers.get(opponentPlayerName);
    if (opponentPlayerId == null) {
        console.error(`There is no such player as playerName: ${opponentPlayerName}`);
        return;
    }
    (0, exports.startNewGame)(playerId, opponentPlayerId);
    return opponentPlayerId;
};
exports.playAgainstDeterminedPlayerAndReturnOpponentPlayerId = playAgainstDeterminedPlayerAndReturnOpponentPlayerId;
const startNewGame = (playerId, opponentPlayerId) => {
    global.players.playingPlayers.playersMap.set(playerId, opponentPlayerId);
    global.players.playingPlayers.playersMap.set(opponentPlayerId, playerId);
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
    const determinedPlayersToRemove = [];
    for (const [playerName, playerSocketId] of global.players.waitingPlayers.determinedPlayers) {
        if (playerSocketId === playerId) {
            determinedPlayersToRemove.push(playerName);
        }
    }
    determinedPlayersToRemove.forEach(playerName => global.players.waitingPlayers.determinedPlayers.delete(playerName));
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
    const gameStatus = (0, common_logic_1.determineStatus)({
        playerGesture: playersState === null || playersState === void 0 ? void 0 : playersState.move,
        opponentGesture: opponentState === null || opponentState === void 0 ? void 0 : opponentState.move,
        score: -1,
        isMultiplayer: false,
        status: types_1.GameStatus.tie // not relevant for this method
    });
    switch (gameStatus) {
        case types_1.GameStatus.win:
            setPlayerWinState();
            return;
        case types_1.GameStatus.lose:
            setOpponentWinState();
            return;
        default:
            return;
    }
};
