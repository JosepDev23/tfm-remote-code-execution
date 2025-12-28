import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { BaseEditorComponent } from '../base/base-editor.component'
import { CService } from '../../services/c/c.service'
import { AuthService } from '../../services/auth/auth.service'
import { BaseContainerService } from '../../services/base/base-container.service'

/**
 * C language code editor component.
 * Extends BaseEditorComponent to inherit common editor functionality.
 */
@Component({
  selector: 'app-c',
  imports: [FormsModule],
  providers: [CService],
  templateUrl: '../base/base-editor.component.html',
  styleUrl: '../base/base-editor.component.css',
})
export class CComponent extends BaseEditorComponent {
  protected readonly languageName = 'C'
  protected readonly fileExtension = '.c'
  protected readonly defaultContent = '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}'

  constructor(
    private readonly cService: CService,
    authService: AuthService,
    router: Router
  ) {
    super(authService, router)
  }

  protected getContainerService(): BaseContainerService {
    return this.cService
  }
}
