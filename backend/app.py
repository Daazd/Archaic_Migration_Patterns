# from flask import Flask
# from flask_cors import CORS
# from flask_pymongo import PyMongo
# from flask_jwt_extended import JWTManager
# from dotenv import load_dotenv
# import os


# load_dotenv()

# def create_app():
#     app = Flask(__name__)
    
#     # Configuration
#     app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
#     app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
#     app.config['MONGO_URI'] = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/biblical-movements')
    
#     # Initialize extensions
#     CORS(app)
#     mongo = PyMongo(app)
#     jwt = JWTManager(app)
    
#     # Store mongo instance
#     app.mongo = mongo
    
#     # Register blueprints
#     from app.routes.bible_routes import bible_bp
#     from app.routes.movement_routes import movement_bp
#     from app.routes.location_routes import location_bp
#     from app.routes.empire_routes import empire_bp
    
#     app.register_blueprint(bible_bp, url_prefix='/api/bible')
#     app.register_blueprint(movement_bp, url_prefix='/api/movements')
#     app.register_blueprint(location_bp, url_prefix='/api/locations')
#     app.register_blueprint(empire_bp, url_prefix='/api/empires')
    
    
#     # Health check endpoint
#     @app.route('/health')
#     def health_check():
#         return {'status': 'ok', 'service': 'biblical-movements-api', 'data_sources': [
#             'Bible API (scripture.api.bible)',
#             'Pleiades Ancient World Gazetteer',
#             'Wikidata Archaeological Database',
#             'Assyrian Royal Inscriptions',
#             'Babylonian Chronicles',
#             'Persian Administrative Records'
#         ]}
    
#     # Data source information endpoint
#     @app.route('/api/data-sources')
#     def data_sources():
#         return {
#             'success': True,
#             'sources': {
#                 'biblical_text': {
#                     'name': 'Bible API',
#                     'url': 'https://scripture.api.bible',
#                     'description': 'Actual biblical text in multiple translations',
#                     'coverage': '66 books, 783,000+ words, 31,000+ verses'
#                 },
#                 'geographical': {
#                     'name': 'Pleiades Gazetteer',
#                     'url': 'https://pleiades.stoa.org',
#                     'description': 'Ancient world geographical database',
#                     'coverage': '35,000+ places from antiquity'
#                 },
#                 'archaeological': {
#                     'name': 'Wikidata',
#                     'url': 'https://wikidata.org',
#                     'description': 'Archaeological sites and historical data',
#                     'coverage': 'Linked open data with archaeological context'
#                 },
#                 'historical_records': {
#                     'assyrian': 'Royal inscriptions and administrative records',
#                     'babylonian': 'Chronicles and deportation records',
#                     'persian': 'Cyrus Cylinder and administrative documents',
#                     'greek': 'Hellenistic period inscriptions',
#                     'roman': 'Administrative records and historical accounts'
#                 }
#             }
#         }
    
#     return app

# if __name__ == '__main__':
#     app = create_app()
#     app.run(debug=True, port=5000)


from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    app.config['MONGO_URI'] = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/biblical-movements')
    
    # Initialize extensions
    CORS(app)
    mongo = PyMongo(app)
    jwt = JWTManager(app)
    
    # Store mongo instance
    app.mongo = mongo
    
    # Register blueprints
    from app.routes.bible_routes import bible_bp
    from app.routes.movement_routes import movement_bp
    from app.routes.location_routes import location_bp
    
    # Import updated empire routes with dynamic API discovery
    try:
        from app.routes.empire_routes import empire_bp
        app.register_blueprint(empire_bp, url_prefix='/api/empires')
        print("✅ Dynamic empire routes loaded (uses real APIs)")
    except ImportError as e:
        print(f"⚠️ Dynamic empire routes not found: {e}")
        # Fallback to basic empire routes if new ones aren't available
        try:
            from app.routes.basic_empire_routes import empire_bp as basic_empire_bp
            app.register_blueprint(basic_empire_bp, url_prefix='/api/empires')
            print("✅ Basic empire routes loaded as fallback")
        except ImportError:
            print("❌ No empire routes available")
    
    app.register_blueprint(bible_bp, url_prefix='/api/bible')
    app.register_blueprint(movement_bp, url_prefix='/api/movements')
    app.register_blueprint(location_bp, url_prefix='/api/locations')
    
    # Health check endpoint with API status
    @app.route('/health')
    def health_check():
        return {
            'status': 'ok', 
            'service': 'biblical-movements-api',
            'version': '2.0 - Dynamic API Integration',
            'data_sources': [
                'Bible API (scripture.api.bible)',
                'Wikidata SPARQL (query.wikidata.org)',
                'DBpedia SPARQL (dbpedia.org/sparql)',
                'Pleiades Ancient World Gazetteer (pleiades.stoa.org)',
                'Chronique BNF (chronique.bnf.fr/api)',
                'British Museum API (britishmuseum.org/api)'
            ],
            'api_endpoints': {
                'discover_civilizations': '/api/empires/discover',
                'empire_structure': '/api/empires/structure', 
                'empire_data': '/api/empires/data/<empire_name>',
                'empire_battles': '/api/empires/battles/<empire_name>',
                'empire_expansion': '/api/empires/expansion/<empire_name>',
                'historical_timeline': '/api/empires/timeline'
            }
        }
    
    # Enhanced data source information endpoint
    @app.route('/api/data-sources')
    def data_sources():
        return {
            'success': True,
            'version': '2.0 - Dynamic Discovery',
            'methodology': 'Real-time API queries with no hardcoded data',
            'sources': {
                'biblical_text': {
                    'name': 'Bible API',
                    'url': 'https://scripture.api.bible',
                    'description': 'Actual biblical text in multiple translations',
                    'coverage': '66 books, 783,000+ words, 31,000+ verses',
                    'usage': 'Movement extraction, cross-referencing'
                },
                'geographical': {
                    'name': 'Pleiades Gazetteer',
                    'url': 'https://pleiades.stoa.org',
                    'description': 'Ancient world geographical database',
                    'coverage': '35,000+ places from antiquity',
                    'usage': 'Historical location coordinates, time periods'
                },
                'archaeological': {
                    'name': 'Wikidata',
                    'url': 'https://query.wikidata.org/sparql',
                    'description': 'SPARQL queries for archaeological sites and civilizations',
                    'coverage': 'Comprehensive linked open data',
                    'usage': 'Civilization discovery, archaeological sites, coordinates'
                },
                'historical_entities': {
                    'name': 'DBpedia',
                    'url': 'http://dbpedia.org/sparql',
                    'description': 'SPARQL queries for historical entities and battles',
                    'coverage': 'Structured data from Wikipedia',
                    'usage': 'Battle data, empire information, historical events'
                },
                'french_historical': {
                    'name': 'Chronique BNF',
                    'url': 'https://chronique.bnf.fr/api',
                    'description': 'French National Library historical records',
                    'coverage': 'Medieval and ancient historical documents',
                    'usage': 'Historical record validation'
                },
                'museum_artifacts': {
                    'name': 'British Museum API',
                    'url': 'https://www.britishmuseum.org/api',
                    'description': 'Museum collection artifacts by culture',
                    'coverage': 'Archaeological artifacts with cultural context',
                    'usage': 'Cultural inference, artifact-based civilization discovery'
                }
            },
            'discovery_process': {
                'step_1': 'Query Wikidata SPARQL for all civilizations in geographic region (10°-70°E, 25°-45°N)',
                'step_2': 'Query DBpedia for historical entities (empires, kingdoms, city-states)',
                'step_3': 'Query Pleiades for ancient places and archaeological cultures',
                'step_4': 'Query British Museum for artifacts indicating cultural presence',
                'step_5': 'Cross-reference and deduplicate discovered civilizations',
                'step_6': 'Filter by time period (10,000 BCE - 1300 CE) and geographic region',
                'step_7': 'Generate dynamic expansion phases from real location data'
            },
            'geographic_scope': {
                'region': 'Fertile Crescent / Middle East',
                'bounding_box': '10°-70°E longitude, 25°-45°N latitude',
                'includes': [
                    'Mesopotamia (Iraq)',
                    'Levant (Syria, Lebanon, Palestine, Jordan)', 
                    'Anatolia (Turkey)',
                    'Iran/Persia',
                    'Egypt',
                    'Arabia',
                    'Cyprus'
                ]
            },
            'temporal_scope': {
                'start': '10,000 BCE (Neolithic Revolution)',
                'end': '1300 CE (End of Crusades)',
                'total_span': '11,300 years',
                'periods_covered': [
                    'Neolithic (10,000-3,500 BCE)',
                    'Bronze Age (3,500-1,200 BCE)', 
                    'Iron Age (1,200-500 BCE)',
                    'Classical Period (500 BCE - 500 CE)',
                    'Medieval Period (500-1300 CE)'
                ]
            }
        }
    
    # API status endpoint
    @app.route('/api/status')
    def api_status():
        """Check status of all external APIs"""
        try:
            from app.services.dynamic_civilization_service import DynamicCivilizationService
            
            service = DynamicCivilizationService()
            
            # Test API connectivity
            api_status = {
                'wikidata': test_api_connection(service.wikidata_api),
                'dbpedia': test_api_connection(service.dbpedia_api),
                'pleiades': test_api_connection(service.pleiades_api),
                'chronique': test_api_connection(service.chronique_api),
                'british_museum': test_api_connection(service.british_museum_api),
                'bible_api': 'configured' if service.bible_api_key else 'not_configured'
            }
            
            total_apis = len(api_status)
            working_apis = sum(1 for status in api_status.values() if status == 'online')
            
            return {
                'success': True,
                'overall_status': 'healthy' if working_apis >= total_apis * 0.6 else 'degraded',
                'api_status': api_status,
                'working_apis': f'{working_apis}/{total_apis}',
                'last_check': app.config.get('last_api_check', 'never'),
                'recommendations': generate_api_recommendations(api_status)
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'overall_status': 'error'
            }
    
    # Civilization discovery endpoint (quick test)
    @app.route('/api/discover-preview')
    def discover_preview():
        """Quick preview of civilization discovery without full processing"""
        try:
            return {
                'success': True,
                'message': 'Civilization discovery available',
                'endpoints': {
                    'full_discovery': '/api/empires/discover',
                    'empire_structure': '/api/empires/structure',
                    'timeline': '/api/empires/timeline'
                },
                'expected_results': {
                    'estimated_civilizations': '50-200',
                    'time_range': '10,000 BCE - 1300 CE',
                    'region': 'Fertile Crescent / Middle East',
                    'data_sources': 6
                },
                'note': 'Use /api/empires/discover for full civilization discovery from APIs'
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    return app

def test_api_connection(api_url):
    """Test if API is reachable"""
    try:
        import requests
        response = requests.get(api_url, timeout=5)
        return 'online' if response.status_code < 500 else 'degraded'
    except:
        return 'offline'

def generate_api_recommendations(api_status):
    """Generate recommendations based on API status"""
    recommendations = []
    
    if api_status.get('wikidata') == 'offline':
        recommendations.append('Wikidata offline - primary civilization data unavailable')
    if api_status.get('dbpedia') == 'offline':
        recommendations.append('DBpedia offline - battle and historical entity data unavailable')
    if api_status.get('pleiades') == 'offline':
        recommendations.append('Pleiades offline - ancient location data unavailable')
    if api_status.get('bible_api') == 'not_configured':
        recommendations.append('Bible API key not configured - set BIBLE_API_KEY environment variable')
    
    if not recommendations:
        recommendations.append('All APIs operational - full functionality available')
    
    return recommendations

if __name__ == '__main__':
    app = create_app()
    print("🚀 Starting Biblical Movements API with Dynamic Civilization Discovery")
    print("📊 Data Sources: Wikidata, DBpedia, Pleiades, Chronique BNF, British Museum, Bible API")
    print("🗺️ Geographic Scope: Fertile Crescent / Middle East (10°-70°E, 25°-45°N)")
    print("⏳ Temporal Scope: 10,000 BCE - 1300 CE")
    print("🔍 Methodology: Real-time API discovery, no hardcoded data")
    app.run(debug=True, port=5000)