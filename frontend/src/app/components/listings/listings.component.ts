import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class ListingsComponent implements OnInit {
  properties: Property[] = [];
  displayedProperties: Property[] = [];
  loading = false;
  error = '';
  
  // Pagination
  itemsPerPage = 6;
  currentPage = 1;
  hasMoreProperties = false;

  // Filter state
  filters = {
    location: '',
    type: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    bedrooms: null as number | null,
    category: ''
  };

  constructor(
    private propertyService: PropertyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Read query params from URL (passed from home search)
    this.route.queryParams.subscribe(params => {
      if (params['location']) this.filters.location = params['location'];
      if (params['type']) this.filters.type = params['type'];
      if (params['category']) this.filters.category = params['category'];
      this.loadProperties();
    });
  }

  loadProperties() {
    this.loading = true;
    this.error = '';

    const activeFilters: any = {};
    if (this.filters.location) activeFilters.location = this.filters.location;
    if (this.filters.type) activeFilters.type = this.filters.type;
    if (this.filters.minPrice) activeFilters.minPrice = this.filters.minPrice;
    if (this.filters.maxPrice) activeFilters.maxPrice = this.filters.maxPrice;
    if (this.filters.bedrooms) activeFilters.bedrooms = this.filters.bedrooms;
    if (this.filters.category) activeFilters.category = this.filters.category;

    this.propertyService.getAllProperties(activeFilters).subscribe({
      next: (res) => {
        this.properties = res.data as Property[];
        this.updateDisplayedProperties();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load properties. Please make sure the backend server is running.';
        this.loading = false;
      }
    });
  }

  onFilterApply() {
    this.currentPage = 1;
    this.loadProperties();
  }

  onFilterReset() {
    this.filters = { location: '', type: '', minPrice: null, maxPrice: null, bedrooms: null, category: '' };
    this.currentPage = 1;
    this.loadProperties();
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

  onSeed() {
    if (confirm('This will replace all existing data with 6 sample properties. Continue?')) {
      this.propertyService.seedProperties().subscribe({
        next: () => this.loadProperties(),
        error: () => alert('Failed to seed data.')
      });
    }
  }

  updateDisplayedProperties() {
    const startIndex = 0;
    const endIndex = this.currentPage * this.itemsPerPage;
    this.displayedProperties = this.properties.slice(startIndex, endIndex);
    this.hasMoreProperties = endIndex < this.properties.length;
  }

  loadMoreProperties() {
    this.currentPage++;
    this.updateDisplayedProperties();
  }

  formatPrice(price: number, type: string): string {
    if (type === 'Rent') return '₹' + price.toLocaleString('en-IN') + '/mo';
    if (price >= 10000000) return '₹' + (price / 10000000).toFixed(1) + ' Cr';
    if (price >= 100000) return '₹' + (price / 100000).toFixed(1) + ' L';
    return '₹' + price.toLocaleString('en-IN');
  }
}
