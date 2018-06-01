import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Spaces } from 'ngx-fabric8-wit';
import { Observable, Subscription } from 'rxjs';

import { AbstractDeploymentsComponent } from './abstract-deployments.component';
import { DeploymentStatusService } from './services/deployment-status.service';
import { DeploymentsService } from './services/deployments.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-apps',
  templateUrl: 'deployments.component.html',
  styleUrls: ['./deployments.component.less'],
  providers: [
    DeploymentStatusService,
    DeploymentsService
  ]
})
export class DeploymentsComponent extends AbstractDeploymentsComponent implements OnInit {

  spaceId: Observable<string>;
  spaceName: Observable<string>;
  environments: Observable<string[]>;
  applications: Observable<string[]>;

  constructor(
    private spaces: Spaces,
    private deploymentsService: DeploymentsService
  ) {
    super();
    this.spaceId = this.spaces.current.first().map(space => space.id);
    this.spaceName = this.spaces.current.first().map(space => space.attributes.name);
  }

  ngOnInit(): void {
    this.addSubscription(
      this.spaceId.subscribe(spaceId => {
        this.environments =
          this.deploymentsService.getEnvironments(spaceId);

        this.applications =
          this.deploymentsService.getApplications(spaceId);
      })
    );
  }

}
