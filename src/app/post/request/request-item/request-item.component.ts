import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Item } from '@models/item.model';
import { FormBuilder, Validators } from '@angular/forms';
import { Link } from '@models/link.model';

@Component({
  selector: 'app-request-item',
  templateUrl: './request-item.component.html',
  styleUrls: ['./request-item.component.scss']
})
export class RequestItemComponent implements OnInit {

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
    price: [0, Validators.compose([Validators.min(0), Validators.required])],
  });
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
      this.item.controls.link.patchValue(this.data.item.link.path);
      this.index = this.data.index;
      this.modifying = this.data.modifying;
    }
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