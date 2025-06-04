import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss']
})
export class ProvidersComponent implements OnInit, OnDestroy {  // ✅ เพิ่มตรงนี้
  progress = 50;
  private frameId: number | null = null;

  ngOnInit(): void {
    this.animateProgress();
  }

  animateProgress(): void {
    const animate = () => {
      if (this.progress < 100) {
        this.progress++;
        this.frameId = requestAnimationFrame(animate);
      }
    };
    this.frameId = requestAnimationFrame(animate);
  }

  resetProgress(event?: Event): void {
    if (event) event.preventDefault();
    this.progress = 0;
    if (this.frameId !== null) cancelAnimationFrame(this.frameId);
    this.animateProgress();
  }

  ngOnDestroy(): void {
    if (this.frameId !== null) cancelAnimationFrame(this.frameId);
  }
}
