import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Proposal } from '@models/post/proposal.model';
import { PostService } from '@core/post.service';
import { Request } from '@models/post/request.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ServerResponse } from '@models/app/server-response.model';
import { UiService } from '@core/ui.service';
import { arraySum, round } from '@utils/math.util';

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
  bill: Array<PricingItem>;
  extended = false;
  pricingItems: Array<PricingItem>;
  extendedPricingItems: Array<PricingItem>;
  checkout: FormGroup = this.fb.group({
    name: ['', Validators.required],
  });
  intentKey: string;
  amount: number;
  validated = false;

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
      if (this.proposal.paid) {
        this.snack.open('Cette proposition a déjà été reglée', 'Ah cool', {duration: 3000});
        this.router.navigate(['/post', 'proposal', this.proposal.id]);
      }
      this.setAmount();
      this.createIntent(this.amount);
      this.generatePricingItems();
    });
  }

  ngAfterViewInit() {
    if (elements) {
      this.mountCard();
    } else {
      this.snack.open('Une erreur est survenue, merci de réessayer ultérieurement', 'OK', {duration: 3000});
      this.router.navigate(['/post', 'proposal', this.proposal.id]);
    }
  }

  pay() {
    this.validated = true;
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
          const rawPrice = this.request.computeRawPrice(this.proposal.bonus);
          this.postService.payProposal(this.proposal.id, rawPrice)
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

  toggleBillDetails() {
    this.extended = !this.extended;
    this.bill = this.extended ? this.extendedPricingItems : this.pricingItems;
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
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
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
    this.extendedPricingItems = this.request.items.map(item => ({
      title: item.label,
      hint: item.description,
      price: item.price
    })).concat([{
      title: 'Bonus voyageur',
      hint: 'Montant du bonus fixé par vous et le voyageur',
      price: this.proposal.bonus,
    }, {
      title: 'Frais de service',
      hint: 'Frais de fonctionnement de la plateforme',
      price: round(this.amount - this.proposal.bonus - arraySum(this.request.items.map(item => item.price)), 2),
    }]);
    this.bill = this.pricingItems;
  }

}
