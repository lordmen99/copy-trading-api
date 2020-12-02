// import TradingHistoryBussiness from '@src/business/TradingHistoryBussiness';
// import TradingOrderBussiness from '@src/business/TradingOrderBussiness';
// import {logger} from '@src/middleware';

// export default (fireDate: Date) => {
//   try {
//     const tradingHistoryBusiness = new TradingHistoryBussiness();
//     const tradingOrderBussiness = new TradingOrderBussiness();

//     tradingOrderBussiness.getListPendingOrders().then((pendingOrders) => {
//       console.log(pendingOrders);
//     });
//   } catch (error) {
//     logger.error(`\nSCHEDULER ERROR: `);
//     logger.error(`${error.message}\n`);
//   }
// };
