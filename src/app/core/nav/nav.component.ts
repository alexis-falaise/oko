import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

import { AuthService } from '@core/auth.service';
import { HistoryService } from '@core/history.service';

import { MenuItem } from '@models/app/menu-item.model';
import { UiService } from '@core/ui.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '@models/user.model';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy, OnChanges {
  @Input() drawer = false;
  @Input() light = false;
  @Output() drawerChanges = new EventEmitter();
  ngUnsubscribe = new Subject();
  menuDisplay = false;
  hasParent = false;
  navXposition = 100;
  guestAccountMenuItems: Array<MenuItem> = [
    { label: 'Aide', path: '/help', icon: 'help' },
    { label: 'Connexion', path: '/oneclick', icon: 'power_settings_new' },
  ];
  accountMenuItems: Array<MenuItem> = [
    { label: 'Aide', path: '/help', icon: 'help' },
    { label: 'Mon compte', path: '/account', icon: 'account_circle' },
    { label: 'Déconnexion', path: '/logout', icon: 'power_settings_new' }
  ];
  menuItems: Array<MenuItem> = [
    { label: 'Accueil', path: '/home', icon: 'home' },
    { label: 'Trajets disponibles', path: '/post/trip', icon: 'map'},
    { label: 'Créer une annonce', path: '/post/request/new', icon: 'new_releases' },
    { label: 'Messages', path: '/messages', icon: 'email' },
  ];
  travelerMenuItems: Array<MenuItem> = [
    { label: 'Proposer un trajet', path: '/post/trip/new', icon: 'flight_takeoff' },
    { label: 'Annonces', path: '/post/request/', icon: 'view_day'},
  ];
  displayAccountMenuItems: Array<MenuItem> = null;
  secondaryMenuItems: Array<MenuItem> = [];
  currentUser: User;
  randomWelcome: string;
  logged = false;

  constructor(
    private authService: AuthService,
    private historyService: HistoryService,
    private uiService: UiService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.drawer) {
      this.menuDisplay = changes.drawer.currentValue;
      this.navXposition = this.menuDisplay ? 0 : 100;
    }
    if (changes.light) {
      this.light = changes.light.currentValue;
    }
  }

  ngOnInit() {
    this.authService.onUser()
    .subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.displayAccountMenuItems = this.accountMenuItems;
        this.randomWelcome = this.uiService.generateRandomWelcome(user.firstname);
      } else {
        this.currentUser = null;
        this.randomWelcome = null;
        this.displayAccountMenuItems = this.guestAccountMenuItems;
      }
    });
    this.checkParent();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.hide();
        this.authService.getLoginStatus();
        this.checkParent();
      }
    });
  }

  checkParent() {
    const url = this.router.url;
    this.hasParent = this.historyService.hasParent(url);
  }

  // pan(e) {
  //   const velocity = e.velocityX;
  //   this.navXposition += velocity * 2;
  //   if (this.navXposition > 30) {
  //     this.hide();
  //   }
  // }

  toggleMenu() {
    this.menuDisplay = !this.menuDisplay;
    this.drawerChanges.emit(this.menuDisplay);
  }

  parent() {
    this.historyService.parent();
  }

  hide() {
    this.menuDisplay = false;
    this.drawerChanges.emit(this.menuDisplay);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
