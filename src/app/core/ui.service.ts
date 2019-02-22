import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  loading = new BehaviorSubject(false);
  saving = new BehaviorSubject(false);

  constructor() { }

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
}
