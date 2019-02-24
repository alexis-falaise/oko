import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '@models/user.model';
import { Description } from '@models/description.model';
import { keyframes } from '@angular/animations';
import { UserService } from '@core/user.service';
import { UiService } from '@core/ui.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {
  user: User;
  description: Description;
  edit: any = {};
  keys = Object.keys;
  french = {
    'occupation': 'Emploi',
    'interests': 'Loisirs',
    'about': 'A propos',
    'originCountry': 'Pays d\'origine',
    'visitedCountries': 'Pays visités',
    'livedCountries': 'Pays où j\'ai vécu',
  };
  isArray = Array.isArray;
  frenchization = (word) => this.french[word];
  camelToTitle = (camelCase) => camelCase
  .replace(/([A-Z])/g, (match) => ` ${match}`)
  .replace(/^./, (match) => match.toUpperCase())
  .trim()

  constructor(
    private userService: UserService,
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.uiService.setLoading(true);
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        this.init(user);
        this.uiService.setLoading(false);
      }
    });
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
    this.uiService.setLoading(true);
    this.user.description = new Description(this.description);
    this.userService.updateUser(this.user)
    .subscribe((res: any) => {
       this.uiService.setLoading(false);
      if (res.status) {
        this.userService.getCurrentUser();
        this.init(res.data);
      }
    });
  }

}
