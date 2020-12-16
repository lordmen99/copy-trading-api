import logger from '@src/middleware/Logger';
import IDataSocketModel from '@src/models/cpDataSocket/IDataSocketModel';
import DataSocketRepository from '@src/repository/DataSocketRepository';

export default (io: any) => {
  try {
    io.on('connect', () => {
      logger.info(`Socket Trading Connection Success: ${io.id}`);
      /** kết nối với hệ thống trading để lấy giá trị trả về theo từng giây */
      io.on('commit', async (data: any) => {
        /** lọc ra nến kết quả */
        if (data.ticking === 1 && data.data[0].is_open === true && data.data[0].open !== data.data[0].close) {
          // const tradingOrderBussiness = new TradingOrderBussiness();
          // tradingOrderBussiness.executeListPendingOrders(data.data[0]);
          const _dataSocketRepository = new DataSocketRepository();
          await _dataSocketRepository.create({
            absoluteChange: data.data[0].absoluteChange,
            close: data.data[0].close,
            date: data.data[0].date,
            dividend: data.data[0].dividend,
            high: data.data[0].high,
            is_open: data.data[0].is_open,
            low: data.data[0].low,
            open: data.data[0].open,
            percentChange: data.data[0].percentChange,
            split: data.data[0].split,
            volume: data.data[0].volume,
          } as IDataSocketModel);
        }
      });
    });

    io.on('connect_error', (error: any) => {
      logger.error(`Socket Trading Connect Error: ${error.message}\n`);
    });

    io.on('error', (error: any) => {
      logger.error(`Socket Trading Error: ${error.message}\n`);
    });

    io.on('disconnect', (reason: string) => {
      logger.error(`Socket Trading Disconnected: ${reason}\n`);
    });
  } catch (error) {
    logger.error(`SOCKET TRADING ERROR: ${error.message}\n`);
  }
};
