import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../messages";

export const ChessBoard = ({
  chess,
  board,
  socket,
  setBoard,
  color
}: {
  chess: Chess;
  setBoard: React.Dispatch<
    React.SetStateAction<
      ({
        square: Square;
        type: PieceSymbol;
        color: Color;
      } | null)[][]
    >
  >;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  color: "w" | "b" | "";
}) => {
  const [from, setFrom] = useState<null | Square>(null);

  const handleSquareClick = (square: Square) => {

    if(chess.turn()!==color){
      alert("It's not your turn");
      return;
    }

    if (!from) {
      setFrom(square);
    } else {
      try {
        const move = { from, to: square };
        const result = chess.move(move);

        if (!result) throw new Error("Invalid move");

        setBoard(chess.board());

        socket.send(
          JSON.stringify({
            type: MOVE,
            payload: { move },
          })
        );
      } catch (err: any) {
        console.error("Failed to make move:", err.message);
      } finally {
        setFrom(null);
      }
    }
  };

  const renderSquare = (
    square: { square: Square; type: PieceSymbol; color: Color } | null,
    squareRepresentation: Square,
    isLightSquare: boolean,
    key: number
  ) => {
    const squareColorClass = isLightSquare ? "bg-green-500" : "bg-slate-500";
    const pieceImage = square
      ? `/${
          square.color === "b"
            ? square.type
            : `${square.type.toUpperCase()} copy`
        }.png`
      : null;

    return (
      <div
        key={key}
        onClick={() => handleSquareClick(squareRepresentation)}
        className={`w-16 h-16 ${squareColorClass}`}
      >
        <div className="w-full h-full flex justify-center items-center">
          {pieceImage && <img className="w-4" src={pieceImage} alt="x" />}
        </div>
      </div>
    );
  };

  return (
    <div className="text-white-200">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((square, colIndex) => {
            const squareRepresentation =
              String.fromCharCode(97 + colIndex) + (8 - rowIndex);
            const isLightSquare = (rowIndex + colIndex) % 2 === 0;

            return renderSquare(
              square,
              squareRepresentation as Square,
              isLightSquare,
              colIndex
            );
          })}
        </div>
      ))}
    </div>
  );
};
