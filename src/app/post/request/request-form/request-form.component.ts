import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, DateAdapter } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { round, objectIsComplete } from '@utils/index.util';
import * as moment from 'moment';

import { UserService } from '@core/user.service';
import { UiService } from '@core/ui.service';
import { PostService } from '@core/post.service';
import { GeoService } from '@core/geo.service';

import { NotConnectedComponent } from '@core/dialogs/not-connected/not-connected.component';
import { RequestItemComponent } from '../request-item/request-item.component';
import { RequestItemSelectionComponent } from '../request-item-selection/request-item-selection.component';

import { User } from '@models/user.model';
import { Item } from '@models/item.model';
import { Request } from '@models/post/request.model';
import { Trip } from '@models/post/trip.model';
import { Proposal } from '@models/post/proposal.model';
import { MeetingPoint } from '@models/meeting-point.model';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss']
})
export class RequestFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() trip: Trip;
  @Input() request: Request;
  @Input() freeRequest = false;
  @Input() edition = false;
  today = moment();
  items: Array<Item> = [];
  itemsPrice: number;
  staticBonus = 10;
  bonusPercentage = 0.15;
  feesPercentage = 0.01;
  staticFees = 0.5;
  fees: number;
  totalPrice: number;
  currentUser: User;
  cities: Array<string> = [];
  meeting = this.fb.group({
    city: [],
    meetingPoint: this.fb.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      zip: [''],
      country: ['', Validators.required],
    }),
    airportPickup: [true],
    homeDelivery: [false],
    urgent: [false],
    urgentDetails: this.fb.group({
      explaination: [''],
      date: [null],
    }),
    bonus: ['', Validators.required],
  });
  bonusAgreed = false;
  requestId: string;
  saved = false;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private adapter: DateAdapter<any>,
    private postService: PostService,
    private uiService: UiService,
    private userService: UserService,
    private geoService: GeoService,
    private snack: MatSnackBar,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.edition) {
      this.edition = changes.edition.currentValue;
    }
    if (changes.request) {
      if (this.edition) {
        this.setEditableRequest(changes.request.currentValue);
      }
    }
  }

  ngOnInit() {
    this.adapter.setLocale('fr');
    this.userService.getCurrentUser().subscribe(user => this.currentUser = user);
    this.geoService.onCities()
    .subscribe(cities => this.cities = cities);
    this.meeting.controls.city.valueChanges
    .subscribe(city => {
      this.meeting.controls.meetingPoint.patchValue({city: city.city, country: city.country});
    });
    this.meeting.controls.bonus.valueChanges.subscribe(() => this.computeTotalPrice());
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
      this.setEditableRequest(draft);
      this.edition = false;
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
        this.router.navigate(['/oneclick']);
      });
    };

    if (this.currentUser) {
      const dialogRef = this.dialog.open(RequestItemSelectionComponent, {
        height: '500px',
        width: '75vw',
        data: this.currentUser,
      });
      dialogRef.afterClosed().subscribe(selection => {
        if (selection) {
          selection.forEach(item => this.addItem(item));
        }
      });
    } else {
      notConnected();
    }
  }

  addItem(item) {
    this.items.push(item);
    this.computeBonus();
  }

  editItem(item, index) {
    this.items[index] = item;
    this.computeBonus();
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.computeBonus();
  }

  homeDelivery() {
    const isHomeDelivery = !this.meeting.controls.homeDelivery.value;
    if (isHomeDelivery) {
      if (this.currentUser) {
        if (this.currentUser.address && objectIsComplete(this.currentUser.address)) {
          this.meeting.controls.meetingPoint.patchValue(this.currentUser.address);
        } else {
          const snack = this.snack.open('Vous n\'avez pas indiqué d\'adresse dans votre profil', 'Ajouter');
          snack.onAction().subscribe(() => {
            const draft = this.createSaveRequest();
            this.saveDraft(draft);
            this.router.navigate(['/account/info']);
          });
        }
      }
    } else {
      this.meeting.controls.meetingPoint.reset();
    }
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
    if (request.items) {
      this.items = request.items;
      this.computeBonus(request.bonus);
      this.computeTotalPrice();
    }
    this.requestId = request.id;
    this.edition = true;
  }

  saveRequest() {
    this.uiService.setLoading(true);
    const saveRequest = this.createSaveRequest();
    let proposal;

    saveRequest.user = this.currentUser;
    if (this.currentUser) {
      if (saveRequest.trip) {
        proposal = {
          from: saveRequest,
          to: saveRequest.trip.id,
          date: moment(),
          author: this.currentUser,
          receiver: saveRequest.trip.user,
          bonus: saveRequest.bonus,
          airportPickup: this.trip.airportDrop || saveRequest.airportPickup,
          meetingPoint: (this.trip.airportDrop || saveRequest.airportPickup) ? new MeetingPoint({
            city: this.trip.to.airport.city,
            country: this.trip.to.airport.country
          }) : saveRequest.meetingPoint,
        };
      }
      const requestService = this.edition
      ? this.postService.updateRequest(saveRequest)
      : (saveRequest.trip
      ? this.postService.createRequestForTrip(proposal)
      : this.postService.createRequest(saveRequest));
      requestService.subscribe(response => {
        if (response.status) {
          this.saved = true;
          let responseProposal;
          let responseRequest;
          if (saveRequest.trip) {
            responseProposal = new Proposal(response.data);
          } else {
            responseRequest = new Request(response.data);
          }
          this.uiService.setLoading(false);
          this.snack.open(`Annonce ${this.edition ? 'modifiée' : 'enregistrée'}`, 'Top!', {duration: 3000});
          this.router.navigate([`post/request/${saveRequest.trip ? responseProposal.from : responseRequest.id}`]);
        } else {
          this.requestServerError(response.message, response.code);
        }
      }, (error: HttpErrorResponse) => this.requestServerError(error.message, error.statusText));

    } else {
      this.requestError(saveRequest);
    }
  }

  private createSaveRequest() {
    let meeting;
    if (this.meeting.value) {
      meeting = this.meeting.value;
    }
    if (this.trip) {
      meeting.meetingPoint = {
        city: this.trip.to.airport.city,
        country: this.trip.to.airport.country,
      };
    }
    delete meeting.city;
    const saveRequest = new Request({
      items: this.items,
      trip: this.trip,
      id: this.edition ? this.requestId : undefined,
      ...meeting,
    });
    return saveRequest;
  }

  private computeBonus(bonus?: number) {
    this.itemsPrice = this.items.reduce((sum, item) => sum + item.price, 0);
    let calculatedBonus = this.itemsPrice * this.bonusPercentage;
    calculatedBonus = calculatedBonus > this.staticBonus ? calculatedBonus : this.staticBonus;
    this.meeting.controls.bonus.patchValue(Math.ceil(bonus || calculatedBonus));
  }

  private computeTotalPrice() {
    const bonus = this.meeting.controls.bonus.value;
    const itemsPrice = this.itemsPrice || 0;
    const preFeesPrice = itemsPrice + bonus;
    this.fees = preFeesPrice * this.feesPercentage + this.staticFees;
    this.totalPrice = round(this.fees + preFeesPrice, 2);
  }

  private requestError(draft) {
    this.saveDraft(draft);
    this.dialog.open(NotConnectedComponent);
    this.uiService.setLoading(false);
  }

  private saveDraft(draft) {
    if (draft
        && (objectIsComplete(draft.meetingPoint)
        || (draft.items && draft.items.length)
        || objectIsComplete(draft.urgentDetails)
        || (draft.city && draft.city !== ''))) {
      this.postService.saveRequestDraft(draft);
    }
  }

  private requestServerError(message: string, code: string) {
    const snackRef = this.snack.open(`Un problème a eu lieu. (${message} - ${code})`, 'Réessayer', {duration: 5000});
    snackRef.onAction().subscribe(() => this.saveRequest());
  }

  ngOnDestroy() {
    this.geoService.resetCities();
    // if (!this.saved) {
    //   const draft = this.createSaveRequest();
    //   this.saveDraft(draft);
    // }
  }

}
