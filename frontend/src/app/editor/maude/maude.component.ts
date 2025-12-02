import { Component, OnInit } from '@angular/core'
import { MaudeService } from '../../services/maude/maude.service'
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth/auth.service'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-maude',
  imports: [FormsModule],
  providers: [MaudeService],
  templateUrl: './maude.component.html',
  styleUrl: './maude.component.css',
})
export class MaudeComponent implements OnInit {
  code = `red 3 + 2 .`

  output = `// Output will be displayed here`

  isExecuting = false

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
    this.isExecuting = true
    this.output = '// Executing code...'
    
    this.maudeService.executeCode(this.code).subscribe({
      next: (response) => {
        this.output = response.stdout || 'No output returned'
        this.isExecuting = false
        console.log('Code executed successfully:', response)
      },
      error: (error) => {
        this.output = `Error: ${error.message || 'Failed to execute code'}`
        this.isExecuting = false
        console.error('Error executing code:', error)
      },
    })
  }

  deleteContainer() {
    this.maudeService.deleteContainer().subscribe({
      next: (response) => {
        console.log('Container deleted successfully:', response)
        this.output = '// Container deleted successfully'
      },
      error: (error) => {
        console.error('Error deleting container:', error)
        this.output = `Error: Failed to delete container`
      },
    })
  }

  goBack() {
    this.router.navigate(['/home'])
  }

  clearOutput() {
    this.output = '// Output cleared'
  }

  onCodeChange() {
    // This method can be used for future enhancements like auto-save
  }

  getLineCount(): number {
    return this.code.split('\n').length
  }

  getCurrentLine(): number {
    // This is a placeholder - would need textarea reference for actual cursor position
    return 1
  }

  getCurrentColumn(): number {
    // This is a placeholder - would need textarea reference for actual cursor position
    return 1
  }

  getLineNumbers(): number[] {
    const lineCount = this.getLineCount()
    return Array.from({ length: lineCount }, (_, i) => i + 1)
  }

  onEditorScroll(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement
    const lineNumbers = document.querySelector('.line-numbers') as HTMLElement
    if (lineNumbers) {
      lineNumbers.scrollTop = textarea.scrollTop
    }
  }
}
