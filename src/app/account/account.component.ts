import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatBottomSheet } from '@angular/material';
import { Socket } from 'ngx-socket-io';

import { UserService } from '@core/user.service';
import { PostService } from '@core/post.service';

import { AccountAvatarUploadComponent } from './account-avatar-upload/account-avatar-upload.component';

import { User } from '@models/user.model';
import { Link } from '@models/link.model';
import { Proposal } from '@models/post/proposal.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  currentUser: User = null;
  categories: Array<Link> = [
    { label: 'Infos', path: '/account/info', icon: 'account_box' },
    { label: 'Propositions', path: '/account/proposal', icon: 'announcement', badge: 0 },
    { label: 'Trajets', path: '/account/trip', icon: 'explore' },
    { label: 'Demandes', path: '/account/request', icon: 'new_releases' },
    { label: 'Solde', path: '/account/balance', icon: 'euro_symbol' }
    // { label: 'Articles', path: '/account/item', icon: 'shopping_cart' },
  ];

  constructor(
    private postService: PostService,
    private userService: UserService,
    private snack: MatSnackBar,
    private sheet: MatBottomSheet,
    private socket: Socket,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.fetchProposalData();
        this.subscribeProposalEvents();
      } else {
        this.connexionError();
      }
    }, (err) => this.connexionError());
  }

  openAvatarUpload() {
    const sheetRef = this.sheet.open(AccountAvatarUploadComponent, {
      autoFocus: true,
      closeOnNavigation: true,
      data: this.currentUser,
    });
    sheetRef.afterDismissed().subscribe((user) => {
      if (user) {
        this.currentUser = new User(user);
      }
    });
  }

  connexionError() {
    const snackRef = this.snack.open('Vous avez été déconnecté', 'Reconnexion');
    snackRef.onAction().subscribe(() => {
      this.router.navigate(['/oneclick']);
    });
  }

  ngOnDestroy() {
    if (this.currentUser) {
      this.unsubscribeProposalEvents();
    }
  }

  private subscribeProposalEvents() {
    this.socket.on(`proposal/${this.currentUser.id}`, () => {
      console.log('Proposal event in account');
      this.fetchProposalData();
    });
  }

  private unsubscribeProposalEvents() {
    this.socket.removeListener(`proposal/${this.currentUser.id}`);
  }

  private fetchProposalData() {
    console.log('Fetch proposal');
    this.postService.getUnseenProposalsByReceiver(this.currentUser)
    .subscribe((proposals: Array<Proposal>) => {
      if (proposals) {
        const proposalCategoryIndex = this.categories.findIndex(category => category.label === 'Propositions');
        this.categories[proposalCategoryIndex].badge = proposals.length;
      }
    });
  }

}
