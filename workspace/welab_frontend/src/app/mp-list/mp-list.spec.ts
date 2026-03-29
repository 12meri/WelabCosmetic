import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpList } from './mp-list';

describe('MpList', () => {
  let component: MpList;
  let fixture: ComponentFixture<MpList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MpList],
    }).compileComponents();

    fixture = TestBed.createComponent(MpList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
