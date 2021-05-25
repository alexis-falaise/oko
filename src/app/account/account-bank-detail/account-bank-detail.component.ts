import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CurrencyCode, getCurrency } from '@static/currency-codes';
import { UserService } from '@core/user.service';
import { User } from '@models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-bank-detail',
  templateUrl: './account-bank-detail.component.html',
  styleUrls: ['./account-bank-detail.component.scss']
})
export class AccountBankDetailComponent implements OnInit {
  @ViewChild('currencyInput', { static: false }) currencyInput: ElementRef;
  account = this.fb.group({
    name: [''],
    iban: ['', Validators.compose([Validators.required, Validators.minLength(14), Validators.maxLength(34)])],
    bic: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(11)])],
    address: ['', Validators.required],
    zip: ['', Validators.required],
    city: [''],
    country: [''],
    currency: [''],
    sepa: [true],
  });
  edition: boolean;
  currencyFocus: boolean;
  currencies: Array<CurrencyCode>;

  constructor(
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      if (data.account) {
        this.edition = true;
        this.account.patchValue(data.account);
      }
    });
  }

  fetchCurrencies(currency: string) {
    if (currency && currency !== '') {
      this.currencies = getCurrency(currency).slice(0, 4);
    } else {
      this.currencies = null;
    }
  }

  focusCurrency() {
    this.currencyFocus = true;
    this.fetchCurrencies(this.currencyInput.nativeElement.value);
  }

  blurCurrency() {
    this.currencyFocus = false;
  }

  setCurrency(currency: CurrencyCode) {
    if (currency.code === 'EUR') {
      this.account.controls.sepa.patchValue(true);
    }
    this.account.controls.currency.patchValue(currency.code);
    this.currencies = null;
  }

  saveBankDetails() {
    const account = this.account.value;
    this.userService.addAccount(account)
    .subscribe((user: User) => {
      this.snack.open('Le compte a été ajouté', 'Super', {duration: 4500});
      this.router.navigate(['/account', 'balance']);
    });
  }

  editBankDetails() {
    const account = this.account.value;
    this.userService.editAccount(account)
    .subscribe(() => {
      this.snack.open('Le compte a bien été modifié', 'Parfait', {duration: 4500});
      this.router.navigate(['/account', 'balance']);
    });
  }

  removeBankDetails() {
    const account = this.account.value;
    this.userService.removeAccount(account)
    .subscribe(() => {
      this.snack.open('Le compte a été supprimé', 'OK', { duration: 4500 });
      this.router.navigate(['/account', 'balance']);
    });
  }

}
