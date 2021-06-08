import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Inject,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from '@core/user.service';
import { UiService } from '@core/ui.service';

import { User } from '@models/user.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-account-avatar-upload',
  templateUrl: './account-avatar-upload.component.html',
  styleUrls: ['./account-avatar-upload.component.scss']
})
export class AccountAvatarUploadComponent implements OnInit, OnDestroy {
  @ViewChild('file', { static: false }) file: ElementRef;
  uploadedFile: File;
  uploadedFileSize: number;
  preview: ArrayBuffer | string = '';
  user: User;
  loading;
  stopUpload = new Subject();

  constructor(
    private snack: MatSnackBar,
    private sheet: MatBottomSheetRef,
    private ref: ChangeDetectorRef,
    private userService: UserService,
    private uiService: UiService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: User,
  ) { }

  ngOnInit() {
    this.user = this.data;
    this.loading = this.uiService.onLoading();
  }

  addFile() {
    this.file.nativeElement.click();
  }

  onFileAdded() {
    const file = this.file.nativeElement.files[0];
    if (file.type.includes('image')) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.preview = reader.result;
        this.ref.detectChanges();
      };
      this.uploadedFile = file;
      this.uploadedFileSize = Math.round(file.size / 1048576 * 100) / 100;
    } else {
      this.snack.open('Veuillez utiliser une image', 'OK', {duration: 2500});
    }
  }

  uploadPicture() {
    this.uiService.setLoading(true);
    this.userService.uploadUserAvatar(this.uploadedFile, this.user)
    .pipe(takeUntil(this.stopUpload))
    .subscribe(response => {
      if (response.status) {
        this.snack.open('Votre photo de profil a été enregistrée', 'OK', {duration: 3000});
        this.uiService.setLoading(false);
        this.sheet.dismiss(response.data);
      } else {
        this.uploadError();
      }
    }, (err) => this.uploadError());
  }

  uploadError() {
    const snackRef = this.snack.open('Erreur lors de l\'enregistrement de votre photo de profil', 'Réessayer', {duration: 3000});
    snackRef.onAction().subscribe(() => this.uploadPicture());
    this.uiService.setLoading(false);
  }

  resetFile() {
    this.preview = null;
    this.uploadedFile = null;
    this.stopUpload.next(true);
    this.uiService.setLoading(false);
  }

  ngOnDestroy() {
    this.stopUpload.next(true);
    this.stopUpload.complete();
  }

}
