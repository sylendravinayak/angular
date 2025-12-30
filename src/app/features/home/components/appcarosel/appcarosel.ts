import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Splide from '@splidejs/splide';

@Component({
  selector: 'app-appcarosel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appcarosel.html',
})
export class Appcarosel implements AfterViewInit {

  @ViewChild('splideRef') splideRef!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  images = [
    'assets/images/image1.jpg'
  ];

  ngAfterViewInit() {
    // Prevent SSR crash — run only in browser
    if (isPlatformBrowser(this.platformId)) {
      new Splide(this.splideRef.nativeElement, {
        type: 'loop',
        autoplay: true,
        interval: 2500,
        perPage: 1,
        arrows: true,
        pagination: true,
      }).mount();
    }
  }
}
