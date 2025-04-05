import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    private startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'white',
                time: this.startTime
            }
        }));

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'black',
                time: this.startTime
            }
        }));
    }

    makeMove(socket: WebSocket, move: { from: string; to: string }) {
        // Determine if the correct player is making the move
        if (this.board.turn() === 'w' && socket !== this.player1) {
            console.log("hello"); // Invalid move by black on white's turn
            return;
        }

        if (this.board.turn() === 'b' && socket !== this.player2) {
            return;
        }

        try {
            this.board.move(move);
        } catch (error) {
            console.log(error);
            return;
        }

        if (this.board.isGameOver()) {
            const winner = this.board.turn() === 'w' ? 'black' : 'white';

            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: { winner }
            }));

            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: { winner }
            }));

            return;
        }

        // Notify opponent of the move
        const opponent = socket === this.player1 ? this.player2 : this.player1;
        opponent.send(JSON.stringify({
            type: MOVE,
            payload: move
        }));
    }
}
