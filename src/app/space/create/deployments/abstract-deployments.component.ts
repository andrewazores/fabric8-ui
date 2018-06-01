import { OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

export class AbstractDeploymentsComponent implements OnDestroy {

  private readonly subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

  protected addSubscription(subscription: Subscription): void {
    this.subscriptions.push(subscription);
  }

}
