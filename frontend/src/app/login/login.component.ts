import { Component, OnInit } from '@angular/core'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { AuthService } from '../services/auth/auth.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup

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
          // Handle login failure, e.g., show an error message
        },
      })
    }
  }
}
