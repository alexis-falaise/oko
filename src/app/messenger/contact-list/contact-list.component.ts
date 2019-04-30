import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '@models/user.model';
import { MessengerService } from '@core/messenger.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit, OnChanges {
  @Input() contacts: Array<User> = [];
  @Input() currentUser: User;
  @Input() column: boolean;

  constructor(
    private messengerService: MessengerService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.contacts) {
      const contacts = changes.contacts.currentValue;
      if (contacts) {
        this.contacts = contacts.sort(this.sortContacts);
      }
    }
    if (changes.currentUser) {
      this.currentUser = changes.currentUser.currentValue;
    }
  }

  ngOnInit() {
  }

  getContactThread(contact: User) {
    this.messengerService.getContactThread(contact, this.currentUser);
  }

  private sortContacts(a: User, b: User): number {
    const firstnameCompare = a.firstname.localeCompare(b.firstname);
    const lastnameCompare = b.lastname.localeCompare(b.lastname);
    return firstnameCompare || lastnameCompare;
  }

}
