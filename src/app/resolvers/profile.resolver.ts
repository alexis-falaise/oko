import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from '@core/user.service';

import { User } from '@models/user.model';

@Injectable()
export class ProfileResolver implements Resolve<User> {

    constructor(private userService: UserService) {}
    resolve(route): Observable<User> {
        const userId = <string>route.paramMap.get('id');
        return this.userService.getUserStatsById(userId);
    }

}
