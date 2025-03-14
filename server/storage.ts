import { 
  users, type User, type InsertUser,
  cities, type City, type InsertCity,
  devices, type Device, type InsertDevice,
  type CityWithDeviceStatus,
  type DeviceWithCity,
  DeviceTypeEnum, DeviceStatusEnum
} from "@shared/schema";

export interface IStorage {
  // User methods (from template)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // City methods
  getAllCities(): Promise<CityWithDeviceStatus[]>;
  getCityById(id: number): Promise<CityWithDeviceStatus | undefined>;
  createCity(city: InsertCity): Promise<City>;
  
  // Device methods
  getAllDevices(): Promise<DeviceWithCity[]>;
  getDevicesByCity(cityId: number): Promise<DeviceWithCity[]>;
  getDeviceById(id: number): Promise<DeviceWithCity | undefined>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDeviceStatus(id: number, status: string): Promise<Device | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cities: Map<number, City>;
  private devices: Map<number, Device>;
  private currentUserId: number;
  private currentCityId: number;
  private currentDeviceId: number;

  constructor() {
    this.users = new Map();
    this.cities = new Map();
    this.devices = new Map();
    this.currentUserId = 1;
    this.currentCityId = 1;
    this.currentDeviceId = 1;
    
    // Initialize with default cities for Mexico
    this.initializeCities();
    this.initializeDevices();
  }

  // User methods (from template)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // City methods
  async getAllCities(): Promise<CityWithDeviceStatus[]> {
    return Array.from(this.cities.values()).map(city => {
      const cityDevices = Array.from(this.devices.values())
        .filter(device => device.cityId === city.id);
      
      const onlineCount = cityDevices.filter(device => device.status === 'online').length;
      const warningCount = cityDevices.filter(device => device.status === 'warning').length;
      const offlineCount = cityDevices.filter(device => device.status === 'offline').length;
      
      return {
        ...city,
        deviceCount: cityDevices.length,
        onlineCount,
        warningCount,
        offlineCount
      };
    });
  }
  
  async getCityById(id: number): Promise<CityWithDeviceStatus | undefined> {
    const city = this.cities.get(id);
    if (!city) return undefined;
    
    const cityDevices = Array.from(this.devices.values())
      .filter(device => device.cityId === city.id);
    
    const onlineCount = cityDevices.filter(device => device.status === 'online').length;
    const warningCount = cityDevices.filter(device => device.status === 'warning').length;
    const offlineCount = cityDevices.filter(device => device.status === 'offline').length;
    
    return {
      ...city,
      deviceCount: cityDevices.length,
      onlineCount,
      warningCount,
      offlineCount
    };
  }
  
  async createCity(insertCity: InsertCity): Promise<City> {
    const id = this.currentCityId++;
    const city: City = { ...insertCity, id };
    this.cities.set(id, city);
    return city;
  }
  
  // Device methods
  async getAllDevices(): Promise<DeviceWithCity[]> {
    return Array.from(this.devices.values()).map(device => {
      const city = this.cities.get(device.cityId);
      return {
        ...device,
        cityName: city?.name || 'Unknown City',
        lastUpdated: device.lastUpdated.toISOString(),
        type: device.type as any,
        status: device.status as any
      };
    });
  }
  
  async getDevicesByCity(cityId: number): Promise<DeviceWithCity[]> {
    const cityDevices = Array.from(this.devices.values())
      .filter(device => device.cityId === cityId);
    
    const city = this.cities.get(cityId);
    
    return cityDevices.map(device => ({
      ...device,
      cityName: city?.name || 'Unknown City',
      lastUpdated: device.lastUpdated.toISOString(),
      type: device.type as any,
      status: device.status as any
    }));
  }
  
  async getDeviceById(id: number): Promise<DeviceWithCity | undefined> {
    const device = this.devices.get(id);
    if (!device) return undefined;
    
    const city = this.cities.get(device.cityId);
    
    return {
      ...device,
      cityName: city?.name || 'Unknown City',
      lastUpdated: device.lastUpdated.toISOString(),
      type: device.type as any,
      status: device.status as any
    };
  }
  
  async createDevice(insertDevice: InsertDevice): Promise<Device> {
    const id = this.currentDeviceId++;
    const device: Device = { ...insertDevice, id };
    this.devices.set(id, device);
    return device;
  }
  
  async updateDeviceStatus(id: number, status: string): Promise<Device | undefined> {
    const device = this.devices.get(id);
    if (!device) return undefined;
    
    const updatedDevice = { ...device, status, lastUpdated: new Date() };
    this.devices.set(id, updatedDevice);
    return updatedDevice;
  }
  
  // Initialize cities based on the required city list
  private initializeCities() {
    const citiesData: InsertCity[] = [
      { name: "Monterrey", state: "Nuevo León", latitude: "25.6866", longitude: "-100.3161", deviceCount: 0 },
      { name: "Ciudad de México", state: "CDMX", latitude: "19.4326", longitude: "-99.1332", deviceCount: 0 },
      { name: "Guadalajara", state: "Jalisco", latitude: "20.6597", longitude: "-103.3496", deviceCount: 0 },
      { name: "Puebla", state: "Puebla", latitude: "19.0414", longitude: "-98.2063", deviceCount: 0 },
      { name: "León", state: "Guanajuato", latitude: "21.1167", longitude: "-101.6833", deviceCount: 0 },
      { name: "Torreón", state: "Coahuila", latitude: "25.5383", longitude: "-103.4526", deviceCount: 0 },
      { name: "Ciudad Juárez", state: "Chihuahua", latitude: "31.6904", longitude: "-106.4245", deviceCount: 0 },
      { name: "Tampico", state: "Tamaulipas", latitude: "22.2553", longitude: "-97.8686", deviceCount: 0 },
      { name: "Nuevo Laredo", state: "Tamaulipas", latitude: "27.4769", longitude: "-99.5424", deviceCount: 0 },
      { name: "Saltillo", state: "Coahuila", latitude: "25.4321", longitude: "-101.0053", deviceCount: 0 },
      { name: "Ciudad Victoria", state: "Tamaulipas", latitude: "23.7369", longitude: "-99.1411", deviceCount: 0 },
      { name: "Reynosa", state: "Tamaulipas", latitude: "26.0920", longitude: "-98.2852", deviceCount: 0 },
      { name: "Durango", state: "Durango", latitude: "24.0277", longitude: "-104.6532", deviceCount: 0 }
    ];
    
    citiesData.forEach(city => {
      const id = this.currentCityId++;
      this.cities.set(id, { ...city, id });
    });
  }
  
  // Initialize devices with random data for demo
  private initializeDevices() {
    // Device types and prefixes
    const deviceTypes = [
      { type: 'router', prefix: 'RT', names: ['Router XR-2000', 'Router CR-1500', 'Router WR-3000'] },
      { type: 'sensor', prefix: 'ST', names: ['Sensor Temp. PT-100', 'Sensor Hum. SH-200', 'Sensor Pres. SP-500'] },
      { type: 'camera', prefix: 'CM', names: ['Cámara IP HD', 'Cámara Domo 360', 'Cámara Térmica'] }
    ];
    
    // Status distribution
    const statuses = ['online', 'online', 'online', 'warning', 'offline'];
    
    // Create 3-5 devices for each city
    for (const [cityId, city] of this.cities.entries()) {
      const numDevices = 3 + Math.floor(Math.random() * 3); // 3 to 5 devices
      const cityPrefix = city.name.substring(0, 3).toUpperCase();
      
      for (let i = 0; i < numDevices; i++) {
        // Pick random device type
        const deviceTypeIndex = Math.floor(Math.random() * deviceTypes.length);
        const deviceType = deviceTypes[deviceTypeIndex];
        
        // Pick random name from the type
        const nameIndex = Math.floor(Math.random() * deviceType.names.length);
        const deviceName = deviceType.names[nameIndex];
        
        // Generate device ID
        const deviceNumber = String(i + 1).padStart(3, '0');
        const deviceId = `${cityPrefix}-${deviceType.prefix}-${deviceNumber}`;
        
        // Pick random status (weighted towards online)
        const statusIndex = Math.floor(Math.random() * statuses.length);
        const status = statuses[statusIndex];
        
        // Generate metadata based on device type
        let metadata = '';
        if (deviceType.type === 'router') {
          const traffic = (Math.random() * 2).toFixed(1);
          metadata = JSON.stringify({ traffic: `${traffic} GB/h` });
        } else if (deviceType.type === 'sensor') {
          const value = (Math.random() * 20 + 20).toFixed(1);
          metadata = JSON.stringify({ value: `${value}°C` });
        } else if (deviceType.type === 'camera') {
          metadata = JSON.stringify({ state: 'Grabando' });
        }
        
        // Create last updated time (within the last hour)
        const lastUpdated = new Date();
        lastUpdated.setMinutes(lastUpdated.getMinutes() - Math.floor(Math.random() * 60));
        
        // Create device
        const device: Device = {
          id: this.currentDeviceId++,
          name: deviceName,
          deviceId,
          type: deviceType.type,
          status,
          cityId,
          lastUpdated,
          metadata
        };
        
        this.devices.set(device.id, device);
      }
    }
  }
}

export const storage = new MemStorage();
