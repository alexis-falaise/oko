import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { AdminService } from 'app/admin/admin.service';
import { UserService } from '@core/user.service';

import { User } from '@models/user.model';

@Injectable()
export class AdminUserViewResolver implements Resolve<User> {

    constructor(
        private adminService: AdminService,
        private userService: UserService,
    ) {}
    resolve(route): Observable<User> {
        const userId = <string>route.paramMap.get('id');
        const send = (observer, data) => {
            observer.next(data);
            observer.complete();
        };
        return Observable.create(observer => {
            let outputUser;
            this.adminService.onCurrentUser().subscribe((user: User) => {
                if (user) {
                    outputUser = new User(user);
                    send(observer, outputUser);
                } else {
                    this.userService.getUserById(userId).subscribe((serverUser: User) => {
                        outputUser = new User(serverUser);
                        send(observer, outputUser);
                    });
                }
            });
        });
    }

}
