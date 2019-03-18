import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { MatSnackBar } from '@angular/material';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private snack: MatSnackBar,
    private socket: Socket,
  ) { }
}
