import { Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  selector: 'isf-search-bar',
  styleUrl: './isf-search-bar.component.scss',
  templateUrl: './isf-search-bar.component.html',
})
export class IsfSearchBarComponent {
  readonly searchLocation = output<string>();

  protected readonly searchControl = new FormControl('');

  protected onSearch(event: Event): void {
    const query = this.searchControl.value?.trim();
    event.stopPropagation();
    if (query) {
      this.searchLocation.emit(query);
    }
  }
}
