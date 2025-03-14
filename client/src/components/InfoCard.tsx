import { useState, useEffect } from 'react';
import { CityWithDeviceStatus, DeviceWithCity, DeviceType, DeviceStatus } from '@shared/schema';
import { Skeleton } from "@/components/ui/skeleton";

interface InfoCardProps {
  city: CityWithDeviceStatus;
  devices: DeviceWithCity[];
  position: { x: number; y: number };
  onClose: () => void;
  isLoading: boolean;
  filters: {
    cities: Record<number, boolean>;
    deviceTypes: Record<DeviceType, boolean>;
    deviceStatus: Record<DeviceStatus, boolean>;
  };
}

// Helper function to format time difference
function formatTimeDiff(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  
  if (diffMin < 60) {
    return `${diffMin}m`;
  } else if (diffMin < 1440) {
    return `${Math.floor(diffMin / 60)}h`;
  } else {
    return `${Math.floor(diffMin / 1440)}d`;
  }
}

// Helper function to get icon for device type
function getDeviceIcon(type: string, status: string): string {
  if (status === 'offline') {
    return 'power_off';
  }
  
  switch (type) {
    case 'router':
      return 'wifi';
    case 'sensor':
      return 'thermostat';
    case 'camera':
      return 'videocam';
    default:
      return 'devices';
  }
}

// Helper function to get status color class
function getStatusColorClass(status: string): string {
  switch (status) {
    case 'online':
      return 'text-success';
    case 'warning':
      return 'text-warning';
    case 'offline':
      return 'text-error';
    default:
      return 'text-neutral-400';
  }
}

export default function InfoCard({ city, devices, position, onClose, isLoading, filters }: InfoCardProps) {
  // Show all devices or just preview
  const [showAll, setShowAll] = useState(false);
  
  // Apply filters to devices
  const filteredDevices = devices.filter(device => 
    filters.deviceTypes[device.type as DeviceType] && 
    filters.deviceStatus[device.status as DeviceStatus]
  );
  
  // Calculate device counts by status
  const onlineCount = filteredDevices.filter(d => d.status === 'online').length;
  const warningCount = filteredDevices.filter(d => d.status === 'warning').length;
  const offlineCount = filteredDevices.filter(d => d.status === 'offline').length;
  
  // Limit displayed devices to 3 unless showAll is true
  const displayedDevices = showAll ? filteredDevices : filteredDevices.slice(0, 3);

  // Card style based on position
  const cardStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`
  };

  return (
    <div 
      className="info-card absolute bg-white rounded-lg shadow-lg overflow-hidden z-50"
      style={cardStyle}
    >
      <div className="bg-primary text-white px-4 py-3 flex justify-between items-center">
        <h3 className="font-medium text-lg">{city.name}</h3>
        <button 
          onClick={onClose}
          className="text-white hover:bg-blue-600 rounded-full p-1"
          aria-label="Close"
        >
          <span className="material-icons">close</span>
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm text-neutral-500">Dispositivos totales:</p>
          <p className="font-medium">{filteredDevices.length}</p>
        </div>
        
        <div className="flex justify-between mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-success"></span>
              <span className="ml-1 font-medium">{onlineCount}</span>
            </div>
            <p className="text-xs text-neutral-400">Activos</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-warning"></span>
              <span className="ml-1 font-medium">{warningCount}</span>
            </div>
            <p className="text-xs text-neutral-400">Advertencia</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-error"></span>
              <span className="ml-1 font-medium">{offlineCount}</span>
            </div>
            <p className="text-xs text-neutral-400">Inactivos</p>
          </div>
        </div>
        
        <h4 className="font-medium text-neutral-500 mb-2">Dispositivos recientes</h4>
        
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="text-center py-4 text-neutral-400">
            <span className="material-icons text-3xl mb-2">devices_off</span>
            <p>No hay dispositivos que coincidan con los filtros seleccionados.</p>
          </div>
        ) : (
          <>
            {displayedDevices.map((device) => {
              // Parse metadata JSON
              let metadata: { [key: string]: string } = {};
              try {
                metadata = JSON.parse(device.metadata);
              } catch (e) {
                console.error("Error parsing device metadata:", e);
              }
              
              // Format last updated time
              const lastUpdated = formatTimeDiff(device.lastUpdated);
              
              // Get metadata display info
              let metadataDisplay = "";
              if (device.type === 'router' && metadata.traffic) {
                metadataDisplay = `Tráfico: ${metadata.traffic}`;
              } else if (device.type === 'sensor' && metadata.value) {
                metadataDisplay = `Valor: ${metadata.value}`;
              } else if (device.type === 'camera' && metadata.state) {
                metadataDisplay = `Estado: ${metadata.state}`;
              }
              
              return (
                <div key={device.id} className="bg-neutral-100 rounded-md p-3 mb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-neutral-500">{device.name}</p>
                      <p className="text-xs text-neutral-400">ID: {device.deviceId}</p>
                    </div>
                    <span className={`material-icons ${getStatusColorClass(device.status)}`}>
                      {getDeviceIcon(device.type, device.status)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-neutral-400">
                    <span>Última actualización: {lastUpdated}</span>
                    <span>{metadataDisplay}</span>
                  </div>
                </div>
              );
            })}
            
            {filteredDevices.length > 3 && (
              <button 
                className="w-full mt-3 py-2 rounded-md border border-primary text-primary font-medium hover:bg-blue-50 transition-colors"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Mostrar menos" : "Ver todos los dispositivos"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
