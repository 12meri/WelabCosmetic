import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private server = 'http://localhost:8010/api'
  private _token?: string
  private _username?: string
  private _error = false

  constructor(private http: HttpClient) {}

  get isAuthentified(): boolean { return !!this._token }
  get token(): string { return this._token ?? '' }
  get username(): string { return this._username ?? '' }
  get error(): boolean { return this._error }

  reset_error() { this._error = false }

  login(username: string, password: string): void {
    this.http.post(this.server + '/login_check', { username, password })
      .subscribe({
        next: (response: any) => {
          if (response?.token) {
            this._token = response.token
            this._username = username
          } else this._error = true
        },
        error: () => { this._error = true }
      })
  }
}