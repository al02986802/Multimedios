import { useState, useEffect, useRef } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CityWithDeviceStatus, DeviceType, DeviceStatus } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import InfoCard from './InfoCard';
import MapControls from './MapControls';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Define the filters prop type
interface FiltersType {
  cities: Record<number, boolean>;
  deviceTypes: Record<DeviceType, boolean>;
  deviceStatus: Record<DeviceStatus, boolean>;
}

interface MapContainerProps {
  cities: CityWithDeviceStatus[];
  filters: FiltersType;
  isLoading: boolean;
  isError: boolean;
}

// Define custom marker icon
const createMarkerIcon = (isActive: boolean) => {
  return L.divIcon({
    className: `city-marker ${isActive ? 'active' : ''}`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    html: `<div style="width: 14px; height: 14px; background-color: ${isActive ? '#FF9800' : '#1A73E8'}; border: 2px solid white; border-radius: 50%; transform: ${isActive ? 'scale(1.5)' : 'scale(1)'}; transition: transform 0.2s ease;"></div>`
  });
};

// Map position adjustment component
function MapAdjuster() {
  const map = useMap();
  
  useEffect(() => {
    map.setView([23.6345, -102.5528], 5); // Center on Mexico
    
    // Adjust map on resize
    const handleResize = () => {
      map.invalidateSize();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);
  
  return null;
}

export default function MapContainer({ cities, filters, isLoading, isError }: MapContainerProps) {
  const [selectedCity, setSelectedCity] = useState<CityWithDeviceStatus | null>(null);
  const [infoCardPosition, setInfoCardPosition] = useState({ x: 0, y: 0 });
  const mapRef = useRef<L.Map | null>(null);
  
  // When city is selected, fetch its devices
  const { data: cityDevices, isLoading: isLoadingDevices } = useQuery({
    queryKey: selectedCity ? ['/api/cities', selectedCity.id, 'devices'] : ['empty'],
    enabled: !!selectedCity
  });
  
  const handleCityClick = (city: CityWithDeviceStatus, e: L.LeafletMouseEvent) => {
    setSelectedCity(city);
    
    // Calculate position for info card
    // We want it to appear near the marker, but not on top of it
    const point = e.containerPoint;
    
    // Position it to the right if possible, otherwise to the left
    const mapWidth = mapRef.current?.getContainer().clientWidth || 0;
    const cardWidth = 280;
    
    let xPos = point.x + 20;
    if (xPos + cardWidth > mapWidth) {
      xPos = point.x - cardWidth - 20;
    }
    
    setInfoCardPosition({
      x: xPos,
      y: point.y - 20
    });
  };
  
  const handleCloseInfoCard = () => {
    setSelectedCity(null);
  };
  
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    // Check if the click was on a marker
    const target = e.originalEvent.target as HTMLElement;
    if (!target.closest('.city-marker')) {
      // Close info card if click was not on a marker
      setSelectedCity(null);
    }
  };
  
  // Filter cities based on filters
  const filteredCities = cities.filter(city => filters.cities[city.id]);
  
  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Error al cargar los datos del mapa. Por favor, intente de nuevo más tarde.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <main className="flex-1 relative">
      <div className="relative h-[calc(100vh-64px)]">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center bg-neutral-200">
            <div className="text-center">
              <span className="material-icons text-primary animate-spin text-4xl mb-2">sync</span>
              <p className="text-neutral-500">Cargando mapa...</p>
            </div>
          </div>
        ) : (
          <LeafletMapContainer
            center={[23.6345, -102.5528]} // Center of Mexico
            zoom={5}
            className="h-full w-full"
            ref={mapRef}
            onClick={handleMapClick}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {filteredCities.map((city) => (
              <Marker
                key={city.id}
                position={[parseFloat(city.latitude), parseFloat(city.longitude)]}
                icon={createMarkerIcon(selectedCity?.id === city.id)}
                eventHandlers={{
                  click: (e) => handleCityClick(city, e)
                }}
              />
            ))}
            
            <MapAdjuster />
          </LeafletMapContainer>
        )}
        
        {/* Info Card */}
        {selectedCity && (
          <InfoCard
            city={selectedCity}
            devices={cityDevices || []}
            position={infoCardPosition}
            onClose={handleCloseInfoCard}
            isLoading={isLoadingDevices}
            filters={filters}
          />
        )}
        
        {/* Map Controls */}
        <MapControls mapRef={mapRef} />
      </div>
    </main>
  );
}
