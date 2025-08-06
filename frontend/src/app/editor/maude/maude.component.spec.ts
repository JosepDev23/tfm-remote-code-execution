import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaudeComponent } from './maude.component';

describe('MaudeComponent', () => {
  let component: MaudeComponent;
  let fixture: ComponentFixture<MaudeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaudeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
