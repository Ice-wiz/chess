import { WebSocket } from "ws";
import Messages from "./messages";
import { Game } from "./Game";



export class GameManager {

    private games : Game[] ;
    private pendingUser: WebSocket|null;
    private users : WebSocket[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket:WebSocket){
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket:WebSocket){
        this.users = this.users.filter((user)=> user !== socket);
        //stop the game here because user left
    }

    private addHandler (socket:WebSocket) {
        socket.on("message", (data)=>{
            const message = JSON.parse(data.toString());
            switch (message.type) {
                case Messages.INIT_GAME.type:
                    if(this.pendingUser){
                        //start the game
                        const game = new Game(this.pendingUser, socket);
                        this.games.push(game);
                        this.pendingUser= null;
                    }
                    this.pendingUser = socket;
                    break;
                
                case Messages.MOVE.type:
                    // can be a better way to find the current game than making player 1 and player 2 public 
                    const game = this.games.find((game) => game.player1 === socket || game.player2 === socket);
                    
                    break;

            }
        })
    }
}