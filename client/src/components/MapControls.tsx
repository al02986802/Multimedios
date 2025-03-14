import { RefObject } from 'react';
import L from 'leaflet';

interface MapControlsProps {
  mapRef: RefObject<L.Map | null>;
}

export default function MapControls({ mapRef }: MapControlsProps) {
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };
  
  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };
  
  const handleCenterOnMexico = () => {
    if (mapRef.current) {
      mapRef.current.setView([23.6345, -102.5528], 5);
    }
  };
  
  return (
    <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
      <button 
        className="bg-white p-2 rounded-full shadow-md hover:bg-neutral-100"
        onClick={handleZoomIn}
        aria-label="Zoom In"
      >
        <span className="material-icons text-neutral-500">add</span>
      </button>
      <button 
        className="bg-white p-2 rounded-full shadow-md hover:bg-neutral-100"
        onClick={handleZoomOut}
        aria-label="Zoom Out"
      >
        <span className="material-icons text-neutral-500">remove</span>
      </button>
      <button 
        className="bg-white p-2 rounded-full shadow-md hover:bg-neutral-100"
        onClick={handleCenterOnMexico}
        aria-label="Center Map"
      >
        <span className="material-icons text-neutral-500">my_location</span>
      </button>
    </div>
  );
}
