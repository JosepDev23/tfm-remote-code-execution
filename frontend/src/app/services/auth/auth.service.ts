import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'

  constructor(private readonly httpClient: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.httpClient
      .post<{ token: string }>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((response: { token: string }) => {
          localStorage.setItem('token', response.token)
        })
      )
  }

  status(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/status`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    })
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }
}
