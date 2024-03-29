"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
require("./controllers/player-actions.controller");
const player_actions_controller_1 = require("./controllers/player-actions.controller");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: '*' },
});
io.on('connection', (socket) => {
    console.log(`${socket.id} user connected.`);
    // TODO: the following should be REST ??
    socket.on('registerAsDeterminedPlayer', (playerName) => {
        const wasAdded = (0, player_actions_controller_1.addPlayerToDeterminedPlayersList)(playerName.playerName, socket.id);
        io.to(socket.id).emit(wasAdded ? 'playerAddedToDeterminedPlayers' : 'playerAlreadyExists');
    });
    socket.on('joinRandomPlayer', () => {
        const opponentPlayerId = (0, player_actions_controller_1.playAgainstRandomPlayerAndReturnRandomPlayerId)(socket.id);
        if (opponentPlayerId == null) {
            return;
        }
        SendGameStartedMessage(socket.id, opponentPlayerId);
    });
    // TODO: the following should be REST ??
    socket.on('getAllWaitingDeterminedPlayers', () => {
        const determinedPlayersList = (0, player_actions_controller_1.getWaitingDeterminedPlayersList)();
        io.to(socket.id).emit('waitingPlayers', { waitingPlayers: determinedPlayersList });
    });
    socket.on('joinDeterminedPlayer', (playerName) => {
        const opponentPlayerId = (0, player_actions_controller_1.playAgainstDeterminedPlayerAndReturnOpponentPlayerId)(socket.id, playerName.playerName);
        if (opponentPlayerId == null) {
            return;
        }
        SendGameStartedMessage(socket.id, opponentPlayerId);
    });
    socket.on('playerMove', (move) => {
        const opponentPlayerId = (0, player_actions_controller_1.executeMove)(socket.id, move);
        if (opponentPlayerId == null) {
            return;
        }
        const opponentState = (0, player_actions_controller_1.getPlayerState)(opponentPlayerId);
        console.log(`opponentPlayerId: ${opponentPlayerId} state is:`);
        console.table(opponentState);
        const playerState = (0, player_actions_controller_1.getPlayerState)(socket.id);
        console.log(`PlayerId: ${socket.id} state is:`);
        console.table(playerState);
        io.to(opponentPlayerId).emit('playerStateUpdate', { opponentMove: playerState.move, playerScore: opponentState.score });
        io.to(socket.id).emit('playerStateUpdate', { opponentMove: opponentState.move, playerScore: playerState.score });
        (0, player_actions_controller_1.preparePlayersForNextRound)(socket.id, opponentPlayerId);
    });
    //TODO: implelemet switch player in the future.
    socket.on('disconnect', () => {
        const opponentPlayerId = (0, player_actions_controller_1.playerDisconnect)(socket.id);
        console.log(`${socket.id}  user disconnected!`);
        if (opponentPlayerId == null) {
            return;
        }
        io.to(opponentPlayerId).emit('opponentDisconnect', null);
    });
    function SendGameStartedMessage(socketId, opponentPlayerId) {
        console.log(`starting game between ${socketId} and ${opponentPlayerId}`);
        io.to(opponentPlayerId).emit('startingGame', { opponentPlayerId: socketId });
        io.to(socketId).emit('startingGame', { opponentPlayerId: opponentPlayerId });
    }
});
// TODO: test code needs to be removed
app.get('/', (req, res) => {
    res.send('Connected!');
});
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`The application is listening on port ${PORT}!`);
    (0, player_actions_controller_1.initializePlayerState)();
});
