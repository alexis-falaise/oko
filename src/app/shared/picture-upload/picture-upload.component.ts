import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatSnackBar } from '@angular/material';
import { Item } from '@models/item.model';
import { UiService } from '@core/ui.service';
import { AppService } from '@core/app.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-picture-upload',
  templateUrl: './picture-upload.component.html',
  styleUrls: ['./picture-upload.component.scss']
})
export class PictureUploadComponent implements OnInit {
  @ViewChild('file') file;
  uploadedFile: File;
  uploadedFileSize: number;
  loading;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Item,
    private sheetRef: MatBottomSheetRef<PictureUploadComponent>,
    private appService: AppService,
    private snack: MatSnackBar,
    private uiService: UiService,
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
      this.appService.uploadPicture(file)
      .subscribe((response: any) => {
        const pictureUrl = `${environment.pictureLocation}/${response.filename}`;
        this.uiService.setLoading(false);
        this.sheetRef.dismiss(pictureUrl);
      });
    } else {
      this.snack.open('Veuillez utiliser une image', 'OK', {duration: 2500});
      this.uiService.setLoading(false);
    }
  }

}
