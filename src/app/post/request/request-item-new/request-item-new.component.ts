import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { RequestService } from '../request.service';

import { Item } from '@models/item.model';
import { Link } from '@models/link.model';
import { itemSizes } from '@static/item-sizes.static';
import { validUrl, extractHostname } from '@utils/index.util';
import { UiService } from '@core/ui.service';
import { MatSnackBar, MatBottomSheet } from '@angular/material';
import { PictureUploadComponent } from '@shared/picture-upload/picture-upload.component';

@Component({
  selector: 'app-request-item-new',
  templateUrl: './request-item-new.component.html',
  styleUrls: ['./request-item-new.component.scss']
})
export class RequestItemNewComponent implements OnInit {
  @ViewChild('itemPicture') itemPicture: ElementRef;
  @ViewChild('itemLink') itemLink;
  @ViewChild('stepper') stepper;
  item = this.fb.group({
    label: ['', Validators.required],
    description: ['', Validators.required],
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
  selectedSize: string;
  clickedStep: number;
  isNotEcommerce: boolean;
  ecommerceFound: boolean;
  edition: boolean;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private requestService: RequestService,
    private route: ActivatedRoute,
    private router: Router,
    private sheet: MatBottomSheet,
    private snack: MatSnackBar,
  ) { }

  ngOnInit() {
    this.route.url.subscribe(segments => {
      const itemIndex = segments.findIndex(segment => segment.path === 'item');
      this.edition = segments[itemIndex + 1].path === 'edit';
      if (this.edition) {
        const item = this.requestService.getCurrentItem();
        this.item.patchValue(item);
        this.item.controls.link.patchValue(item.link.path);
      }
    });
    this.item.controls.link.valueChanges.subscribe(() => this.getItemInfo());
    this.initSize();
  }

  getItemInfo() {
    const pastedUrl = this.item.controls.link.value;
    this.ecommerceFound = false;
    const host = extractHostname(pastedUrl);
    this.snack.open(`Recherche de votre article sur ${host}`, undefined, {duration: 5000});
    if (validUrl(pastedUrl)) {
      this.uiService.setLoading(true);
      this.requestService.getItemInfo(pastedUrl)
      .subscribe(item => {
        this.uiService.setLoading(false);
        if (item) {
          this.ecommerceFound = true;
          this.snack.open('Article trouvé', 'Génial', {duration: 3000});
          this.item.patchValue(item);
        }
      });
    } else {
      const snackRef = this.snack.open('Merci d\'entrer un lien valide', 'OK', {duration: 3000});
      snackRef.onAction().subscribe(() => this.itemLink.focus());
    }
  }

  focusPicture() {
    this.itemPicture.nativeElement.focus();
  }

  goToStep(index: number) {
    this.stepper.selectedIndex = index;
  }

  clickStep(index: number) {
    this.clickedStep = index;
  }

  previous() {
    this.stepper.previous();
  }

  next(authorized?: boolean) {
    if (authorized) {
      this.stepper.next();
    }
  }

  initSize() {
    if (this.edition) {
      const sizeIndex = this.itemSizes.findIndex(size => size.height === this.item.controls.height.value);
      this.selectSize(sizeIndex);
    } else {
      this.selectSize(0);
    }
  }

  selectSize(index: number) {
    this.itemSizes.forEach((size, sizeIndex) => {
        size.selected = sizeIndex === index;
        if (sizeIndex === index) {
          this.selectedSize = size.label;
          this.item.patchValue({
            height: size.height,
            width: size.width,
            depth: size.depth,
            weight: size.weight,
          });
        }
    });
  }

  pictureUpload() {
    const sheetRef = this.sheet.open(PictureUploadComponent, {
      autoFocus: true,
      closeOnNavigation: true,
      data: this.item.value,
    });
    sheetRef.afterDismissed().subscribe((picture) => {
      this.item.controls.photo.patchValue(picture);
    });
  }

  save() {
    const item = new Item(this.item.value);
    item.photo = [this.item.value.photo];
    item.link = new Link({label: this.item.value.label, path: this.item.value.link});
    if (this.edition) {
      this.requestService.editItem(item);
      this.requestService.resetCurrentItem();
    } else {
      this.requestService.addItem(item);
    }
    this.router.navigate(['../..'], { relativeTo: this.route });
  }

}
