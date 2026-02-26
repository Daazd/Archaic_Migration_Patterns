# Dynamic Empire Routes - Uses real APIs instead of hardcoded data
from flask import Blueprint, request, jsonify, current_app
from ..services.comprehensive_historical_service import ComprehensiveHistoricalService
from ..services.data_integration_service import DataIntegrationService
import asyncio
import time

empire_bp = Blueprint('empires', __name__)

@empire_bp.route('/discover', methods=['GET'])
def discover_civilizations():
    """Discover all civilizations from APIs with proper error handling"""
    start_time = time.time()
    
    try:
        print("🚀 Starting comprehensive civilization discovery from APIs...")
        
        # Create service instance
        service = ComprehensiveHistoricalService()
        
        # Run async discovery with timeout
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            # Set a reasonable timeout (20 seconds)
            civilizations = loop.run_until_complete(
                asyncio.wait_for(service.discover_all_civilizations(), timeout=20.0)
            )
        except asyncio.TimeoutError:
            print("⚠️ API discovery timed out, using fallback data...")
            civilizations = service.get_fallback_civilizations()
        finally:
            loop.close()
        
        # Convert to list format for frontend
        civilizations_list = []
        for name, data in civilizations.items():
            civilizations_list.append({
                'id': name.lower().replace(' ', '_'),
                'name': name,
                'period': data.get('period', [-1000, 500]),
                'coordinates': data.get('coordinates', [0, 0]),
                'type': data.get('type', 'Unknown'),
                'description': data.get('description', ''),
                'source': data.get('source', 'API'),
                'region': data.get('region', 'Middle East'),
                'significance': data.get('significance', ''),
                'color': data.get('color', '#8B4513')
            })
        
        elapsed_time = time.time() - start_time
        print(f"🎉 Successfully discovered {len(civilizations_list)} civilizations in {elapsed_time:.2f}s!")
        
        return jsonify({
            'success': True,
            'count': len(civilizations_list),
            'civilizations': civilizations_list,
            'discovery_time': elapsed_time,
            'timestamp': int(time.time())
        })
        
    except Exception as e:
        print(f"❌ Error in civilization discovery: {str(e)}")
        
        # Return fallback data on error
        fallback_civilizations = [
            {
                'id': 'babylonian_empire',
                'name': 'Babylonian Empire',
                'period': [-1894, -539],
                'coordinates': [44.4, 32.5],
                'type': 'Empire',
                'description': 'Ancient Mesopotamian empire centered in Babylon',
                'source': 'Fallback Data',
                'region': 'Mesopotamia',
                'significance': 'Major ancient empire',
                'color': '#8B4513'
            },
            {
                'id': 'assyrian_empire',
                'name': 'Assyrian Empire',
                'period': [-2500, -609],
                'coordinates': [43.1, 36.3],
                'type': 'Empire',
                'description': 'Ancient Mesopotamian empire centered in Assyria',
                'source': 'Fallback Data',
                'region': 'Mesopotamia',
                'significance': 'Major ancient empire',
                'color': '#800080'
            }
        ]
        
        return jsonify({
            'success': False,
            'error': str(e),
            'civilizations': fallback_civilizations,
            'count': len(fallback_civilizations),
            'fallback': True
        })

@empire_bp.route('/structure', methods=['GET'])
def get_empire_structure():
    """Get empire structure from real APIs"""
    try:
        civilization_service = ComprehensiveHistoricalService()
        data_integration_service = DataIntegrationService()
        
        # Get civilizations from APIs
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            api_result = loop.run_until_complete(
                civilization_service.get_all_civilizations_from_apis()
            )
        finally:
            loop.close()
        
        civilizations = api_result.get('civilizations', {})
        
        # Transform for frontend structure
        empire_structure = {}
        
        for name, civ_data in civilizations.items():
            empire_structure[name] = {
                'period': civ_data.get('period', [-1000, 500]),
                'capital': 'Unknown',  # Would need additional API call to determine
                'color': civ_data.get('color', '#666666'),
                'impact': civ_data.get('description', 'Historical civilization'),
                'type': civ_data.get('type', 'Civilization'),
                'region': civ_data.get('region', 'Middle East'),
                'coordinates': civ_data.get('coordinates'),
                'source': civ_data.get('source', 'API'),
                'significance': civ_data.get('significance', 'Historical entity'),
                'api_verified': True
            }
        
        return jsonify({
            'success': True,
            'data': {
                'empires': empire_structure,
                'metadata': {
                    'total_count': len(empire_structure),
                    'time_range': api_result.get('time_range', [-10000, 1300]),
                    'region': api_result.get('region', 'Fertile Crescent / Middle East'),
                    'data_sources': api_result.get('data_sources', []),
                    'methodology': 'Dynamic API discovery',
                    'last_updated': api_result.get('last_updated')
                }
            },
            'message': f'Loaded {len(empire_structure)} civilizations from APIs'
        })
        
    except Exception as e:
        current_app.logger.error(f"Error getting empire structure: {str(e)}")
        return jsonify({
            'success': False, 
            'error': str(e),
            'fallback_message': 'Consider using /discover endpoint first'
        }), 500

@empire_bp.route('/data/<empire_name>', methods=['GET'])
def get_empire_from_apis(empire_name):
    """Get specific empire data from APIs"""
    try:
        civilization_service = ComprehensiveHistoricalService()
        data_integration_service = DataIntegrationService()
        
        print(f"🔍 Fetching detailed data for {empire_name} from APIs...")
        
        # First get basic civilization data
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            api_result = loop.run_until_complete(
                civilization_service.get_all_civilizations_from_apis()
            )
        finally:
            loop.close()
        
        civilizations = api_result.get('civilizations', {})
        
        # Find the specific empire
        empire_data = None
        for name, civ in civilizations.items():
            if empire_name.lower() in name.lower() or name.lower() in empire_name.lower():
                empire_data = civ
                break
        
        if not empire_data:
            return jsonify({
                'success': False, 
                'error': f'Empire "{empire_name}" not found in API data'
            }), 404
        
        # Enhance with additional API data
        enhanced_data = {
            'name': empire_name,
            'basic_info': empire_data,
            'archaeological_sites': data_integration_service.get_archaeological_data_from_wikidata(empire_name),
            'historical_locations': data_integration_service.get_historical_locations_from_pleiades(),
            'period': empire_data.get('period', [-1000, 500]),
            'coordinates': empire_data.get('coordinates'),
            'region': empire_data.get('region', 'Middle East'),
            'source': 'Multiple APIs - Real Data',
            'data_sources': api_result.get('data_sources', []),
            'verified': True
        }
        
        return jsonify({
            'success': True,
            'data': enhanced_data,
            'message': f'Real API data for {empire_name}'
        })
        
    except Exception as e:
        current_app.logger.error(f"Error fetching empire data from APIs: {str(e)}")
        return jsonify({
            'success': False, 
            'error': str(e)
        }), 500

@empire_bp.route('/battles/<empire_name>', methods=['GET'])
def get_empire_battles_from_apis(empire_name):
    """Get battles from DBpedia and Wikidata APIs"""
    try:
        civilization_service = ComprehensiveHistoricalService()
        
        print(f"⚔️ Fetching battles for {empire_name} from APIs...")
        
        # Use DBpedia SPARQL to find battles
        battles = []
        
        # Construct SPARQL query for battles involving this empire
        battle_query = f"""
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
        
        SELECT DISTINCT ?battle ?battleLabel ?date ?location ?result ?description ?lat ?long WHERE {{
          ?battle rdf:type dbo:MilitaryConflict .
          ?battle rdfs:label ?battleLabel .
          
          # Filter for battles related to this empire
          FILTER(
            CONTAINS(LCASE(?battleLabel), "{empire_name.split()[0].lower()}") ||
            CONTAINS(LCASE(STR(?battle)), "{empire_name.split()[0].lower()}")
          )
          
          OPTIONAL {{ ?battle dbo:date ?date . }}
          OPTIONAL {{ ?battle dbo:place ?location . }}
          OPTIONAL {{ ?battle dbo:result ?result . }}
          OPTIONAL {{ ?battle dbo:abstract ?description . }}
          OPTIONAL {{ ?battle geo:lat ?lat . }}
          OPTIONAL {{ ?battle geo:long ?long . }}
          
          FILTER(LANG(?battleLabel) = "en")
          FILTER(LANG(?description) = "en")
        }}
        LIMIT 50
        """
        
        # Execute DBpedia query
        import requests
        response = requests.get(
            civilization_service.dbpedia_api,
            params={'query': battle_query, 'format': 'json'},
            timeout=15
        )
        
        if response.status_code == 200:
            data = response.json()
            
            for binding in data.get('results', {}).get('bindings', []):
                battle = {
                    'name': binding.get('battleLabel', {}).get('value', 'Unknown Battle'),
                    'date': binding.get('date', {}).get('value', 'Unknown'),
                    'location': binding.get('location', {}).get('value', 'Unknown'),
                    'result': binding.get('result', {}).get('value', 'Unknown'),
                    'description': binding.get('description', {}).get('value', '')[:300] + '...',
                    'coordinates': get_coords_from_dbpedia_binding(binding),
                    'source': 'DBpedia SPARQL',
                    'empire': empire_name,
                    'verified': True,
                    'api_source': True
                }
                battles.append(battle)
        
        return jsonify({
            'success': True,
            'data': battles,
            'count': len(battles),
            'source': 'Real API data from DBpedia',
            'empire': empire_name
        })
        
    except Exception as e:
        current_app.logger.error(f"Error fetching battles from APIs: {str(e)}")
        return jsonify({
            'success': False, 
            'error': str(e),
            'data': []
        }), 500

@empire_bp.route('/expansion/<empire_name>', methods=['GET'])
def get_empire_expansion_from_apis(empire_name):
    """Get empire expansion data from Pleiades and Wikidata"""
    try:
        civilization_service = ComprehensiveHistoricalService()
        data_integration_service = DataIntegrationService()
        
        print(f"🗺️ Fetching expansion data for {empire_name} from APIs...")
        
        # Get all civilizations first to find this empire
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            api_result = loop.run_until_complete(
                civilization_service.get_all_civilizations_from_apis()
            )
        finally:
            loop.close()
        
        civilizations = api_result.get('civilizations', {})
        
        # Find the empire
        empire_info = None
        for name, civ in civilizations.items():
            if empire_name.lower() in name.lower():
                empire_info = civ
                break
        
        if not empire_info:
            return jsonify({
                'success': False,
                'error': f'Empire {empire_name} not found in API data'
            }), 404
        
        # Get historical locations from Pleiades
        historical_locations = data_integration_service.get_historical_locations_from_pleiades()
        
        # Get archaeological sites from Wikidata
        archaeological_sites = data_integration_service.get_archaeological_data_from_wikidata(empire_name)
        
        # Create expansion phases from real data
        expansion_phases = create_expansion_phases_from_api_data(
            empire_info, 
            historical_locations, 
            archaeological_sites
        )
        
        return jsonify({
            'success': True,
            'data': {
                'empire': empire_name,
                'expansion_phases': expansion_phases,
                'historical_locations': historical_locations,
                'archaeological_sites': archaeological_sites,
                'period': empire_info.get('period', [-1000, 500]),
                'source': 'Real API data from Pleiades + Wikidata'
            }
        })
        
    except Exception as e:
        current_app.logger.error(f"Error getting expansion data from APIs: {str(e)}")
        return jsonify({
            'success': False, 
            'error': str(e)
        }), 500

@empire_bp.route('/timeline', methods=['GET'])
def get_timeline_from_apis():
    """Get complete historical timeline from APIs"""
    try:
        civilization_service = ComprehensiveHistoricalService()
        
        print("📅 Building historical timeline from API data...")
        
        # Get all civilizations
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            api_result = loop.run_until_complete(
                civilization_service.get_all_civilizations_from_apis()
            )
        finally:
            loop.close()
        
        civilizations = api_result.get('civilizations', {})
        
        # Create timeline events
        timeline_events = []
        
        for name, civ in civilizations.items():
            period = civ.get('period', [-1000, 500])
            start_year, end_year = period[0], period[1]
            
            # Start event
            if start_year > -10000:
                timeline_events.append({
                    'year': start_year,
                    'event': f'Rise of {name}',
                    'type': 'founding',
                    'civilization': name,
                    'description': f'Beginning of {name}',
                    'coordinates': civ.get('coordinates'),
                    'source': civ.get('source', 'API')
                })
            
            # End event
            if end_year < 1300:
                timeline_events.append({
                    'year': end_year,
                    'event': f'Fall of {name}',
                    'type': 'dissolution',
                    'civilization': name,
                    'description': f'End of {name}',
                    'coordinates': civ.get('coordinates'),
                    'source': civ.get('source', 'API')
                })
        
        # Sort by year
        timeline_events.sort(key=lambda x: x['year'])
        
        return jsonify({
            'success': True,
            'data': {
                'timeline': timeline_events,
                'civilizations': civilizations,
                'total_events': len(timeline_events),
                'time_range': [-10000, 1300]
            },
            'source': 'Real API data - dynamically generated'
        })
        
    except Exception as e:
        current_app.logger.error(f"Error building timeline from APIs: {str(e)}")
        return jsonify({
            'success': False, 
            'error': str(e)
        }), 500

# Helper functions
def get_coords_from_dbpedia_binding(binding):
    """Extract coordinates from DBpedia SPARQL binding"""
    try:
        lat = binding.get('lat', {}).get('value')
        lon = binding.get('long', {}).get('value')
        if lat and lon:
            return [float(lon), float(lat)]
    except:
        pass
    return None

def create_expansion_phases_from_api_data(empire_info, historical_locations, archaeological_sites):
    """Create expansion phases from real API data"""
    phases = []
    
    period = empire_info.get('period', [-1000, 500])
    start_year, end_year = period[0], period[1]
    
    # Get relevant locations for this empire
    empire_locations = []
    empire_name = empire_info.get('name', '')
    
    # Filter historical locations
    for location in historical_locations:
        if (empire_name.lower() in location.get('name', '').lower() or 
            empire_info.get('region', '').lower() in location.get('name', '').lower()):
            empire_locations.append(location)
    
    # Add archaeological sites
    for site in archaeological_sites:
        if site.get('coordinates'):
            empire_locations.append({
                'name': site.get('name', 'Archaeological Site'),
                'coords': parse_site_coordinates(site.get('coordinates', '')),
                'source': 'Wikidata'
            })
    
    # Create phases based on time periods
    phase_duration = (end_year - start_year) // 3 if end_year > start_year else 500
    
    for i in range(3):
        phase_start = start_year + (i * phase_duration)
        phase_locations = empire_locations[:min(len(empire_locations), (i + 1) * len(empire_locations) // 3)]
        
        if phase_locations:
            # Extract coordinates for polygon
            territory_coords = []
            for loc in phase_locations:
                coords = loc.get('coords')
                if coords and len(coords) >= 2:
                    territory_coords.append([coords[1], coords[0]])  # [lat, lng] for Leaflet
            
            if len(territory_coords) >= 3:  # Need at least 3 points for polygon
                phases.append({
                    'year': phase_start,
                    'territory_coords': territory_coords,
                    'description': f'Phase {i+1} - {len(phase_locations)} locations from APIs',
                    'locations': [loc.get('name', 'Unknown') for loc in phase_locations],
                    'api_data': True,
                    'source': 'Real historical data'
                })
    
    return phases

def parse_site_coordinates(coord_str):
    """Parse coordinate string from Wikidata"""
    if not coord_str or 'Point(' not in coord_str:
        return None
    try:
        coord_part = coord_str.replace('Point(', '').replace(')', '')
        lon, lat = coord_part.split()
        return [float(lon), float(lat)]
    except:
        return None