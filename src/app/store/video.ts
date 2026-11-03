import {
  Injectable,
  signal,
  computed
} from '@angular/core';

import { Video } from '../core/models/video';

@Injectable({
  providedIn: 'root'
})
export class VideoStore {

  videos = signal<Video[]>([]);

  selectedVideo = signal<Video | null>(null);

  totalVideos = computed(
    () => this.videos().length
  );

  setVideos(videos: Video[]) {

    this.videos.set(videos);

  }

  addVideo(video: Video) {

    this.videos.update(items => [
      ...items,
      video
    ]);

  }

  removeVideo(id: number) {

    this.videos.update(items =>
      items.filter(x => x.id !== id)
    );

  }

  selectVideo(video: Video) {

    this.selectedVideo.set(video);

  }

  clearSelectedVideo() {

    this.selectedVideo.set(null);

  }

}