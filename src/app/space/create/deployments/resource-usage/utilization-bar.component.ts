import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { AbstractDeploymentsComponent } from '../abstract-deployments.component';
import { Stat } from '../models/stat';
import { DeploymentStatusService } from '../services/deployment-status.service';

@Component({
  selector: 'utilization-bar',
  templateUrl: 'utilization-bar.component.html',
  styleUrls: ['./utilization-bar.component.less']
})
export class UtilizationBarComponent extends AbstractDeploymentsComponent implements OnInit {

  @Input() resourceTitle: string;
  @Input() resourceUnit: string;
  @Input() stat: Observable<Stat>;

  warn: boolean = false;

  used: number;
  total: number;
  usedPercent: number;
  unusedPercent: number;

  ngOnInit(): void {
    this.addSubscription(
      this.stat.subscribe((val: Stat): void => {
        this.used = val.used;
        this.total = val.quota;
        this.usedPercent = (this.total !== 0) ? Math.floor(this.used / this.total * 100) : 0;
        this.unusedPercent = 100 - this.usedPercent;

        this.warn = val.used / val.quota >= DeploymentStatusService.WARNING_THRESHOLD;
      })
    );
  }

}
