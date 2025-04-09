import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "../messages";
import { Loading } from "../components/Loading";
import { useSoundContext } from "../context/SoundContext";
import { useSound } from "../hooks/useSound";

export const Game = () => {
  const socket = useSocket();
  const [chess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);
  const [color, setColor] = useState<"w" | "b" | "">("");

  const { enabled, toggleSound } = useSoundContext();
  const { play } = useSound();

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
      socket.onmessage = null;
    };
  }, [socket]);

  const initializeGame = (player: { color: "w" | "b" }) => {
    setBoard(chess.board());
    setStarted(true);
    setColor(player.color);
    console.log(chess.turn());
    play("game-start");
  };

  const handleMove = (payload: { move: { to: string; from: string } }) => {
    chess.move(payload.move);
    setBoard(chess.board());
    console.log(chess.turn());
    play("move-self");
  };

  const handleGameOver = () => {
    console.log("Game over");
    play("game-over");
  };

  const handlePlayClick = () => {
    if (socket) {
      socket.send(JSON.stringify({ type: INIT_GAME }));
    }
  };

  if (!socket) return <Loading />;

  return (
    <div className="justify-center flex bg-slate-800 h-screen w-screen">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-4 w-full flex justify-center">
            <ChessBoard
              chess={chess}
              setBoard={setBoard}
              socket={socket}
              board={board}
              color={color}
            />
          </div>
          <div className="col-span-2 bg-slate-900 w-full flex justify-center">
            <div className="w-full flex flex-col items-center">
              <div className="pt-8">
                <Button onClick={toggleSound}>
                  {enabled ? "Sound On" : "Sound Off"}
                </Button>
              </div>
              <div className="pt-4">
                {!started && <Button onClick={handlePlayClick}>Play</Button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


