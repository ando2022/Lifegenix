export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  city?: string;
  country?: string;
  address?: string;
}

export interface ShopWithDistance {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  distance: number; // in kilometers
  averageRating: number;
  totalReviews: number;
  priceRange: string;
  category: string;
  openingHours?: string;
  phone?: string;
  website?: string;
  isOpen?: boolean;
}

export class LocationService {
  private static instance: LocationService;
  private currentLocation: Location | null = null;
  private locationWatchers: Array<(location: Location | null) => void> = [];

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Get current location with high accuracy
  async getCurrentLocation(options: {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
  } = {}): Promise<Location | null> {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
      ...options
    };

    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser');
        return await this.getLocationFromIP();
      }

      // Request permission and get location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          defaultOptions
        );
      });

      const location: Location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };

      // Get address details from coordinates
      const addressDetails = await this.reverseGeocode(location.latitude, location.longitude);
      if (addressDetails) {
        location.city = addressDetails.city;
        location.country = addressDetails.country;
        location.address = addressDetails.address;
      }

      this.currentLocation = location;
      this.notifyWatchers(location);
      
      return location;
    } catch (error) {
      console.warn('Failed to get precise location:', error);
      
      // Fallback to IP-based location
      const ipLocation = await this.getLocationFromIP();
      if (ipLocation) {
        this.currentLocation = ipLocation;
        this.notifyWatchers(ipLocation);
      }
      
      return ipLocation;
    }
  }

  // Fallback: Get approximate location from IP
  private async getLocationFromIP(): Promise<Location | null> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        return {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          city: data.city,
          country: data.country_name,
          address: `${data.city}, ${data.region}, ${data.country_name}`
        };
      }
    } catch (error) {
      console.warn('Failed to get IP location:', error);
    }
    
    return null;
  }

  // Convert address to coordinates
  async geocodeAddress(address: string): Promise<Location | null> {
    try {
      // Using OpenStreetMap Nominatim (free alternative to Google Geocoding)
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          city: result.address?.city || result.address?.town || result.address?.village,
          country: result.address?.country,
          address: result.display_name
        };
      }
    } catch (error) {
      console.warn('Geocoding failed:', error);
    }
    
    return null;
  }

  // Convert coordinates to address
  private async reverseGeocode(lat: number, lng: number): Promise<{city: string, country: string, address: string} | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.address) {
        return {
          city: data.address.city || data.address.town || data.address.village || '',
          country: data.address.country || '',
          address: data.display_name || ''
        };
      }
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
    }
    
    return null;
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Find nearby shops within specified radius
  async findNearbyShops(
    userLocation: Location,
    shops: any[],
    radiusKm: number = 10
  ): Promise<ShopWithDistance[]> {
    const nearbyShops: ShopWithDistance[] = [];

    for (const shop of shops) {
      if (!shop.latitude || !shop.longitude) continue;

      const distance = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        parseFloat(shop.latitude),
        parseFloat(shop.longitude)
      );

      if (distance <= radiusKm) {
        nearbyShops.push({
          id: shop.id,
          name: shop.name,
          address: shop.address,
          city: shop.city,
          latitude: parseFloat(shop.latitude),
          longitude: parseFloat(shop.longitude),
          distance,
          averageRating: parseFloat(shop.averageRating || '0'),
          totalReviews: shop.totalReviews || 0,
          priceRange: shop.priceRange || '$$',
          category: shop.category || 'juice-bar',
          openingHours: shop.openingHours,
          phone: shop.phone,
          website: shop.website,
          isOpen: this.isShopOpen(shop.openingHours)
        });
      }
    }

    // Sort by distance, then by rating
    return nearbyShops.sort((a, b) => {
      if (a.distance !== b.distance) {
        return a.distance - b.distance;
      }
      return b.averageRating - a.averageRating;
    });
  }

  // Check if shop is currently open
  private isShopOpen(openingHours?: string): boolean {
    if (!openingHours) return true; // Assume open if no hours provided

    try {
      const hours = JSON.parse(openingHours);
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const currentTime = now.getHours() * 100 + now.getMinutes(); // HHMM format

      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const todayHours = hours[dayNames[dayOfWeek]];

      if (!todayHours || todayHours.closed) {
        return false;
      }

      const openTime = this.parseTime(todayHours.open);
      const closeTime = this.parseTime(todayHours.close);

      return currentTime >= openTime && currentTime <= closeTime;
    } catch (error) {
      console.warn('Failed to parse opening hours:', error);
      return true; // Default to open if parsing fails
    }
  }

  private parseTime(timeStr: string): number {
    // Parse time like "09:30" to 930
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 100 + minutes;
  }

  // Watch for location changes
  watchLocation(callback: (location: Location | null) => void): () => void {
    this.locationWatchers.push(callback);
    
    // Immediately call with current location if available
    if (this.currentLocation) {
      callback(this.currentLocation);
    }

    // Return unsubscribe function
    return () => {
      const index = this.locationWatchers.indexOf(callback);
      if (index > -1) {
        this.locationWatchers.splice(index, 1);
      }
    };
  }

  private notifyWatchers(location: Location | null) {
    this.locationWatchers.forEach(callback => callback(location));
  }

  // Get cached location
  getCachedLocation(): Location | null {
    return this.currentLocation;
  }

  // Clear cached location
  clearLocation() {
    this.currentLocation = null;
    this.notifyWatchers(null);
  }

  // Get location permission status
  async getLocationPermissionStatus(): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> {
    if (!navigator.permissions || !navigator.geolocation) {
      return 'unsupported';
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state as 'granted' | 'denied' | 'prompt';
    } catch (error) {
      return 'unsupported';
    }
  }

  // Request location permission
  async requestLocationPermission(): Promise<boolean> {
    try {
      const location = await this.getCurrentLocation();
      return location !== null;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const locationService = LocationService.getInstance();
