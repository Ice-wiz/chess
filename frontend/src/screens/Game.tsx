import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { Loading } from "../components/Loading";
import { useSocket } from "../hooks/useSocket";
import { GAME_OVER, INIT_GAME, MOVE } from "../messages";
import { Chess } from "chess.js";

export const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board ,setBoard] = useState(chess.board());
  // Handle socket events here
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      // Handle incoming messages here
      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setBoard(chess.board());
          console.log("Game initialized");
          break;
        // Add more cases for different message types
        case MOVE:
          const move = message.payload;
          chess?.move(move)
          // Update the board with the move
          setBoard(chess.board());
          console.log("Move received:", message.data);
          break;

        case GAME_OVER:
          console.log("Game over:", message.data);
          break;
      }
    };
  }, [socket]);

  if (!socket) return <Loading />;

  return (
    <div className="bg-gray-900 text-white">
      <div className="justify-center flex h-screen">
        <div className="pt-8 max-w-screen-lg bg-red-300 w-full">
          <div className="grid grid-cols-6 gap-4 w-full">
            <div className="col-span-4 bg-yellow-300 w-full">
              <ChessBoard board={board}/>
            </div>
            <div className="flex justify-center col-span-2 bg-green-300 w-full">
              <Button
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: INIT_GAME,
                    })
                  );
                }}
              >
                Play
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
