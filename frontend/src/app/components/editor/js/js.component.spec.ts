import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { JsComponent } from './js.component'
import { AuthService } from '../../../services/auth/auth.service'

describe('JsComponent', () => {
  let component: JsComponent
  let fixture: ComponentFixture<JsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    })
    .compileComponents()

    fixture = TestBed.createComponent(JsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
