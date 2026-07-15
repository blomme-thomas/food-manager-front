import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { TranslatePipe } from '@ngx-translate/core';
import { version } from '../../../../package.json';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NzLayoutModule, TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  readonly currentYear = new Date().getFullYear();
  readonly version = version;
}
