import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, NgIf, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  flag: boolean = false;
  
  constructor(private authService: AuthService, private router: Router) { }
  ngOnInit(): void {
    this.authService.deleteToken();
  }

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log(response);
        
        this.authService.saveToken(response.token);
        this.router.navigate(['/panel']);
      },
      error: (error) => {
        console.error("Error al iniciar sesión: ", error)
        this.flag = true;
        this.username = "";
        this.password = "";
      }
    })
  }
}
