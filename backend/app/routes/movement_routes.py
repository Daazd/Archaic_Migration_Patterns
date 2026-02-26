from flask import Blueprint, request, jsonify
from ..services.movement_service import MovementService
from ..services.data_integration_service import DataIntegrationService

movement_bp = Blueprint('movements', __name__)
movement_service = MovementService()
data_integration_service = DataIntegrationService()

@movement_bp.route('/', methods=['GET'])
def get_movements():
    try:
        filters = {
            'group': request.args.get('group'),
            'type': request.args.get('type'),
            'book': request.args.get('book'),
            'region': request.args.get('region'),
            'from_location': request.args.get('fromLocation'),
            'to_location': request.args.get('toLocation'),
            'time_start': request.args.get('timeStart', type=int),
            'time_end': request.args.get('timeEnd', type=int),
            'limit': request.args.get('limit', 100, type=int),
            'offset': request.args.get('offset', 0, type=int)
        }
        
        # Get movements from database first
        movements, total = movement_service.get_movements(filters)
        
        # If no movements in database, try to extract from Bible API
        if not movements:
            # Extract movements from key biblical books
            key_books = ['Genesis', 'Exodus', 'Joshua', '2 Kings', 'Ezra', 'Acts']
            
            for book in key_books:
                for chapter in range(1, 4):  # Sample first few chapters
                    try:
                        real_movements = data_integration_service.extract_real_movements_from_bible(book, chapter)
                        
                        # Store in database for future use
                        for movement in real_movements:
                            movement_service.create_movement(movement)
                        
                        movements.extend(real_movements)
                    except Exception as e:
                        print(f"Error processing {book} {chapter}: {str(e)}")
                        continue
            
            total = len(movements)
        
        return jsonify({
            'success': True,
            'count': len(movements),
            'total': total,
            'data': movements,
            'source': 'Real biblical and historical data'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@movement_bp.route('/extract/real', methods=['POST'])
def extract_real_movements():
    """Extract real movements from Bible API"""
    try:
        data = request.get_json()
        book = data.get('book')
        chapter = data.get('chapter')
        
        if not book or not chapter:
            return jsonify({'success': False, 'error': 'Book and chapter required'}), 400
        
        # Extract real movements from Bible API
        movements = data_integration_service.extract_real_movements_from_bible(book, chapter)
        
        # Cross-reference with historical records
        enhanced_movements = []
        for movement in movements:
            enhanced = data_integration_service.cross_reference_with_historical_records(movement)
            enhanced_movements.append(enhanced)
        
        return jsonify({
            'success': True,
            'count': len(enhanced_movements),
            'data': enhanced_movements,
            'source': 'Bible API + Historical Cross-Reference'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@movement_bp.route('/archaeological/<location_name>', methods=['GET'])
def get_archaeological_context(location_name):
    """Get archaeological context for a location"""
    try:
        archaeological_data = data_integration_service.get_archaeological_data_from_wikidata(location_name)
        
        return jsonify({
            'success': True,
            'location': location_name,
            'archaeological_sites': archaeological_data,
            'source': 'Wikidata + Archaeological databases'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@movement_bp.route('/historical-locations/real', methods=['GET'])
def get_real_historical_locations():
    """Get real historical location data from Pleiades"""
    try:
        locations = data_integration_service.get_historical_locations_from_pleiades()
        
        return jsonify({
            'success': True,
            'count': len(locations),
            'data': locations,
            'source': 'Pleiades Ancient World Gazetteer'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500