import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'pokemon-tcg-poke-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule],
  templateUrl: './poke-card.component.html',
  styleUrls: ['./poke-card.component.scss'],
})
export class PokeCardComponent {
  @Input() card: any;
  @Output() openDetail = new EventEmitter();
  @Output() addToDesk = new EventEmitter();

  showCardDetails(card: any) {
    this.openDetail.emit(card);
  }

  addToMyDesk(card: any) {
    this.addToDesk.next(card);
  }
}
