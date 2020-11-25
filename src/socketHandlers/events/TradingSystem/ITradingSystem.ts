import {AppData, Socket} from '../../EventTypes';

type TradingCandlesData = {};
export type TradingCandles = (
  app: AppData,
  socket: Socket<TradingCandlesData, {}>,
) => (data: TradingCandlesData) => void;
