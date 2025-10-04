-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  state TEXT,
  district TEXT,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Farms table
CREATE TABLE IF NOT EXISTS public.farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  area_hectares DECIMAL(10, 2),
  soil_type TEXT,
  state TEXT,
  district TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own farms"
  ON public.farms FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own farms"
  ON public.farms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own farms"
  ON public.farms FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own farms"
  ON public.farms FOR DELETE
  USING (auth.uid() = user_id);

-- Crop types reference table
CREATE TABLE IF NOT EXISTS public.crop_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  growth_stages JSONB NOT NULL,
  environmental_requirements JSONB NOT NULL,
  resource_consumption JSONB NOT NULL,
  yield_metrics JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- No RLS needed - this is reference data, publicly readable
ALTER TABLE public.crop_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view crop types"
  ON public.crop_types FOR SELECT
  TO authenticated
  USING (true);

-- Farm crops (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.farm_crops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  crop_type_id TEXT NOT NULL REFERENCES public.crop_types(id),
  planting_date DATE NOT NULL,
  expected_harvest_date DATE,
  area_hectares DECIMAL(10, 2),
  current_stage TEXT,
  status TEXT DEFAULT 'active', -- active, harvested, failed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.farm_crops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own farm crops"
  ON public.farm_crops FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = farm_crops.farm_id
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own farm crops"
  ON public.farm_crops FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = farm_crops.farm_id
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own farm crops"
  ON public.farm_crops FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = farm_crops.farm_id
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own farm crops"
  ON public.farm_crops FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = farm_crops.farm_id
      AND farms.user_id = auth.uid()
    )
  );

-- Crop monitoring data
CREATE TABLE IF NOT EXISTS public.crop_monitoring (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_crop_id UUID NOT NULL REFERENCES public.farm_crops(id) ON DELETE CASCADE,
  monitoring_date DATE NOT NULL,
  ndvi_value DECIMAL(5, 3), -- Normalized Difference Vegetation Index
  soil_moisture DECIMAL(5, 2), -- Percentage
  temperature_celsius DECIMAL(5, 2),
  rainfall_mm DECIMAL(7, 2),
  health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
  notes TEXT,
  satellite_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.crop_monitoring ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own crop monitoring"
  ON public.crop_monitoring FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farm_crops
      JOIN public.farms ON farms.id = farm_crops.farm_id
      WHERE farm_crops.id = crop_monitoring.farm_crop_id
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own crop monitoring"
  ON public.crop_monitoring FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farm_crops
      JOIN public.farms ON farms.id = farm_crops.farm_id
      WHERE farm_crops.id = crop_monitoring.farm_crop_id
      AND farms.user_id = auth.uid()
    )
  );

-- Weather data
CREATE TABLE IF NOT EXISTS public.weather_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  temperature_min DECIMAL(5, 2),
  temperature_max DECIMAL(5, 2),
  humidity DECIMAL(5, 2),
  rainfall_mm DECIMAL(7, 2),
  wind_speed DECIMAL(5, 2),
  aqi INTEGER, -- Air Quality Index
  weather_condition TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(farm_id, date)
);

ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weather data"
  ON public.weather_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = weather_data.farm_id
      AND farms.user_id = auth.uid()
    )
  );

-- MRV (Monitoring, Reporting, Verification) Reports
CREATE TABLE IF NOT EXISTS public.mrv_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  report_type TEXT NOT NULL, -- monthly, seasonal, annual
  total_water_used DECIMAL(10, 2), -- in liters
  total_fertilizer_used DECIMAL(10, 2), -- in kg
  carbon_footprint DECIMAL(10, 2), -- in kg CO2
  sustainability_score INTEGER CHECK (sustainability_score >= 0 AND sustainability_score <= 100),
  yield_data JSONB,
  recommendations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mrv_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own MRV reports"
  ON public.mrv_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = mrv_reports.farm_id
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own MRV reports"
  ON public.mrv_reports FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms
      WHERE farms.id = mrv_reports.farm_id
      AND farms.user_id = auth.uid()
    )
  );

-- Irrigation events
CREATE TABLE IF NOT EXISTS public.irrigation_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_crop_id UUID NOT NULL REFERENCES public.farm_crops(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  water_amount_liters DECIMAL(10, 2),
  method TEXT, -- flood, drip, sprinkler
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.irrigation_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own irrigation events"
  ON public.irrigation_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farm_crops
      JOIN public.farms ON farms.id = farm_crops.farm_id
      WHERE farm_crops.id = irrigation_events.farm_crop_id
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own irrigation events"
  ON public.irrigation_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farm_crops
      JOIN public.farms ON farms.id = farm_crops.farm_id
      WHERE farm_crops.id = irrigation_events.farm_crop_id
      AND farms.user_id = auth.uid()
    )
  );

-- Fertilizer applications
CREATE TABLE IF NOT EXISTS public.fertilizer_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_crop_id UUID NOT NULL REFERENCES public.farm_crops(id) ON DELETE CASCADE,
  application_date DATE NOT NULL,
  fertilizer_type TEXT NOT NULL,
  amount_kg DECIMAL(10, 2),
  npk_ratio TEXT, -- e.g., "10-26-26"
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.fertilizer_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own fertilizer applications"
  ON public.fertilizer_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farm_crops
      JOIN public.farms ON farms.id = farm_crops.farm_id
      WHERE farm_crops.id = fertilizer_applications.farm_crop_id
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own fertilizer applications"
  ON public.fertilizer_applications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farm_crops
      JOIN public.farms ON farms.id = farm_crops.farm_id
      WHERE farm_crops.id = fertilizer_applications.farm_crop_id
      AND farms.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_farms_user_id ON public.farms(user_id);
CREATE INDEX idx_farm_crops_farm_id ON public.farm_crops(farm_id);
CREATE INDEX idx_crop_monitoring_farm_crop_id ON public.crop_monitoring(farm_crop_id);
CREATE INDEX idx_weather_data_farm_id ON public.weather_data(farm_id);
CREATE INDEX idx_mrv_reports_farm_id ON public.mrv_reports(farm_id);
CREATE INDEX idx_irrigation_events_farm_crop_id ON public.irrigation_events(farm_crop_id);
CREATE INDEX idx_fertilizer_applications_farm_crop_id ON public.fertilizer_applications(farm_crop_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON public.farms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_farm_crops_updated_at BEFORE UPDATE ON public.farm_crops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
