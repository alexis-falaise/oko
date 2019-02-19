import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

import { RequestItemComponent } from '../request-item/request-item.component';
import { Item } from '@models/item.model';
import { Link } from '@models/link.model';
import { Airport } from '@models/airport.model';
import { PostService } from '@core/post.service';
import { Request } from '@models/post/request.model';
import { UserService } from '@core/user.service';
import { NotConnectedComponent } from '@core/dialogs/not-connected/not-connected.component';
import { Trip } from '@models/post/trip.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss']
})
export class RequestFormComponent implements OnInit {
  @Input() trip: Trip;
  today = moment();
  items: Array<Item> = [new Item({
    label: 'iPhone XS',
    photo: ['https://static.fnac-static.com/multimedia/Images/FR/MDM/25/ca/8d/9292325/1540-1/tsp20180920193530/Apple-iPhone-XS-64-Go-5-8-Or.jpg'],
    link: new Link({
      label: 'Acheter un iphone',
      path: 'https://www.apple.com/fr/shop/buy-iphone/iphone-xs/%C3%A9cran-5,8-pouces-64go-argent#00,10,20',
    }),
    price: 1155.28
  })];
  meeting = this.fb.group({
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
    private snack: MatSnackBar,
  ) { }

  ngOnInit() {
    this.checkDraft();
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
      height: '75vh',
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

  request() {
    const saveRequest = new Request({
      items: this.items,
      trip: this.trip,
      ...this.meeting.value
    });
    console.log('Making request', saveRequest);
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
            this.snack.open('Un problème a eu lieu', 'Réessayer', {duration: 5000});
          }
        });
      } else {
        this.requestError(saveRequest);
      }
    }, (error) => {
        this.requestError(saveRequest);
    });
  }

  private requestError(draft) {
    this.postService.saveRequestDraft(draft);
    this.dialog.open(NotConnectedComponent);
  }

}
