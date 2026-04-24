import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../services/auth.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-my-properties',
  templateUrl: './my-properties.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class MyPropertiesComponent implements OnInit {
  properties: Property[] = [];
  loading = false;
  error = '';
  userName = '';

  constructor(
    private propertyService: PropertyService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.userName = user?.name || 'User';
    this.loadMyProperties();
  }

  loadMyProperties() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.error = 'Please log in to view your properties.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.propertyService.getMyProperties(user.id).subscribe({
      next: (res) => {
        this.properties = res.data as Property[];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load your properties.';
        this.loading = false;
      }
    });
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this property?')) {
      this.propertyService.deleteProperty(id).subscribe({
        next: () => {
          this.properties = this.properties.filter(p => p._id !== id);
        },
        error: () => alert('Failed to delete property.')
      });
    }
  }

  formatPrice(price: number, type: string): string {
    if (type === 'Rent') return '₹' + price.toLocaleString('en-IN') + '/mo';
    if (price >= 10000000) return '₹' + (price / 10000000).toFixed(1) + ' Cr';
    if (price >= 100000) return '₹' + (price / 100000).toFixed(1) + ' L';
    return '₹' + price.toLocaleString('en-IN');
  }
}
