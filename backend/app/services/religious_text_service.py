import requests
import os
from flask import current_app

class ReligiousTextService:
    def __init__(self):
        self.bible_api_key = os.getenv('BIBLE_API_KEY')
        self.base_url = 'https://api.scripture.api.bible/v1'
        
    def get_headers(self):
        return {'api-key': self.bible_api_key}
    
    def get_religious_texts_structure(self):
        """Get the structure of available religious texts"""
        return {
            'biblical_texts': {
                'old_testament': {
                    'Genesis': {'chapters': 50, 'focus': 'Patriarchal migrations, early settlements'},
                    'Exodus': {'chapters': 40, 'focus': 'Egyptian exodus, wilderness wandering'},
                    'Numbers': {'chapters': 36, 'focus': 'Census data, tribal movements'},
                    'Joshua': {'chapters': 24, 'focus': 'Conquest narratives, land distribution'},
                    'Judges': {'chapters': 21, 'focus': 'Tribal conflicts, population shifts'},
                    '1 Samuel': {'chapters': 31, 'focus': 'Political transitions, refugee movements'},
                    '2 Samuel': {'chapters': 24, 'focus': 'Kingdom expansion, administrative changes'},
                    '1 Kings': {'chapters': 22, 'focus': 'Trade routes, diplomatic relations'},
                    '2 Kings': {'chapters': 25, 'focus': 'Assyrian/Babylonian deportations'},
                    '1 Chronicles': {'chapters': 29, 'focus': 'Genealogical records, tribal territories'},
                    '2 Chronicles': {'chapters': 36, 'focus': 'Temple records, royal policies'},
                    'Ezra': {'chapters': 10, 'focus': 'Return from exile, community restoration'},
                    'Nehemiah': {'chapters': 13, 'focus': 'Wall building, population policies'},
                    'Esther': {'chapters': 10, 'focus': 'Persian diaspora, court politics'},
                    'Daniel': {'chapters': 12, 'focus': 'Babylonian exile, court life'}
                },
                'new_testament': {
                    'Matthew': {'chapters': 28, 'focus': 'Jewish-Christian transitions'},
                    'Mark': {'chapters': 16, 'focus': 'Galilean movements, urban ministry'},
                    'Luke': {'chapters': 24, 'focus': 'Samaritan relations, social boundaries'},
                    'John': {'chapters': 21, 'focus': 'Judean-Galilean dynamics'},
                    'Acts': {'chapters': 28, 'focus': 'Missionary journeys, church expansion'},
                    'Romans': {'chapters': 16, 'focus': 'Imperial context, diaspora communities'},
                    'Corinthians': {'chapters': 29, 'focus': 'Urban Christianity, cultural adaptation'},
                    'Galatians': {'chapters': 6, 'focus': 'Ethnic boundaries, religious identity'}
                }
            },
            'quranic_texts': {
                'meccan_period': {
                    'focus': 'Early community formation, tribal relations',
                    'migration_themes': ['Hijra preparation', 'Community solidarity', 'Trade networks']
                },
                'medinan_period': {
                    'focus': 'Community establishment, inter-tribal relations',
                    'migration_themes': ['Hijra narrative', 'Refugee integration', 'Alliance building']
                }
            },
            'apocryphal_texts': {
                '1_maccabees': {'focus': 'Hellenistic resistance, population movements'},
                '2_maccabees': {'focus': 'Cultural preservation, religious persecution'},
                'jubilees': {'focus': 'Chronological frameworks, territorial claims'},
                'enoch': {'focus': 'Cosmological journeys, diaspora theology'}
            }
        }
    
    def analyze_migration_themes(self, text_reference):
        """Analyze migration themes in religious texts"""
        migration_themes = {
            'forced_deportation': {
                'keywords': ['carried away', 'exiled', 'deported', 'captivity'],
                'historical_context': 'Imperial policies of population control'
            },
            'voluntary_migration': {
                'keywords': ['journeyed', 'went out', 'departed', 'traveled'],
                'historical_context': 'Economic opportunity, religious calling'
            },
            'refugee_movements': {
                'keywords': ['fled', 'escaped', 'sought refuge', 'ran away'],
                'historical_context': 'Political persecution, natural disasters'
            },
            'return_migration': {
                'keywords': ['returned', 'restored', 'brought back', 'came home'],
                'historical_context': 'Political change, policy reversal'
            },
            'trade_migration': {
                'keywords': ['merchants', 'traders', 'caravans', 'commerce'],
                'historical_context': 'Economic networks, cultural exchange'
            }
        }
        
        return migration_themes
    
    def get_empire_impact_analysis(self, empire_name, time_period):
        """Analyze how specific empires impacted migrations"""
        empire_impacts = {
            'Assyrian Empire': {
                'deportation_policy': 'Systematic forced relocation to prevent rebellion',
                'cultural_impact': 'Cultural mixing, loss of ethnic identity',
                'biblical_references': ['2 Kings 17:6', '2 Kings 18:11', 'Isaiah 7:8'],
                'affected_groups': ['Northern Kingdom', 'Arameans', 'Phoenicians']
            },
            'Babylonian Empire': {
                'deportation_policy': 'Elite deportation, skilled labor recruitment',
                'cultural_impact': 'Religious innovation, tradition preservation',
                'biblical_references': ['2 Kings 24:14', 'Daniel 1:3', 'Ezekiel 1:1'],
                'affected_groups': ['Judean elite', 'Craftsmen', 'Religious leaders']
            },
            'Persian Empire': {
                'deportation_policy': 'Restoration policy, religious tolerance',
                'cultural_impact': 'Cultural revival, administrative autonomy',
                'biblical_references': ['Ezra 1:1', 'Nehemiah 2:5', 'Esther 8:17'],
                'affected_groups': ['Jewish exiles', 'Various ethnic groups']
            },
            'Greek Empire': {
                'deportation_policy': 'Colonization, cultural assimilation',
                'cultural_impact': 'Hellenization, intellectual synthesis',
                'biblical_references': ['1 Maccabees 1:11', 'Daniel 8:21'],
                'affected_groups': ['Local elites', 'Urban populations']
            },
            'Roman Empire': {
                'deportation_policy': 'Punitive deportation, slave trade',
                'cultural_impact': 'Legal integration, infrastructure development',
                'biblical_references': ['Luke 2:1', 'Acts 18:2', 'Acts 28:16'],
                'affected_groups': ['Jewish diaspora', 'Christian communities']
            }
        }
        
        return empire_impacts.get(empire_name, {})