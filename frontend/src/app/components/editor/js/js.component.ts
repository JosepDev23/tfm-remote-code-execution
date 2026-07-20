import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { BaseEditorComponent } from '../base/base-editor.component'
import { JsService } from '../../../services/js/js.service'
import { AuthService } from '../../../services/auth/auth.service'
import { BaseContainerService } from '../../../services/base/base-container.service'

/**
 * JavaScript language code editor component.
 * Extends BaseEditorComponent to inherit common editor functionality.
 */
@Component({
  selector: 'app-js',
  imports: [FormsModule],
  providers: [JsService],
  templateUrl: '../base/base-editor.component.html',
  styleUrl: '../base/base-editor.component.css',
})
export class JsComponent extends BaseEditorComponent {
  protected readonly languageName = 'JavaScript'
  protected readonly fileExtension = '.js'
  protected readonly defaultContent = 'console.log("Hello, World!");\n'

  constructor(
    private readonly jsService: JsService,
    authService: AuthService,
    router: Router
  ) {
    super(authService, router)
  }

  protected getContainerService(): BaseContainerService {
    return this.jsService
  }
}
