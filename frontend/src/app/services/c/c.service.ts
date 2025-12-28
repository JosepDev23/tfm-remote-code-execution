import { Injectable } from '@angular/core'
import { BaseContainerService } from '../base/base-container.service'

/**
 * Service for managing C language code execution containers.
 * Extends BaseContainerService to inherit common container operations.
 */
@Injectable({
  providedIn: 'root',
})
export class CService extends BaseContainerService {
  protected readonly apiUrl = 'http://localhost:3000/c-container'
}
