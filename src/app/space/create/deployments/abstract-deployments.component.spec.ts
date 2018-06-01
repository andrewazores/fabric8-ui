import {
  Component,
  Injectable,
  OnInit
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  Observable,
  Subscription
} from 'rxjs';

import { createMock } from 'testing/mock';
import {
  initContext,
  TestContext
} from 'testing/test-context';

import { AbstractDeploymentsComponent } from './abstract-deployments.component';

@Injectable()
class TestService {
  readonly mockObs: jasmine.SpyObj<Observable<any>>;
  readonly mockSub: jasmine.SpyObj<Subscription>;

  constructor() {
    this.mockObs = createMock(Observable);
    this.mockSub = createMock(Subscription);

    this.mockObs.subscribe.and.returnValue(this.mockSub);
    this.mockSub.unsubscribe.and.stub();
  }

  func(): Observable<any> {
    return this.mockObs;
  }
}

@Component({
  selector: 'test-component',
  template: '',
  providers: [ TestService ]
})
class TestComponent extends AbstractDeploymentsComponent implements OnInit {
  constructor(
    readonly testService: TestService
  ) {
    super();
  }

  ngOnInit(): void {
    this.addSubscription(this.testService.func().subscribe());
  }
}

@Component({
  template: '<test-component></test-component>'
})
class HostComponent { }

describe('AbstractDeploymentsComponent', (): void => {
  type TestingContext = TestContext<TestComponent, HostComponent>;

  initContext(TestComponent, HostComponent, { });

  it('should be instantiable', function(this: TestingContext): void {
    expect(this.testedDirective).toBeTruthy();
  });

  describe('#ngOnDestroy', (): void => {
    it('should be defined', function(this: TestingContext): void {
      expect(this.testedDirective.ngOnDestroy).toBeDefined();
    });

    it('should be a function', function(this: TestingContext): void {
      expect(typeof this.testedDirective.ngOnDestroy).toBe('function');
    });

    it('should unsubscribe subscriptions', function(this: TestingContext): void {
      const svc: TestService = this.testedDirective.testService;
      expect(svc.mockSub.unsubscribe).not.toHaveBeenCalled();
      this.testedDirective.ngOnDestroy();
      expect(svc.mockSub.unsubscribe).toHaveBeenCalled();
    });
  });

});
