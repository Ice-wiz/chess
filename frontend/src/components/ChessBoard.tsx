import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../messages";

export const ChessBoard = ({
  chess,
  board,
  socket,
  setBoard,
  moveCount
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
  moveCount:number
}) => {
  const [from, setFrom] = useState<null | Square>(null);

  // Handle square click logic
  const handleSquareClick = (squareRepresentation: Square) => {
    if (!from) {
      // Set the starting square
      setFrom(squareRepresentation);
    } else {
      try {
        // Send the move to the server
        socket.send(
          JSON.stringify({
            type: MOVE,
            payload: {
              move: {
                from,
                to: squareRepresentation,
              },
              moveCount:moveCount+1
            },
          })
        );

        // Attempt to update the chess state and board
        const moveResult = chess.move({ from, to: squareRepresentation });
        console.log(moveResult)
        if (!moveResult) {
          throw new Error("Invalid move");
        }

        setBoard(chess.board());
      } catch (error: any) {
        console.error("Failed to make a move:", error.message);
      } finally {
        // Reset the starting square regardless of success or failure
        setFrom(null);
      }

      // Log the move
      setFrom(null);
      console.log({ from, to: squareRepresentation });
    }
  };

  // Render a single square
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

  // Render the chessboard
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
