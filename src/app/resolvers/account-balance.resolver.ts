import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from '@core/user.service';

import { User } from '@models/user.model';

@Injectable()
export class AccountBalanceResolver implements Resolve<User> {
    constructor(private userService: UserService) {}
    resolve(route): Observable<User> {
        return this.userService.getCurrentUser();
    }
}
