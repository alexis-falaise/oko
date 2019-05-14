import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@models/user.model';
import { BankDetails } from '@models/balance/bank-details.model';

@Component({
  selector: 'app-account-balance',
  templateUrl: './account-balance.component.html',
  styleUrls: ['./account-balance.component.scss']
})
export class AccountBalanceComponent implements OnInit {
  user: User;
  balanceScreens = ['settings', 'balance', 'history'];
  balanceScreenIndex = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.user = data.user;
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

}
