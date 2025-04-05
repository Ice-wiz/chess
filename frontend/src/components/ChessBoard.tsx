import { Color, PieceSymbol, Square } from "chess.js";

export const ChessBoard = ({board}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
}) => {
  return (
    <div>
        
    </div>
  )
};
