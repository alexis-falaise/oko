import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as $ from 'jquery';

import { AuthService } from '@core/auth.service';
import { HistoryService } from '@core/history.service';

import { MenuItem } from '@models/app/menu-item.model';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnChanges {
  @Input() drawer = false;
  @Output() drawerChanges = new EventEmitter();
  menuDisplay = false;
  previousAvailable = false;
  guestAccountMenuItems: Array<MenuItem> = [
    { label: 'Connexion', path: '/login', icon: 'power_settings_new' },
  ];
  accountMenuItems: Array<MenuItem> = [
    { label: 'Mon compte', path: '/account/info', icon: 'account_circle' },
    { label: 'Mes trajets', path: '/account/trip', icon: 'explore' },
    { label: 'Mes demandes', path: '/account/request', icon: 'new_releases' },
    { label: 'Déconnexion', path: '/logout', icon: 'power_settings_new' }
  ];
  menuItems: Array<MenuItem> = [
    { label: 'Accueil', path: '/home', icon: 'home' },
    { label: 'Faire une demande', path: '/post/request/new', icon: 'new_releases' },
    { label: 'Proposer un trajet', path: '/post/trip/new', icon: 'flight_takeoff' },
    { label: 'Trajets disponibles', path: '/post/trip', icon: 'map'},
    { label: 'Annonces', path: '/post/request/', icon: 'view_day'},
    { label: 'Messages', path: '/messages', icon: 'email' },
    { label: 'Aide', path: '/help', icon: 'help' },
  ];
  displayAccountMenuItems: Array<MenuItem> = null;
  secondaryMenuItems: Array<MenuItem> = [];
  logged = false;

  constructor(
    private authService: AuthService,
    private historyService: HistoryService,
    private router: Router,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.drawer) {
      this.menuDisplay = changes.drawer.currentValue;
    }
  }

  ngOnInit() {
    this.authService.onStatus()
    .subscribe(status => {
      if (status && status.status) {
        this.displayAccountMenuItems = this.accountMenuItems;
      } else {
        this.displayAccountMenuItems = this.guestAccountMenuItems;
      }
    });
    this.historyService.onHistory()
    .subscribe(history => {
      this.previousAvailable = history.length > 1;
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.authService.getLoginStatus();
      }
    });
  }

  toggleMenu() {
    this.menuDisplay = !this.menuDisplay;
    this.drawerChanges.emit(this.menuDisplay);
  }

  back() {
    this.historyService.back();
  }

  hide() {
    this.menuDisplay = false;
    this.drawerChanges.emit(this.menuDisplay);
  }

}
