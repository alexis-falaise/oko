import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

import { BankDetails } from '@models/balance/bank-details.model';
import { User } from '@models/user.model';
import { BalanceVariation } from '@models/balance/balance-variation.model';
import { sortByDate } from '@utils/array.util';
import { Earning } from '@models/balance/earning.model';

class BalanceVariationDisplay extends BalanceVariation {
  earning: boolean;
}
@Component({
  selector: 'app-account-balance',
  templateUrl: './account-balance.component.html',
  styleUrls: ['./account-balance.component.scss']
})
export class AccountBalanceComponent implements OnInit {
  user: User;
  balanceHistory: Array<BalanceVariationDisplay>;
  balanceScreens = ['settings', 'balance', 'history'];
  balanceScreenIndex = 1;
  moment = moment;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data.user;
      this.buildBalanceHistory();
    });
  }

  toScreen(screen: string) {
    this.balanceScreenIndex = this.balanceScreens.findIndex(balanceScreen => balanceScreen === screen);
  }

  addAccount() {
    this.router.navigate(['/account', 'balance', 'bank-detail']);
  }

  editAccount(account: BankDetails) {
    this.router.navigate(['/account', 'balance', 'bank-detail', account.iban]);
  }

  entryInfo(entry: BalanceVariationDisplay) {
    if (entry.earning) {
      const earning = new Earning(entry);
      this.router.navigate(['/post', 'proposal', earning.proposalId]);
    }
  }

  next() {
    if (this.balanceScreenIndex < this.balanceScreens.length - 1) {
      this.balanceScreenIndex++;
    }
  }

  previous() {
    if (this.balanceScreenIndex > 0) {
      this.balanceScreenIndex--;
    }
  }

  private buildBalanceHistory() {
    const earnings: Array<BalanceVariation> = this.user.earnings;
    const withdrawals: Array<BalanceVariation> = this.user.withdrawals;
    const earningsDisplay: Array<BalanceVariationDisplay> = earnings.map(earning => Object.assign({earning: true}, earning));
    const withdrawalsDisplay: Array<BalanceVariationDisplay> = withdrawals.map(withdrawal => Object.assign({earning: false}, withdrawal));
    this.balanceHistory = earningsDisplay.concat(withdrawalsDisplay).sort(sortByDate);
  }

}
