import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AuthModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();
  @Input() mode: AuthMode = 'login';

  isLoading = false;
  errorMessage = '';

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  setMode(mode: AuthMode) {
    this.mode = mode;
    this.errorMessage = '';
  }

  onSubmit() {
    if (this.mode === 'login') {
      this.submitLogin();
    } else {
      this.submitRegister();
    }
  }

  private submitLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.success.emit();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Invalid credentials. Please try again.';
      }
    });
  }

  private submitRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { name, email, password } = this.registerForm.value;
    this.authService.register(name, email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.success.emit();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Registration failed. Please try again.';
      }
    });
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  get lf(): { [key: string]: any } { return this.loginForm.controls as any; }
  get rf(): { [key: string]: any } { return this.registerForm.controls as any; }
}
