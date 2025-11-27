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
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  providers: [AuthService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerFormGroup!: FormGroup
  errorMessage: string = ''
  successMessage: string = ''

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.registerFormGroup = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', Validators.required),
    })
  }

  onSubmit(): void {
    this.errorMessage = ''
    this.successMessage = ''

    if (this.registerFormGroup.valid) {
      const { username, password, confirmPassword } =
        this.registerFormGroup.value

      // Check if passwords match
      if (password !== confirmPassword) {
        this.errorMessage = 'Passwords do not match'
        return
      }

      console.log('Register submitted:', { username, password })
      this.authService.register(username, password).subscribe({
        next: (response) => {
          console.log('Registration successful:', response)
          this.successMessage = 'Registration successful! Redirecting to login...'
          setTimeout(() => {
            this.router.navigate(['/login'])
          }, 2000)
        },
        error: (error) => {
          console.error('Registration failed:', error)
          this.errorMessage =
            error.error?.message || 'Registration failed. Please try again.'
        },
      })
    }
  }
}
