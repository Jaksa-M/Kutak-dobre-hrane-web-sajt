import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent {
  @Input() selectedStars: number = 0;
  @Output() selectedStarsChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];

  selectRating(star: number): void {
    this.selectedStars = star;
    this.selectedStarsChange.emit(star);
  }
}
