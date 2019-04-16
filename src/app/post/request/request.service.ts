import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { objectMatch } from '@utils/object.util';

import { Item } from '@models/item.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  storedItems = new BehaviorSubject<Array<Item>>([]);
  computedBonus = new BehaviorSubject<number>(null);
  computedTotalPrice = new BehaviorSubject<number>(null);
  currentItem = new BehaviorSubject<Item>(null);

  constructor() { }

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
