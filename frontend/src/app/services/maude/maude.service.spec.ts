import { TestBed } from '@angular/core/testing'

import { MaudeService } from './maude.service'

describe('MaudeService', () => {
  let service: MaudeService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(MaudeService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
