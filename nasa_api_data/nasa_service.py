import requests
import json
import datetime
from typing import Dict, List, Optional

class NASADataService:
    def __init__(self):
        self.api_key = "MN7A4sg6nekv20Ybe9dOHOSgNdqYcjbQDojaA7DT"
        self.base_urls = {
            'weather': 'https://power.larc.nasa.gov/api/temporal/daily/point',
            'imagery': 'https://api.nasa.gov/planetary/earth/imagery',
            'landsat': 'https://api.nasa.gov/planetary/earth/assets',
            'epic': 'https://api.nasa.gov/EPIC/api/natural'
        }
    
    def get_default_location(self) -> Dict[str, float]:
        """Return default coordinates (Central US - good for agriculture)"""
        return {'lat': 39.8283, 'lon': -98.5795}
    
    def fetch_weather_data(self, lat: float, lon: float) -> Dict:
        """Fetch weather data with proper error handling for -999 values"""
        end_date = datetime.datetime.now()
        start_date = end_date - datetime.timedelta(days=30)
        
        params = {
            'parameters': 'T2M,PRECTOTCORR,WS2M,RH2M,ALLSKY_SFC_SW_DWN,PS',
            'community': 'AG',
            'longitude': lon,
            'latitude': lat,
            'start': start_date.strftime('%Y%m%d'),
            'end': end_date.strftime('%Y%m%d'),
            'format': 'JSON'
        }
        
        try:
            response = requests.get(self.base_urls['weather'], params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            return self._process_weather_data(data)
            
        except requests.exceptions.RequestException as e:
            return {'error': f"Weather API error: {str(e)}"}

    def _process_weather_data(self, raw_data: Dict) -> Dict:
        """Process weather data and handle -999 values"""
        if 'properties' not in raw_data or 'parameter' not in raw_data['properties']:
            return {'error': 'Invalid weather data format'}
        
        parameters = raw_data['properties']['parameter']
        processed_data = {
            'summary': {},
            'daily_data': {},
            'units': {}
        }
        
        # Get units from parameters section
        if 'parameters' in raw_data:
            for param, info in raw_data['parameters'].items():
                processed_data['units'][param] = info.get('units', 'unknown')
        
        # Process each parameter
        for param, values in parameters.items():
            # Filter out -999 values and get valid data
            valid_data = {date: val for date, val in values.items() if val != -999.0}
            
            if valid_data:
                dates = list(valid_data.keys())
                data_points = list(valid_data.values())
                
                # Get latest value and 7-day average
                latest_value = data_points[-1] if data_points else None
                seven_day_avg = sum(data_points[-7:]) / len(data_points[-7:]) if len(data_points) >= 7 else sum(data_points) / len(data_points)
                
                processed_data['summary'][param] = {
                    'latest': latest_value,
                    'avg_7day': seven_day_avg,
                    'unit': self.get_weather_unit(param),
                    'trend': 'stable'  # Basic trend analysis
                }
                
                # Store daily data for charts
                processed_data['daily_data'][param] = valid_data
        
        return processed_data

    def get_weather_unit(self, parameter: str) -> str:
        """Get unit for weather parameters"""
        units = {
            'T2M': '°C',
            'PRECTOTCORR': 'mm/day',
            'WS2M': 'm/s',
            'RH2M': '%',
            'ALLSKY_SFC_SW_DWN': 'MJ/m²/day',
            'PS': 'kPa',
            'CLRSKY_SFC_SW_DWN': 'MJ/m²/day'
        }
        return units.get(parameter, 'unknown')

    def fetch_satellite_imagery(self, lat: float, lon: float) -> Dict:
        """Fetch satellite imagery with fallback"""
        target_date = (datetime.datetime.now() - datetime.timedelta(days=15)).strftime('%Y-%m-%d')
        
        params = {
            'lon': lon,
            'lat': lat,
            'date': target_date,
            'dim': 0.15,
            'api_key': self.api_key
        }
        
        try:
            response = requests.get(self.base_urls['imagery'], params=params, timeout=20)
            
            if response.status_code == 200:
                return {
                    'image_url': response.url,
                    'coordinates': {'lat': lat, 'lon': lon},
                    'date': target_date,
                    'type': 'Landsat 8',
                    'status': 'available'
                }
            else:
                return {
                    'status': 'unavailable',
                    'message': 'No recent imagery available for this location',
                    'coordinates': {'lat': lat, 'lon': lon}
                }
                
        except requests.exceptions.RequestException:
            return {
                'status': 'error',
                'message': 'Imagery service temporarily unavailable',
                'coordinates': {'lat': lat, 'lon': lon}
            }

    def fetch_landsat_data(self, lat: float, lon: float) -> Dict:
        """Fetch Landsat metadata"""
        start_date = (datetime.datetime.now() - datetime.timedelta(days=90)).strftime('%Y-%m-%d')
        
        params = {
            'lon': lon,
            'lat': lat,
            'begin': start_date,
            'api_key': self.api_key
        }
        
        try:
            response = requests.get(self.base_urls['landsat'], params=params, timeout=20)
            
            if response.status_code == 200:
                data = response.json()
                if data and 'count' in data and data['count'] > 0:
                    return {
                        'available_scenes': data['count'],
                        'latest_date': data['results'][0]['date'],
                        'cloud_score': data['results'][0].get('cloud_score', 'N/A'),
                        'status': 'available'
                    }
                else:
                    return {'status': 'no_scenes', 'message': 'No Landsat scenes available'}
            else:
                return {'status': 'error', 'message': 'Landsat service unavailable'}
                
        except requests.exceptions.RequestException:
            return {'status': 'error', 'message': 'Landsat service temporarily unavailable'}

    def fetch_agriculture_indices(self, lat: float, lon: float) -> Dict:
        """Calculate agriculture-related indices"""
        try:
            weather_data = self.fetch_weather_data(lat, lon)
            
            if 'error' in weather_data:
                return {'error': weather_data['error']}
            
            if 'summary' in weather_data:
                summary = weather_data['summary']
                
                agriculture_analysis = {
                    'growing_conditions': self.assess_growing_conditions(summary),
                    'drought_risk': self.calculate_drought_risk(summary),
                    'crop_suitability': self.assess_crop_suitability(summary, lat),
                    'recommendations': self.generate_recommendations(summary, lat),
                    'risk_level': self.calculate_risk_level(summary)
                }
                
                return agriculture_analysis
            else:
                return {'error': 'No weather data available for agriculture analysis'}
                
        except Exception as e:
            return {'error': f"Agriculture analysis error: {str(e)}"}

    def assess_growing_conditions(self, weather_summary: Dict) -> str:
        """Assess overall growing conditions"""
        if 'T2M' not in weather_summary or 'PRECTOTCORR' not in weather_summary:
            return "Insufficient data"
        
        temp = weather_summary['T2M']['latest']
        precip = weather_summary['PRECTOTCORR']['latest']
        
        if temp is None or precip is None:
            return "Insufficient data"
        
        if 15 <= temp <= 30 and precip >= 1:
            return "Excellent"
        elif 10 <= temp <= 35 and precip >= 0.5:
            return "Good"
        elif 5 <= temp <= 40:
            return "Moderate"
        else:
            return "Poor"

    def calculate_drought_risk(self, weather_summary: Dict) -> str:
        """Calculate drought risk based on precipitation and temperature"""
        if 'PRECTOTCORR' not in weather_summary or 'T2M' not in weather_summary:
            return "Unknown"
        
        precip = weather_summary['PRECTOTCORR']['avg_7day']
        temp = weather_summary['T2M']['avg_7day']
        
        if precip is None or temp is None:
            return "Unknown"
        
        if precip < 0.2 and temp > 25:
            return "High"
        elif precip < 0.5 and temp > 20:
            return "Moderate"
        elif precip < 1.0:
            return "Low"
        else:
            return "Very Low"

    def calculate_risk_level(self, weather_summary: Dict) -> str:
        """Calculate overall risk level for farming"""
        drought_risk = self.calculate_drought_risk(weather_summary)
        
        if drought_risk == "High":
            return "High"
        elif drought_risk == "Moderate":
            return "Medium"
        else:
            return "Low"

    def assess_crop_suitability(self, weather_summary: Dict, lat: float) -> List[str]:
        """Recommend suitable crops based on climate and location"""
        suitable_crops = []
        
        if 'T2M' not in weather_summary:
            return ["Insufficient data"]
        
        avg_temp = weather_summary['T2M']['avg_7day']
        
        if avg_temp is None:
            return ["Insufficient data"]
        
        # Basic crop recommendations based on temperature
        if avg_temp >= 20:
            suitable_crops.extend(["Corn", "Soybeans", "Cotton", "Rice"])
        if 15 <= avg_temp <= 25:
            suitable_crops.extend(["Wheat", "Barley", "Oats"])
        if avg_temp >= 10:
            suitable_crops.extend(["Potatoes", "Tomatoes", "Vegetables"])
        
        return list(set(suitable_crops))

    def generate_recommendations(self, weather_summary: Dict, lat: float) -> List[str]:
        """Generate agricultural recommendations"""
        recommendations = []
        
        if 'PRECTOTCORR' in weather_summary:
            precip = weather_summary['PRECTOTCORR']['latest']
            if precip is not None and precip < 0.5:
                recommendations.append("Consider irrigation - low precipitation")
            elif precip is not None and precip > 5.0:
                recommendations.append("Monitor for waterlogging - high precipitation")
        
        if 'T2M' in weather_summary:
            temp = weather_summary['T2M']['latest']
            if temp is not None and temp < 5:
                recommendations.append("Protect crops from frost")
            elif temp is not None and temp > 35:
                recommendations.append("Provide shade and extra water for heat stress")
        
        return recommendations if recommendations else ["Conditions appear normal for growing season"]

    def fetch_all_data(self, lat: float = None, lon: float = None) -> Dict:
        """Fetch all available NASA data for given coordinates"""
        if lat is None or lon is None:
            location = self.get_default_location()
            lat, lon = location['lat'], location['lon']
        
        all_data = {
            'location': {
                'latitude': lat,
                'longitude': lon,
                'timestamp': datetime.datetime.now().isoformat()
            },
            'weather_data': self.fetch_weather_data(lat, lon),
            'satellite_imagery': self.fetch_satellite_imagery(lat, lon),
            'landsat_data': self.fetch_landsat_data(lat, lon),
            'agriculture_analysis': self.fetch_agriculture_indices(lat, lon)
        }
        
        # Save to file
        self.save_data_to_file(all_data)
        
        return all_data

    def save_data_to_file(self, data: Dict):
        """Save data to JSON file"""
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'nasa_agriculture_data_{timestamp}.json'
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving file: {e}")
