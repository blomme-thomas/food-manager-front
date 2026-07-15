import { Observable, of } from 'rxjs';

export class MockTranslateService {
  private current = 'fr';

  addLangs(langs: string[]): void {
    void langs;
  }

  use(lang: string): void {
    this.current = lang;
  }

  getCurrentLang(): string {
    return this.current;
  }

  instant(key: string): string {
    return key;
  }

  get(key: string | string[]): Observable<unknown> {
    return of(key);
  }
}
