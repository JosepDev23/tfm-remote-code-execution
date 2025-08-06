import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../auth/auth.service'
import { HomeCardComponent } from './home-card/home-card.component'

@Component({
  selector: 'app-home',
  imports: [HomeCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken()
    if (!token) {
      this.router.navigate(['/login'])
    }
    this.authService.status().subscribe({
      next: (response) => {
        console.log('User status:', response)
      },
      error: (error) => {
        console.error('Error fetching user status:', error)
        this.router.navigate(['/login'])
      },
    })
  }
}
