import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
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
  @Input() light = false;
  @Output() drawerChanges = new EventEmitter();
  menuDisplay = false;
  previousAvailable = false;
  guestAccountMenuItems: Array<MenuItem> = [
    { label: 'Aide', path: '/help', icon: 'help' },
    { label: 'Connexion', path: '/login', icon: 'power_settings_new' },
  ];
  accountMenuItems: Array<MenuItem> = [
    { label: 'Aide', path: '/help', icon: 'help' },
    { label: 'Mon compte', path: '/account/info', icon: 'account_circle' },
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
  randomWelcome: string;
  logged = false;

  constructor(
    private authService: AuthService,
    private historyService: HistoryService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.drawer) {
      this.menuDisplay = changes.drawer.currentValue;
    }
    if (changes.light) {
      this.light = changes.light.currentValue;
    }
  }

  ngOnInit() {
    this.authService.onUser()
    .subscribe(user => {
      if (user) {
        this.displayAccountMenuItems = this.accountMenuItems;
        this.generateRandomWelcome(user.firstname);
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
        this.hide();
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
      `Je te suis ${name} !`
    ];
    const rand = Math.floor(Math.random() * randomWelcomes.length);
    this.randomWelcome = randomWelcomes[rand];
  }

}
