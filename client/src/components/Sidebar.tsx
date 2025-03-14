import { useEffect, useRef, useState } from "react";
import { DeviceType, DeviceStatus, CityWithDeviceStatus } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarProps {
  isOpen: boolean;
  cities: CityWithDeviceStatus[];
  filters: {
    cities: Record<number, boolean>;
    deviceTypes: Record<DeviceType, boolean>;
    deviceStatus: Record<DeviceStatus, boolean>;
  };
  updateCityFilter: (cityId: number, checked: boolean) => void;
  updateDeviceTypeFilter: (type: DeviceType, checked: boolean) => void;
  updateStatusFilter: (status: DeviceStatus, checked: boolean) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  isLoading: boolean;
  toggleSidebar?: () => void;
}

export default function Sidebar({
  isOpen,
  cities,
  filters,
  updateCityFilter,
  updateDeviceTypeFilter,
  updateStatusFilter,
  resetFilters,
  applyFilters,
  isLoading,
  toggleSidebar
}: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) && 
        window.innerWidth < 1024 && 
        isOpen
      ) {
        // We're clicking outside the sidebar on mobile while it's open
        // This would close the sidebar, but we should let the parent component handle it
        // This is handled in MapPage.tsx with the overlay click
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Show all cities or just a preview
  const [showAllCities, setShowAllCities] = useState(false);
  const displayedCities = showAllCities ? cities : cities.slice(0, 3);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`bg-white w-64 shadow-md transition-all duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative z-20 h-full overflow-y-auto`}
      >
        <div className="p-4">
          <h2 className="text-lg font-medium text-neutral-500 mb-4">Filtros</h2>
          
          {/* City filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">Ciudades</h3>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                {displayedCities.map((city) => (
                  <div key={city.id} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={`city-${city.id}`} 
                      className="rounded text-primary focus:ring-primary"
                      checked={filters.cities[city.id] || false}
                      onChange={(e) => updateCityFilter(city.id, e.target.checked)}
                    />
                    <label htmlFor={`city-${city.id}`} className="ml-2 text-sm text-neutral-500">
                      {city.name}
                    </label>
                  </div>
                ))}
                {cities.length > 3 && (
                  <button 
                    className="text-primary text-sm font-medium mt-1"
                    onClick={() => setShowAllCities(!showAllCities)}
                  >
                    {showAllCities ? "Mostrar menos" : "Ver todas"}
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Device type filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">Tipo de dispositivo</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="type-router" 
                  className="rounded text-primary focus:ring-primary"
                  checked={filters.deviceTypes.router || false}
                  onChange={(e) => updateDeviceTypeFilter('router', e.target.checked)}
                />
                <label htmlFor="type-router" className="ml-2 text-sm text-neutral-500">
                  Routers
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="type-sensor" 
                  className="rounded text-primary focus:ring-primary"
                  checked={filters.deviceTypes.sensor || false}
                  onChange={(e) => updateDeviceTypeFilter('sensor', e.target.checked)}
                />
                <label htmlFor="type-sensor" className="ml-2 text-sm text-neutral-500">
                  Sensores
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="type-camera" 
                  className="rounded text-primary focus:ring-primary"
                  checked={filters.deviceTypes.camera || false}
                  onChange={(e) => updateDeviceTypeFilter('camera', e.target.checked)} 
                />
                <label htmlFor="type-camera" className="ml-2 text-sm text-neutral-500">
                  Cámaras
                </label>
              </div>
            </div>
          </div>
          
          {/* Status filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">Estado</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="status-online" 
                  className="rounded text-primary focus:ring-primary"
                  checked={filters.deviceStatus.online || false}
                  onChange={(e) => updateStatusFilter('online', e.target.checked)}
                />
                <label htmlFor="status-online" className="ml-2 text-sm text-neutral-500 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-success mr-1"></span>
                  En línea
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="status-warning" 
                  className="rounded text-primary focus:ring-primary"
                  checked={filters.deviceStatus.warning || false}
                  onChange={(e) => updateStatusFilter('warning', e.target.checked)}
                />
                <label htmlFor="status-warning" className="ml-2 text-sm text-neutral-500 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-warning mr-1"></span>
                  Advertencia
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="status-offline" 
                  className="rounded text-primary focus:ring-primary"
                  checked={filters.deviceStatus.offline || false}
                  onChange={(e) => updateStatusFilter('offline', e.target.checked)}
                />
                <label htmlFor="status-offline" className="ml-2 text-sm text-neutral-500 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-error mr-1"></span>
                  Fuera de línea
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <button 
              onClick={applyFilters}
              className="w-full bg-primary text-white py-2 rounded-full font-medium shadow-sm hover:bg-blue-600 transition-colors"
            >
              Aplicar filtros
            </button>
            <button 
              onClick={resetFilters}
              className="w-full text-primary text-sm font-medium mt-2"
            >
              Restablecer
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

