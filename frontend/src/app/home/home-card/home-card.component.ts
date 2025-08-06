import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-home-card',
  imports: [],
  templateUrl: './home-card.component.html',
  styleUrl: './home-card.component.css',
})
export class HomeCardComponent {
  @Input() title: string = ''
  @Input() route: string = ''
  @Input() icon: string = ''

  constructor(private readonly router: Router) {}

  openEditor(): void {
    this.router.navigate(['/editor/' + this.route])
  }
}
