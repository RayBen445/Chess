// Unicode chess pieces
export const pieceSymbols = {
  wp: '♙',
  wn: '♘',
  wb: '♗',
  wr: '♖',
  wq: '♕',
  wk: '♔',
  bp: '♟',
  bn: '♞',
  bb: '♝',
  br: '♜',
  bq: '♛',
  bk: '♚'
};

export const getPieceSymbol = (piece) => {
  if (!piece) return null;
  const key = piece.color + piece.type;
  return pieceSymbols[key];
};
