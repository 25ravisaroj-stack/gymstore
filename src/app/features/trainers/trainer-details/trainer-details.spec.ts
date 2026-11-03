import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainerDetails } from './trainer-details';

describe('TrainerDetails', () => {
  let component: TrainerDetails;
  let fixture: ComponentFixture<TrainerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainerDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
