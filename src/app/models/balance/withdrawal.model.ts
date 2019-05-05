import { BankDetails } from '@models/balance/bank-details.model';
import { BalanceVariation } from '@models/balance/balance-variation.model';

export class Withdrawal extends BalanceVariation {
    account: BankDetails;
    constructor(withdrawal: Partial<Withdrawal>) {
        super(withdrawal);
    }
}
