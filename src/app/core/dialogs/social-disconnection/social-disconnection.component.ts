import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-social-disconnection',
  templateUrl: './social-disconnection.component.html',
  styleUrls: ['./social-disconnection.component.scss']
})
export class SocialDisconnectionComponent implements OnInit {

  socialProvider: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {provider: string, token: string},
    private dialogRef: MatDialogRef<SocialDisconnectionComponent>,
  ) { }

  ngOnInit() {
    this.socialProvider = this.data.provider.toLowerCase();
  }

  close(disconnect: boolean) {
    this.dialogRef.close(disconnect);
  }

}
