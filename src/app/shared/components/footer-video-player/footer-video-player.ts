import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { VideoService } from '../../../core/services/video';
import { Video } from '../../../core/models/video';

@Component({
  selector: 'app-footer-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer-video-player.html',
  styleUrl: './footer-video-player.scss'
})
export class FooterVideoPlayer implements OnInit, AfterViewInit {

  private videoService = inject(VideoService);
  private cdr = inject(ChangeDetectorRef);

  videos: Video[] = [];

  mutedStates: boolean[] = [];

  progressValues: number[] = [];

  private observer!: IntersectionObserver;

  @ViewChildren('player')
  players!: QueryList<ElementRef<HTMLVideoElement>>;

  ngOnInit(): void {

    this.videoService.getVideos().subscribe({
      next: (res) => {

        this.videos = res;

        this.mutedStates =
          new Array(res.length).fill(true);

        this.progressValues =
          new Array(res.length).fill(0);

        this.cdr.detectChanges();

        setTimeout(() => {

          this.setupObserver();

        });

      },
      error: (error) => {

        console.error(error);

      }
    });

  }

  ngAfterViewInit(): void {

    this.players.changes.subscribe(() => {

      this.setupObserver();

    });

  }

  setupObserver(): void {

    if (!this.players) {
      return;
    }

    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          const video =
            entry.target as HTMLVideoElement;

          if (entry.isIntersecting) {

            video.play().catch(() => { });

          } else {

            video.pause();

          }

        });

      },
      {
        threshold: 0.5
      }
    );

    this.players.forEach(player => {

      player.nativeElement.muted = true;

      player.nativeElement.volume = 0.5;

      this.observer.observe(
        player.nativeElement
      );

    });

  }

  togglePlay(
    video: HTMLVideoElement
  ): void {

    if (video.paused) {

      video.play();

    } else {

      video.pause();

    }

  }

  toggleMute(
    video: HTMLVideoElement,
    index: number
  ): void {

    video.muted = !video.muted;

    this.mutedStates[index] =
      video.muted;

  }

  onVolumeChange(
    video: HTMLVideoElement,
    index: number,
    event: Event
  ): void {

    const value = Number(
      (event.target as HTMLInputElement).value
    );

    video.volume = value;

    video.muted = value === 0;

    this.mutedStates[index] =
      video.muted;

  }

  increaseVolume(
    video: HTMLVideoElement,
    index: number
  ): void {

    video.volume = Math.min(
      1,
      video.volume + 0.1
    );

    video.muted = false;

    this.mutedStates[index] =
      false;

  }

  decreaseVolume(
    video: HTMLVideoElement,
    index: number
  ): void {

    video.volume = Math.max(
      0,
      video.volume - 0.1
    );

    if (video.volume === 0) {

      video.muted = true;

      this.mutedStates[index] =
        true;

    }

  }

  toggleFullscreen(
    video: HTMLVideoElement
  ): void {

    if (document.fullscreenElement) {

      document.exitFullscreen();

      return;

    }

    video.requestFullscreen();

  }

  updateProgress(
    video: HTMLVideoElement,
    index: number
  ): void {

    if (!video.duration) {
      return;
    }

    this.progressValues[index] =
      (video.currentTime / video.duration) * 100;

  }

  seekVideo(
    video: HTMLVideoElement,
    event: Event
  ): void {

    const value = Number(
      (event.target as HTMLInputElement).value
    );

    video.currentTime =
      (value / 100) * video.duration;

  }

}