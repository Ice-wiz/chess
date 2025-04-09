import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../messages";
import { useSound } from "../hooks/useSound";

export const ChessBoard = ({
  chess,
  board,
  socket,
  setBoard,
  color,
}: {
  chess: Chess;
  setBoard: React.Dispatch<
    React.SetStateAction<
      ({ square: Square; type: PieceSymbol; color: Color } | null)[][]
    >
  >;
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  socket: WebSocket;
  color: "w" | "b" | "";
}) => {
  const [from, setFrom] = useState<null | Square>(null);
  const { play } = useSound();

  const handleSquareClick = (clickedSquare: Square) => {
    if (chess.turn() !== color) {
      alert("It's not your turn");
      return;
    }

    if (!from) {
      setFrom(clickedSquare);
      console.log(`Selected: ${clickedSquare}`);
      return;
    }

    const move = { from, to: clickedSquare };

    try {
      const moveResult = chess.move(move);
      // capture sound

      if (!moveResult) {
        play("invalid-move");
        return;
      }

      console.log(`Moved: ${from} -> ${clickedSquare}`);
      console.log("Board after move:\n", chess.ascii());

      if(moveResult.captured) {
        play("capture");
      }

      play("move-self");
      setBoard(chess.board());

      socket.send(
        JSON.stringify({
          type: MOVE,
          payload: { move },
        })
      );
    } catch (err: any) {
      console.error("Move error:", err.message);
      play("invalid-move");
      alert("Error while moving piece.");
    } finally {
      setFrom(null);
    }
  };

  const getSquareLabel = (row: number, col: number) =>
    `${String.fromCharCode(97 + col)}${8 - row}` as Square;

  const renderSquare = (
    square: { square: Square; type: PieceSymbol; color: Color } | null,
    squareLabel: Square,
    isLight: boolean,
    key: string
  ) => {
    const bgClass = isLight ? "bg-green-600" : "bg-white";
    const pieceSrc = square
      ? `chess-pieces/${square.color}${square.type}.png`
      : "";

    return (
      <div
        key={key}
        onClick={() => handleSquareClick(squareLabel)}
        className={`w-16 h-16 ${bgClass}`}
      >
        <div className="w-full h-full flex justify-center items-center cursor-pointer">
          {pieceSrc && <img src={pieceSrc} alt="" />}
        </div>
      </div>
    );
  };

  const rows = color !== "b" ? board : [...board].slice().reverse();

  return (
    <div className="text-white-200 ">
      {rows.map((row, rowIndex) => {
        const actualRow = color === "w" ? row : [...row].slice().reverse();

        return (
          <div key={rowIndex} className="flex">
            {actualRow.map((square, colIndex) => {
              const actualRowIdx = color === "w" ? rowIndex : 7 - rowIndex;
              const actualColIdx = color === "w" ? colIndex : 7 - colIndex;
              const squareLabel = getSquareLabel(actualRowIdx, actualColIdx);
              const isLight = (actualRowIdx + actualColIdx) % 2 === 0;

              return renderSquare(
                square,
                squareLabel,
                isLight,
                `${actualRowIdx}-${actualColIdx}`
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
