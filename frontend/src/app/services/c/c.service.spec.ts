import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { CService } from './c.service'
import { AuthService } from '../auth/auth.service'

describe('CService', () => {
  let service: CService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CService, AuthService],
    })
    service = TestBed.inject(CService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
