import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '@models/user.model';
import { Description } from '@models/description.model';
import { keyframes } from '@angular/animations';
import { UserService } from '@core/user.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit, OnChanges {
  @Input() user: User;
  description: Description;
  edit: any = {};
  keys = Object.keys;
  isArray = Array.isArray;
  loading = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user) {
      this.init(changes.user.currentValue);
    }
  }

  init(user: User) {
    this.user = user;
    this.description = new Description(user.description);
    this.createEditionObject();
  }

  createEditionObject() {
    this.keys(this.description).map(item => {
      this.edit[item] = false;
    });
    delete this.edit.id;
  }

  addToArray(item: string, array: Array<string>, key: string) {
    this.edit[key] = true;
    const index = array.findIndex(arrayItem => arrayItem === item);
    if (index === -1 && item && item !== '') {
      array.push(item);
    }
  }

  removeFromArray(item: string, array: Array<string>, key: string) {
    this.edit[key] = true;
    const index = array.findIndex(arrayItem => arrayItem === item);
    array.splice(index, 1);
  }

  hasEdited(): boolean {
    return !!this.keys(this.edit).find(item => this.edit[item]);
  }

  save() {
    this.loading = true;
    this.user.description = new Description(this.description);
    this.userService.updateUser(this.user)
    .subscribe((res: any) => {
      this.loading = false;
      if (res.status) {
        this.userService.getCurrentUser();
        this.init(res.data);
      }
    });
  }

}
