import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

export type ErrorPageVariant = 'not-found' | 'forbidden';

@Component({
  standalone: true,
  selector: 'app-error-page',
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './error-page.html',
  styleUrls: ['./error-page.scss'],
})
export class ErrorPageComponent {
  readonly code = input.required<'403' | '404'>();
  readonly titleKey = input.required<string>();
  readonly descriptionKey = input.required<string>();
  readonly illustrationLabelKey = input.required<string>();
  readonly variant = input.required<ErrorPageVariant>();

  goBack(): void {
    window.history.back();
  }
}
