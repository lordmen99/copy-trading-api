import logger from '@src/middleware/Logger';

export default (io: any) => {
  try {
    io.on('connect', () => {
      logger.info(`Socket Trading Connection Success: ${io.id}`);
      /** kết nối với hệ thống trading để lấy giá trị trả về theo từng giây */
      io.on('commit', (data: any) => {
        /** lọc ra nến kết quả */
        if (data.ticking === 1 && data.data[0].is_open === false) {
          console.log(data.data[0], 'data');
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
