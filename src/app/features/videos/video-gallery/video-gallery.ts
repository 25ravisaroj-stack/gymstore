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
import { FormsModule } from '@angular/forms';

import { VideoService } from '../../../core/services/video';
import { Video } from '../../../core/models/video';

@Component({
  selector: 'app-video-gallery',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './video-gallery.html',
  styleUrl: './video-gallery.scss'
})
export class VideoGalleryComponent
  implements OnInit, AfterViewInit {

  private videoService = inject(VideoService);
  private cdr = inject(ChangeDetectorRef);

  videos: Video[] = [];

  currentVideoId = 1;

  isLoading = false;

  hasMoreVideos = true;
  commentCountMap: { [key: number]: number } = {};

  mutedStates: boolean[] = [];

  reactions: any[] = [];

  commentsMap: {
    [key: number]: any[];
  } = {};

  commentText: {
    [key: number]: string;
  } = {};

  showComments: {
    [key: number]: boolean;
  } = {};
  reactionMap: {
    [key: number]: any;
  } = {};
  private observer!: IntersectionObserver;

  @ViewChildren('player')
  players!: QueryList<ElementRef<HTMLVideoElement>>;

  ngOnInit(): void {
    this.loadNextVideo();
    // this.loadVideos();

    // this.loadReactions();

  }

  ngAfterViewInit(): void {

    this.players.changes.subscribe(() => {

      this.setupObserver();

    });

  }
  loadNextVideo(): void {

    if (
      this.isLoading ||
      !this.hasMoreVideos
    ) {
      return;
    }

    this.isLoading = true;

    this.videoService
      .getVideoById(
        this.currentVideoId
      )
      .subscribe({

        next: (video: Video) => {

          if (!video) {

            this.hasMoreVideos = false;

            return;

          }

          this.videos.push(video);

          this.mutedStates.push(true);
          this.loadReaction(video.id);
          this.loadCommentCount(video.id);

          this.currentVideoId++;

          this.cdr.detectChanges();

          setTimeout(() => {

            this.setupObserver();

          });

        },

        error: () => {

          this.hasMoreVideos = false;

        },

        complete: () => {

          this.isLoading = false;

        }

      });

  }
  loadCommentCount(videoId: number): void {

    this.videoService
      .getComments(videoId)
      .subscribe(res => {

        this.commentCountMap[videoId] = res.length;
        this.cdr.detectChanges();

      });

  }
  loadVideos(): void {

    this.videoService
      .getVideos()
      .subscribe({

        next: (res) => {

          this.videos = res;

          this.mutedStates =
            new Array(res.length).fill(true);

          this.cdr.detectChanges();

          setTimeout(() => {

            this.setupObserver();

          });

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  loadReactions(): void {

    this.videoService
      .getReactions()
      .subscribe({

        next: (res) => {

          this.reactions = res;

        },

        error: (err) => {

          console.error(err);

        }

      });

  }
  setupObserver(): void {

    if (!this.players) {
      return;
    }

    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer =
      new IntersectionObserver(

        entries => {

          entries.forEach(entry => {

            const currentVideo =
              entry.target as HTMLVideoElement;

            if (entry.isIntersecting) {

              this.players.forEach(player => {

                const video =
                  player.nativeElement;

                if (video !== currentVideo) {

                  video.pause();

                  video.currentTime = 0;

                }

              });

              currentVideo
                .play()
                .catch(() => { });

              const lastVideo =
                this.players.last
                  ?.nativeElement;

              if (
                currentVideo ===
                lastVideo
              ) {

                this.loadNextVideo();

              }

            } else {

              currentVideo.pause();

            }

          });

        },

        {
          threshold: 0.8
        }

      );

    this.players.forEach(player => {

      player.nativeElement.muted = true;

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

    const volume = Number(
      (event.target as HTMLInputElement)
        .value
    );

    video.volume = volume;

    video.muted =
      volume === 0;

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

    this.mutedStates[index] = false;

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

      this.mutedStates[index] = true;

    }

  }

  likeVideo(videoId: number): void {

    let reaction =
      this.reactionMap[Number(videoId)];

    if (!reaction) {

      const newReaction = {

        videoId: Number(videoId),

        likeCount: 1,

        dislikeCount: 0

      };

      this.videoService
        .addReaction(newReaction)
        .subscribe((res: any) => {

          this.reactionMap[Number(videoId)] = res;
          this.cdr.detectChanges();

        });

      return;

    }

    reaction.likeCount++;



    this.videoService
      .updateReaction(
        reaction.id,
        {
          likeCount: reaction.likeCount
        }
      )
      .subscribe();

  }

  dislikeVideo(videoId: number): void {

    let reaction =
      this.reactionMap[Number(videoId)];

    if (!reaction) {

      const newReaction = {

        videoId: Number(videoId),

        likeCount: 0,

        dislikeCount: 1

      };

      this.videoService
        .addReaction(newReaction)
        .subscribe((res: any) => {
          console.log('API Response', res);
          this.reactionMap[Number(videoId)] = res;
          console.log(this.reactionMap);
          this.cdr.detectChanges();
        });

      return;

    }

    reaction.dislikeCount++;



    this.videoService
      .updateReaction(
        reaction.id,
        {
          dislikeCount: reaction.dislikeCount
        }
      )
      .subscribe();

  }

  loadComments(videoId: number): void {

    this.showComments[videoId] =
      !this.showComments[videoId];

    if (!this.showComments[videoId]) {
      return;
    }

    this.videoService
      .getComments(videoId)
      .subscribe(res => {

        this.commentsMap[videoId] = [...res];

        this.cdr.detectChanges();

      });
  }
  addComment(
    videoId: number
  ): void {

    const message =
      this.commentText[videoId];

    if (!message?.trim()) {
      return;
    }

    const comment = {

      videoId: Number(videoId),
      userName: 'Ravi',
      message,

      createdOn:
        new Date()
          .toISOString()

    };

    this.videoService
      .addComment(comment)
      .subscribe(() => {

        this.videoService
          .getComments(videoId)
          .subscribe(res => {

            this.commentsMap[videoId] =
              res;
            this.cdr.detectChanges();

          });

        this.commentText[videoId] =
          '';


      });

  }

  getReaction(
    videoId: number
  ) {

    return this.reactionMap[
      videoId
    ];

  }
  closeComments(videoId: number): void {
    this.loadCommentCount(Number(videoId));
    this.showComments[videoId] = false;

  }

  loadReaction(videoId: number): void {

    if (this.reactionMap[Number(videoId)]) {
      return;
    }

    this.videoService
      .getReactionByVideoId(Number(videoId))
      .subscribe({

        next: (res: any[]) => {

          this.reactionMap[Number(videoId)] =
            res.length > 0
              ? res[0]
              : null;

        }

      });

  }

}