import {
  Inject,
  Injectable,
  InjectionToken
} from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';
import { Logger } from 'ngx-base';
import { Observable } from 'rxjs';
import { WIT_API_URL } from 'ngx-fabric8-wit';

import { Environment } from '../models/environment';
import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';

export const DEPLOYMENTS_SERVICE = new InjectionToken<IDeploymentsService>('IDeploymentsService');

export declare interface IDeploymentsService {
  getApplications(spaceId: string): Observable<string[]>;
  getEnvironments(spaceId: string): Observable<Environment[]>;
  getPodCount(spaceId: string, environmentId: string): Observable<number>;
  getVersion(spaceId: string, environmentId: string): Observable<string>;
  getCpuStat(spaceId: string, environmentId: string): Observable<CpuStat>;
  getMemoryStat(spaceId: string, environmentId: string): Observable<MemoryStat>;
}

export declare interface ApplicationsResponse {
  data: Applications;
}

export declare interface Applications {
  applications: Application[];
  id: string;
}

export declare interface Application {
  id: string;
  name: string;
  pipeline: Pipeline[];
}

export declare interface Pipeline {
  id: string;
  name: string;
  stats: Stats;
}

export declare interface Stats {
  cpucores: CpuCores;
  memory: Memory;
  pods: Pods;
}

export declare interface CpuCores {
  used: number;
}

export declare interface Memory {
  units: string;
  used: number;
}

export declare interface Pods {
  running: number;
  starting: number;
  stopping: number;
}

@Injectable()
export class DeploymentsService implements IDeploymentsService {
  static readonly POLL_RATE_MS: number = 5000;

  public headers = new Headers({ 'Content-Type': 'application/json' });
  public appsUrl: string;

  constructor(
    public http: Http,
    public logger: Logger,
    public auth: AuthenticationService,
    @Inject(WIT_API_URL) apiUrl: string
  ) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.appsUrl = apiUrl + 'apps/spaces/23630802-c4b2-11e7-82a2-507b9dac9ad3';
  }

  getApplications(spaceId: string): Observable<string[]> {
    return this.http
      .get(this.appsUrl, { headers : this.headers })
      .map(response => response.json() as ApplicationsResponse)
      .concatMap(resp => resp.data.applications)
      .map(app => app.name)
      .toArray();
  }

  getEnvironments(spaceId: string): Observable<Environment[]> {
    return Observable.of([
      { environmentId: 'envId-stage', name: 'stage' } as Environment,
      { environmentId: 'envId-run', name: 'run' } as Environment
    ]);
  }

  getPodCount(spaceId: string, environmentId: string): Observable<number> {
    return Observable
      .interval(DeploymentsService.POLL_RATE_MS)
      .distinctUntilChanged()
      .map(() => Math.floor(Math.random() * 5) + 1);
  }

  getVersion(spaceId: string, environmentId: string): Observable<string> {
    return Observable.of('1.0.2');
  }

  getCpuStat(spaceId: string, environmentId: string): Observable<CpuStat> {
    return Observable
      .interval(DeploymentsService.POLL_RATE_MS)
      .distinctUntilChanged()
      .map(() => ({ used: Math.floor(Math.random() * 9) + 1, total: 10 } as CpuStat))
      .startWith({ used: 3, total: 10 } as CpuStat);
  }

  getMemoryStat(spaceId: string, environmentId: string): Observable<MemoryStat> {
    return Observable
      .interval(DeploymentsService.POLL_RATE_MS)
      .distinctUntilChanged()
      .map(() => ({ used: Math.floor(Math.random() * 156) + 100, total: 256 } as MemoryStat))
      .startWith({ used: 200, total: 256 } as MemoryStat);
  }
}
