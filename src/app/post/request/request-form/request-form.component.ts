import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';

import { RequestItemComponent } from '../request-item/request-item.component';
import { Item } from '@models/item.model';
import { Link } from '@models/link.model';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss']
})
export class RequestFormComponent implements OnInit {
  items: Array<Item> = [new Item({
    label: 'iPhone XS',
    photo: ['https://static.fnac-static.com/multimedia/Images/FR/MDM/25/ca/8d/9292325/1540-1/tsp20180920193530/Apple-iPhone-XS-64-Go-5-8-Or.jpg'],
    link: new Link({
      label: 'Acheter un iphone',
      path: 'https://www.apple.com/fr/shop/buy-iphone/iphone-xs/%C3%A9cran-5,8-pouces-64go-argent#00,10,20',
    }),
    price: 1155.28
  })];
  disclose = [];

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  openItemDialog(item?: Item, index?: number) {
    const dialogRef = this.dialog.open(RequestItemComponent, {
      height: '75vh',
      width: '95vw',
      data: item ? { item: item, index: index, modifying: true } : null,
    });
    this.disclose = [];
    dialogRef.afterClosed().subscribe(savedItemData => {
      console.log('Closed item dialog', savedItemData);
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
    this.disclose[index] = false;
  }

  removeItem(index) {
    this.items.splice(index, 1);
  }

}
