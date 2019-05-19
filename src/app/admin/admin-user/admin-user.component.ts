import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';

import { AdminService } from '../admin.service';
import { User } from '@models/user.model';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit {
  users: Array<User>;
  usersSource = new MatTableDataSource(this.users);
  displayedColumns = [
    'avatar',
    'lastname',
    'firstname',
    'email',
    'birthdate',
    'rating',
    'sessions',
    'secure',
    'guest',
    'signin',
    'socialProvider',
    'lastConnection',
    'connected',
    'admin'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  moment = moment;

  constructor(
    private adminService: AdminService,
    private router: Router,
  ) { }

  ngOnInit() {
    // this.usersSource.paginator = this.paginator;
    this.usersSource.sort = this.sort;
    this.adminService.getUsers().subscribe(users => {
      this.users = users;
      this.updateDataSource(users);
    });
  }

  filter(filter: string) {
    this.usersSource.filter = filter;
  }

  displayUser(user: User) {
    this.adminService.setCurrentUser(user);
    this.router.navigate([`/admin/user/${user.id}`]);
  }

  private updateUser(user: User) {
    const userIndex = this.users.findIndex(tabUser => tabUser._id === user._id);
    this.users[userIndex] = user;
    this.updateDataSource(this.users);
  }

  private updateDataSource(users: Array<User>) {
    this.usersSource.data = users;
  }
}
