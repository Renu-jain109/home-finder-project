import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../services/property.service';
import { Property, INDIAN_STATES } from '../../models/property.model';
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
  availableStates: string[] = INDIAN_STATES;

  private map: any = null;
  private markersMap = new Map<string, any>();
  private destroy$ = new Subject<void>();
  private leafletLoaded = false;
  private viewReady = false;

  private defaultLat = 20.5937;
  private defaultLng = 78.9629;
  private defaultZoom = 5;

  hoveredPropertyId: string | null = null;

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.loadProperties();
  }

  ngAfterViewInit() {
    this.viewReady = true;
    this.loadLeaflet();
  }

  private loadLeaflet() {
    if ((window as any).L) {
      this.leafletLoaded = true;
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
      this.leafletLoaded = true;
      this.initMap();
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
    console.log('initMap called:', { viewReady: this.viewReady, leafletLoaded: this.leafletLoaded, hasMap: !!this.map });
    if (!this.viewReady || !this.leafletLoaded) return;
    if (!this.mapContainer?.nativeElement) {
      console.log('Map container not found');
      return;
    }
    if (this.map) return; // Already initialized

    console.log('Initializing map with container:', this.mapContainer.nativeElement);
    this.map = (window as any).L.map(this.mapContainer.nativeElement).setView(
      [this.defaultLat, this.defaultLng],
      this.defaultZoom
    );

    (window as any).L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    console.log('Map initialized, updating markers');
    this.updateMapMarkers();
  }

  private updateMapMarkers() {
    console.log('updateMapMarkers called:', { hasMap: !!this.map, propertiesCount: this.filteredProperties.length });
    if (!this.map) return;

    this.markersMap.forEach(marker => marker.remove());
    this.markersMap.clear();

    const bounds = (window as any).L.latLngBounds([]);
    let hasValidMarkers = false;

    console.log('Processing properties for markers:', this.filteredProperties.length);
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

// Store marker by ID instead of index

        marker.on('mouseover', () => {
          this.hoveredPropertyId = property._id ?? null;
        });

        marker.on('mouseout', () => {
          this.hoveredPropertyId = null;
        });

        this.markersMap.set(property._id!, marker);
        bounds.extend([lat, lng]);
        hasValidMarkers = true;
      }
    });

    if (hasValidMarkers && bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }else {
      // Fallback if no properties found
      this.map.setView([this.defaultLat, this.defaultLng], this.defaultZoom);
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
    console.log('loadProperties called with state filter:', this.selectedState);
    this.loading = true;
    this.error = '';

    const filters = this.selectedState ? { state: this.selectedState } : undefined;

    this.propertyService.getAllProperties(filters).subscribe({
      next: (res) => {
        console.log('Properties loaded:', (res.data as Property[])?.length || 0);
        this.properties = res.data as Property[];
        this.applyStateFilter();
        this.loading = false;
        if (this.map) {
          this.updateMapMarkers();
        }
      },
      error: (err) => {
        console.error('Failed to load properties:', err);
        this.error = 'Failed to load properties.';
        this.loading = false;
      }
    });
  }

  onStateChange() {
    this.loadProperties();
  }

  applyStateFilter() {
    if (!this.selectedState) {
      this.filteredProperties = [...this.properties];
    } else {
      const selected = this.selectedState.toLowerCase();
      this.filteredProperties = this.properties.filter(p =>
        (p.state && p.state.toLowerCase() === selected) ||
        p.location.toLowerCase().includes(selected)
      );
    }
  }

  // MODIFIED: Cleaner hover logic using property ID
  onPropertyHover(property: Property) {
    if (!property._id) return;
    
    const marker = this.markersMap.get(property._id!);
    if (marker) {
      marker.openTooltip();
      
      const lat = property.lat ?? this.getMockLatForLocation(property.location);
      const lng = property.lng ?? this.getMockLngForLocation(property.location);
      
      // Use flyTo for smooth professional animation
      this.map?.flyTo([lat, lng], 10, {
        animate: true,
        duration: 0.8
      });
    }
  }

  onPropertyLeave() {
    this.markersMap.forEach(marker => marker.closeTooltip());
  }

  formatPrice(price: number, type: string): string {
    if (type === 'Rent') return '₹' + price.toLocaleString('en-IN') + '/mo';
    if (price >= 10000000) return '₹' + (price / 10000000).toFixed(1) + ' Cr';
    if (price >= 100000) return '₹' + (price / 100000).toFixed(1) + ' L';
    return '₹' + price.toLocaleString('en-IN');
  }
}
