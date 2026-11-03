import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NexoProduct } from '../../../features/home/models/product.model';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  // Required input model
  readonly product = input.required<NexoProduct>();

  // Selected output event for parent orchestration
  readonly selected = output<NexoProduct>();

  onCardClick(event: MouseEvent): void {
    this.selected.emit(this.product());
  }
}

