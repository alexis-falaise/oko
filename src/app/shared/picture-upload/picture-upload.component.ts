import { Component, OnInit, Inject, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatSnackBar } from '@angular/material';
import { Item } from '@models/item.model';
import { UiService } from '@core/ui.service';
import { AppService } from '@core/app.service';
import { environment } from '@env/environment';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-picture-upload',
  templateUrl: './picture-upload.component.html',
  styleUrls: ['./picture-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PictureUploadComponent implements OnInit {
  @ViewChild('file') file;
  uploadedFile: File;
  uploadedFileSize: number;
  loading;
  progress = 0;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Item,
    private sheetRef: MatBottomSheetRef<PictureUploadComponent>,
    private appService: AppService,
    private snack: MatSnackBar,
    private uiService: UiService,
    private detector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.loading = this.uiService.onLoading();
  }

  addFile() {
    this.file.nativeElement.click();
  }

  onFileAdded() {
    this.uiService.setLoading(true);
    const file = this.file.nativeElement.files[0];
    if (file.type.includes('image')) {
      this.uploadedFile = file;
      this.uploadedFileSize = Math.round(file.size / 1048576 * 100) / 100;
      if (this.uploadedFileSize < 3) {
        this.appService.uploadPicture(file)
        .subscribe((response: any) => {
          if (response.status === 'progress') {
            this.progress = response.data;
            this.detector.detectChanges();
          }
          if (response.status === 'done') {
            const pictureUrl = `${environment.pictureLocation}/${response.data.filename}`;
            this.uiService.setLoading(false);
            this.sheetRef.dismiss(pictureUrl);
          }
        });
      } else {
        this.snack.open(`La taille maximale autorisée est de 3 Mo (image de ${this.uploadedFileSize} Mo)`, 'OK', {duration: 4500});
        this.uploadedFile = null;
        this.uploadedFileSize = 0;
        this.uiService.setLoading(false);
      }
    } else {
      this.snack.open('Veuillez utiliser une image', 'OK', {duration: 2500});
      this.uiService.setLoading(false);
    }
  }

}
