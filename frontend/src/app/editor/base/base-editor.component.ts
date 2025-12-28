import { OnInit, Directive } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth/auth.service'
import { BaseContainerService } from '../../services/base/base-container.service'

export interface EditorFile {
  id: string
  name: string
  content: string
}

/**
 * Abstract base component for code editor interfaces.
 * Provides common functionality for file management, code execution, and UI interactions.
 */
@Directive()
export abstract class BaseEditorComponent implements OnInit {
  // Abstract properties that must be implemented by derived classes
  protected abstract readonly languageName: string
  protected abstract readonly fileExtension: string
  protected abstract readonly defaultContent: string

  // File management
  files: EditorFile[] = []
  activeFileId: string = ''
  renamingFileId: string | null = null

  // Editor state
  output = `// Output will be displayed here`
  isExecuting = false
  isDragging = false
  panelHeight = 200 // Default height in pixels
  isResizing = false

  constructor(
    protected readonly authService: AuthService,
    protected readonly router: Router
  ) {}

  /**
   * Abstract method to get the language-specific container service
   */
  protected abstract getContainerService(): BaseContainerService

  ngOnInit(): void {
    // Initialize first file
    this.files = [
      {
        id: this.generateId(),
        name: `main${this.fileExtension}`,
        content: this.defaultContent
      }
    ]
    this.activeFileId = this.files[0].id

    // Authentication check
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

  // Code Execution Methods
  executeCode(): void {
    const activeFile = this.getActiveFile()
    if (!activeFile) return

    this.isExecuting = true
    this.output = `// Executing ${activeFile.name}...`
    
    this.getContainerService().executeCode(activeFile.content).subscribe({
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

  deleteContainer(): void {
    this.getContainerService().deleteContainer().subscribe({
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

  // Navigation Methods
  goBack(): void {
    this.router.navigate(['/home'])
  }

  // Output Methods
  clearOutput(): void {
    this.output = '// Output cleared'
  }

  // Editor Methods
  onCodeChange(): void {
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
  getActiveFile(): EditorFile | undefined {
    return this.files.find(f => f.id === this.activeFileId)
  }

  getActiveFileContent(): string {
    const textarea = document.querySelector('.code-editor') as HTMLTextAreaElement
    return textarea ? textarea.value : ''
  }

  createFile(): void {
    const fileNumber = this.files.length + 1
    const newFile: EditorFile = {
      id: this.generateId(),
      name: `file${fileNumber}${this.fileExtension}`,
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
      file.name = newName.trim().endsWith(this.fileExtension) 
        ? newName.trim() 
        : `${newName.trim()}${this.fileExtension}`
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
        const nameWithoutExtension = input.value.replace(this.fileExtension, '')
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

  // Drag and Drop Methods
  onDragOver(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isDragging = true
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isDragging = false
  }

  onDrop(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.isDragging = false

    const files = event.dataTransfer?.files
    if (!files || files.length === 0) return

    // Process each dropped file
    Array.from(files).forEach(file => {
      // Accept files with the correct extension or text files
      if (file.name.endsWith(this.fileExtension) || file.type === 'text/plain' || file.type === '') {
        const reader = new FileReader()
        
        reader.onload = (e) => {
          const content = e.target?.result as string
          
          // Create new file with the dropped file's name and content
          const newFile: EditorFile = {
            id: this.generateId(),
            name: file.name.endsWith(this.fileExtension) 
              ? file.name 
              : `${file.name}${this.fileExtension}`,
            content: content || ''
          }
          
          this.files.push(newFile)
          this.switchFile(newFile.id)
        }
        
        reader.onerror = () => {
          console.error('Error reading file:', file.name)
          this.output = `// Error: Failed to read file ${file.name}`
        }
        
        reader.readAsText(file)
      } else {
        console.warn('Unsupported file type:', file.name)
        this.output = `// Error: Only ${this.fileExtension} files are supported. Received: ${file.name}`
      }
    })
  }

  downloadFile(): void {
    const activeFile = this.getActiveFile()
    if (!activeFile) return

    // Create a Blob with the file content
    const blob = new Blob([activeFile.content], { type: 'text/plain' })
    
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob)
    
    // Create a temporary anchor element and trigger download
    const link = document.createElement('a')
    link.href = url
    link.download = activeFile.name
    link.click()
    
    // Clean up the temporary URL
    URL.revokeObjectURL(url)
  }

  // Panel Resize Methods
  startResize(event: MouseEvent): void {
    event.preventDefault()
    this.isResizing = true
    
    const onMouseMove = (e: MouseEvent) => {
      if (!this.isResizing) return
      
      const containerHeight = window.innerHeight
      const newHeight = containerHeight - e.clientY - 22 // 22px for status bar
      
      // Set min and max heights
      const minHeight = 100
      const maxHeight = containerHeight - 200 // Leave space for editor
      
      this.panelHeight = Math.max(minHeight, Math.min(newHeight, maxHeight))
    }
    
    const onMouseUp = () => {
      this.isResizing = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }
}
