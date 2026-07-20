import { Injectable } from '@angular/core'
import { BaseContainerService } from '../base/base-container.service'

/**
 * Service for managing JavaScript language code execution containers.
 * Extends BaseContainerService to inherit common container operations.
 */
@Injectable({
  providedIn: 'root',
})
export class JsService extends BaseContainerService {
  protected readonly apiUrl = 'http://localhost:3000/js-container'
}
