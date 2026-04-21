declare module 'leaflet' {
  export class Map {
    constructor(element: HTMLElement | string, options?: any);
    setView(center: LatLngExpression, zoom: number): this;
    fitBounds(bounds: LatLngBoundsExpression, options?: any): this;
    panTo(latlng: LatLngExpression): this;
    remove(): this;
  }

  export class Marker {
    constructor(latlng: LatLngExpression, options?: any);
    addTo(map: Map): this;
    remove(): this;
    bindTooltip(content: string, options?: any): this;
    openTooltip(): this;
    closeTooltip(): this;
    on(type: string, fn: (e: any) => void): this;
  }

  export class TileLayer {
    constructor(urlTemplate: string, options?: any);
    addTo(map: Map): this;
  }

  export function map(element: HTMLElement | string, options?: any): Map;
  export function marker(latlng: LatLngExpression, options?: any): Marker;
  export function tileLayer(urlTemplate: string, options?: any): TileLayer;
  export function latLngBounds(latlngs: LatLngExpression[]): LatLngBounds;

  export type LatLngExpression = [number, number] | { lat: number; lng: number };
  export type LatLngBoundsExpression = LatLngBounds | LatLngExpression[];

  export class LatLngBounds {
    constructor(southWest: LatLngExpression, northEast: LatLngExpression);
    extend(latlng: LatLngExpression): this;
    isValid(): boolean;
  }
}
