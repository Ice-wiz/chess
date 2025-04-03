
import { WebSocket } from "ws";
import { Chess } from "chess.js"
import Messages from "./messages";

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
    }

    makeMove(socket: WebSocket, move: {
        from: string;
        to: string;
    }) {

        // Check if the move is valid

        if (this.board.moves.length % 2 === 0 && socket !== this.player1) {
            return;
        }

        if (this.board.moves.length % 2 === 1 && socket !== this.player2) {
            return;
        }

        try {
            this.board.move(move);
        } catch (e) {
            return;
        }

        if (this.board.isGameOver()) {
            // we send message to both the players 
            this.player1.emit(JSON.stringify({
                type: Messages.GAME_OVER.type,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            }))
            this.player2.emit(JSON.stringify({
                type: Messages.GAME_OVER.type,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white'
                }
            }))

            return;
        }

        // Send the move to the other player

        if(this.board.moves.length%2===0){
            this.player2.emit(JSON.stringify({
                type: Messages.MOVE.type,
                payload: move
            }))         
        }else{
            this.player1.emit(JSON.stringify({
                type: Messages.MOVE.type,
                payload: move
            }))         
        }
    }
}