import { Routes } from '@angular/router'
import { HomeComponent } from './components/home/home.component'
import { LoginComponent } from './components/login/login.component'
import { RegisterComponent } from './components/register/register.component'
import { MaudeComponent } from './components/editor/maude/maude.component'
import { CComponent } from './components/editor/c/c.component'

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'editor/maude', component: MaudeComponent },
  { path: 'editor/c', component: CComponent },
]

