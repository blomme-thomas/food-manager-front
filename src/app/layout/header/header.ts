import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@core/services/language.service';
import { UserService } from '@core/api/services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AsyncPipe,
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
  private readonly userService = inject(UserService);

  currentLang = this.languageService.getCurrentLanguage();
  currentUser$ = this.userService.currentUser$;

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  changeLang(lang: 'fr' | 'en'): void {
    this.languageService.setLanguage(lang);
    this.currentLang = lang;
  }

  getAvatarText(firstName: string, lastName: string): string {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
}
