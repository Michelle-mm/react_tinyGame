import { createSlice } from '@reduxjs/toolkit';

const getCurrentMonth = () => {
  const date = new Date();
  // `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  return `${date.getFullYear()}-${String(date.getMonth() + 1)}`;
};

const initialState = {
  monthlyPoints: {},
  tenzie: {
    games: [], // Array of {date: string, timeSpent: number}
  },
  ticTacToe: {
    monthlyRecord: {}, // { "YYYY-MM": { wins: number, losses: number } }
  },
  paperScissorsStone: {
    monthlyRecord: {}, // { "YYYY-MM": { wins: number, losses: number } }
  },
  mineSweeper: {
    games: [], // Array of {date: string, timeSpent: number, result: 'clear' | 'mine'}
  },
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    addPoints: (state, action) => {
      const { points } = action.payload;
      const currentDate = getCurrentMonth();
      if (!state.monthlyPoints[currentDate]) {
        state.monthlyPoints[currentDate] = 0;
      }
      state.monthlyPoints[currentDate] += points;
      // console.log("currentDate",currentDate, state.monthlyPoints[currentDate]);
    },
    recordTenzieGame: (state, action) => {
      const { timeSpent, rollNum } = action.payload;
      state.tenzie.games.push({
        date: new Date().toISOString(),
        rollNum,
        timeSpent,
      });
    },
    recordTicTacToeGame: (state, action) => {
      const { result } = action.payload; // 'win' or 'loss'
      const currentMonth = getCurrentMonth();
      if (!state.ticTacToe.monthlyRecord[currentMonth]) {
        state.ticTacToe.monthlyRecord[currentMonth] = { wins: 0, losses: 0, fairs: 0 };
      }
      state.ticTacToe.monthlyRecord[currentMonth][result === "fair" ? "fairs" : result==="win" ? 'wins' : 'losses']++;
    },
    recordPaperScissorsStoneGame: (state, action) => {
      const { result } = action.payload; // 'win' or 'loss'
      const currentMonth = getCurrentMonth();
      if (!state.paperScissorsStone.monthlyRecord[currentMonth]) {
        state.paperScissorsStone.monthlyRecord[currentMonth] = { wins: 0, losses: 0 };
      }
      state.paperScissorsStone.monthlyRecord[currentMonth][result === "fair" ? "fairs" : result==="win" ? 'wins' : 'losses']++;
    },
    recordMineSweeperGame: (state, action) => {
      const { timeSpent, result } = action.payload; // result: 'clear' or 'mine'
      state.mineSweeper.games.push({
        date: new Date().toISOString(),
        timeSpent,
        result,
      });
      state.mineSweeper.games = state.mineSweeper.games.slice(0, 10);
    },
    resetGameState: (state, action) => {
      const {gameName} = action.payload;
      state[gameName] = initialState[gameName];
    },
    resetState: (state) => {
      return initialState;
    },
  },
});

export const { 
  addPoints,
  recordTenzieGame,
  recordTicTacToeGame,
  recordPaperScissorsStoneGame,
  recordMineSweeperGame,
  resetGameState,
  resetState,
} = gamesSlice.actions;

export default gamesSlice.reducer;