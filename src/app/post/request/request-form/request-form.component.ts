import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

import { UserService } from '@core/user.service';
import { PostService } from '@core/post.service';
import { GeoService } from '@core/geo.service';
import { NotConnectedComponent } from '@core/dialogs/not-connected/not-connected.component';
import { RequestItemComponent } from '../request-item/request-item.component';
import { RequestItemSelectionComponent } from '../request-item-selection/request-item-selection.component';

import { Item } from '@models/item.model';
import { Request } from '@models/post/request.model';
import { Trip } from '@models/post/trip.model';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss']
})
export class RequestFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() trip: Trip;
  @Input() request: Request;
  @Input() freeRequest = false;
  today = moment();
  items: Array<Item> = [];
  // #TODO: clean test
  // items: Array<Item> = [new Item({
  //   label: 'iPhone XS',
  //   photo: ['https://static.fnac-static.com/multimedia/Images/FR/MDM/25/ca/8d/9292325/1540-1/tsp20180920193530/Apple-iPhone-XS-64-Go-5-8-Or.jpg'],
  //   link: new Link({
  //     label: 'Acheter un iphone',
  //     path: 'https://www.apple.com/fr/shop/buy-iphone/iphone-xs/%C3%A9cran-5,8-pouces-64go-argent#00,10,20',
  //   }),
  //   price: 1155.28
  // })];
  cities: Array<string> = [];
  meeting = this.fb.group({
    city: [],
    meetingPoint: this.fb.group({
      adress: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],
      country: ['', Validators.required],
    }),
    airportPickup: [false],
    urgent: [false],
    urgentDetails: this.fb.group({
      explaination: ['', Validators.required],
      date: [null],
    }),
    bonus: ['', Validators.required],
  });
  bonusAgreed = false;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private postService: PostService,
    private userService: UserService,
    private geoService: GeoService,
    private snack: MatSnackBar,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.request) {
      this.setEditableRequest(changes.request.currentValue);
    }
  }

  ngOnInit() {
    this.geoService.onCities()
    .subscribe(cities => this.cities = cities);
    this.meeting.controls.city.valueChanges
    .subscribe(city => {
      this.meeting.controls.meetingPoint.patchValue({city: city.city, country: city.country});
    });
    this.checkDraft();
  }

  fetchCities(city: string) {
    this.geoService.getCities(city);
  }

  displayCity(city: {city: string, country: string}) {
    return city ? city.city : '';
  }

  checkDraft() {
    const draft = this.postService.getRequestDraft();
    if (draft) {
      this.items = draft.items;
      delete draft.items;
      this.meeting.patchValue(draft);
    }
  }

  openItemDialog(item?: Item, index?: number) {
    const dialogRef = this.dialog.open(RequestItemComponent, {
      height: '85vh',
      width: '95vw',
      data: item ? { item: item, index: index, modifying: true } : null,
    });
    dialogRef.afterClosed().subscribe(savedItemData => {
      if (savedItemData) {
        if (savedItemData.modifying) {
          this.editItem(savedItemData.item, savedItemData.index);
        } else {
          this.addItem(savedItemData.item);
        }
      }
    });
  }

  openItemSelectionDialog() {
    const notConnected = () => {
      const snackRef = this.snack.open('Connectez-vous !', 'Connexion', {duration: 3000});
      snackRef.onAction().subscribe(() => {
        this.router.navigate(['/login']);
      });
    };
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        const dialogRef = this.dialog.open(RequestItemSelectionComponent, {
          height: '500px',
          width: '75vw',
          data: user,
        });
        dialogRef.afterClosed().subscribe(selection => {
          if (selection) {
            selection.forEach(item => this.addItem(item));
          }
        });
      } else {
        notConnected();
      }
    }, (err) => notConnected());
  }

  addItem(item) {
    this.items.push(item);
  }

  editItem(item, index) {
    this.items[index] = item;
  }

  removeItem(index) {
    this.items.splice(index, 1);
  }

  bonusAgreement(agreement) {
    if (agreement.checked) {
      this.meeting.controls.bonus.patchValue(this.trip.bonus);
    }
  }

  setEditableRequest(request: Request) {
    this.meeting.patchValue(request);
    if (request.meetingPoint && request.meetingPoint.city && request.meetingPoint.country) {
      this.meeting.controls.city.patchValue({
        city: request.meetingPoint.city,
        country: request.meetingPoint.country
      });
    }
    this.items = request.items;
  }

  saveRequest() {
    const meeting = this.meeting.value;
    delete meeting.city;
    const saveRequest = new Request({
      items: this.items,
      trip: this.trip,
      ...meeting,
    });

    this.userService.getCurrentUser()
    .subscribe(currentUser => {
      saveRequest.user = currentUser;
      if (currentUser) {
        this.postService.createRequest(saveRequest)
        .subscribe(response => {
          if (response.status) {
            const createdRequest = new Request(response.data);
            this.snack.open('Demande enregistrée', 'Top!', {duration: 3000});
            this.router.navigate([`post/request/${createdRequest.id}`]);
          } else {
            this.requestServerError();
          }
        }, (error) => this.requestServerError());
      } else {
        this.requestError(saveRequest);
      }
    }, (error) => this.requestError(saveRequest));
  }

  private requestError(draft) {
    this.postService.saveRequestDraft(draft);
    this.dialog.open(NotConnectedComponent);
  }

  private requestServerError() {
    const snackRef = this.snack.open('Un problème a eu lieu', 'Réessayer', {duration: 5000});
    snackRef.onAction().subscribe(() => this.saveRequest());
  }

  ngOnDestroy() {
    this.geoService.getCities(null);
  }

}
