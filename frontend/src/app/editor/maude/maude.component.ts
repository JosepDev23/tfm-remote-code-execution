import { Component, OnInit } from '@angular/core'
import { MaudeService } from '../../services/maude/maude.service'
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth/auth.service'
import { FormsModule } from '@angular/forms'

interface MaudeFile {
  id: string
  name: string
  content: string
}

@Component({
  selector: 'app-maude',
  imports: [FormsModule],
  providers: [MaudeService],
  templateUrl: './maude.component.html',
  styleUrl: './maude.component.css',
})
export class MaudeComponent implements OnInit {
  files: MaudeFile[] = [
    {
      id: this.generateId(),
      name: 'main.maude',
      content: 'red 3 + 2 .'
    }
  ]

  activeFileId: string = this.files[0].id

  renamingFileId: string | null = null

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
    const activeFile = this.getActiveFile()
    if (!activeFile) return

    this.isExecuting = true
    this.output = `// Executing ${activeFile.name}...`
    
    this.maudeService.executeCode(activeFile.content).subscribe({
      next: (response) => {
        this.output = `// Executed: ${activeFile.name}\n${response.stdout || 'No output returned'}`
        this.isExecuting = false
        console.log('Code executed successfully:', response)
      },
      error: (error) => {
        this.output = `// Error executing ${activeFile.name}\nError: ${error.message || 'Failed to execute code'}`
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
    const activeFile = this.getActiveFile()
    if (activeFile) {
      activeFile.content = this.getActiveFileContent()
    }
  }

  getLineCount(): number {
    const activeFile = this.getActiveFile()
    return activeFile ? activeFile.content.split('\n').length : 0
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

  // File Management Methods
  getActiveFile(): MaudeFile | undefined {
    return this.files.find(f => f.id === this.activeFileId)
  }

  getActiveFileContent(): string {
    const textarea = document.querySelector('.code-editor') as HTMLTextAreaElement
    return textarea ? textarea.value : ''
  }

  createFile(): void {
    const fileNumber = this.files.length + 1
    const newFile: MaudeFile = {
      id: this.generateId(),
      name: `file${fileNumber}.maude`,
      content: ''
    }
    this.files.push(newFile)
    this.switchFile(newFile.id)
  }

  deleteFile(fileId: string): void {
    if (this.files.length <= 1) {
      console.warn('Cannot delete the last file')
      return
    }

    const index = this.files.findIndex(f => f.id === fileId)
    if (index === -1) return

    this.files.splice(index, 1)

    // If we deleted the active file, switch to the first available file
    if (fileId === this.activeFileId) {
      this.activeFileId = this.files[0].id
    }
  }

  switchFile(fileId: string): void {
    // Save current file content before switching
    const currentFile = this.getActiveFile()
    if (currentFile) {
      currentFile.content = this.getActiveFileContent()
    }

    this.activeFileId = fileId
  }

  renameFile(fileId: string, newName: string): void {
    const file = this.files.find(f => f.id === fileId)
    if (file && newName.trim()) {
      file.name = newName.trim().endsWith('.maude') ? newName.trim() : `${newName.trim()}.maude`
    }
    this.renamingFileId = null
  }

  startRenaming(fileId: string, event?: Event): void {
    if (event) {
      event.stopPropagation()
    }
    this.renamingFileId = fileId
    // Focus the input after Angular renders it
    setTimeout(() => {
      const input = document.querySelector('.file-rename-input') as HTMLInputElement
      if (input) {
        const nameWithoutExtension = input.value.replace('.maude', '')
        input.value = nameWithoutExtension
        input.select()
      }
    }, 0)
  }

  finishRenaming(fileId: string, newName: string, event?: KeyboardEvent): void {
    if (event && event.key !== 'Enter' && event.key !== 'Escape') {
      return
    }
    
    if (event?.key === 'Escape') {
      this.renamingFileId = null
      return
    }

    this.renameFile(fileId, newName)
  }

  private generateId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
