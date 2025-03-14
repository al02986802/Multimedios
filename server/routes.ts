import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { DeviceStatusEnum, DeviceTypeEnum } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiPrefix = "/api";
  
  // Get all cities with device count info
  app.get(`${apiPrefix}/cities`, async (_req: Request, res: Response) => {
    try {
      const cities = await storage.getAllCities();
      return res.json(cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      return res.status(500).json({ message: "Failed to fetch cities" });
    }
  });
  
  // Get a specific city
  app.get(`${apiPrefix}/cities/:id`, async (req: Request, res: Response) => {
    try {
      const cityId = parseInt(req.params.id);
      if (isNaN(cityId)) {
        return res.status(400).json({ message: "Invalid city ID" });
      }
      
      const city = await storage.getCityById(cityId);
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      
      return res.json(city);
    } catch (error) {
      console.error("Error fetching city:", error);
      return res.status(500).json({ message: "Failed to fetch city" });
    }
  });
  
  // Get all devices
  app.get(`${apiPrefix}/devices`, async (_req: Request, res: Response) => {
    try {
      const devices = await storage.getAllDevices();
      return res.json(devices);
    } catch (error) {
      console.error("Error fetching devices:", error);
      return res.status(500).json({ message: "Failed to fetch devices" });
    }
  });
  
  // Get devices for a specific city
  app.get(`${apiPrefix}/cities/:id/devices`, async (req: Request, res: Response) => {
    try {
      const cityId = parseInt(req.params.id);
      if (isNaN(cityId)) {
        return res.status(400).json({ message: "Invalid city ID" });
      }
      
      const city = await storage.getCityById(cityId);
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      
      const devices = await storage.getDevicesByCity(cityId);
      return res.json(devices);
    } catch (error) {
      console.error("Error fetching city devices:", error);
      return res.status(500).json({ message: "Failed to fetch city devices" });
    }
  });
  
  // Get a specific device
  app.get(`${apiPrefix}/devices/:id`, async (req: Request, res: Response) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Invalid device ID" });
      }
      
      const device = await storage.getDeviceById(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      
      return res.json(device);
    } catch (error) {
      console.error("Error fetching device:", error);
      return res.status(500).json({ message: "Failed to fetch device" });
    }
  });
  
  // Update device status
  app.patch(`${apiPrefix}/devices/:id/status`, async (req: Request, res: Response) => {
    try {
      const deviceId = parseInt(req.params.id);
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Invalid device ID" });
      }
      
      const { status } = req.body;
      
      // Validate status
      if (!status || !DeviceStatusEnum.safeParse(status).success) {
        return res.status(400).json({ 
          message: "Invalid status. Must be one of: online, warning, offline" 
        });
      }
      
      const updatedDevice = await storage.updateDeviceStatus(deviceId, status);
      if (!updatedDevice) {
        return res.status(404).json({ message: "Device not found" });
      }
      
      return res.json(updatedDevice);
    } catch (error) {
      console.error("Error updating device status:", error);
      return res.status(500).json({ message: "Failed to update device status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
