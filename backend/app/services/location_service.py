from pymongo import MongoClient
from bson.objectid import ObjectId
from flask import current_app
import os

class LocationService:
    def __init__(self):
        try:
            self.client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/biblical-movements'))
            self.db = self.client.get_default_database()
            self.locations = self.db.locations
        except Exception as e:
            print(f"MongoDB connection error: {e}")
            self.locations = None
        
    def get_locations(self, filters):
        """Get locations with optional filtering"""
        try:
            # Fix: Check if self.locations is None instead of using bool()
            if self.locations is None:
                return self._get_fallback_locations(), 1
                
            query = {}
            
            # Build query based on filters
            if filters.get('name'):
                query['$or'] = [
                    {'name': {'$regex': filters['name'], '$options': 'i'}},
                    {'alternateNames': {'$regex': filters['name'], '$options': 'i'}}
                ]
            
            if filters.get('region'):
                query['region'] = filters['region']
            if filters.get('importance'):
                query['importance'] = filters['importance']
            
            # Time period query - find locations that existed during the specified time
            if filters.get('time_start'):
                query['period.1'] = {'$gte': filters['time_start']}  # End year >= timeStart
            if filters.get('time_end'):
                query['period.0'] = {'$lte': filters['time_end']}    # Start year <= timeEnd
            
            # Execute query
            cursor = self.locations.find(query)
            cursor = cursor.sort('name', 1)
            cursor = cursor.skip(filters.get('offset', 0))
            cursor = cursor.limit(filters.get('limit', 100))
            
            locations = list(cursor)
            total = self.locations.count_documents(query)
            
            # Convert ObjectId to string
            for location in locations:
                location['id'] = str(location['_id'])
                del location['_id']
            
            return locations, total
        except Exception as e:
            current_app.logger.error(f"Error getting locations: {str(e)}")
            # Return fallback data if database fails
            return self._get_fallback_locations(), 1
    
    def _get_fallback_locations(self):
        """Return fallback data when database is unavailable"""
        return [
            {
                'id': '1',
                'name': 'Jerusalem',
                'coords': [35.2137, 31.7683],
                'period': [-1000, 2025],
                'region': 'Judea',
                'importance': 'major',
                'alternateNames': ['Yerushalayim', 'Zion']
            },
            {
                'id': '2',
                'name': 'Bethlehem',
                'coords': [35.2024, 31.7054],
                'period': [-1500, 2025],
                'region': 'Judea',
                'importance': 'minor',
                'alternateNames': ['Beit Lechem']
            },
            {
                'id': '3',
                'name': 'Egypt',
                'coords': [30.8025, 26.8206],
                'period': [-5000, 2025],
                'region': 'North Africa',
                'importance': 'major',
                'alternateNames': ['Misr', 'Mizraim']
            }
        ]
    
    def get_location_by_id(self, location_id):
        """Get a specific location by ID"""
        try:
            if self.locations is None:
                return None
                
            location = self.locations.find_one({'_id': ObjectId(location_id)})
            if location:
                location['id'] = str(location['_id'])
                del location['_id']
            return location
        except Exception as e:
            current_app.logger.error(f"Error getting location by ID: {str(e)}")
            return None
    
    def get_locations_near(self, longitude, latitude, max_distance):
        """Get locations near coordinates"""
        try:
            if self.locations is None:
                return []
                
            # Create geospatial query
            query = {
                'coords': {
                    '$near': {
                        '$geometry': {
                            'type': 'Point',
                            'coordinates': [longitude, latitude]
                        },
                        '$maxDistance': max_distance
                    }
                }
            }
            
            locations = list(self.locations.find(query).limit(10))
            
            # Convert ObjectId to string
            for location in locations:
                location['id'] = str(location['_id'])
                del location['_id']
            
            return locations
        except Exception as e:
            current_app.logger.error(f"Error getting locations near coordinates: {str(e)}")
            return []
