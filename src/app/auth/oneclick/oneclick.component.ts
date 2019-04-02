import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '@core/auth.service';
import { HistoryService } from '@core/history.service';

import { User } from '@models/user.model';
import { UiService } from '@core/ui.service';

@Component({
  selector: 'app-oneclick',
  templateUrl: './oneclick.component.html',
  styleUrls: ['./oneclick.component.scss']
})
export class OneclickComponent implements OnInit, OnDestroy {

  displayTagline: string;
  taglines = [
    'Le service de livraison collaboratif',
    'Ça veut dire transport',
  ];
  taglineEnter = false;
  taglineExit = false;
  partial = false;
  firstConnection = false;
  profile: User;
  password = null;
  passwordFocused = false;
  validated = false;
  ngUnsubscribe = new Subject();

  constructor(
    private authService: AuthService,
    private uiService: UiService,
    private historyService: HistoryService,
    private router: Router
  ) { }

  ngOnInit() {
    this.displayTagline = this.taglines[0];
    timer(3000, 4000).subscribe(() => this.swapTagline());
    this.subscribeStatus();
    this.subscribeSocialProfile();
  }

  googleConnect() {
    this.authService.googleConnection();
  }

  facebookConnect() {
    this.authService.facebookConnection();
  }

  signin() {
    const user = this.profile;
    user.password = this.password;
    this.validated = true;
    if (this.password && this.password.length >= 8) {
      this.uiService.setLoading(true);
      this.authService.signin(user)
      .subscribe((signInfo: any) => {
        if (signInfo.status) {
          this.authService.login(user.email, user.password);
        }
      });
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private swapTagline() {
    this.taglineExit = true;
    timer(250).subscribe(() => {
      const currentTaglineIndex = this.taglines.findIndex(line => line === this.displayTagline);
      const nextTaglineIndex = currentTaglineIndex + 1 < this.taglines.length
      ? currentTaglineIndex + 1 : 0;
      const nextTagline = this.taglines[nextTaglineIndex];
      this.displayTagline = nextTagline;
      this.taglineEnter = true;
      this.taglineExit = false;
      timer(250).subscribe(() => this.taglineEnter = false);
    });
  }

  private subscribeStatus() {
    this.authService.onStatus()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((status) => {
      if (status && status.status) {
        this.ngUnsubscribe.next();
        if (this.historyService.hasBack()) {
          this.historyService.back(1);
        } else {
          this.router.navigate(['/home']);
        }
      }
    });
  }

  private subscribeSocialProfile() {
    this.uiService.setLoading(true);
    this.authService.onSocialProfile()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((profile: User) => {
      this.uiService.setLoading(false);
      if (profile) {
        this.profile = profile;
        this.partial = true;
      }
    });
  }

}
