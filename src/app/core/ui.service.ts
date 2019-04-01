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
  mainLoading = new BehaviorSubject(false);
  saving = new BehaviorSubject(false);

  constructor(
    private snack: MatSnackBar,
    private router: Router
  ) { }

  onLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }

  onMainLoading(): Observable<boolean> {
    return this.mainLoading.asObservable();
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

  setMainLoading(loadingState: boolean) {
    const currentState = this.mainLoading.getValue();
    if (currentState !== loadingState) {
      this.mainLoading.next(loadingState);
    }
  }

  generateRandomWelcome(name: string) {
    const randomWelcomes = [
      `Hello ${name}`,
      `Content de te revoir ${name}`,
      `Bonjour ${name}`,
      `Salut ${name}`,
      `On part où ${name} ?`,
      `On fait quoi ${name} ?`,
      `Hey ${name} !`,
      `On commence par quoi ${name} ?`,
      `${name}, tu voulais faire quelquechose ?`,
      `Je te suis ${name} !`,
      `T'es dans la bonne direction ${name}`
    ];
    const rand = Math.floor(Math.random() * randomWelcomes.length);
    return randomWelcomes[rand];
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
    if (status === 404 || status === 403) {
      this.router.navigate([`/${status}`]);
    }
    snackRef.onAction().subscribe(() => {
      if (status === 401) {
        this.router.navigate(['/login']);
      }
    });
  }
}
