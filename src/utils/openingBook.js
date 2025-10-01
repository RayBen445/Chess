// Popular chess openings database
export const openingBook = {
  // Starting position
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1': {
    name: 'Starting Position',
    moves: []
  },
  
  // After 1.e4
  'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1': {
    name: "King's Pawn Opening",
    moves: ['e7e5', 'c7c5', 'e7e6', 'c7c6', 'g7g6']
  },
  
  // After 1.d4
  'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1': {
    name: "Queen's Pawn Opening",
    moves: ['d7d5', 'g8f6', 'e7e6', 'c7c5']
  },
  
  // After 1.e4 e5
  'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2': {
    name: 'Open Game',
    moves: ['g1f3', 'f2f4', 'b1c3', 'f1c4']
  },
  
  // Sicilian Defense
  'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2': {
    name: 'Sicilian Defense',
    moves: ['g1f3', 'b1c3', 'c2c3']
  },
  
  // French Defense
  'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2': {
    name: 'French Defense',
    moves: ['d2d4', 'b1c3', 'g1f3']
  },
  
  // Caro-Kann Defense
  'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2': {
    name: 'Caro-Kann Defense',
    moves: ['d2d4', 'b1c3']
  },
  
  // Italian Game
  'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3': {
    name: 'Italian Game',
    moves: ['g8f6', 'f8c5', 'f8e7']
  },
  
  // Ruy Lopez
  'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3': {
    name: 'Ruy Lopez',
    moves: ['a7a6', 'g8f6', 'f8e7']
  },
  
  // Queen's Gambit
  'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2': {
    name: "Queen's Gambit",
    moves: ['d5c4', 'd5e4', 'e7e6', 'c7c6']
  },
  
  // King's Indian Defense
  'rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3': {
    name: "King's Indian Defense",
    moves: ['b1c3', 'g1f3']
  }
};

export const getOpeningInfo = (fen) => {
  // Normalize FEN (remove move counters for matching)
  const normalizedFen = fen.split(' ').slice(0, 4).join(' ');
  
  // Try to find exact match
  for (const [key, value] of Object.entries(openingBook)) {
    const normalizedKey = key.split(' ').slice(0, 4).join(' ');
    if (normalizedKey === normalizedFen) {
      return value;
    }
  }
  
  return null;
};

export const getOpeningMove = (fen) => {
  const opening = getOpeningInfo(fen);
  if (opening && opening.moves && opening.moves.length > 0) {
    // Return a random move from the opening book
    return opening.moves[Math.floor(Math.random() * opening.moves.length)];
  }
  return null;
};
