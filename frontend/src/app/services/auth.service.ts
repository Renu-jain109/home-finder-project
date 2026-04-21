import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'homefinder_token';
  private readonly USER_KEY = 'homefinder_user';

  private isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem(this.TOKEN_KEY));
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  login(email: string, password: string): Observable<{ success: boolean; token: string; user: User }> {
    return of({
      success: true,
      token: 'mock_token_' + Date.now(),
      user: {
        id: 'user_' + Date.now(),
        email: email,
        name: email.split('@')[0]
      }
    }).pipe(
      delay(600),
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        this.isLoggedInSubject.next(true);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(name: string, email: string, password: string): Observable<{ success: boolean; token: string; user: User }> {
    return of({
      success: true,
      token: 'mock_token_' + Date.now(),
      user: {
        id: 'user_' + Date.now(),
        email: email,
        name: name
      }
    }).pipe(
      delay(800),
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        this.isLoggedInSubject.next(true);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
