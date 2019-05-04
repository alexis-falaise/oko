import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Proposal } from '@models/post/proposal.model';
import { PostService } from '@core/post.service';
import { Request } from '@models/post/request.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ServerResponse } from '@models/app/server-response.model';
import { UiService } from '@core/ui.service';

declare var stripe: any;
declare var elements: any;

interface PricingItem {
  title: string;
  subtitle?: string;
  hint?: string;
  price: number;
}

@Component({
  selector: 'app-proposal-pay',
  templateUrl: './proposal-pay.component.html',
  styleUrls: ['./proposal-pay.component.scss']
})
export class ProposalPayComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cardInfo') cardInfo: ElementRef;
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  proposal: Proposal;
  request: Request;
  pricingItems: Array<PricingItem>;
  checkout: FormGroup = this.fb.group({
    name: ['', Validators.required],
  });
  intentKey: string;
  amount: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
    private postService: PostService,
    private uiService: UiService,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.proposal = data.proposal;
      if (this.proposal.from instanceof Request) {
        this.request = this.proposal.from;
      } else if (this.proposal.to instanceof Request) {
        this.request = this.proposal.to;
      }
      this.setAmount();
      this.createIntent(this.amount);
      this.generatePricingItems();
      this.mountCard();
    });
  }

  ngAfterViewInit() {
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  pay() {
    if (this.checkout.valid) {
      this.uiService.setLoading(true);
      stripe.handleCardPayment(this.intentKey, this.card, {
        payment_method_data: {
          billing_details: this.checkout.value,
        }
      }).then((result) => {
        if (result.error) {
          this.error = result.error.message;
          this.uiService.setLoading(false);
        } else {
          this.error = null;
          this.postService.payProposal(this.proposal.id)
          .subscribe((response: ServerResponse) => {
            if (response.status) {
              this.snack.open('La proposition a été reglée, merci', 'Super', {duration: 4500});
              this.router.navigate(['/post', 'proposal', this.proposal.id]);
            }
            this.uiService.setLoading(false);
          }, (err) => this.uiService.serverError(err));
        }
      });
    }
  }

  onChange({error}) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.changeDetector.detectChanges();
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  private createIntent(amount: number) {
    this.postService.createProposalPayment(this.proposal.id, amount)
    .subscribe((response) => {
      if (response.status) {
        this.intentKey = response.data;
      }
    }, (error) => {
      const snackRef = this.snack.open('Une erreur est survenue', 'Réessayer', {duration: 7500});
      snackRef.onAction().subscribe(() => this.createIntent(amount));
    });
  }

  private mountCard() {
  }

  private setAmount() {
    this.amount = this.request.computePrice(this.proposal.bonus);
  }

  private generatePricingItems() {
    this.pricingItems = [
      {
        title: 'Articles',
        subtitle: `${this.request.items.length} article${ this.request.items.length === 1 ? '' : 's'}`,
        hint: 'Les articles seront achetés par le voyageur pour ce prix',
        price: this.request.itemsPrice,
      },
      {
        title: 'Bonus voyageur',
        hint: 'Montant du bonus fixé par vous et le voyageur',
        price: this.proposal.bonus,
      },
    ];
  }

}
