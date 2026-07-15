import { Component } from '@angular/core';
import { ErrorPageComponent } from '../error-page/error-page';

@Component({
  standalone: true,
  selector: 'app-not-found',
  imports: [ErrorPageComponent],
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.scss'],
})
export class NotFoundComponent {}
