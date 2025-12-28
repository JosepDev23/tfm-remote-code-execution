import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { CComponent } from './c.component'
import { CService } from '../../services/c/c.service'
import { AuthService } from '../../services/auth/auth.service'

describe('CComponent', () => {
  let component: CComponent
  let fixture: ComponentFixture<CComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [CService, AuthService],
    }).compileComponents()

    fixture = TestBed.createComponent(CComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
