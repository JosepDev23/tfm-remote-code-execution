import { Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component'
import { MaudeComponent } from './editor/maude/maude.component'

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'editor/maude', component: MaudeComponent },
]
