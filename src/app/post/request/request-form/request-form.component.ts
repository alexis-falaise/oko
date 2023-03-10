import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { round, objectIsComplete, arraySum } from '@utils/index.util';
import * as moment from 'moment';

import { HistoryService } from '@core/history.service';
import { RequestService } from '../request.service';
import { UserService } from '@core/user.service';
import { UiService } from '@core/ui.service';
import { PostService } from '@core/post.service';
import { GeoService } from '@core/geo.service';

import { NotConnectedComponent } from '@core/dialogs/not-connected/not-connected.component';
import { RequestItemSelectionComponent } from '../request-item-selection/request-item-selection.component';

import { User } from '@models/user.model';
import { Item } from '@models/item.model';
import { Request } from '@models/post/request.model';
import { Trip } from '@models/post/trip.model';
import { Proposal } from '@models/post/proposal.model';
import { MeetingPoint } from '@models/meeting-point.model';
import { ConfirmComponent } from '@core/dialogs/confirm/confirm.component';
import { feesPercentage, staticFees, bonusPercentage, staticBonus, estimateBonus, calculateTotalPrice } from '@static/fees';

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
  @Input() creation = false;
  today = moment();
  items: Array<Item> = [];
  itemsPrice: number;
  staticBonus = 10;
  bonusPercentage = 0.15;
  fees: number;
  computedBonus: number;
  totalPrice: number;
  currentUser: User;
  cities: Array<string> = [];
  cityLoading = false;
  nextCityQuery = new Subject();
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
    bonus: ['', Validators.compose([Validators.required, Validators.min(1)])],
    private: [false],
  });
  bonusAgreed = false;
  requestId: string;
  saved = false;
  draft = false;
  ngUnsubscribe = new Subject();

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adapter: DateAdapter<any>,
    private historyService: HistoryService,
    private location: Location,
    private postService: PostService,
    private requestService: RequestService,
    private uiService: UiService,
    private userService: UserService,
    private geoService: GeoService,
    private snack: MatSnackBar,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.edition) {
      this.edition = changes.edition.currentValue;
    }
    if (changes.freeRequest) {
      this.freeRequest = changes.freeRequest.currentValue;
      if (this.freeRequest) {
        this.checkDraft();
        // if (!this.draft) {
        //   this.requestService.resetRequest();
        // }
      }
    }
    if (changes.request) {
      if (this.edition) {
        this.setEditableRequest(changes.request.currentValue);
      }
    }
    if (changes.trip) {
      const trip: Trip = changes.trip.currentValue;
      this.setCity({
        city: trip.to.airport.city,
        country: trip.to.airport.country,
      });
    }
  }

  ngOnInit() {
    this.adapter.setLocale('fr');

    // Initialisation
    this.userService.getCurrentUser(false).subscribe(user => this.currentUser = user);

    const savedCity = this.requestService.currentCity.getValue();
    if (savedCity) {
      this.setCity(savedCity);
    }

    // Manage stored items
    const nextItemList = new Subject();
    this.requestService.onStoredItems()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((items) => {
      nextItemList.next();
      this.items = items;
      if (items && items.length) {
        this.computeBonus();
      }
      // this.checkDraft();
    });

    this.requestService.getStoredItems();
    this.requestService.onTotalPrice().subscribe((price) => {
      this.totalPrice = price;
    });

    // Fetch citites
    this.geoService.onCities()
    .subscribe(cities => {
      this.cityLoading = false;
      this.cities = cities;
    });

    // Manage form changes
    this.meeting.controls.city.valueChanges
    .subscribe(city => {
      this.meeting.controls.meetingPoint.patchValue({city: city.city, country: city.country});
    });
    this.meeting.controls.urgent.valueChanges
    .subscribe((value) => {
      if (value) {
        this.meeting.controls.urgentDetails.get('date').setValidators(Validators.required);
      } else {
        this.meeting.controls.urgentDetails.get('date').clearValidators();
      }
    });
    this.meeting.controls.airportPickup.valueChanges.subscribe(() => this.computeBonus());
    this.meeting.controls.bonus.valueChanges.subscribe(() => this.computeTotalPrice());
  }

  fetchCities(city: string) {
    this.nextCityQuery.next();
    this.cityLoading = true;
    timer(250).pipe(takeUntil(this.nextCityQuery))
    .subscribe(() => {
      this.geoService.getCities(city);
    });
  }

  displayCity(city: {city: string, country: string}) {
    return city ? city.city : '';
  }

  setCity(city: {city: string, country: string}) {
    this.meeting.controls.city.patchValue(city);
    this.meeting.controls.meetingPoint.patchValue(city);
    const savedCity = this.requestService.currentCity.getValue();
    if (!savedCity) {
      this.requestService.setCurrentCity(city);
    }
  }

  checkDraft() {
    const draft = this.postService.getRequestDraft();
    if (draft) {
      this.setEditableRequest(draft);
      this.draft = true;
      this.edition = false;
    }
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
        width: '85vw',
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
    this.requestService.addItem(item);
  }

  newItem() {
    this.historyService.add(this.location.path());
    const tree = this.router.createUrlTree(['item', 'new'], { relativeTo: this.route });
    const serializedTree = this.router.serializeUrl(tree);
    this.router.navigate([serializedTree]);
  }

  editItem(item: Item) {
    this.requestService.setCurrentItem(item);
    const tree = this.router.createUrlTree(['item', 'edit'], { relativeTo: this.route });
    const serializedTree = this.router.serializeUrl(tree);
    this.router.navigate([serializedTree]);
  }

  removeItem(index) {
    this.requestService.removeItem(index);
  }

  removeDraft() {
    this.postService.deleteRequestDraft();
    this.requestService.resetRequest();
    this.snack.open('Le brouillon a ??t?? supprim??', 'OK', {duration: 3000});
    this.draft = false;
  }

  removeRequest() {
    if (this.edition) {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: {
          title: 'Supprimer cette annonce',
          message: 'Cette action est irr??versible. Voulez-vous continuer ?',
          action: 'Supprimer',
          actionStyle: 'btn-danger',
        },
        height: '40vh',
        width: '75vw',
      });
      dialogRef.afterClosed().subscribe((action) => {
        if (action) {
          this.postService.removeRequest(this.request)
          .subscribe((response) => {
            if (response.status) {
              this.snack.open('L\'annonce a ??t?? supprim??e', 'OK', {duration: 5000});
              this.router.navigate(['/home']);
            }
          }, (error) => this.uiService.serverError(error));
        }
      });
    }
  }

  setHomeCity() {
    const user = this.currentUser;
    if (user && user.address && user.address.city && user.address.country) {
      this.setCity({city: user.address.city, country: user.address.country});
    } else {
      this.noAddress();
    }
  }

  homeDelivery() {
    const isHomeDelivery = !this.meeting.controls.homeDelivery.value;
    if (isHomeDelivery) {
      if (this.currentUser) {
        if (this.currentUser.address && objectIsComplete(this.currentUser.address)) {
          this.meeting.controls.meetingPoint.patchValue(this.currentUser.address);
        } else {
          this.noAddress();
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
    const requestServiceHasData = this.requestService.hasData();
    if (this.edition || !requestServiceHasData) {
      if (!request.outdated && !request.closed) {
        this.meeting.patchValue(request);
        if (request.meetingPoint && request.meetingPoint.city && request.meetingPoint.country) {
          this.setCity({
            city: request.meetingPoint.city,
            country: request.meetingPoint.country
          });
        }
        if (request.items) {
          this.requestService.setStoredItems(request.items);
          this.items = request.items;
          this.computeBonus(request.bonus);
          this.computeTotalPrice();
        }
        this.requestId = request.id;
        this.edition = true;
      } else {
        this.snack.open('Cette annonce n\'est plus valide', 'OK', {duration: 3000});
        this.historyService.back(1);
      }
    }
  }

  saveRequest() {
    this.uiService.setLoading(true);
    const saveRequest = this.createSaveRequest();
    let proposal;

    saveRequest.user = this.currentUser;
    if (this.currentUser) {
      if (saveRequest.trip) {
        proposal = this.createProposal(saveRequest);
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
          this.postService.deleteRequestDraft();
          this.requestService.resetRequest();
          this.snack.open(`Annonce ${this.edition ? 'modifi??e' : 'enregistr??e'}`, 'Top!', {duration: 3000});
          const route = saveRequest.trip
          ? [`/post/proposal/${responseProposal.id}`]
          : [`/post/request/${responseRequest.id}`];
          this.router.navigate(route);
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
    if (meeting.city) {
      meeting.meetingPoint = {
        city: meeting.city.city,
        country: meeting.city.country,
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

  private createProposal(request: Request) {
    return {
      from: request,
      to: request.trip.id,
      date: moment(),
      author: this.currentUser,
      receiver: request.trip.user,
      bonus: request.bonus,
      airportPickup: this.trip.airportDrop || request.airportPickup,
      meetingPoint: (this.trip.airportDrop || request.airportPickup) ? new MeetingPoint({
        city: this.trip.to.airport.city,
        country: this.trip.to.airport.country
      }) : request.meetingPoint,
    };
  }

  /**
   * Computes a bonus for the traveler
   * @param bonus : Existing bonus when editing a request
   */
  private computeBonus(bonus?: number) {
    this.itemsPrice = arraySum(this.items.map(item => item.price));
    if (Number.isNaN(this.itemsPrice)) {
      this.itemsPrice = 0;
    }
    const calculatedBonus = estimateBonus(this.items, this.meeting.controls.airportPickup.value);
    const resultingBonus = Math.ceil(bonus || calculatedBonus);
    this.meeting.controls.bonus.patchValue(resultingBonus);
    // Update validation on bonus input
    this.meeting.controls.bonus.setValidators([
      Validators.required, Validators.min(resultingBonus * 0.6), Validators.max(resultingBonus * 2)
    ]);
    this.computeTotalPrice();
    this.computedBonus = resultingBonus;
    this.requestService.setBonus(resultingBonus);
  }

  private computeTotalPrice() {
    const bonus = this.meeting.controls.bonus.value;
    const itemsPrice = this.itemsPrice || 0;
    const price = calculateTotalPrice(itemsPrice, bonus);
    this.requestService.setTotalPrice(price);
  }

  private requestError(draft) {
    this.saveDraft(draft);
    this.dialog.open(NotConnectedComponent);
    this.uiService.setLoading(false);
  }

  private saveDraft(draft) {
    const city = this.meeting.controls.city.value;
    if (draft
        && (objectIsComplete(draft.meetingPoint)
        || (draft.items && draft.items.length)
        || objectIsComplete(draft.urgentDetails)
        || objectIsComplete(city))) {
      this.postService.saveRequestDraft(draft);
    }
  }

  private requestServerError(message: string, code: string)??{
    const snackRef = this.snack.open(`Un probl??me a eu lieu. (${message} - ${code})`, 'R??essayer', {duration: 5000});
    snackRef.onAction().subscribe(() => this.saveRequest());
  }

  private noAddress() {
    const snack = this.snack.open('Vous n\'avez pas indiqu?? d\'adresse dans votre profil', 'Ajouter', {duration: 5000});
    snack.onAction().subscribe(() => {
      const draft = this.createSaveRequest();
      this.saveDraft(draft);
      this.router.navigate(['/account/info']);
    });
  }

  ngOnDestroy() {
    this.geoService.resetCities();
    if (!this.saved && this.freeRequest && !this.edition) {
      const draft = this.createSaveRequest();
      this.saveDraft(draft);
    }
    // if (this.edition) {
    //   this.requestService.resetRequest();
    // }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
