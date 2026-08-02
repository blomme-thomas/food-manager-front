import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFacadeService } from '@core/auth/services/auth-facade.service';
import { AuthenticateExternalIdentityResponse } from '@core/auth/models/responses/authenticate-external-identity.response';
import { RegisterExternalUserRequest } from '@core/auth/models/requests/register-external-user.request';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [CommonModule, TranslatePipe, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register implements OnInit {
  private readonly authFacade = inject(AuthFacadeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  public readonly isLoading = signal(false);
  public readonly errorMessage = signal<string | null>(null);

  public readonly authResult = signal<AuthenticateExternalIdentityResponse | null>(null);

  public displayName = signal('');
  public firstName = signal('');
  public lastName = signal('');

  public ngOnInit(): void {
    const state = history.state as { authResult?: AuthenticateExternalIdentityResponse };

    if (!state?.authResult) {
      void this.router.navigate(['/login']);
      return;
    }

    const result = state.authResult as AuthenticateExternalIdentityResponse;
    this.authResult.set(result);
    this.displayName.set(result.displayName || '');
    this.firstName.set(result.firstName || '');
    this.lastName.set(result.lastName || '');
  }

  public register(): void {
    console.log(
      'Registering user with displayName:',
      this.displayName(),
      'firstName:',
      this.firstName(),
      'lastName:',
      this.lastName(),
    );
    const result = this.authResult();

    if (!result?.registrationTokenId) {
      console.log('No registration token found, cannot register user.', result);
      this.errorMessage.set('AUTH.ERRORS.GENERIC');
      return;
    }

    // Validation basique
    if (!this.displayName().trim() || !this.firstName().trim() || !this.lastName().trim()) {
      this.errorMessage.set('AUTH.ERRORS.MISSING_FIELDS');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const request: RegisterExternalUserRequest = {
      registrationTokenId: result.registrationTokenId,
      displayName: this.displayName().trim(),
      firstName: this.firstName().trim(),
      lastName: this.lastName().trim(),
    };

    this.authFacade
      .registerExternalUser(request)
      .pipe(
        finalize((): void => {
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (): void => {
          void this.router.navigate(['/dashboard']);
        },
        error: (error: unknown): void => {
          console.error(error);
          this.errorMessage.set('AUTH.ERRORS.GENERIC');
        },
      });
  }

  public cancel(): void {
    void this.router.navigate(['/login']);
  }
}
