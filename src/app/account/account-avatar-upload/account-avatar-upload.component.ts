import { Component, OnInit, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { MatSnackBar, MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';

import { UserService } from '@core/user.service';
import { UiService } from '@core/ui.service';

import { User } from '@models/user.model';

@Component({
  selector: 'app-account-avatar-upload',
  templateUrl: './account-avatar-upload.component.html',
  styleUrls: ['./account-avatar-upload.component.scss']
})
export class AccountAvatarUploadComponent implements OnInit {
  @ViewChild('file') file;
  uploadedFile: File;
  preview: ArrayBuffer | string = '';
  user: User;

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
    } else {
      this.snack.open('Veuillez utiliser une image', 'OK', {duration: 2500});
    }
  }

  uploadPicture() {
    this.uiService.setLoading(true);
    this.userService.uploadUserAvatar(this.uploadedFile, this.user)
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
    this.uiService.setLoading(true);
  }

  resetFile() {
    this.preview = null;
    this.uploadedFile = null;
  }

}
