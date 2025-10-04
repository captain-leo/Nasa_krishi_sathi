// NASA Data Types

export interface NASAPowerData {
  geometry: {
    coordinates: [number, number]
  }
  properties: {
    parameter: {
      T2M: number // Temperature at 2 meters
      PRECTOTCORR: number // Precipitation
      RH2M: number // Relative Humidity
      WS2M: number // Wind Speed
    }
  }
}

export interface NDVIData {
  date: string
  ndvi: number
  coordinates: [number, number]
}

export interface SoilMoistureData {
  date: string
  soilMoisture: number // Percentage
  coordinates: [number, number]
}

export interface SatelliteImagery {
  date: string
  imageUrl: string
  type: "RGB" | "NDVI" | "NDWI"
  coordinates: [number, number]
}
