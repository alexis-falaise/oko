import { BalanceVariation } from '@models/balance/balance-variation.model';

export class Earning extends BalanceVariation {
    proposalId: string;
    constructor(earning: Partial<Earning>) {
        super(earning);
    }
}
