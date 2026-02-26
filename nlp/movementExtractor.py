import json
import sys
import re
import spacy
from spacy.matcher import Matcher
from spacy.tokens import Span
import datetime

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_md")
except OSError:
    nlp = spacy.load("en_core_web_sm")

MOVEMENT_VERBS = [
    "went", "traveled", "journeyed", "departed", "fled", "moved",
    "returned", "came", "arrived", "crossed", "entered", "left",
    "migrated", "wandered", "escaped", "led", "brought", "sent"
]

FROM_INDICATORS = ["from", "out of", "away from", "departed from"]
TO_INDICATORS = ["to", "into", "unto", "toward", "towards", "in"]

def extract_movements(text, reference, locations):
    """Extract movement information from biblical text using NLP"""
    doc = nlp(text)
    movements = []
    
    for sent in doc.sents:
        for token in sent:
            if token.lemma_ in MOVEMENT_VERBS:
                locations_in_sent = [ent for ent in sent.ents if ent.label_ in ["GPE", "LOC"]]
                if len(locations_in_sent) >= 2:
                    from_loc = locations_in_sent[0].text
                    to_loc = locations_in_sent[1].text
                    
                    # Find subject
                    subject = "Unknown"
                    for t in sent:
                        if t.dep_ == "nsubj":
                            subject = t.text
                            break
                    
                    movement = {
                        "id": f"{reference.get('book', '')}-{reference.get('chapter', 0)}-{len(movements)}",
                        "group": subject,
                        "fromLocation": from_loc,
                        "toLocation": to_loc,
                        "verb": token.text,
                        "timePeriod": estimate_time_period(sent.text),
                        "description": sent.text,
                        "book": reference.get("book", ""),
                        "chapter": reference.get("chapter", 0),
                        "verse": reference.get("verse", 0),
                        "type": classify_movement_type(sent.text),
                        "region": "Unknown",
                        "context": {
                            "purpose": "",
                            "companions": [],
                            "circumstances": ""
                        }
                    }
                    movements.append(movement)
    
    return movements

def estimate_time_period(text):
    """Estimate the time period based on textual clues"""
    time_markers = {
        "abraham": -2000,
        "exodus": -1446,
        "moses": -1400,
        "david": -1000,
        "solomon": -950,
        "babylon": -586,
        "exile": -586,
        "jesus": 30,
        "paul": 50
    }
    
    for marker, year in time_markers.items():
        if marker.lower() in text.lower():
            return year
    
    return -1000  # Default

def classify_movement_type(text):
    """Classify the type of movement based on keywords"""
    movement_types = {
        "Exodus": ["exodus", "flee", "escaped", "fled"],
        "Exile": ["exile", "exiled", "captive", "captivity"],
        "Return": ["return", "returned", "restoration"],
        "Missionary": ["preach", "proclaim", "gospel"],
        "Conquest": ["conquest", "conquer", "invade"],
        "Migration": ["migrate", "settle", "dwell"]
    }
    
    text_lower = text.lower()
    for movement_type, keywords in movement_types.items():
        for keyword in keywords:
            if keyword in text_lower:
                return movement_type
    
    return "Migration"

def main():
    """Main function to process input and return results"""
    input_str = ""
    for line in sys.stdin:
        input_str += line
    
    try:
        input_data = json.loads(input_str)
        text = input_data.get("text", "")
        reference = input_data.get("reference", {})
        locations = input_data.get("locations", {})
    except json.JSONDecodeError:
        text = input_str
        reference = {}
        locations = {}
    
    movements = extract_movements(text, reference, locations)
    print(json.dumps(movements, indent=2))

if __name__ == "__main__":
    main()
