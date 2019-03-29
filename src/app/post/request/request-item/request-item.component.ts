import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';

import { Item } from '@models/item.model';
import { Link } from '@models/link.model';

import { itemSizes } from '@static/item-sizes.static';

@Component({
  selector: 'app-request-item',
  templateUrl: './request-item.component.html',
  styleUrls: ['./request-item.component.scss']
})
export class RequestItemComponent implements OnInit {
  @ViewChild('stepper') public stepper;
  item = this.fb.group({
    label: ['', Validators.required],
    description: [''],
    link: [''],
    photo: [''],
    width: [null, Validators.min(0)],
    height: [null, Validators.min(0)],
    depth: [null, Validators.min(0)],
    weight: [null, Validators.min(0)],
    cabinOnly: [false],
    price: ['', Validators.compose([Validators.min(0), Validators.required])],
  });
  itemSizes = itemSizes.filter(size => size.visible);
  index: number;
  modifying: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { item: Item, index: number, modifying: boolean },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RequestItemComponent>
  ) { }

  ngOnInit() {
    if (this.data) {
      this.item.patchValue(this.data.item);
      if (this.data.item.link) {
        this.item.controls.link.patchValue(this.data.item.link.path);
      }
      this.index = this.data.index;
      this.modifying = this.data.modifying;
      this.initSize();
    }
  }

  previous() {
    this.stepper.previous();
  }

  next(allowed?: boolean) {
    if (allowed) {
      this.stepper.next();
    }
  }

  initSize() {
    if (this.modifying) {
      const sizeIndex = this.itemSizes.findIndex(size => size.height === this.item.controls.height.value);
      this.selectSize(sizeIndex);
    }
  }

  selectSize(index: number) {
    this.itemSizes.forEach((size, sizeIndex) => {
        size.selected = sizeIndex === index;
        if (sizeIndex === index) {
          this.item.patchValue({
            height: size.height,
            width: size.width,
            depth: size.depth,
          });
        }
    });
  }

  save() {
    const item = new Item(this.item.value);
    item.photo = [this.item.value.photo];
    item.link = new Link({label: this.item.value.label, path: this.item.value.link});
    this.dialogRef.close({
      item: item,
      modifying: this.modifying,
      index: this.index,
    });
  }

  close() {
    this.dialogRef.close();
  }

}
