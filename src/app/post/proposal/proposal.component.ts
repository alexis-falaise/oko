import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import * as moment from 'moment';

import { MessengerService } from '@core/messenger.service';
import { PostService } from '@core/post.service';
import { UiService } from '@core/ui.service';
import { UserService } from '@core/user.service';

import { ConfirmComponent } from '@core/dialogs/confirm/confirm.component';
import { ProposalEditComponent } from '../proposal-edit/proposal-edit.component';
import { ProposalEditBonusComponent } from './proposal-edit-bonus/proposal-edit-bonus.component';
import { ProposalEditMeetingComponent } from './proposal-edit-meeting/proposal-edit-meeting.component';

import { Proposal } from '@models/post/proposal.model';
import { Request } from '@models/post/request.model';
import { ServerResponse } from '@models/app/server-response.model';
import { Trip } from '@models/post/trip.model';
import { User } from '@models/user.model';
import { Post } from '@models/post/post.model';
import { timer } from 'rxjs';
import { ProposalEditDateComponent } from './proposal-edit-date/proposal-edit-date.component';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss'],
})
export class ProposalComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  @ViewChild('actionsBar') actionsBar;
  @Input() proposal: Proposal;
  @Input() receiver: boolean;
  @Input() entry: Post;
  currentUser: User;
  fromTrip: boolean;
  toTrip: boolean;
  isLastUpdateAuthor: boolean;
  standalone: boolean;
  self: boolean;
  displayBottomOffset: number;
  displayLocation: boolean;
  displayAcceptButton: boolean;
  displayRefuseButton: boolean;
  displayPaymentButton: boolean;
  displayConfirmButton: boolean;
  displayDeliveryButton: boolean;
  displayContextualButtons: boolean;
  fullSummary: boolean;
  actionsBarExtended = false;
  moment = moment;

  constructor(
    private messengerService: MessengerService,
    private postService: PostService,
    private userService: UserService,
    private uiService: UiService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private socket: Socket,
    private snack: MatSnackBar
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.proposal) {
      this.proposal = changes.proposal.currentValue;
      this.initProposal();
    }
    if (changes.receiver) {
      this.receiver = changes.receiver.currentValue;
    }
    if (changes.entry) {
      this.entry = changes.entry.currentValue;
    }
  }

  ngOnInit() {
    this.userService.getCurrentUser()
    .subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.route.url.subscribe(segments => {
          this.standalone = !!segments.find(segment => segment.path === 'proposal');
          if (this.standalone) {
            this.getStandaloneProposal();
          } else {
            this.initProposal();
          }
        });
      }
    }, (error) => {
      this.uiService.serverError(error);
      this.router.navigate(['/login']);
    });
  }

  ngAfterViewInit() {
    if (this.standalone) {
      timer(1000).subscribe(() => {
        this.displayBottomOffset = this.actionsBar.nativeElement.clientHeight;
      });
    }
  }

  initProposal() {
    if (this.proposal) {
      this.fromTrip = this.proposal.isFromTrip();
      this.toTrip = this.proposal.isToTrip();
      if (this.proposal.receiver && this.currentUser) {
        this.receiver = this.proposal.receiver.id === this.currentUser.id;
      }
      if (this.currentUser) {
        this.proposal.isAuthor(this.currentUser);
        this.isLastUpdateAuthor = this.proposal.lastUpdate.author.id === this.currentUser.id;
        this.displayManagement();
        if (!this.isLastUpdateAuthor || this.proposal.accepted) {
          this.actionsBarExtended = true;
        }
      }
      if (this.entry) {
        if (this.proposal.from instanceof Post) {
          this.self = this.entry.id === this.proposal.from.id;
        }
        if (typeof this.proposal.from === 'string') {
          this.self = this.entry.id === this.proposal.from;
        }
      }
    }
  }

  getStandaloneProposal() {
    this.route.params.subscribe(param => {
      if (param && param.id) {
        this.uiService.setLoading(true);
        this.postService.getProposalById(param.id)
        .subscribe(proposal => {
          if (proposal) {
            this.postService.getAllProposalSubPosts(proposal)
            .subscribe(filledProposal => {
              this.uiService.setLoading(false);
              this.removeProposalListeners();
              this.proposal = new Proposal(filledProposal);
              this.setProposalListeners();
              this.initProposal();
            }, (error) => this.uiService.serverError(error));
          } else {
            this.uiService.setLoading(false);
          }
        }, (error) => this.uiService.serverError(error));
      }
    });
  }

  openTrip(trip: Trip) {
    this.router.navigate([`/post/trip/${trip._id}`]);
  }

  openRequest(request: Request) {
    this.router.navigate([`/post/request/${request._id}`]);
  }

  contact() {
    const otherParty = this.proposal.authorView ? this.proposal.receiver : this.proposal.author;
    this.messengerService.getContactThread(otherParty, this.currentUser);
  }

  acceptProposal() {
    if (!this.meetingPointDefined()) {
      this.snack.open('Le lieu de remise n\'a pas été défini', 'C\'est vrai', {duration: 5000});
      this.updateProposalMeeting('Proposer un lieu de remise');
    } else {
      if (!this.proposal.pickupDate) {
        this.snack.open('Choisissez une date de remise', 'Ah oui', { duration: 5000 });
        this.updateProposalDate();
      }
      if (!this.proposal.accepted && !this.proposal.outdated) {
        const dialogRef = this.dialog.open(ConfirmComponent, {
          data: {
            title: 'Accepter la proposition',
            message: `Bonus de ${this.proposal.bonus} € -
            Remise à ${this.proposal.airportPickup
            ? 'l\'aéroport'
            : this.proposal.meetingPoint.address + ', ' + this.proposal.meetingPoint.city + ' - ' + this.proposal.meetingPoint.country}.
            Tout est ok ?`,
            action: 'Accepter',
            actionStyle: 'btn-success',
          },
          height: '40vh',
          width: '75vw',
        });
        dialogRef.afterClosed().subscribe((action) => {
          if (action) {
            this.uiService.setLoading(true);
            this.postService.acceptProposal(this.proposal.id)
            .subscribe((response: ServerResponse) => {
              if (response.status) {
                this.snack.open('La proposition a été acceptée', 'Génial', {duration: 3000});
                this.proposal.accepted = response.data.accepted;
              } else {
                this.serverError(response);
              }
            this.uiService.setLoading(false);
            }, (err) => this.serverError(err));
          }
        });
      }
    }
  }

  closeProposal() {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        title: 'Annuler la proposition',
        message: 'Vous allez annuler la proposition. Voulez-vous continuer ?',
        action: 'Annuler',
        actionStyle: 'btn-danger',
        cancel: 'Retour',
      },
      height: '40vh',
      width: '75vw',
    });
    dialogRef.afterClosed().subscribe((action) => {
      if (action) {
        this.uiService.setLoading(true);
        this.postService.closeProposal(this.proposal.id)
        .subscribe((response: ServerResponse) => {
          if (response.status) {
            this.snack.open('La proposition a été annulée', 'OK', {duration: 3000});
            this.proposal.closed = response.data.closed;
          } else {
            this.serverError(response);
          }
        this.uiService.setLoading(false);
        }, (err) => this.serverError(err));
      }
    });
  }

  payProposal() {
    this.uiService.setLoading(true);
    this.router.navigate(['/post', 'proposal', this.proposal.id, 'pay']);
  }

  refuseProposal() {
    if (!this.proposal.refused && !this.proposal.outdated) {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: {
          title: 'Refuser la proposition',
          message: 'Êtes-vous sur de vouloir refuser cette proposition ?',
          action: 'Refuser',
          actionStyle: 'btn-danger',
        },
        height: '40vh',
        width: '75vw',
      });
      dialogRef.afterClosed().subscribe((action) => {
        if (action) {
          this.uiService.setLoading(true);
          this.postService.refuseProposal(this.proposal.id)
          .subscribe((response: ServerResponse) => {
            if (response.status) {
              this.snack.open('La proposition a été refusée', 'OK', {duration: 3000});
              this.proposal.refused = response.data.refused;
            } else {
              this.serverError(response);
            }
          this.uiService.setLoading(false);
          }, (err) => this.serverError(err));
        }
      });
    }
  }

  validateProposal() {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        title: 'Confirmer la réception',
        message: `Vous confirmez avoir bien reçu vos articles de la part de ${
          this.proposal.fromTrip ? this.proposal.author.firstname : this.proposal.receiver.firstname}`,
        action: 'Bien reçu',
        actionStyle: 'btn-success',
      },
      height: '40vh',
      width: '75vw',
    });
    dialogRef.afterClosed().subscribe((action) => {
      if (action) {
        this.uiService.setLoading(true);
        this.postService.validateProposal(this.proposal.id)
        .subscribe((response: ServerResponse) => {
          if (response.status) {
            this.snack.open('La réception a bien été confirmée', 'Parfait', {duration: 3000});
            this.proposal.validated = response.data.validated;
          } else {
            this.serverError(response);
          }
        this.uiService.setLoading(false);
        }, (err) => this.serverError(err));
      }
    });
  }

  modifyProposal() {
    const dialogRef = this.dialog.open(ProposalEditComponent, {
      height: '85vh',
      width: '80vw',
      data: {
        proposal: this.proposal,
        user: this.currentUser,
      },
    });
    dialogRef.afterClosed().subscribe(proposal => {
      if (proposal) {
        this.proposal.bonus = proposal.bonus;
        this.proposal.updates = proposal.updates;
        this.proposal = new Proposal(this.proposal);
      }
    });
  }

  updateProposalDate() {
    const dialogRef = this.dialog.open(ProposalEditDateComponent, {
      height: '50vh',
      width: '75vw',
      data: {
        proposal: this.proposal,
      }
    });
    dialogRef.afterClosed().subscribe(proposal => {
      if (proposal) {
        this.proposal.pickupDate = proposal.pickupDate;
        this.proposal = new Proposal(this.proposal);
      }
    });
  }

  updateProposalBonus() {
    const dialogRef = this.dialog.open(ProposalEditBonusComponent, {
      height: '60vh',
      width: '80vw',
      data: {
        proposal: this.proposal,
        user: this.currentUser,
      },
    });
    dialogRef.afterClosed().subscribe(proposal => {
      if (proposal) {
        this.proposal.bonus = proposal.bonus;
        this.proposal.updates = proposal.updates;
        this.proposal = new Proposal(this.proposal);
      }
    });
  }

  updateProposalMeeting(title?: string) {
    const dialogRef = this.dialog.open(ProposalEditMeetingComponent, {
      height: '75vh',
      width: '90vw',
      data: {
        title: title,
        proposal: this.proposal,
        user: this.currentUser,
      }
    });
    dialogRef.afterClosed().subscribe(proposal => {
      if (proposal) {
        this.proposal.meetingPoint = proposal.meetingPoint;
        this.proposal.airportPickup = proposal.airportPickup;
        this.proposal.updates = proposal.updates;
        this.proposal = new Proposal(this.proposal);
      }
    });
  }

  openProposal() {
    this.router.navigate(['/post', 'proposal', this.proposal.id]);
  }

  private setProposalListeners() {
    this.socket.on(`proposal/${this.proposal.id}`, (proposal: Proposal) => {
      this.proposal.lastUpdate = proposal.lastUpdate;
      this.proposal.meetingPoint = proposal.meetingPoint;
      this.proposal.accepted = proposal.accepted;
      this.proposal.refused = proposal.refused;
      this.proposal.closed = proposal.closed;
      this.proposal.paid = proposal.paid;
      this.proposal.validated = proposal.validated;
      this.proposal.updates = proposal.updates;
      this.proposal.airportPickup = proposal.airportPickup;
      this.proposal.bonus = proposal.bonus;
      this.proposal = new Proposal(this.proposal);
      this.initProposal();
    });
  }

  private removeProposalListeners() {
    if (this.proposal) {
      this.socket.removeListener(`proposal/${this.proposal.id}`);
    }
  }

  private serverError(error: HttpErrorResponse | ServerResponse) {
    this.uiService.setLoading(false);
    const snackRef = this.snack.open(`Une erreur est survenue (${error instanceof HttpErrorResponse ? error.status : error.message})`,
    undefined, {duration: 5000});
  }

  private meetingPointDefined(): boolean {
    if (this.proposal) {
      return this.proposal.airportPickup
      || this.proposal.meetingPoint
      && (this.proposal.meetingPoint.city && this.proposal.meetingPoint.city !== ''
      && this.proposal.meetingPoint.address && this.proposal.meetingPoint.address !== '');
    } else {
      return false;
    }
  }

  private displayManagement() {
    this.displayLocation = !((this.proposal.fromRequest && this.receiver
      || this.proposal.fromTrip && this.proposal.authorView)
      && this.proposal.paid && !this.proposal.validated);
    this.displayAcceptButton = this.proposal.lastUpdate.author.id !== this.currentUser.id
    && !this.proposal.refused && !this.proposal.closed && !this.proposal.paid;
    this.displayRefuseButton = (this.proposal.lastUpdate.author.id !== this.currentUser.id
      && !this.proposal.accepted && !this.proposal.closed)
      || (this.proposal.lastUpdate.author.id === this.currentUser.id
      && this.proposal.refused);
    this.displayPaymentButton = this.proposal.accepted
      && (this.proposal.toRequest && this.receiver
      || this.proposal.fromRequest && this.proposal.authorView);
    this.displayConfirmButton = (this.proposal.toRequest && this.receiver
      || this.proposal.fromRequest && this.proposal.authorView)
      && this.proposal.paid;
    this.displayDeliveryButton = (this.proposal.toTrip && this.receiver
      || this.proposal.fromTrip && !this.receiver)
      && this.proposal.validated;
    this.displayContextualButtons = this.displayAcceptButton
    || this.displayRefuseButton
    || this.displayPaymentButton
    || this.displayConfirmButton
    || this.displayDeliveryButton;
  }

  ngOnDestroy() {
    this.removeProposalListeners();
  }

}
