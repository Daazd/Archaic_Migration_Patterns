import requests
import os
from flask import current_app

class BibleService:
    def __init__(self):
        self.api_key = os.getenv('BIBLE_API_KEY')
        self.base_url = 'https://api.scripture.api.bible/v1'
        self.bible_id = 'de4e12af7f28f599-02'  # ESV translation
        
    def get_headers(self):
        return {'api-key': self.api_key}
    
    def get_bible_structure(self):
        """Get the structure of the Bible (books, chapters)"""
        # Return a basic structure for now
        return {
            'Genesis': {'id': 'GEN', 'chapters': 50, 'abbr': 'Gen'},
            'Exodus': {'id': 'EXO', 'chapters': 40, 'abbr': 'Exo'},
            'Acts': {'id': 'ACT', 'chapters': 28, 'abbr': 'Acts'}
        }
    
    def get_passage(self, book, chapter, start_verse=1, end_verse=None):
        """Get Bible passage text"""
        if not self.api_key:
            return f"Sample text from {book} {chapter}:{start_verse}. Please add your Bible API key to see real content."
        
        try:
            reference = f"{book}.{chapter}"
            if end_verse:
                reference += f".{start_verse}-{end_verse}"
            elif start_verse > 1:
                reference += f".{start_verse}"
            
            url = f"{self.base_url}/bibles/{self.bible_id}/passages"
            params = {
                'q': reference,
                'content-type': 'text',
                'include-notes': False,
                'include-titles': False,
                'include-chapter-numbers': False,
                'include-verse-numbers': True
            }
            
            response = requests.get(url, headers=self.get_headers(), params=params)
            response.raise_for_status()
            
            return response.json()['data']['content']
        except Exception as e:
            current_app.logger.error(f"Error getting Bible passage: {str(e)}")
            return f"Error loading {book} {chapter}:{start_verse}. Please check your API key."
    
    def search_bible(self, query, limit=20):
        """Search Bible text"""
        return [{'reference': 'Sample 1:1', 'text': f'Sample search result for: {query}'}]
