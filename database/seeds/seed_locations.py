from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

locations = [
    {
        "name": "Jerusalem",
        "coords": [35.2137, 31.7683],
        "period": [-1000, 2025],
        "alternateNames": ["Yerushalayim", "Al-Quds", "Zion"],
        "region": "Judea",
        "importance": "major",
        "description": "The holy city"
    },
    {
        "name": "Bethlehem",
        "coords": [35.2024, 31.7054],
        "period": [-1500, 2025],
        "alternateNames": ["Beit Lechem"],
        "region": "Judea",
        "importance": "minor",
        "description": "Birthplace of Jesus"
    },
    {
        "name": "Egypt",
        "coords": [30.8025, 26.8206],
        "period": [-5000, 2025],
        "alternateNames": ["Misr", "Mizraim"],
        "region": "North Africa",
        "importance": "major",
        "description": "Land of the Pharaohs"
    },
    {
        "name": "Babylon",
        "coords": [44.4213, 32.5422],
        "period": [-2000, -539],
        "alternateNames": ["Babel"],
        "region": "Mesopotamia",
        "importance": "major",
        "description": "Ancient empire"
    }
]

def seed_database():
    try:
        uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/biblical-movements')
        client = MongoClient(uri)
        db = client.get_default_database()
        
        # Clear existing locations
        db.locations.drop()
        print('Cleared existing locations')
        
        # Insert new locations
        result = db.locations.insert_many(locations)
        print(f'Inserted {len(result.inserted_ids)} locations')
        
        # Create geospatial index
        db.locations.create_index([("coords", "2dsphere")])
        print('Created geospatial index')
        
        client.close()
        print('Database seeding complete')
        
    except Exception as error:
        print(f'Seeding error: {error}')

if __name__ == "__main__":
    seed_database()
