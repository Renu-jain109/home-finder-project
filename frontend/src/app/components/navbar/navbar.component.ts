import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AuthModalComponent]
})
export class NavbarComponent implements OnInit, OnDestroy {
  showAuthModal = false;
  authModalMode: 'login' | 'register' = 'login';
  isLoggedIn = false;
  userName = '';
  isMobileMenuOpen = false;
  isUserMenuOpen = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.pipe(takeUntil(this.destroy$)).subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.userName = user?.name || '';
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openLogin() {
    this.authModalMode = 'login';
    this.showAuthModal = true;
  }

  openRegister() {
    this.authModalMode = 'register';
    this.showAuthModal = true;
  }

  closeAuthModal() {
    this.showAuthModal = false;
  }

  onAuthSuccess() {
    this.showAuthModal = false;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu() {
    this.isUserMenuOpen = false;
  }

  logoutAndClose() {
    this.closeUserMenu();
    this.closeMobileMenu();
    this.onLogout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    // Close user menu if clicking outside of it
    if (this.isUserMenuOpen) {
      const userMenuElement = document.querySelector('.user-menu-container');
      const userMenuButton = document.querySelector('.user-menu-button');
      
      if (userMenuElement && userMenuButton && 
          !userMenuElement.contains(target) && 
          !userMenuButton.contains(target)) {
        this.closeUserMenu();
      }
    }
  }
}
