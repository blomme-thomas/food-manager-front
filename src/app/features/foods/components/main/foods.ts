import { Component } from '@angular/core';
import { FilterFormComponent } from '../forms/filter/filter.form';

@Component({
  standalone: true,
  selector: 'app-foods',
  templateUrl: './foods.html',
  styleUrls: ['./foods.scss'],
  imports: [FilterFormComponent],
})
export class FoodsComponent {}
