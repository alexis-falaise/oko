import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-connected',
  templateUrl: './not-connected.component.html',
  styleUrls: ['./not-connected.component.scss']
})
export class NotConnectedComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NotConnectedComponent>,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  login() {
    this.router.navigate(['/login']);
    this.dialogRef.close();
  }

  signin() {
    this.router.navigate(['/signin']);
    this.dialogRef.close();
  }

}
