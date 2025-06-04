import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { VideoPlayerService } from '../../service/video/video-player.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})
export class VideoPlayerComponent implements OnInit {
  @Input() videoSrc: string = 'home';
  @Input() width: number = 640;
  @Input() height: number = 360;
  safeVideoUrl: SafeUrl | undefined;

  constructor(
    private videoPlayerService: VideoPlayerService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.videoPlayerService.getVideoHome(this.videoSrc).subscribe((blob) => {
      const videoUrl = URL.createObjectURL(blob);
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustUrl(videoUrl);
    });
  }
}
