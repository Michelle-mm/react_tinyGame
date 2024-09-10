import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from './gamesSlice';
import { thunk } from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, gamesReducer);

export const store = configureStore({
  reducer: {
    games: persistedReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    }).concat(thunk)
});

export const persistor = persistStore(store);

//without persist
// export const store = configureStore({
//   reducer: {
//     games: gamesReducer,
//   },
// });