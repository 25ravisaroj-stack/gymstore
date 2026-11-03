import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterVideoPlayer } from './footer-video-player';

describe('FooterVideoPlayer', () => {
  let component: FooterVideoPlayer;
  let fixture: ComponentFixture<FooterVideoPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterVideoPlayer],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterVideoPlayer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
