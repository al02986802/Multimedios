// This file contains helper functions for map data manipulation

// Helper function to format time difference from now
export function formatTimeDifference(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  
  if (diffMin < 1) {
    return 'justo ahora';
  } else if (diffMin < 60) {
    return `${diffMin}m`;
  } else if (diffMin < 1440) {
    const hours = Math.floor(diffMin / 60);
    return `${hours}h`;
  } else {
    const days = Math.floor(diffMin / 1440);
    return `${days}d`;
  }
}

// Helper function to get device icon based on type
export function getDeviceIcon(type: string): string {
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

// Helper function to get status color
export function getStatusColor(status: string): string {
  switch (status) {
    case 'online':
      return '#34A853'; // success
    case 'warning':
      return '#FBBC04'; // warning
    case 'offline':
      return '#EA4335'; // error
    default:
      return '#5F6368'; // neutral
  }
}

// Helper function to get status text
export function getStatusText(status: string): string {
  switch (status) {
    case 'online':
      return 'En línea';
    case 'warning':
      return 'Advertencia';
    case 'offline':
      return 'Fuera de línea';
    default:
      return 'Desconocido';
  }
}
