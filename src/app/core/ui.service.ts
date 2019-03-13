import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ServerResponse } from '@models/app/server-response.model';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  loading = new BehaviorSubject(false);
  saving = new BehaviorSubject(false);

  constructor(
    private snack: MatSnackBar,
    private router: Router
  ) { }

  onLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }

  onSaving(): Observable<boolean> {
    return this.saving.asObservable();
  }

  setLoading(loadingState: boolean) {
    this.loading.next(loadingState);
  }

  setSaving(savingState: boolean) {
    this.saving.next(savingState);
  }

  serverError(error: HttpErrorResponse | ServerResponse, customMessage?: string) {
    const status = error instanceof HttpErrorResponse ? error.status : error.message;
    let message: string;
    let action: string;
    let duration: number;
    if (error instanceof HttpErrorResponse) {
      switch (status) {
        case 500:
          message = 'Une erreur est survenue';
          action = 'Réessayer';
          duration = 5000;
          break;
        case 404:
          message = 'Le post n\'a pas été trouvé';
          action = 'OK';
          duration = 3000;
          break;
        case 401:
          message = 'Vous n\'êtes pas connecté';
          action = 'Connexion';
          duration = 5000;
          break;
      }
    } else {
      message = `Une erreur est survenue (${error.message})`;
    }
    const snackRef = this.snack.open(customMessage || message, action, {duration: duration});
    snackRef.onAction().subscribe(() => {
      if (status === 401) {
        this.router.navigate(['/login']);
      }
    });
  }
}
