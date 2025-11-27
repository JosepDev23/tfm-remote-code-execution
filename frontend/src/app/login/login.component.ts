import { Component, OnInit } from '@angular/core'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { AuthService } from '../services/auth/auth.service'
import { Router, RouterLink } from '@angular/router'

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup
  errorMessage: string = ''
  showPassword: boolean = false

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loginFormGroup = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    })
  }

  onSubmit(): void {
    this.errorMessage = ''

    if (this.loginFormGroup.valid) {
      const { username, password } = this.loginFormGroup.value
      console.log('Login submitted:', { username, password })
      this.authService.login(username, password).subscribe({
        next: (response) => {
          console.log('Login successful:', response)
          this.router.navigate(['/'])
        },
        error: (error) => {
          console.error('Login failed:', error)
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password'
          } else {
            this.errorMessage =
              error.error?.message || 'Login failed. Please try again.'
          }
        },
      })
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }
}
