#!/usr/bin/env python3
import os
import sys

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

try:
    from pymongo import MongoClient
    print("✅ PyMongo imported successfully")
except ImportError as e:
    print(f"❌ PyMongo import failed: {e}")
    print("Installing pymongo...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pymongo==4.3.3"])
    from pymongo import MongoClient

def seed_working_data():
    """Seed database with working sample data"""
    try:
        # Connect to MongoDB
        print("🔄 Connecting to MongoDB...")
        client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)
        
        # Test connection
        client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # Select database
        db = client['biblical-movements']
        
        # Clear existing data
        print("🗑️  Clearing existing data...")
        db.locations.drop()
        db.movements.drop()
        
        # Insert historical locations
        locations = [
            {
                "name": "Jerusalem",
                "coords": [35.2137, 31.7683],
                "period": [-1000, 2025],
                "alternateNames": ["Yerushalayim", "Al-Quds", "Zion"],
                "region": "Judea",
                "importance": "major",
                "description": "The holy city and capital of ancient Israel"
            },
            {
                "name": "Babylon",
                "coords": [44.4213, 32.5422],
                "period": [-626, -539],
                "alternateNames": ["Babel", "Bab-ilim"],
                "region": "Mesopotamia",
                "importance": "major",
                "description": "Capital of the Babylonian Empire"
            },
            {
                "name": "Egypt",
                "coords": [30.8025, 26.8206],
                "period": [-3100, 2025],
                "alternateNames": ["Misr", "Mizraim", "Kemet"],
                "region": "North Africa",
                "importance": "major",
                "description": "Land of the Pharaohs"
            },
            {
                "name": "Rome",
                "coords": [12.4964, 41.9028],
                "period": [-753, 476],
                "alternateNames": ["Roma", "Eternal City"],
                "region": "Italy",
                "importance": "major",
                "description": "Capital of the Roman Empire"
            },
            {
                "name": "Nineveh",
                "coords": [43.1520, 36.3483],
                "period": [-3000, -612],
                "alternateNames": ["Ninua"],
                "region": "Assyria",
                "importance": "major",
                "description": "Capital of the Assyrian Empire"
            },
            {
                "name": "Damascus",
                "coords": [36.2765, 33.5138],
                "period": [-3000, 2025],
                "alternateNames": ["Dimashq"],
                "region": "Syria",
                "importance": "major",
                "description": "Ancient trading city"
            },
            {
                "name": "Alexandria",
                "coords": [29.9187, 31.2001],
                "period": [-331, 641],
                "alternateNames": ["Al-Iskandariyyah"],
                "region": "Egypt",
                "importance": "major",
                "description": "Hellenistic capital of Egypt"
            },
            {
                "name": "Bethlehem",
                "coords": [35.2024, 31.7054],
                "period": [-1400, 2025],
                "alternateNames": ["Beit Lechem", "House of Bread"],
                "region": "Judea",
                "importance": "minor",
                "description": "Birthplace of King David and Jesus"
            },
            {
                "name": "Nazareth",
                "coords": [35.2978, 32.7021],
                "period": [-300, 2025],
                "alternateNames": ["Natsrat"],
                "region": "Galilee",
                "importance": "minor",
                "description": "Hometown of Jesus"
            },
            {
                "name": "Samaria",
                "coords": [35.1924, 32.2758],
                "period": [-880, 722],
                "alternateNames": ["Shomron"],
                "region": "Israel",
                "importance": "major",
                "description": "Capital of the Northern Kingdom of Israel"
            }
        ]
        
        # Insert locations
        result = db.locations.insert_many(locations)
        print(f"✅ Inserted {len(result.inserted_ids)} historical locations")
        
        # Insert biblical movements
        movements = [
            {
                "id": "exodus-1",
                "group": "Israelites",
                "fromLocation": "Egypt",
                "toLocation": "Canaan", 
                "type": "Exodus",
                "timePeriod": -1446,
                "description": "The Israelites departed from Egypt under Moses' leadership",
                "book": "Exodus",
                "chapter": 12,
                "verse": 31,
                "source": "Biblical narrative",
                "verified": True,
                "historical_context": "Late Bronze Age collapse period",
                "archaeological_notes": "Archaeological evidence supports major population movements in this period"
            },
            {
                "id": "abraham-1",
                "group": "Abraham",
                "fromLocation": "Ur",
                "toLocation": "Canaan",
                "type": "Migration", 
                "timePeriod": -2000,
                "description": "Abraham journeyed from Ur to the promised land",
                "book": "Genesis",
                "chapter": 12,
                "verse": 1,
                "source": "Biblical narrative",
                "verified": True,
                "historical_context": "Middle Bronze Age migrations",
                "archaeological_notes": "Period of Amorite migrations corroborates narrative"
            },
            {
                "id": "babylonian-exile-1",
                "group": "Judean Elite",
                "fromLocation": "Jerusalem",
                "toLocation": "Babylon",
                "type": "Exile",
                "timePeriod": -597,
                "description": "First deportation of Judean nobility to Babylon",
                "book": "2 Kings",
                "chapter": 24,
                "verse": 14,
                "source": "Biblical narrative + Babylonian records",
                "verified": True,
                "historical_context": "Neo-Babylonian expansion",
                "archaeological_notes": "Babylonian Chronicles confirm siege and deportation",
                "historical_cross_references": [
                    {
                        "source": "Babylonian Chronicles",
                        "reference": "Chronicle 5 (BM 21946)",
                        "content": "Records Nebuchadnezzar's siege of Jerusalem in 597 BCE",
                        "verification": "Confirms biblical chronology"
                    }
                ]
            },
            {
                "id": "assyrian-exile-1", 
                "group": "Northern Kingdom",
                "fromLocation": "Samaria",
                "toLocation": "Assyria",
                "type": "Exile",
                "timePeriod": -722,
                "description": "Assyrian deportation of the Northern Kingdom of Israel",
                "book": "2 Kings", 
                "chapter": 17,
                "verse": 6,
                "source": "Biblical narrative + Assyrian records",
                "verified": True,
                "historical_context": "Assyrian imperial expansion",
                "archaeological_notes": "Assyrian royal inscriptions document deportation policy",
                "historical_cross_references": [
                    {
                        "source": "Assyrian Royal Inscriptions",
                        "reference": "Sargon II Prism",
                        "content": "Records deportation of 27,290 Israelites from Samaria",
                        "verification": "Corroborates biblical account"
                    }
                ]
            },
            {
                "id": "return-from-exile-1",
                "group": "Jewish Exiles",
                "fromLocation": "Babylon", 
                "toLocation": "Jerusalem",
                "type": "Return",
                "timePeriod": -538,
                "description": "Return of Jewish exiles under Cyrus's decree",
                "book": "Ezra",
                "chapter": 1,
                "verse": 1,
                "source": "Biblical narrative + Persian records",
                "verified": True,
                "historical_context": "Persian restoration policy",
                "archaeological_notes": "Cyrus Cylinder confirms policy of returning displaced peoples",
                "historical_cross_references": [
                    {
                        "source": "Cyrus Cylinder",
                        "reference": "BM 90920 (British Museum)",
                        "content": "Cyrus's policy of returning displaced peoples to their homelands",
                        "verification": "Supports biblical account of return"
                    }
                ]
            },
            {
                "id": "christian-dispersion-1",
                "group": "Early Christians",
                "fromLocation": "Jerusalem",
                "toLocation": "Samaria",
                "type": "Missionary",
                "timePeriod": 35,
                "description": "Dispersion of Christians following persecution",
                "book": "Acts",
                "chapter": 8,
                "verse": 1,
                "source": "Biblical narrative",
                "verified": True,
                "historical_context": "Early Roman period",
                "archaeological_notes": "Early Christian inscriptions found throughout region"
            },
            {
                "id": "paul-mission-1",
                "group": "Paul and companions",
                "fromLocation": "Antioch",
                "toLocation": "Cyprus",
                "type": "Missionary",
                "timePeriod": 47,
                "description": "Paul's first missionary journey begins",
                "book": "Acts",
                "chapter": 13,
                "verse": 4,
                "source": "Biblical narrative", 
                "verified": True,
                "historical_context": "Roman period missionary expansion",
                "archaeological_notes": "Roman road network facilitated travel"
            }
        ]
        
        # Insert movements
        result = db.movements.insert_many(movements)
        print(f"✅ Inserted {len(result.inserted_ids)} biblical movements")
        
        # Create indexes for performance
        print("🔄 Creating database indexes...")
        db.locations.create_index([("coords", "2dsphere")])
        db.locations.create_index([("name", 1)])
        db.movements.create_index([("timePeriod", 1)])
        db.movements.create_index([("book", 1), ("chapter", 1)])
        db.movements.create_index([("type", 1)])
        db.movements.create_index([("group", 1)])
        print("✅ Database indexes created")
        
        client.close()
        print("🎉 Database seeding completed successfully!")
        print(f"\n📊 Summary:")
        print(f"- Locations: {len(locations)} historical places")
        print(f"- Movements: {len(movements)} documented migrations")
        print(f"- Time span: 4000+ years of history")
        print(f"- Sources: Biblical narratives + historical cross-references")
        
    except Exception as error:
        print(f"❌ Seeding error: {error}")
        return False
    
    return True

if __name__ == "__main__":
    seed_working_data()