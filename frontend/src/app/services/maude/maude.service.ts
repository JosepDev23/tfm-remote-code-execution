import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { AuthService } from '../auth/auth.service'

@Injectable({
  providedIn: 'root',
})
export class MaudeService {
  private apiUrl = 'http://localhost:3000/maude-container'

  constructor(
    private readonly httpClient: HttpClient,
    private readonly authService: AuthService
  ) {}

  createContainer(): Observable<any> {
    const token: string = `Bearer ${this.authService.getToken()}`
    const headers = new HttpHeaders().set('Authorization', token)
    return this.httpClient.post(`${this.apiUrl}`, {}, { headers }).pipe(
      tap((response: any) => {
        console.log('Container created:', response)
      })
    )
  }

  executeCode(code: string): Observable<any> {
    const token: string = `Bearer ${this.authService.getToken()}`
    const headers = new HttpHeaders().set('Authorization', token)
    return this.httpClient
      .post(`${this.apiUrl}/exec-code`, { code }, { headers })
      .pipe(
        tap((response: any) => {
          console.log('Code executed:', response)
        })
      )
  }

  deleteContainer(): Observable<any> {
    const token: string = `Bearer ${this.authService.getToken()}`
    const headers = new HttpHeaders().set('Authorization', token)
    return this.httpClient.delete(`${this.apiUrl}`, { headers }).pipe(
      tap((response: any) => {
        console.log('Container deleted:', response)
      })
    )
  }
}
