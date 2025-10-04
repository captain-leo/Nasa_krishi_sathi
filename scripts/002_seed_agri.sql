insert into livestock (type, daily_feed_kg, water_liters, notes, owner)
select 'Cow (dairy)', 25, 60, 'High-yield dairy requires steady water', auth.uid()
where not exists (select 1 from livestock where type = 'Cow (dairy)' and owner = auth.uid());

insert into datasets (name, kind, payload, owner)
select 'sample-geojson', 'geojson', '{"type":"FeatureCollection","features":[]}'::jsonb, auth.uid()
where not exists (select 1 from datasets where name='sample-geojson' and owner = auth.uid());
