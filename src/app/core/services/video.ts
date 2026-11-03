import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Video } from '../models/video';


@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/videos';
  private reactionUrl = 'http://localhost:3000/videoReactions';

  private commentUrl = 'http://localhost:3000/comments';
  private cache = new Map<number, Video>();

  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(this.apiUrl);
  }

  getVideoById(
    id: number
  ) {

    const cached =
      this.cache.get(id);

    if (cached) {

      return of(cached);

    }

    return this.http
      .get<Video>(
        `${this.apiUrl}/${id}`
      )
      .pipe(
        tap((video: Video) => {

          this.cache.set(
            id,
            video
          );

        })

      );

  }

  getReactions() {
    return this.http.get<any[]>(
      this.reactionUrl
    );
  }
  getReactionByVideoId(
    videoId: number
  ) {

    return this.http.get<any[]>(
      `${this.reactionUrl}?videoId=${Number(videoId)}`
    );

  }

  getComments(
    videoId: number
  ) {
    return this.http.get<any[]>(
      `${this.commentUrl}?videoId=${videoId}`
    );
  }
  addReaction(data: any) {

    return this.http.post(
      this.reactionUrl,
      data
    );

  }
  updateReaction(
    id: number,
    data: any
  ) {
    return this.http.patch(
      `${this.reactionUrl}/${id}`,
      data
    );
  }

  addComment(
    comment: any
  ) {
    return this.http.post(
      this.commentUrl,
      comment
    );
  }
}
