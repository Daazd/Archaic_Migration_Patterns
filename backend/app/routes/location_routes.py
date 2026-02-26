from flask import Blueprint, request, jsonify
from ..services.location_service import LocationService

location_bp = Blueprint('locations', __name__)
location_service = LocationService()

@location_bp.route('/', methods=['GET'])
def get_locations():
    try:
        filters = {
            'name': request.args.get('name'),
            'region': request.args.get('region'),
            'importance': request.args.get('importance'),
            'time_start': request.args.get('timeStart', type=int),
            'time_end': request.args.get('timeEnd', type=int),
            'limit': request.args.get('limit', 100, type=int),
            'offset': request.args.get('offset', 0, type=int)
        }
        
        locations, total = location_service.get_locations(filters)
        
        return jsonify({
            'success': True,
            'count': len(locations),
            'total': total,
            'data': locations
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@location_bp.route('/<location_id>', methods=['GET'])
def get_location_by_id(location_id):
    try:
        location = location_service.get_location_by_id(location_id)
        if not location:
            return jsonify({'success': False, 'error': 'Location not found'}), 404
        
        return jsonify({'success': True, 'data': location})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
