import { Component, Input, OnInit, OnChanges, SimpleChanges } from "@angular/core";

@Component({
  selector: "app-book-image-spinner",
  templateUrl: "./book-image-spinner.component.html",
  styleUrls: ["./book-image-spinner.component.scss"],
})
export class BookImageSpinnerComponent implements OnInit, OnChanges {
  @Input() srcUrl: string = "none";
  @Input() altFrom: string = "...";
  @Input() sendClass: string = "";

  imageUrl: string = "./takeLibro/spin-book-image.gif";
  isLoading: boolean = true;

  ngOnInit(): void {
    this.loadImage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["srcUrl"]) {
      this.loadImage();
    }
  }

  private loadImage(): void {
    this.isLoading = true;
    this.imageUrl = "./takeLibro/spin-book-image.gif";

    if (this.srcUrl === "onInput") {
      this.imageUrl = "./takeLibro/spin-book-image.gif";
      this.isLoading = false;
    } else {
      const img = new Image();
      img.src = this.srcUrl;

      img.onload = () => {
        this.imageUrl = this.srcUrl;
        this.isLoading = false;
      };

      img.onerror = () => {
        this.imageUrl = "./takeLibro/no-book-image.png";
        this.isLoading = false;
      };
    }
  }
}
