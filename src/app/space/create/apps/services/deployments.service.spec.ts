import {
  Http,
  Response,
  ResponseOptions,
  XHRBackend,
  HttpModule
} from '@angular/http';
import {
  MockBackend,
  MockConnection
} from '@angular/http/testing';
import {
  discardPeriodicTasks,
  fakeAsync,
  tick,
  TestBed
} from '@angular/core/testing';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { DeploymentsService } from './deployments.service';

describe('DeploymentsService', () => {

  let mockBackend: MockBackend;
  let svc: DeploymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        { provide: XHRBackend, useClass: MockBackend },
        { provide: WIT_API_URL, useValue: 'http://example.com:1234/api/' },
        DeploymentsService
      ]
    });
    svc = TestBed.get(DeploymentsService);
    mockBackend = TestBed.get(XHRBackend);
  });

  describe('#getApplications', () => {
    it('should publish faked application names', () => {
      // given
      const expectedResponse = {
        data: {
          applications: [
            {
              name: 'vertx-hello'
            },
            {
              name: 'vertx-paint'
            },
            {
              name: 'vertx-wiki'
            }
          ]
        }
      };
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: JSON.stringify(expectedResponse),
            status: 200
          })
        ));
      });
      // when
      svc.getApplications('foo-spaceId').subscribe((data: string[]) => {
        // then
        expect(data).toEqual(['vertx-hello', 'vertx-paint', 'vertx-wiki']);
      });
    });
  });

  describe('#getEnvironments', () => {
    it('should publish faked environments', fakeAsync(() => {
      svc.getEnvironments('foo')
        .subscribe(val => {
          expect(val).toEqual([
            { environmentId: 'envId-stage', name: 'stage' },
            { environmentId: 'envId-run', name: 'run' }
          ]);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));
  });

  describe('#getPodCount', () => {
    it('should return a number between 1 and 6', fakeAsync(() => {
      svc.getPodCount('foo', 'bar')
        .subscribe(val => {
          expect(val).toBeGreaterThanOrEqual(1);
          expect(val).toBeLessThanOrEqual(6);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));
  });

  describe('#getVersion', () => {
    it('should return 1.0.2', fakeAsync(() => {
      svc.getVersion('foo', 'bar').subscribe(val => {
        expect(val).toEqual('1.0.2');
      });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));
  });

  describe('#getCpuStat', () => {
    it('should return a "total" value of 10', fakeAsync(() => {
      svc.getCpuStat('foo', 'bar')
        .subscribe(val => {
          expect(val.total).toBe(10);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should return a "used" value between 1 and 10', fakeAsync(() => {
      svc.getCpuStat('foo', 'bar')
        .subscribe(val => {
          expect(val.used).toBeGreaterThanOrEqual(1);
          expect(val.used).toBeLessThanOrEqual(10);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));
  });

  describe('#getMemoryStat', () => {
    it('should return a "total" value of 256', fakeAsync(() => {
      svc.getMemoryStat('foo', 'bar')
        .subscribe(val => {
          expect(val.total).toBe(256);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));

    it('should return a "used" value between 100 and 256', fakeAsync(() => {
      svc.getMemoryStat('foo', 'bar')
        .subscribe(val => {
          expect(val.used).toBeGreaterThanOrEqual(100);
          expect(val.used).toBeLessThanOrEqual(256);
        });
      tick(DeploymentsService.POLL_RATE_MS + 10);
      discardPeriodicTasks();
    }));
  });

});
