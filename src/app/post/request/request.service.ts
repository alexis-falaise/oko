import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, Subject } from 'rxjs';

import { environment } from '@env/environment';

import { objectMatch } from '@utils/object.util';

import { Item } from '@models/item.model';
import { ServerResponse } from '@models/app/server-response.model';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  storedItems = new BehaviorSubject<Array<Item>>([]);
  computedBonus = new BehaviorSubject<number>(null);
  computedTotalPrice = new BehaviorSubject<number>(null);
  currentItem = new BehaviorSubject<Item>(null);
  private itemUrl = `${environment.serverUrl}/item`;
  private specialChars = ['-', '/', ',', '(', ':', '.'];
  constructor(
    private http: HttpClient,
    private snack: MatSnackBar,
  ) { }

  onStoredItems() {
    return this.storedItems.asObservable();
  }

  onBonus() {
    return this.computedBonus.asObservable();
  }

  onTotalPrice() {
    return this.computedTotalPrice.asObservable();
  }

  addItem(item: Item) {
    const storedItems = this.storedItems.getValue();
    storedItems.push(item);
    this.storedItems.next(storedItems);
  }

  loadItem(index: number): Item {
    const items = this.storedItems.getValue();
    return items[index];
  }

  /**
   * Helper to refresh view
   */
  getStoredItems() {
    const items = this.storedItems.getValue();
    this.storedItems.next(items);
  }

  getCurrentItem() {
    return this.currentItem.getValue();
  }

  getItemInfo(url: string): Observable<Item> {
    const timeout = timer(7500);
    const foundItem = new Subject();
    return Observable.create(observer => {
      this.http.get(`${this.itemUrl}/scrap?url=${url}`, { withCredentials: true})
      .pipe(takeUntil(timeout))
      .subscribe((response: ServerResponse) => {
        timeout.pipe(takeUntil(foundItem)).subscribe(() => {
          this.snack.open('Votre article n\'a pas été trouvé. Complétez le formulaire', 'Ca marche', {duration: 5000});
          observer.complete();
        });
        if (response.status) {
          foundItem.next(true);
          const itemInfo = response.data;
          let label = itemInfo.label;
          this.specialChars.forEach(char => {
            label = label.split(char)[0];
          });
          const formattedPrice = itemInfo.price ? itemInfo.price.slice(4).split(',').join('.') : null;
          const price = formattedPrice ? parseFloat(formattedPrice) : null;
          const item = new Item({
            price: price,
            label: label,
            description: itemInfo.label,
            photo: itemInfo.photo,
          });
          observer.next(item);
          observer.complete();
        } else {
          observer.complete();
        }
      }, (error) => observer.complete());
    });
  }

  setCurrentItem(item: Item) {
    const storedItems = this.storedItems.getValue();
    if (storedItems) {
      const itemIndex = storedItems.findIndex(storedItem => objectMatch(storedItem, item));
      if (itemIndex !== -1) {
        this.currentItem.next(item);
      }
    }
  }

  editItem(editedItem: Item, index?: number) {
    const storedItems = this.storedItems.getValue();
    const currentItem = this.currentItem.getValue();
    const itemIndex = index || storedItems.findIndex(storedItem => objectMatch(storedItem, currentItem));
    storedItems[itemIndex] = editedItem;
    this.storedItems.next(storedItems);
  }

  removeItem(index: number) {
    const storedItems = this.storedItems.getValue();
    storedItems.splice(index, 1);
    this.storedItems.next(storedItems);
  }

  resetStoredItems() {
    this.storedItems.next(null);
  }

  resetCurrentItem() {
    this.currentItem.next(null);
  }

  setBonus(bonus: number) {
    this.computedBonus.next(bonus);
  }

  setTotalPrice(price: number) {
    this.computedTotalPrice.next(price);
  }
}
