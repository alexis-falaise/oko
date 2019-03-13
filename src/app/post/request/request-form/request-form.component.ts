import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, DateAdapter } from '@angular/material';
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
import { HttpErrorResponse } from '@angular/common/http';
import { isFulfilled } from 'q';
import { Proposal } from '@models/post/proposal.model';
import { UiService } from '@core/ui.service';
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
    this.geoService.onCities()
    .subscribe(cities => this.cities = cities);
    this.meeting.controls.city.valueChanges
    .subscribe(city => {
      this.meeting.controls.meetingPoint.patchValue({city: city.city, country: city.country});
    });
    this.meeting.controls.bonus.valueChanges.subscribe(() => this.computeTotalPrice());
    if (this.items && this.items.length) {
      this.computeBonus();
      this.computeTotalPrice();
    }
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
    }
    this.requestId = request.id;
    this.edition = true;
  }

  saveRequest() {
    this.uiService.setLoading(true);
    const saveRequest = this.createSaveRequest();
    let proposal;

    this.userService.getCurrentUser()
    .subscribe(currentUser => {
      saveRequest.user = currentUser;
      if (currentUser) {
        if (saveRequest.trip) {
          proposal = {
            from: saveRequest,
            to: saveRequest.trip.id,
            date: moment(),
            author: currentUser,
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
    }, (error) => this.requestError(saveRequest));
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

  private computeBonus() {
    this.itemsPrice = this.items.reduce((sum, item) => sum + item.price, 0);
    const calculatedBonus = this.itemsPrice * this.bonusPercentage + this.staticBonus;
    this.meeting.controls.bonus.patchValue(Math.ceil(calculatedBonus));
  }

  private computeTotalPrice() {
    const bonus = this.meeting.controls.bonus.value;
    const preFeesPrice = this.itemsPrice + bonus;
    this.fees = preFeesPrice * this.feesPercentage + this.staticFees;
    this.totalPrice = this.round(this.fees + preFeesPrice, 2);
  }

  private requestError(draft) {
    this.saveDraft(draft);
    this.dialog.open(NotConnectedComponent);
    this.uiService.setLoading(false);
  }

  private saveDraft(draft) {
    const isFilled = (object): boolean => {
      let filled = false;
      Object.keys(object).forEach(key => {
        if (object[key] && object[key] !== '') {
          filled = true;
        }
      });
      return filled;
    };
    if (draft
        && (isFilled(draft.meetingPoint)
        || (draft.items && draft.items.length)
        || isFilled(draft.urgentDetails)
        || (draft.city && draft.city !== ''))) {
      this.postService.saveRequestDraft(draft);
    }
  }

  private requestServerError(message: string, code: string) {
    const snackRef = this.snack.open(`Un problème a eu lieu. (${message} - ${code})`, 'Réessayer', {duration: 5000});
    snackRef.onAction().subscribe(() => this.saveRequest());
  }

  private round(number: number, decimals: number) {
    return Math.round(number * 10 ** decimals) / 10 ** decimals;
  }

  ngOnDestroy() {
    this.geoService.resetCities();
    if (!this.saved) {
      const draft = this.createSaveRequest();
      this.saveDraft(draft);
    }
  }

}
