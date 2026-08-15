import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserResponse } from '@core/api/responses/user.response';

const MOCK_USER: UserResponse = {
  id: 'mock-user-id',
  email: 'mock.user@example.com',
  displayName: 'Mock User',
  firstName: 'Mock',
  lastName: 'User',
  preferredLocale: 'fr',
  role: 'user',
};

export class MockUserService {
  private readonly userSubject = new BehaviorSubject<UserResponse | null>(MOCK_USER);

  currentUser$ = this.userSubject.asObservable();

  loadCurrentUser(): Observable<UserResponse> {
    return of(MOCK_USER);
  }

  getUser(): UserResponse | null {
    return this.userSubject.value;
  }

  setUser(user: UserResponse): void {
    this.userSubject.next(user);
  }

  clearUser(): void {
    this.userSubject.next(null);
  }
}
