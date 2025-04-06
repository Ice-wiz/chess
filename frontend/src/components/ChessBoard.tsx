import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../messages";

export const ChessBoard = ({
  board,
  socket,
}: {
  board: (Array<{ square: Square; type: PieceSymbol; color: Color } | null>)[];
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null);

  const handleSquareClick = (rowIndex:number,colIndex:number) => {

    const squareRepresentation = String.fromCharCode(97+(colIndex%8)) + "" + (8 - rowIndex) as Square;
    console.log({ squareRepresentation });

    if (!from) {
      console.log("first click");
      setFrom(squareRepresentation);
    } else {
      console.log("hello")
      setTo(squareRepresentation);
        socket.send(
          JSON.stringify({
            type: MOVE,
            payload: { from, to: squareRepresentation },
          })
        );

      console.log({ from, to: squareRepresentation });
      // Reset the selection
      setFrom(null);
    }
  };

  return (
    <div className="text-white-200">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((square, colIndex) => (
            <div
              key={colIndex}
              onClick={() => handleSquareClick(rowIndex,colIndex)}
              className={`w-16 h-16 flex items-center ${(colIndex+rowIndex) % 2 === 0 ? "bg-green-500" : "bg-white"} cursor-pointer`}
            >
              {/* Render the piece if present */}
              {square && (
                <div className="text-gray-900 w-full h-full flex items-center justify-center">
                  {square.color === "w" ? square.type.toUpperCase() : square.type}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
