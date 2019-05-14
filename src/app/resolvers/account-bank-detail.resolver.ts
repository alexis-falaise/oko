import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from '@core/user.service';

import { User } from '@models/user.model';
import { UiService } from '@core/ui.service';

@Injectable()
export class AccountBankDetailResolver implements Resolve<User> {
    constructor(
        private userService: UserService,
        private uiService: UiService
    ) {}
    resolve(route): Observable<User> {
        const iban = <string>route.paramMap.get('iban');
        return Observable.create(observer => {
            this.userService.getCurrentUser()
            .subscribe(user => {
                if (user) {
                    const account = user.accounts.find(searchedAccount => searchedAccount.iban === iban);
                    observer.next(account);
                    observer.complete();
                } else {
                    this.uiService.connectionSnack();
                    observer.complete();
                }
            }, (error) => {
                this.uiService.serverError(error);
                observer.complete();
            });
        });
    }
}
