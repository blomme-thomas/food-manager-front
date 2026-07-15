import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NzAvatarModule,
    NzBadgeModule,
    NzButtonModule,
    NzDropdownModule,
    NzIconModule,
    TranslatePipe,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly menuToggle = output<void>();
  private readonly languageService = inject(LanguageService);
  currentLang = this.languageService.getCurrentLanguage();

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  changeLang(lang: 'fr' | 'en'): void {
    this.languageService.setLanguage(lang);
    this.currentLang = lang;
  }
}
