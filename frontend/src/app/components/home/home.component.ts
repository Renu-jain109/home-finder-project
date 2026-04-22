import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class HomeComponent implements OnInit, OnDestroy {
  searchLocation = '';
  searchType = '';
  isLoggedIn = false;
  private destroy$ = new Subject<void>();

  categories = [
    { icon: '🏢', label: 'Apartment', value: 'Apartment' },
    { icon: '🏠', label: 'House', value: 'House' },
    { icon: '🏡', label: 'Villa', value: 'Villa' },
    { icon: '🌳', label: 'Plot', value: 'Plot' },
    { icon: '🏬', label: 'Commercial', value: 'Commercial' },
    { icon: '🔍', label: 'All', value: '' },
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.pipe(takeUntil(this.destroy$)).subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch() {
    this.router.navigate(['/listings'], {
      queryParams: {
        location: this.searchLocation || null,
        type: this.searchType || null
      }
    });
  }
}
