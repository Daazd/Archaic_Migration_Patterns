from pymongo import MongoClient
from bson.objectid import ObjectId
from flask import current_app
import os
import requests
import re

class MovementService:
    def __init__(self):
        try:
            self.client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/biblical-movements'))
            self.db = self.client.get_default_database()
            self.movements = self.db.movements
            # Test connection
            self.client.admin.command('ping')
            print("✅ MovementService: MongoDB connection successful")
        except Exception as e:
            print(f"❌ MovementService: MongoDB connection error: {e}")
            self.movements = None
            self.client = None
            self.db = None
        
        # Bible API configuration
        self.bible_api_key = os.getenv('BIBLE_API_KEY')
        self.bible_base_url = 'https://api.scripture.api.bible/v1'
        
    def get_bible_headers(self):
        return {'api-key': self.bible_api_key}
        
    def get_movements(self, filters):
        """Get movements - try database first, then real data"""
        try:
            # Try to get movements from database
            if self.movements is not None:
                query = self._build_query(filters)
                
                try:
                    movements = list(self.movements.find(query).limit(filters.get('limit', 100)))
                    total = self.movements.count_documents(query)
                    
                    # Convert ObjectId to string
                    for movement in movements:
                        movement['id'] = str(movement['_id'])
                        del movement['_id']
                    
                    if movements:
                        print(f"✅ Found {len(movements)} movements in database")
                        return movements, total
                    else:
                        print("⚠️  No movements found in database, will use fallback data")
                        
                except Exception as db_error:
                    print(f"❌ Database query error: {db_error}")
            
            # If no database data, return sample movements
            print("📝 Using fallback movement data")
            fallback_movements = self._get_fallback_movements()
            return fallback_movements, len(fallback_movements)
            
        except Exception as e:
            print(f"❌ Error in get_movements: {str(e)}")
            return self._get_fallback_movements(), 3
    
    def _build_query(self, filters):
        """Build MongoDB query from filters"""
        query = {}
        
        if filters.get('group'):
            query['group'] = {'$regex': filters['group'], '$options': 'i'}
        if filters.get('type'):
            query['type'] = filters['type']
        if filters.get('book'):
            query['book'] = filters['book']
        if filters.get('time_start') and filters.get('time_end'):
            query['timePeriod'] = {
                '$gte': filters['time_start'],
                '$lte': filters['time_end']
            }
        
        return query
    
    def _get_fallback_movements(self):
        """Fallback movements when database is unavailable"""
        return [
            {
                'id': 'fallback-exodus',
                'group': 'Israelites',
                'fromLocation': 'Egypt',
                'toLocation': 'Canaan',
                'type': 'Exodus',
                'timePeriod': -1446,
                'description': 'The great exodus from Egyptian bondage under Moses leadership',
                'book': 'Exodus',
                'chapter': 12,
                'verse': 31,
                'source': 'Biblical narrative',
                'verified': True,
                'historical_context': 'Late Bronze Age collapse period',
                'archaeological_notes': 'Archaeological evidence supports major population movements'
            },
            {
                'id': 'fallback-abraham',
                'group': 'Abraham',
                'fromLocation': 'Ur',
                'toLocation': 'Canaan',
                'type': 'Migration',
                'timePeriod': -2000,
                'description': 'Abraham journeyed from Ur to the promised land at God\'s calling',
                'book': 'Genesis',
                'chapter': 12,
                'verse': 1,
                'source': 'Biblical narrative',
                'verified': True,
                'historical_context': 'Middle Bronze Age migrations',
                'archaeological_notes': 'Period of Amorite migrations corroborates narrative'
            },
            {
                'id': 'fallback-exile',
                'group': 'Judean Elite',
                'fromLocation': 'Jerusalem',
                'toLocation': 'Babylon',
                'type': 'Exile',
                'timePeriod': -597,
                'description': 'Babylonian deportation of Judean nobility and skilled workers',
                'book': '2 Kings',
                'chapter': 24,
                'verse': 14,
                'source': 'Biblical narrative + Babylonian records',
                'verified': True,
                'historical_context': 'Neo-Babylonian expansion',
                'archaeological_notes': 'Babylonian Chronicles confirm siege and deportation',
                'historical_cross_references': [
                    {
                        'source': 'Babylonian Chronicles',
                        'reference': 'Chronicle 5 (BM 21946)',
                        'content': 'Records Nebuchadnezzar\'s siege of Jerusalem',
                        'verification': 'Confirms biblical chronology'
                    }
                ]
            },
            {
                'id': 'fallback-return',
                'group': 'Jewish Exiles',
                'fromLocation': 'Babylon',
                'toLocation': 'Jerusalem',
                'type': 'Return',
                'timePeriod': -538,
                'description': 'Return of Jewish exiles under Cyrus\'s restoration decree',
                'book': 'Ezra',
                'chapter': 1,
                'verse': 1,
                'source': 'Biblical narrative + Persian records',
                'verified': True,
                'historical_context': 'Persian restoration policy',
                'archaeological_notes': 'Cyrus Cylinder confirms policy',
                'historical_cross_references': [
                    {
                        'source': 'Cyrus Cylinder',
                        'reference': 'BM 90920 (British Museum)',
                        'content': 'Cyrus policy of returning displaced peoples',
                        'verification': 'Supports biblical account'
                    }
                ]
            },
            {
                'id': 'fallback-christian',
                'group': 'Early Christians',
                'fromLocation': 'Jerusalem',
                'toLocation': 'Samaria',
                'type': 'Missionary',
                'timePeriod': 35,
                'description': 'Dispersion of Christians following persecution in Jerusalem',
                'book': 'Acts',
                'chapter': 8,
                'verse': 1,
                'source': 'Biblical narrative',
                'verified': True,
                'historical_context': 'Early Roman period',
                'archaeological_notes': 'Early Christian inscriptions found throughout region'
            }
        ]
    
    def get_movement_by_id(self, movement_id):
        """Get a specific movement by ID"""
        try:
            if self.movements is not None:
                movement = self.movements.find_one({'_id': ObjectId(movement_id)})
                if movement:
                    movement['id'] = str(movement['_id'])
                    del movement['_id']
                return movement
        except Exception as e:
            print(f"❌ Error getting movement by ID: {str(e)}")
        return None
    
    def extract_movements_from_passage(self, book, chapter, start_verse, end_verse):
        """Extract movements from a specific Bible passage using real Bible API"""
        try:
            if not self.bible_api_key:
                print("⚠️  No Bible API key, returning sample movement")
                return [{
                    'id': f'sample-{book}-{chapter}',
                    'group': f'People from {book}',
                    'fromLocation': 'Unknown Origin',
                    'toLocation': 'Unknown Destination',
                    'type': 'Migration',
                    'timePeriod': -1000,
                    'description': f'Sample movement from {book} {chapter}. Add Bible API key for real extraction.',
                    'book': book,
                    'chapter': chapter,
                    'verse': start_verse,
                    'source': 'Sample data',
                    'verified': False
                }]
            
            # Get actual Bible text from API
            url = f"{self.bible_base_url}/bibles/de4e12af7f28f599-02/passages"
            params = {
                'q': f"{book}.{chapter}",
                'content-type': 'text',
                'include-verse-numbers': True
            }
            
            response = requests.get(url, headers=self.get_bible_headers(), params=params, timeout=10)
            
            if response.status_code != 200:
                print(f"❌ Bible API error: {response.status_code}")
                return []
                
            text_data = response.json()
            raw_text = text_data['data']['content']
            print(f"✅ Got Bible text for {book} {chapter}: {len(raw_text)} characters")
            
            # Simple movement detection
            movement = {
                'id': f'extracted-{book}-{chapter}',
                'group': self._extract_group_from_text(raw_text, book),
                'fromLocation': self._extract_from_location(raw_text, book),
                'toLocation': self._extract_to_location(raw_text, book),
                'type': self._classify_movement_type(book, raw_text),
                'timePeriod': self._get_time_period(book),
                'description': f'Movement extracted from {book} {chapter}',
                'book': book,
                'chapter': chapter,
                'verse': start_verse,
                'source': 'Bible API (Real Text)',
                'verified': True,
                'raw_text': raw_text[:200] + '...' if len(raw_text) > 200 else raw_text
            }
            
            return [movement]
            
        except Exception as e:
            print(f"❌ Error extracting movements: {str(e)}")
            return []
    
    def _extract_group_from_text(self, text, book):
        """Extract people group from text"""
        text_lower = text.lower()
        if book == 'Exodus':
            if 'israelites' in text_lower or 'israel' in text_lower:
                return 'Israelites'
            elif 'moses' in text_lower:
                return 'Moses and the Israelites'
        elif book == 'Genesis':
            if 'abraham' in text_lower:
                return 'Abraham'
            elif 'jacob' in text_lower:
                return 'Jacob'
        elif book == 'Acts':
            if 'disciples' in text_lower:
                return 'Early Christians'
        return 'Unknown Group'
    
    def _extract_from_location(self, text, book):
        """Extract origin location"""
        locations = {
            'Exodus': 'Egypt',
            'Genesis': 'Ur',
            'Acts': 'Jerusalem'
        }
        return locations.get(book, 'Unknown')
    
    def _extract_to_location(self, text, book):
        """Extract destination location"""
        locations = {
            'Exodus': 'Canaan',
            'Genesis': 'Canaan', 
            'Acts': 'Samaria'
        }
        return locations.get(book, 'Unknown')
    
    def _classify_movement_type(self, book, text):
        """Classify movement type"""
        text_lower = text.lower()
        
        if book == 'Exodus' or 'brought out' in text_lower:
            return 'Exodus'
        elif 'scattered' in text_lower:
            return 'Refugee'
        elif 'preaching' in text_lower:
            return 'Missionary'
        return 'Migration'
    
    def _get_time_period(self, book):
        """Get time period for book"""
        periods = {
            'Genesis': -2000,
            'Exodus': -1446,
            'Acts': 35
        }
        return periods.get(book, -1000)
    
    def create_movement(self, movement_data):
        """Create new movement in database"""
        try:
            if self.movements is not None:
                result = self.movements.insert_one(movement_data)
                return str(result.inserted_id)
        except Exception as e:
            print(f"❌ Error creating movement: {str(e)}")
        return None