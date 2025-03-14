import { pgTable, text, serial, integer, boolean, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original user table - keeping as reference
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Cities table
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  state: text("state").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  deviceCount: integer("device_count").default(0),
});

// Device types enum
export const DeviceTypeEnum = z.enum([
  "router",
  "sensor",
  "camera"
]);

export type DeviceType = z.infer<typeof DeviceTypeEnum>;

// Device status enum
export const DeviceStatusEnum = z.enum([
  "online", 
  "warning", 
  "offline"
]);

export type DeviceStatus = z.infer<typeof DeviceStatusEnum>;

// Devices table
export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  deviceId: text("device_id").notNull().unique(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  cityId: integer("city_id").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  metadata: text("metadata").notNull(),
});

// City schemas
export const insertCitySchema = createInsertSchema(cities).omit({ id: true });
export type InsertCity = z.infer<typeof insertCitySchema>;
export type City = typeof cities.$inferSelect;

// Device schemas
export const insertDeviceSchema = createInsertSchema(devices).omit({ id: true });
export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Device = typeof devices.$inferSelect;

// For frontend use - city with device counts by status
export const cityWithDeviceStatusSchema = z.object({
  id: z.number(),
  name: z.string(),
  state: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  deviceCount: z.number(),
  onlineCount: z.number(),
  warningCount: z.number(),
  offlineCount: z.number(),
});

export type CityWithDeviceStatus = z.infer<typeof cityWithDeviceStatusSchema>;

// Device with city info for API response
export const deviceWithCitySchema = z.object({
  id: z.number(),
  name: z.string(),
  deviceId: z.string(),
  type: DeviceTypeEnum,
  status: DeviceStatusEnum,
  cityId: z.number(),
  cityName: z.string(),
  lastUpdated: z.string(),
  metadata: z.string(),
});

export type DeviceWithCity = z.infer<typeof deviceWithCitySchema>;

// For user schema - original schema from template
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
