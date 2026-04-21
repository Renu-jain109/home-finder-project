import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class PropertyDetailComponent implements OnInit {
  property: Property | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadProperty(id);
  }

  loadProperty(id: string) {
    this.loading = true;
    this.propertyService.getPropertyById(id).subscribe({
      next: (res) => {
        this.property = res.data as Property;
        this.loading = false;
      },
      error: () => {
        this.error = 'Property not found.';
        this.loading = false;
      }
    });
  }

  onDelete() {
    if (this.property && confirm('Delete this property?')) {
      this.propertyService.deleteProperty(this.property._id!).subscribe({
        next: () => this.router.navigate(['/listings']),
        error: () => alert('Failed to delete.')
      });
    }
  }

  formatPrice(price: number, type: string): string {
    if (type === 'Rent') return '₹' + price.toLocaleString('en-IN') + ' / month';
    if (price >= 10000000) return '₹' + (price / 10000000).toFixed(2) + ' Crore';
    if (price >= 100000) return '₹' + (price / 100000).toFixed(2) + ' Lakh';
    return '₹' + price.toLocaleString('en-IN');
  }
}
