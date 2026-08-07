import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserResponse } from '../responses/user.response';
import { API_ROUTES } from '@core/api/api-routes';

const USER_STORAGE_KEY = 'food-manager-user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly userSubject = new BehaviorSubject<UserResponse | null>(
    this.getUserFromStorage(),
  );

  public currentUser$ = this.userSubject.asObservable();

  constructor() {
    if (!this.userSubject.value) {
      this.loadCurrentUser().subscribe();
    }
  }

  public loadCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(API_ROUTES.USERS.ME).pipe(tap((user) => this.setUser(user)));
  }

  public getUser(): UserResponse | null {
    return this.userSubject.value;
  }

  public setUser(user: UserResponse): void {
    this.userSubject.next(user);
    this.saveUserToStorage(user);
  }

  public clearUser(): void {
    this.userSubject.next(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  private getUserFromStorage(): UserResponse | null {
    try {
      const user = localStorage.getItem(USER_STORAGE_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  private saveUserToStorage(user: UserResponse): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}
