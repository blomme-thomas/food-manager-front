import { Component } from '@angular/core';
import { ErrorPageComponent } from '../error-page/error-page';

@Component({
  standalone: true,
  selector: 'app-forbidden',
  imports: [ErrorPageComponent],
  templateUrl: './forbidden.html',
  styleUrls: ['./forbidden.scss'],
})
export class ForbiddenComponent {}
