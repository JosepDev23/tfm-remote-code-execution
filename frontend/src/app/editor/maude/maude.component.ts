import { Component, OnInit } from '@angular/core'
import { MaudeService } from '../../services/maude/maude.service'
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth/auth.service'

@Component({
  selector: 'app-maude',
  imports: [],
  providers: [MaudeService],
  templateUrl: './maude.component.html',
  styleUrl: './maude.component.css',
})
export class MaudeComponent implements OnInit {
  code = `red 3 + 2 .`

  output = `// Output will be displayed here`

  constructor(
    private readonly maudeService: MaudeService,
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

  executeCode() {
    this.maudeService.executeCode(this.code).subscribe({
      next: (response) => {
        this.output = response.stdout || 'No output returned'
        console.log('Code executed successfully:', response)
      },
      error: (error) => {
        console.error('Error executing code:', error)
      },
    })
  }

  deleteContainer() {
    this.maudeService.deleteContainer().subscribe({
      next: (response) => {
        console.log('Container deleted successfully:', response)
      },
      error: (error) => {
        console.error('Error deleting container:', error)
      },
    })
  }
}
