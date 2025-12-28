import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { BaseEditorComponent } from '../base/base-editor.component'
import { MaudeService } from '../../../services/maude/maude.service'
import { AuthService } from '../../../services/auth/auth.service'
import { BaseContainerService } from '../../../services/base/base-container.service'

/**
 * Maude language code editor component.
 * Extends BaseEditorComponent to inherit common editor functionality.
 */
@Component({
  selector: 'app-maude',
  imports: [FormsModule],
  providers: [MaudeService],
  templateUrl: '../base/base-editor.component.html',
  styleUrl: '../base/base-editor.component.css',
})
export class MaudeComponent extends BaseEditorComponent {
  protected readonly languageName = 'Maude'
  protected readonly fileExtension = '.maude'
  protected readonly defaultContent = 'red 3 + 2 .'

  constructor(
    private readonly maudeService: MaudeService,
    authService: AuthService,
    router: Router
  ) {
    super(authService, router)
  }

  protected getContainerService(): BaseContainerService {
    return this.maudeService
  }
}
