import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class HomeComponent {
  searchLocation = '';
  searchType = '';

  categories = [
    { icon: '🏢', label: 'Apartment', value: 'Apartment' },
    { icon: '🏠', label: 'House', value: 'House' },
    { icon: '🏡', label: 'Villa', value: 'Villa' },
    { icon: '🌳', label: 'Plot', value: 'Plot' },
    { icon: '🏬', label: 'Commercial', value: 'Commercial' },
    { icon: '🔍', label: 'All', value: '' },
  ];

  constructor(private router: Router) {}

  onSearch() {
    this.router.navigate(['/listings'], {
      queryParams: {
        location: this.searchLocation || null,
        type: this.searchType || null
      }
    });
  }
}
