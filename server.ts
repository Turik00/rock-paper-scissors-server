import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import './controllers/player-actions.controller';
import {
  playAgainstRandomPlayerAndReturnRandomPlayerId,
  initializePlayerState,
  executeMove,
  getPlayerState,
  playerDisconnect,
  preparePlayersForNextRound,
} from './controllers/player-actions.controller';

const app = express();
app.use(express.json());
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log(`${socket.id} user connected.`);

  socket.on('waitForDeterminedPlayer', () => {
    //add user to determined players list
  });

  socket.on('joinRandomPlayer', () => {
    const opponentPlayerId = playAgainstRandomPlayerAndReturnRandomPlayerId(socket.id);
    if (opponentPlayerId == null) {
      return;
    }
    console.log(`starting game between ${socket.id} and ${opponentPlayerId}`);
    io.to(opponentPlayerId).emit('startingGame', { opponentPlayerId: socket.id });
    io.to(socket.id).emit('startingGame', { opponentPlayerId: opponentPlayerId });
  });

  socket.on('joinDeterminedPlayer', (playerSocketId) => {
    //add user to determined players list
  });

  socket.on('playerMove', (move) => {
    const opponentPlayerId = executeMove(socket.id, move);
    if (opponentPlayerId == null) {
      return;
    }
    const opponentState = getPlayerState(opponentPlayerId);
    console.log(`opponentPlayerId: ${opponentPlayerId} state is:`);
    console.table(opponentState);
    const playerState = getPlayerState(socket.id);
    console.log(`PlayerId: ${socket.id} state is:`);
    console.table(playerState);
    io.to(opponentPlayerId).emit('playerStateUpdate', {opponentMove: playerState.move, playerScore: opponentState.score});
    io.to(socket.id).emit('playerStateUpdate', {opponentMove: opponentState.move, playerScore: playerState.score});

    preparePlayersForNextRound(socket.id, opponentPlayerId);
  });

  //TODO: implelemet switch player in the future.

  socket.on('disconnect', () => {
    const opponentPlayerId = playerDisconnect(socket.id);
    console.log(`${socket.id}  user disconnected!`);
    if (opponentPlayerId == null) {
      return;
    }
    io.to(opponentPlayerId).emit('opponentDisconnect', null);

  });
});

// TODO: test code needs to be removed
app.get('/', (req, res) => {
  res.send('Connected!');
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`The application is listening on port ${PORT}!`);
  initializePlayerState();
});
