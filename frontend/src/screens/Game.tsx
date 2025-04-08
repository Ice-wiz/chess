import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "../messages";
import { Loading } from "../components/Loading";

export const Game = () => {
  const socket = useSocket();
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const [moveCount , setMoveCount] = useState(0); // State to track the number of moves made in the game  

  // State to track the active player
  // This could be a color (e.g., "white" or "black") or null if not set
  // This is used to determine whose turn it is
  // and to manage the game state accordingly

const [activePlayer, setActivePlayer] = useState<null | string>(null);


  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME:
          initializeGame(message.payload);
          break;
        case MOVE:
          handleMove(message.payload);
          break;
        case GAME_OVER:
          handleGameOver();
          break;
        default:
          console.warn("Unknown message type:", message.type);
      }
    };

    socket.onmessage = handleMessage;

    return () => {
      socket.onmessage = null; // Cleanup listener on unmount
    };
  }, [socket]);

  // Initialize the game
  const initializeGame = (Player:{}) => {
    console.log(Player);
    setBoard(chess.board());
    setStarted(true);
  };

  // Handle a move from the server
  const handleMove = (payload:{move:{to:string,from:string},moveCount:number}) => {
    chess.move(payload.move);
    setBoard(chess.board());
    console.log("Move made:", payload.move);
    console.log("move count:",payload.moveCount);
    setMoveCount(payload.moveCount);
  };

  // Handle game over
  const handleGameOver = () => {
    console.log("Game over");
  };

  // Handle the "Play" button click
  const handlePlayClick = () => {
    if (socket) {
      socket.send(
        JSON.stringify({
          type: INIT_GAME,
        })
      );
    }

    console.log(JSON.stringify({ type: INIT_GAME }));
  };

  if (!socket) return <Loading />;

  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          {/* Chessboard Section */}
          <div className="col-span-4 w-full flex justify-center">
            <ChessBoard moveCount={moveCount} chess={chess} setBoard={setBoard} socket={socket} board={board} />
          </div>

          {/* Sidebar Section */}
          <div className="col-span-2 bg-slate-900 w-full flex justify-center">
            <div className="pt-8">
              {!started && <Button onClick={handlePlayClick}>Play</Button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};