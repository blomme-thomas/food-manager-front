import { Observable, of, Subject } from 'rxjs';

export class MockTranslateService {
  private current = 'fr';
  private langChangeSubject = new Subject<string>();

  addLangs(langs: string[]): void {
    void langs;
  }

  use(lang: string): void {
    this.current = lang;
    this.langChangeSubject.next(lang);
  }

  getCurrentLang(): string {
    return this.current;
  }

  instant(key: string): string {
    return key;
  }

  // Newer versions of ngx-translate call `translate()` on the service.
  // Return a plain string so templates using the `translate` pipe can operate synchronously.
  translate(key: string): string {
    if (Array.isArray(key)) {
      return key.join(',');
    }
    return String(key);
  }

  get(key: string | string[]): Observable<unknown> {
    return of(key);
  }

  // Return an observable that emits the translation (simple passthrough)
  stream(key: string | string[]): Observable<unknown> {
    return of(key);
  }

  // Provide an observable for language change events
  get onLangChange(): Observable<string> {
    return this.langChangeSubject.asObservable();
  }

  // Minimal getTranslation implementation used by some APIs
  getTranslation(_lang: string): Observable<Record<string, unknown>> {
    void _lang;
    return of({});
  }

  // ngx-translate vX uses `cachedSignal` internally in its pipe in some builds.
  // Provide a minimal implementation that returns a function producing the translated string.
  cachedSignal(key: string | string[]): () => string {
    return () => {
      if (Array.isArray(key)) return key.join(',');
      return String(key);
    };
  }
}
