import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare const L: any;

@Component({
  selector: 'app-split-view',
  templateUrl: './split-view.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class SplitViewComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  properties: Property[] = [];
  filteredProperties: Property[] = [];
  loading = false;
  error = '';

  selectedState: string = '';
  availableStates: string[] = ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Telangana', 'Gujarat', 'Rajasthan', 'Kerala', 'Punjab', 'Haryana'];

  private map: any = null;
  private markers: any[] = [];
  private destroy$ = new Subject<void>();

  private defaultLat = 20.5937;
  private defaultLng = 78.9629;
  private defaultZoom = 5;

  hoveredPropertyId: string | null = null;

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.loadProperties();
    this.loadLeaflet();
  }

  ngAfterViewInit() {
    // Map will be initialized after Leaflet loads
  }

  private loadLeaflet() {
    if ((window as any).L) {
      this.initMap();
      return;
    }

    // Load Leaflet CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(cssLink);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      setTimeout(() => this.initMap(), 100);
    };
    document.head.appendChild(script);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap() {
    if (!this.mapContainer?.nativeElement) return;

    this.map = (window as any).L.map(this.mapContainer.nativeElement).setView(
      [this.defaultLat, this.defaultLng],
      this.defaultZoom
    );

    (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.updateMapMarkers();
  }

  private updateMapMarkers() {
    if (!this.map) return;

    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    const bounds = (window as any).L.latLngBounds([]);
    let hasValidMarkers = false;

    this.filteredProperties.forEach(property => {
      const lat = property.lat ?? this.getMockLatForLocation(property.location);
      const lng = property.lng ?? this.getMockLngForLocation(property.location);

      if (lat && lng) {
        const marker = (window as any).L.marker([lat, lng]).addTo(this.map);

        marker.bindTooltip(property.title, {
          direction: 'top',
          offset: [0, -10],
          className: 'bg-gray-900 text-white px-3 py-1 rounded text-sm font-medium shadow-lg border-none'
        });

        marker.on('mouseover', () => {
          this.hoveredPropertyId = property._id ?? null;
        });

        marker.on('mouseout', () => {
          this.hoveredPropertyId = null;
        });

        this.markers.push(marker);
        bounds.extend([lat, lng]);
        hasValidMarkers = true;
      }
    });

    if (hasValidMarkers && bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  private getMockLatForLocation(location: string): number {
    const baseLat = 20.5937;
    const hash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return baseLat + (hash % 1000) / 500 - 1;
  }

  private getMockLngForLocation(location: string): number {
    const baseLng = 78.9629;
    const hash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return baseLng + (hash % 1000) / 500 - 1;
  }

  loadProperties() {
    this.loading = true;
    this.error = '';

    this.propertyService.getAllProperties().subscribe({
      next: (res) => {
        this.properties = res.data as Property[];
        this.applyStateFilter();
        this.loading = false;
        if (this.map) {
          this.updateMapMarkers();
        }
      },
      error: () => {
        this.error = 'Failed to load properties.';
        this.loading = false;
      }
    });
  }

  onStateChange() {
    this.applyStateFilter();
    if (this.map) {
      this.updateMapMarkers();
    }
  }

  applyStateFilter() {
    if (!this.selectedState) {
      this.filteredProperties = [...this.properties];
    } else {
      this.filteredProperties = this.properties.filter(p =>
        p.location.toLowerCase().includes(this.selectedState.toLowerCase())
      );
    }
  }

  onPropertyHover(property: Property) {
    const index = this.filteredProperties.indexOf(property);
    if (index >= 0 && this.markers[index]) {
      this.markers[index].openTooltip();
      const lat = property.lat ?? this.getMockLatForLocation(property.location);
      const lng = property.lng ?? this.getMockLngForLocation(property.location);
      this.map?.panTo([lat, lng]);
    }
  }

  onPropertyLeave() {
    this.markers.forEach(marker => marker.closeTooltip());
  }

  formatPrice(price: number, type: string): string {
    if (type === 'Rent') return '₹' + price.toLocaleString('en-IN') + '/mo';
    if (price >= 10000000) return '₹' + (price / 10000000).toFixed(1) + ' Cr';
    if (price >= 100000) return '₹' + (price / 100000).toFixed(1) + ' L';
    return '₹' + price.toLocaleString('en-IN');
  }
}
