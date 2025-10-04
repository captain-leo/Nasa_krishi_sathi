from flask import Flask, render_template, request, jsonify
from nasa_service import NASADataService
import json
import os
from datetime import datetime

app = Flask(__name__)
nasa_service = NASADataService()

@app.route('/')
def index():
    """Main dashboard page"""
    return render_template('index.html')

@app.route('/api/nasa/data', methods=['GET', 'POST'])
def get_nasa_data():
    """API endpoint to fetch NASA data"""
    try:
        if request.method == 'POST':
            data = request.get_json()
            lat = data.get('lat')
            lon = data.get('lon')
        else:
            lat = request.args.get('lat', type=float)
            lon = request.args.get('lon', type=float)
        
        # Use default coordinates if none provided
        if lat is None or lon is None:
            location = nasa_service.get_default_location()
            lat, lon = location['lat'], location['lon']
        
        # Fetch NASA data
        nasa_data = nasa_service.fetch_all_data(lat, lon)
        
        return jsonify({
            'success': True,
            'data': nasa_data,
            'location': {'lat': lat, 'lon': lon},
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/nasa/weather', methods=['GET'])
def get_weather_data():
    """API endpoint for weather data only"""
    try:
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        
        if lat is None or lon is None:
            location = nasa_service.get_default_location()
            lat, lon = location['lat'], location['lon']
        
        weather_data = nasa_service.fetch_weather_data(lat, lon)
        
        return jsonify({
            'success': True,
            'weather': weather_data,
            'location': {'lat': lat, 'lon': lon}
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/nasa/agriculture', methods=['GET'])
def get_agriculture_data():
    """API endpoint for agriculture analysis"""
    try:
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        
        if lat is None or lon is None:
            location = nasa_service.get_default_location()
            lat, lon = location['lat'], location['lon']
        
        ag_data = nasa_service.fetch_agriculture_indices(lat, lon)
        
        return jsonify({
            'success': True,
            'agriculture': ag_data,
            'location': {'lat': lat, 'lon': lon}
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/location/current', methods=['GET'])
def get_current_location():
    """Get user's current location via browser geolocation"""
    # This endpoint is for the frontend to use with browser geolocation
    return jsonify({
        'message': 'Use browser geolocation and send coordinates to /api/nasa/data'
    })

@app.route('/api/data/history', methods=['GET'])
def get_data_history():
    """Get list of previously saved data files"""
    try:
        history_files = []
        for file in os.listdir('.'):
            if file.startswith('nasa_agriculture_data_') and file.endswith('.json'):
                history_files.append(file)
        
        return jsonify({
            'success': True,
            'files': sorted(history_files, reverse=True)[:10]  # Last 10 files
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
