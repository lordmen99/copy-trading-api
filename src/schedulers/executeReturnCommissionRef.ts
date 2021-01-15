import CommissionRefLogBussiness from '@src/business/CommissionRefLogBussiness';
import { logger } from '@src/middleware';

export default (date: Date) => {
  try {
    /** xử lý đánh các lệnh được order trước từ admin */
    const commissionRefLogBus = new CommissionRefLogBussiness();
    commissionRefLogBus.CalcularCommissionRef();
  } catch (error) {
    logger.error(`\nSCHEDULER ERROR: `);
    logger.error(`${error.message}\n`);
  }
};
