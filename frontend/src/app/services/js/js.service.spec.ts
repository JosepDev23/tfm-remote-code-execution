import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { JsService } from './js.service'
import { AuthService } from '../auth/auth.service'

describe('JsService', () => {
  let service: JsService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JsService, AuthService],
    })
    service = TestBed.inject(JsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
