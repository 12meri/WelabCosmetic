import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpAdd } from './mp-add';

describe('MpAdd', () => {
  let component: MpAdd;
  let fixture: ComponentFixture<MpAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MpAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(MpAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
