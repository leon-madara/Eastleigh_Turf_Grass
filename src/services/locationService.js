// Location Service
class LocationService {
    constructor() {
        this.isSupported = 'geolocation' in navigator;
        this.currentPosition = null;
    }

    // Check if geolocation is supported
    isGeolocationSupported() {
        return this.isSupported;
    }

    // Get current location using browser geolocation
    async getCurrentLocation() {
        if (!this.isSupported) {
            throw new Error('Geolocation is not supported in this browser');
        }

        return new Promise((resolve, reject) => {
            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentPosition = position;
                    resolve(position);
                },
                (error) => {
                    reject(this.handleGeolocationError(error));
                },
                options
            );
        });
    }

    // Handle geolocation errors
    handleGeolocationError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                return {
                    type: 'permission_denied',
                        message: 'Location access was denied. Please enable location services.',
                        code: 'PERMISSION_DENIED'
                };
            case error.POSITION_UNAVAILABLE:
                return {
                    type: 'position_unavailable',
                        message: 'Location information is unavailable.',
                        code: 'POSITION_UNAVAILABLE'
                };
            case error.TIMEOUT:
                return {
                    type: 'timeout',
                        message: 'Location request timed out. Please try again.',
                        code: 'TIMEOUT'
                };
            default:
                return {
                    type: 'unknown',
                        message: 'An unknown error occurred while getting location.',
                        code: 'UNKNOWN_ERROR'
                };
        }
    }

    // Get location using IP address (fallback method)
    async getIPLocation() {
        try {
            // Try multiple IP geolocation services for better reliability
            const services = [
                'https://ipapi.co/json/',
                'https://ipinfo.io/json',
                'https://api.ipify.org?format=json'
            ];

            for (const service of services) {
                try {
                    const response = await fetch(service, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        },
                        timeout: 5000
                    });

                    if (response.ok) {
                        const data = await response.json();
                        return this.formatIPLocation(data);
                    }
                } catch (error) {
                    console.warn(`IP location service ${service} failed:`, error);
                    continue;
                }
            }

            throw new Error('All IP location services failed');
        } catch (error) {
            console.error('IP location detection failed:', error);
            throw new Error('Could not detect location from IP address');
        }
    }

    // Format IP location data from various services
    formatIPLocation(data) {
        // Handle different IP geolocation service formats
        if (data.city && data.country) {
            // ipinfo.io format
            return {
                city: data.city,
                region: data.region,
                country: data.country,
                formatted: `${data.city}, ${data.region}, ${data.country}`,
                coordinates: data.loc ? data.loc.split(',').map(Number) : null
            };
        } else if (data.city_name && data.country_name) {
            // ipapi.co format
            return {
                city: data.city_name,
                region: data.region,
                country: data.country_name,
                formatted: `${data.city_name}, ${data.region}, ${data.country_name}`,
                coordinates: [data.latitude, data.longitude]
            };
        } else {
            // Generic format
            return {
                city: data.city || 'Unknown',
                region: data.region || data.state || 'Unknown',
                country: data.country || data.country_name || 'Unknown',
                formatted: `${data.city || 'Unknown'}, ${data.region || data.state || 'Unknown'}, ${data.country || data.country_name || 'Unknown'}`,
                coordinates: data.lat && data.lon ? [data.lat, data.lon] : null
            };
        }
    }

    // Reverse geocode coordinates to address
    async reverseGeocode(latitude, longitude) {
        try {
            // Using OpenStreetMap Nominatim API (free, no API key required)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch location data');
            }

            const data = await response.json();
            return this.formatAddress(data);
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
            throw new Error('Failed to get address from coordinates');
        }
    }

    // Format address from Nominatim response
    formatAddress(data) {
        if (!data.address) {
            return 'Unknown location';
        }

        const address = data.address;
        const parts = [];

        // Build address from most specific to least specific
        if (address.house_number && address.road) {
            parts.push(`${address.house_number} ${address.road}`);
        } else if (address.road) {
            parts.push(address.road);
        }

        if (address.suburb) {
            parts.push(address.suburb);
        }

        if (address.city) {
            parts.push(address.city);
        } else if (address.town) {
            parts.push(address.town);
        } else if (address.village) {
            parts.push(address.village);
        }

        if (address.state) {
            parts.push(address.state);
        }

        if (address.country) {
            parts.push(address.country);
        }

        return parts.join(', ');
    }

    // Enhanced location detection with fallbacks
    async detectLocation() {
        try {
            // Method 1: Try GPS/Geolocation first (most accurate)
            try {
                const position = await this.getCurrentLocation();
                const address = await this.reverseGeocode(
                    position.coords.latitude,
                    position.coords.longitude
                );

                return {
                    success: true,
                    address,
                    method: 'gps',
                    coordinates: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    accuracy: position.coords.accuracy,
                    message: 'Location detected using GPS'
                };
            } catch (gpsError) {
                console.warn('GPS detection failed, trying IP-based detection:', gpsError);

                // Method 2: Fallback to IP-based location
                try {
                    const ipLocation = await this.getIPLocation();

                    return {
                        success: true,
                        address: ipLocation.formatted,
                        method: 'ip',
                        coordinates: ipLocation.coordinates,
                        accuracy: 'low',
                        message: 'Approximate location detected using IP address. Please verify your exact address.',
                        isApproximate: true
                    };
                } catch (ipError) {
                    console.warn('IP detection failed:', ipError);

                    // Method 3: Return error with helpful message
                    return {
                        success: false,
                        error: this.getHelpfulErrorMessage(gpsError),
                        type: gpsError.type || 'unknown',
                        message: 'Please enter your location manually'
                    };
                }
            }
        } catch (error) {
            return {
                success: false,
                error: 'Failed to detect location. Please enter manually.',
                type: 'unknown'
            };
        }
    }

    // Get helpful error message based on error type
    getHelpfulErrorMessage(error) {
        switch (error.type) {
            case 'permission_denied':
                return 'Location access was denied. Please enable location services in your browser settings or enter your address manually.';
            case 'timeout':
                return 'Location detection timed out. Please try again or enter your address manually.';
            case 'position_unavailable':
                return 'Location information is currently unavailable. Please enter your address manually.';
            default:
                return 'Could not detect your location automatically. Please enter your address manually.';
        }
    }

    // Search for locations (autocomplete)
    async searchLocations(query) {
        if (!query || query.length < 3) {
            return [];
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ke&limit=5`
            );

            if (!response.ok) {
                throw new Error('Failed to search locations');
            }

            const data = await response.json();
            return data.map(item => ({
                display_name: item.display_name,
                lat: item.lat,
                lon: item.lon,
                type: item.type
            }));
        } catch (error) {
            console.error('Location search failed:', error);
            return [];
        }
    }

    // Get location suggestions for autocomplete
    async getLocationSuggestions(query) {
        const results = await this.searchLocations(query);
        return results.map(result => result.display_name);
    }

    // Validate if a location is in Kenya
    isLocationInKenya(latitude, longitude) {
        // Rough bounding box for Kenya
        const kenyaBounds = {
            north: 5.0, // Northern border
            south: -4.7, // Southern border
            east: 41.9, // Eastern border
            west: 33.9 // Western border
        };

        return (
            latitude >= kenyaBounds.south &&
            latitude <= kenyaBounds.north &&
            longitude >= kenyaBounds.west &&
            longitude <= kenyaBounds.east
        );
    }

    // Get distance between two coordinates (Haversine formula)
    getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance;
    }

    // Convert degrees to radians
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Show location permission request
    async requestLocationPermission() {
        if (!this.isSupported) {
            throw new Error('Geolocation is not supported');
        }

        try {
            // Try to get current position to trigger permission request
            await this.getCurrentLocation();
            return true;
        } catch (error) {
            if (error.type === 'permission_denied') {
                return false;
            }
            throw error;
        }
    }

    // Check if location permission is granted
    async checkLocationPermission() {
        if (!this.isSupported) {
            return false;
        }

        try {
            await this.getCurrentLocation();
            return true;
        } catch (error) {
            return error.type !== 'permission_denied';
        }
    }

    // Check if location detection is supported
    isLocationDetectionSupported() {
        return this.isSupported || navigator.onLine;
    }
}

// Export singleton instance
export const locationService = new LocationService();