import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pokemon-tcg-poke-card-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './poke-card-detail.component.html',
  styleUrls: ['./poke-card-detail.component.scss'],
})
export class PokeCardDetailComponent {
  @Input() card: any;
}
