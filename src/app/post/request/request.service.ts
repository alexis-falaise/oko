import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { environment } from '@env/environment';

import { objectMatch, objectIsComplete, objectIsEmpty } from '@utils/object.util';

import { Item } from '@models/item.model';
import { ServerResponse } from '@models/app/server-response.model';
import { MeetingPoint } from '@models/meeting-point.model';
import { PostService } from '@core/post.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  storedItems = new BehaviorSubject<Array<Item>>([]);
  computedBonus = new BehaviorSubject<number>(null);
  computedTotalPrice = new BehaviorSubject<number>(null);
  currentItem = new BehaviorSubject<Item>(null);
  currentMeetingPoint = new BehaviorSubject<MeetingPoint>(null);
  currentCity = new BehaviorSubject<{city: string, country: string}>(null);
  private itemUrl = `${environment.serverUrl}/item`;
  private specialChars = ['-', '/', ',', '(', ')', ':', '.', '[', ']', '{', '}', '*', '_'];
  constructor(
    private http: HttpClient,
    private postService: PostService,
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

  getItemInfo(url: string): Observable<Item>??{
    const timeout = timer(7500);
    const foundItem = new Subject();
    return Observable.create(observer => {
      this.http.get(`${this.itemUrl}/scrap?url=${url}`)
      .pipe(takeUntil(timeout))
      .subscribe((response: ServerResponse) =>??{
        timeout.pipe(takeUntil(foundItem)).subscribe(() => {
          this.snack.open('Votre article n\'a pas ??t?? trouv??. Compl??tez le formulaire', 'Ca marche', {duration: 5000});
          observer.complete();
        });
        if (response.status) {
          foundItem.next(true);
          const item = this.formatItemInfo(response.data);
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

  setStoredItems(items: Array<Item>) {
    this.storedItems.next(items);
  }

  resetStoredItems() {
    this.storedItems.next([]);
  }

  resetCurrentItem() {
    this.currentItem.next(null);
  }

  resetRequest() {
    this.resetStoredItems();
    this.resetCurrentItem();
    this.computedBonus.next(null);
    this.computedTotalPrice.next(null);
    this.currentCity.next(null);
  }

  setBonus(bonus: number)??{
    this.computedBonus.next(bonus);
  }

  setTotalPrice(price: number) {
    this.computedTotalPrice.next(price);
  }

  setCurrentCity(city: {city: string, country: string}) {
    this.currentCity.next(city);
  }

  hasData() {
    const city = this.currentCity.getValue();
    const meetingPoint = this.currentMeetingPoint.getValue();
    const items = this.storedItems.getValue();
    return !!(!objectIsEmpty(city) || !objectIsEmpty(meetingPoint) || (items && items.length));
  }

  private formatItemInfo(itemData: any): Item {
    const itemInfo = itemData;
    let label = itemInfo.label;
    this.specialChars.forEach(char => {
      label = label.split(char)[0];
    });
    label = label.split(' ').slice(0, 4).join(' ');
    const formattedPrice = itemInfo.price ? itemInfo.price.slice(4).split(',').join('.') : null;
    const price = formattedPrice ? parseFloat(formattedPrice) : null;
    return new Item({
      price: price,
      label: label,
      description: itemInfo.label,
      photo: itemInfo.photo,
    });
  }
}
