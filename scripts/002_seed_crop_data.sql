-- Seed crop types data from NASA Farm Navigators
INSERT INTO public.crop_types (id, name, growth_stages, environmental_requirements, resource_consumption, yield_metrics) VALUES
('wheat', 'Wheat', 
  '[
    {"stage": "Planting", "durationDays": 10, "description": "Sowing seeds in prepared soil."},
    {"stage": "Germination", "durationDays": 7, "description": "Seed sprouts and emerges."},
    {"stage": "Tillering", "durationDays": 20, "description": "Formation of additional shoots from the base."},
    {"stage": "Stem Elongation", "durationDays": 15, "description": "Main stem grows taller."},
    {"stage": "Booting", "durationDays": 10, "description": "Flag leaf emerges, head forms within the sheath."},
    {"stage": "Heading", "durationDays": 7, "description": "Head emerges from the boot."},
    {"stage": "Flowering (Anthesis)", "durationDays": 5, "description": "Pollen sheds, fertilization occurs."},
    {"stage": "Grain Filling", "durationDays": 30, "description": "Grains develop and fill with starch."},
    {"stage": "Ripening", "durationDays": 10, "description": "Grains harden and dry."},
    {"stage": "Harvest", "durationDays": 3, "description": "Collection of mature grains."}
  ]'::jsonb,
  '{"temperatureRangeCelsius": "15-25", "rainfallMM": "300-900 annually", "soilType": "Loamy to clayey soils", "phRange": "6.0-7.0"}'::jsonb,
  '{"waterDemand": "Medium", "fertilizerDemand": "Medium"}'::jsonb,
  '{"averageYieldKgPerHectare": 4000}'::jsonb
),
('paddy', 'Paddy (Rice)', 
  '[
    {"stage": "Nursery Preparation", "durationDays": 20, "description": "Raising seedlings in a small plot."},
    {"stage": "Transplanting", "durationDays": 7, "description": "Moving seedlings to the main field."},
    {"stage": "Tillering", "durationDays": 25, "description": "Production of new shoots."},
    {"stage": "Panicle Initiation", "durationDays": 10, "description": "Formation of the flower cluster."},
    {"stage": "Booting", "durationDays": 10, "description": "Panicle develops inside the flag leaf sheath."},
    {"stage": "Heading", "durationDays": 7, "description": "Panicle emerges from the flag leaf."},
    {"stage": "Flowering (Anthesis)", "durationDays": 5, "description": "Pollen sheds, fertilization occurs."},
    {"stage": "Grain Filling", "durationDays": 25, "description": "Grains develop and fill."},
    {"stage": "Ripening", "durationDays": 15, "description": "Grains harden and dry."},
    {"stage": "Harvest", "durationDays": 5, "description": "Collection of mature grains."}
  ]'::jsonb,
  '{"temperatureRangeCelsius": "20-35", "rainfallMM": "1000-1500 annually", "soilType": "Clayey to loamy soils, requires standing water", "phRange": "5.0-7.0"}'::jsonb,
  '{"waterDemand": "High", "fertilizerDemand": "Medium-High"}'::jsonb,
  '{"averageYieldKgPerHectare": 6000}'::jsonb
),
('corn', 'Corn (Maize)', 
  '[
    {"stage": "Planting", "durationDays": 5, "description": "Sowing seeds."},
    {"stage": "Emergence (VE)", "durationDays": 7, "description": "Seedling emerges."},
    {"stage": "V1-Vn (Vegetative Stages)", "durationDays": 40, "description": "Leaf collar development."},
    {"stage": "Tasseling (VT)", "durationDays": 5, "description": "Male flowers (tassel) emerge."},
    {"stage": "Silking (R1)", "durationDays": 5, "description": "Female flowers (silks) emerge."},
    {"stage": "Blister (R2)", "durationDays": 10, "description": "Kernels are white, fluid-filled."},
    {"stage": "Milk (R3)", "durationDays": 10, "description": "Kernels yellow, milky fluid."},
    {"stage": "Dough (R4)", "durationDays": 10, "description": "Kernels firm, dough-like consistency."},
    {"stage": "Dent (R5)", "durationDays": 10, "description": "Kernels dented."},
    {"stage": "Physiological Maturity (R6)", "durationDays": 7, "description": "Black layer forms, maximum dry weight."},
    {"stage": "Harvest", "durationDays": 5, "description": "Collection of dried kernels."}
  ]'::jsonb,
  '{"temperatureRangeCelsius": "20-30", "rainfallMM": "600-1200 annually", "soilType": "Deep, well-drained loamy soils", "phRange": "6.0-7.0"}'::jsonb,
  '{"waterDemand": "Medium-High", "fertilizerDemand": "High"}'::jsonb,
  '{"averageYieldKgPerHectare": 8000}'::jsonb
),
('soybean', 'Soybean', 
  '[
    {"stage": "Planting", "durationDays": 5, "description": "Sowing seeds."},
    {"stage": "Emergence (VE)", "durationDays": 7, "description": "Seedling emerges."},
    {"stage": "VC-Vn (Vegetative Stages)", "durationDays": 30, "description": "Cotyledon to node development."},
    {"stage": "Beginning Bloom (R1)", "durationDays": 10, "description": "First open flower."},
    {"stage": "Full Bloom (R2)", "durationDays": 7, "description": "Open flower at one of the two uppermost nodes."},
    {"stage": "Beginning Pod (R3)", "durationDays": 7, "description": "Pod 5 mm long at one of the four uppermost nodes."},
    {"stage": "Full Pod (R4)", "durationDays": 7, "description": "Pod 2 cm long at one of the four uppermost nodes."},
    {"stage": "Beginning Seed (R5)", "durationDays": 10, "description": "Seed 3 mm long in a pod at one of the four uppermost nodes."},
    {"stage": "Full Seed (R6)", "durationDays": 10, "description": "Pod containing green seeds filling the cavity."},
    {"stage": "Beginning Maturity (R7)", "durationDays": 10, "description": "One normal pod has reached its mature color."},
    {"stage": "Full Maturity (R8)", "durationDays": 7, "description": "95% of pods have reached their mature color."},
    {"stage": "Harvest", "durationDays": 5, "description": "Collection of dried pods."}
  ]'::jsonb,
  '{"temperatureRangeCelsius": "20-30", "rainfallMM": "400-800 annually", "soilType": "Well-drained loamy soils", "phRange": "6.0-7.0"}'::jsonb,
  '{"waterDemand": "Medium", "fertilizerDemand": "Low-Medium (nitrogen fixation)"}'::jsonb,
  '{"averageYieldKgPerHectare": 3000}'::jsonb
),
('cotton', 'Cotton', 
  '[
    {"stage": "Planting", "durationDays": 7, "description": "Sowing seeds."},
    {"stage": "Emergence", "durationDays": 7, "description": "Seedling emerges."},
    {"stage": "Squaring", "durationDays": 30, "description": "Formation of flower buds (squares)."},
    {"stage": "Flowering", "durationDays": 40, "description": "Flowers open, pollination."},
    {"stage": "Boll Development", "durationDays": 60, "description": "Bolls (fruit) grow and fiber develops."},
    {"stage": "Boll Opening", "durationDays": 30, "description": "Bolls crack open, exposing lint."},
    {"stage": "Harvest", "durationDays": 30, "description": "Collection of lint (often multiple picks)."}
  ]'::jsonb,
  '{"temperatureRangeCelsius": "25-35", "rainfallMM": "600-1200 annually", "soilType": "Deep, well-drained loamy to clayey soils", "phRange": "5.8-8.0"}'::jsonb,
  '{"waterDemand": "High", "fertilizerDemand": "High"}'::jsonb,
  '{"averageYieldKgPerHectare": 1500}'::jsonb
),
('sugarcane', 'Sugarcane', 
  '[
    {"stage": "Planting", "durationDays": 10, "description": "Planting setts (stem cuttings)."},
    {"stage": "Germination/Sprouting", "durationDays": 30, "description": "Shoots emerge from setts."},
    {"stage": "Tillering", "durationDays": 60, "description": "Formation of multiple stalks."},
    {"stage": "Grand Growth", "durationDays": 150, "description": "Rapid elongation of stalks."},
    {"stage": "Ripening/Maturation", "durationDays": 90, "description": "Sugar accumulation in stalks."},
    {"stage": "Harvest", "durationDays": 30, "description": "Cutting and collecting stalks."}
  ]'::jsonb,
  '{"temperatureRangeCelsius": "20-30", "rainfallMM": "1100-1500 annually", "soilType": "Deep, well-drained fertile soils", "phRange": "6.0-7.0"}'::jsonb,
  '{"waterDemand": "Very High", "fertilizerDemand": "High"}'::jsonb,
  '{"averageYieldKgPerHectare": 70000}'::jsonb
),
('potato', 'Potato', 
  '[
    {"stage": "Planting", "durationDays": 7, "description": "Planting seed potatoes."},
    {"stage": "Sprouting", "durationDays": 15, "description": "Shoots emerge from the ground."},
    {"stage": "Vegetative Growth", "durationDays": 30, "description": "Rapid leaf and stem development."},
    {"stage": "Tuber Initiation", "durationDays": 15, "description": "Small tubers begin to form."},
    {"stage": "Tuber Bulking", "durationDays": 40, "description": "Tubers grow and accumulate starch."},
    {"stage": "Maturity", "durationDays": 15, "description": "Foliage begins to yellow and die back."},
    {"stage": "Harvest", "durationDays": 10, "description": "Digging up mature tubers."}
  ]'::jsonb,
  '{"temperatureRangeCelsius": "15-20", "rainfallMM": "500-800 annually", "soilType": "Loose, well-drained sandy loams", "phRange": "5.0-6.0"}'::jsonb,
  '{"waterDemand": "High", "fertilizerDemand": "High"}'::jsonb,
  '{"averageYieldKgPerHectare": 25000}'::jsonb
),
('tomato', 'Tomato', 
  '[
    {"stage": "Seed Sowing", "durationDays": 7, "description": "Planting seeds in trays."},
    {"stage": "Germination", "durationDays": 7, "description": "Seedlings emerge."},
    {"stage": "Transplanting", "durationDays": 7, "description": "Moving seedlings to garden/field."},
    {"stage": "Vegetative Growth", "durationDays": 30, "description": "Plant grows larger, produces leaves."},
    {"stage": "Flowering", "durationDays": 20, "description": "Flowers appear."},
    {"stage": "Fruit Set", "durationDays": 15, "description": "Small fruits begin to form."},
    {"stage": "Fruit Development", "durationDays": 30, "description": "Fruits grow and ripen."},
    {"stage": "Harvest", "durationDays": 60, "description": "Picking ripe tomatoes (continuous)."}
  ]'::jsonb,
  '{"temperatureRangeCelsius": "20-27", "rainfallMM": "400-600 annually", "soilType": "Well-drained, fertile loamy soils", "phRange": "6.0-6.8"}'::jsonb,
  '{"waterDemand": "High", "fertilizerDemand": "Medium-High"}'::jsonb,
  '{"averageYieldKgPerHectare": 40000}'::jsonb
),
('millet', 'Millet', 
  '[
    {"stage": "Planting", "durationDays": 5, "description": "Sowing seeds."},
    {"stage": "Emergence", "durationDays": 7, "description": "Seedling emerges."},
    {"stage": "Tillering", "durationDays": 20, "description": "Formation of side shoots."},
    {"stage": "Panicle Initiation", "durationDays": 10, "description": "Formation of the flower cluster."},
    {"stage": "Heading", "durationDays": 7, "description": "Panicle emerges."},
    {"stage": "Flowering (Anthesis)", "durationDays": 5, "description": "Pollen sheds."},
    {"stage": "Grain Filling", "durationDays": 25, "description": "Grains develop."},
    {"stage": "Ripening", "durationDays": 10, "description": "Grains harden and dry."},
    {"stage": "Harvest", "durationDays": 5, "description": "Collection of mature grains."}
  ]'::jsonb,
  '{"temperatureRangeCelsius": "25-35", "rainfallMM": "300-600 annually", "soilType": "Sandy to loamy soils, tolerant to poor soils", "phRange": "5.5-7.5"}'::jsonb,
  '{"waterDemand": "Low (drought tolerant)", "fertilizerDemand": "Low"}'::jsonb,
  '{"averageYieldKgPerHectare": 2000}'::jsonb
),
('sorghum', 'Sorghum', 
  '[
    {"stage": "Planting", "durationDays": 5, "description": "Sowing seeds."},
    {"stage": "Emergence", "durationDays": 7, "description": "Seedling emerges."},
    {"stage": "Vegetative Growth", "durationDays": 40, "description": "Leaf development."},
    {"stage": "Booting", "durationDays": 10, "description": "Head forms within the flag leaf sheath."},
    {"stage": "Heading", "durationDays": 7, "description": "Panicle emerges."},
    {"stage": "Flowering (Anthesis)", "durationDays": 5, "description": "Pollen sheds."},
    {"stage": "Grain Filling", "durationDays": 30, "description": "Grains develop."},
    {"stage": "Physiological Maturity", "durationDays": 10, "description": "Maximum dry weight."},
    {"stage": "Harvest", "durationDays": 5, "description": "Collection of mature grains."}
  ]'::jsonb,
  '{"temperatureRangeCelsius": "25-35", "rainfallMM": "400-700 annually", "soilType": "Wide range, prefers well-drained loams", "phRange": "6.0-7.5"}'::jsonb,
  '{"waterDemand": "Low-Medium (drought tolerant)", "fertilizerDemand": "Medium"}'::jsonb,
  '{"averageYieldKgPerHectare": 5000}'::jsonb
);
