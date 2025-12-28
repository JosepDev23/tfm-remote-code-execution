import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { AuthService } from '../auth/auth.service'

/**
 * Abstract base service for container-based code execution services.
 * Provides common functionality for creating, executing, and deleting containers.
 */
@Injectable()
export abstract class BaseContainerService {
  protected abstract readonly apiUrl: string

  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly authService: AuthService
  ) {}

  /**
   * Creates HTTP headers with authorization token
   * @returns HttpHeaders with Bearer token
   */
  protected createAuthHeaders(): HttpHeaders {
    const token: string = `Bearer ${this.authService.getToken()}`
    return new HttpHeaders().set('Authorization', token)
  }

  /**
   * Creates a new container for code execution
   * @returns Observable with container creation response
   */
  createContainer(): Observable<any> {
    const headers = this.createAuthHeaders()
    return this.httpClient.post(`${this.apiUrl}`, {}, { headers }).pipe(
      tap((response: any) => {
        console.log('Container created:', response)
      })
    )
  }

  /**
   * Executes code in the container
   * @param code - The code to execute
   * @returns Observable with execution response
   */
  executeCode(code: string): Observable<any> {
    const headers = this.createAuthHeaders()
    return this.httpClient
      .post(`${this.apiUrl}/exec-code`, { code }, { headers })
      .pipe(
        tap((response: any) => {
          console.log('Code executed:', response)
        })
      )
  }

  /**
   * Deletes the container
   * @returns Observable with deletion response
   */
  deleteContainer(): Observable<any> {
    const headers = this.createAuthHeaders()
    return this.httpClient.delete(`${this.apiUrl}`, { headers }).pipe(
      tap((response: any) => {
        console.log('Container deleted:', response)
      })
    )
  }
}
