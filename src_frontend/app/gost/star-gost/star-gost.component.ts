import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star-gost',
  templateUrl: './star-gost.component.html',
  styleUrls: ['./star-gost.component.css']
})
export class StarGostComponent {
  @Input() rating: number;

  get fullStars(): number[] {
    return new Array(Math.floor(this.rating));
  }

  get halfStar(): boolean {
    return (this.rating - Math.floor(this.rating)) >= 0.25 && (this.rating - Math.floor(this.rating)) < 0.75;
  }

  get emptyStars(): number[] {
    return new Array(5 - Math.ceil(this.rating));
  }
}
