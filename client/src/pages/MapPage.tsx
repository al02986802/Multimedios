import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MapContainer from "@/components/MapContainer";
import { DeviceType, DeviceStatus, CityWithDeviceStatus } from "@shared/schema";

export default function MapPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    cities: {} as Record<number, boolean>,
    deviceTypes: {
      router: true,
      sensor: true,
      camera: true
    } as Record<DeviceType, boolean>,
    deviceStatus: {
      online: true,
      warning: true,
      offline: false
    } as Record<DeviceStatus, boolean>
  });

  // Fetch cities from API
  const { data: cities, isLoading: isLoadingCities, isError: isCitiesError } = useQuery<CityWithDeviceStatus[]>({
    queryKey: ['/api/cities'],
  });

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Update filters
  const updateCityFilter = (cityId: number, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      cities: {
        ...prev.cities,
        [cityId]: checked
      }
    }));
  };

  const updateDeviceTypeFilter = (type: DeviceType, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      deviceTypes: {
        ...prev.deviceTypes,
        [type]: checked
      }
    }));
  };

  const updateStatusFilter = (status: DeviceStatus, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      deviceStatus: {
        ...prev.deviceStatus,
        [status]: checked
      }
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      cities: Object.fromEntries((Array.isArray(cities) ? cities : []).map(city => [city.id, true])),
      deviceTypes: {
        router: true,
        sensor: true,
        camera: true
      },
      deviceStatus: {
        online: true,
        warning: true,
        offline: false
      }
    });
  };

  // Apply all filters
  const applyFilters = () => {
    // This function is mainly for the UI, since we apply filters reactively
    console.log("Filters applied:", filters);
  };

  // Initialize city filters when data is loaded
  if (cities && Object.keys(filters.cities).length === 0) {
    setFilters(prev => ({
      ...prev,
      cities: Object.fromEntries((Array.isArray(cities) ? cities : []).map(city => [city.id, true]))
    }));
  }

  return (
    <div className="bg-neutral-100 flex flex-col h-screen">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar 
          isOpen={isSidebarOpen} 
          cities={Array.isArray(cities) ? cities : []} 
          filters={filters}
          updateCityFilter={updateCityFilter}
          updateDeviceTypeFilter={updateDeviceTypeFilter}
          updateStatusFilter={updateStatusFilter}
          resetFilters={resetFilters}
          applyFilters={applyFilters}
          isLoading={isLoadingCities}
          toggleSidebar={toggleSidebar}
        />
        
        <MapContainer 
          cities={Array.isArray(cities) ? cities : []} 
          filters={filters}
          isLoading={isLoadingCities}
          isError={isCitiesError}
        />
      </div>
    </div>
  );
}
