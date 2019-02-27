import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '@models/user.model';
import { Description } from '@models/description.model';
import { keyframes } from '@angular/animations';
import { UserService } from '@core/user.service';
import { UiService } from '@core/ui.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MeetingPoint } from '@models/meeting-point.model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {
  user: User;
  address = this.fb.group({
    address: [''],
    city: [''],
    zip: [''],
    country: [''],
  });
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
    private uiService: UiService,
    private snack: MatSnackBar,
    private fb: FormBuilder,
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
    if (user.address) {
      this.address.patchValue(user.address);
    }
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

  save() {
    this.uiService.setLoading(true);
    this.user.description = new Description(this.description);
    this.user.address = new MeetingPoint(this.address.value);
    this.userService.updateUser(this.user)
    .subscribe((res: any) => {
      if (res.status) {
        this.snack.open('Profil mis à jour', 'OK', {duration: 2500});
        this.userService.getCurrentUser();
        this.init(res.data);
      } else {
        this.saveError();
      }
      this.uiService.setLoading(false);
    }, () => this.saveError());
  }

  saveError() {
    const snackRef = this.snack.open('Erreur lors de la mise à jour de votre profil', 'Réessayer', {duration: 3000});
    snackRef.onAction().subscribe(() => this.save());
    this.uiService.setLoading(false);
  }

}
