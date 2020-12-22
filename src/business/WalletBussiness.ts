import TradingCopyRepository from '@src/repository/TradingCopyRepository';
import TradingWithdrawRepository from '@src/repository/TradingWithdrawRepository';
import UserRepository from '@src/repository/UserRepository';

export default class AdminBussiness {
  private _tradingWithdrawRepository: TradingWithdrawRepository;
  private _tradingCopyRepository: TradingCopyRepository;
  private _userRepository: UserRepository;

  constructor() {
    this._tradingWithdrawRepository = new TradingWithdrawRepository();
    this._tradingCopyRepository = new TradingCopyRepository();
    this._userRepository = new UserRepository();
  }

  public async getWalletInfo(): Promise<any> {
    try {
      const result = {
        withdraws_to_copy_trade: 0,
        withdraws_to_wallet: 0,
        investment_amount: 0,
        base_amount: 0,
        total_amount: 0,
      };
      const withdraws_to_copy_trade = await this._tradingWithdrawRepository.calculateWithdrawCopyTrade();
      const withdraws_to_wallet = await this._tradingWithdrawRepository.calculateWithdrawWallet();
      const copy_amount = await this._tradingCopyRepository.calculateCopyAmount();
      const total_amount = await this._userRepository.calculateUserAmount();

      if (withdraws_to_copy_trade.length > 0) {
        result.withdraws_to_copy_trade = withdraws_to_copy_trade[0].amount;
      }

      if (withdraws_to_wallet.length > 0) {
        result.withdraws_to_wallet = withdraws_to_wallet[0].amount;
      }

      if (copy_amount.length > 0) {
        result.investment_amount = copy_amount[0].investment_amount;
        result.base_amount = copy_amount[0].base_amount;
      }

      if (total_amount.length > 0) {
        result.total_amount = total_amount[0].total_amount;
      }

      return result;
    } catch (err) {
      throw err;
    }
  }
}
