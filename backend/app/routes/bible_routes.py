from flask import Blueprint, request, jsonify
from ..services.bible_service import BibleService

bible_bp = Blueprint('bible', __name__)
bible_service = BibleService()

@bible_bp.route('/structure', methods=['GET'])
def get_bible_structure():
    try:
        structure = bible_service.get_bible_structure()
        return jsonify({'success': True, 'data': structure})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@bible_bp.route('/passage/<book>/<int:chapter>', methods=['GET'])
@bible_bp.route('/passage/<book>/<int:chapter>/<int:start_verse>', methods=['GET'])
@bible_bp.route('/passage/<book>/<int:chapter>/<int:start_verse>/<int:end_verse>', methods=['GET'])
def get_passage(book, chapter, start_verse=1, end_verse=None):
    try:
        text = bible_service.get_passage(book, chapter, start_verse, end_verse)
        reference = f"{book} {chapter}"
        if start_verse > 1 or end_verse:
            reference += f":{start_verse}"
            if end_verse and end_verse != start_verse:
                reference += f"-{end_verse}"
        
        return jsonify({
            'success': True,
            'data': {
                'reference': reference,
                'text': text
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@bible_bp.route('/search', methods=['GET'])
def search_bible():
    try:
        query = request.args.get('query')
        limit = request.args.get('limit', 20, type=int)
        
        if not query:
            return jsonify({'success': False, 'error': 'Please provide a search query'}), 400
        
        results = bible_service.search_bible(query, limit)
        return jsonify({
            'success': True,
            'count': len(results),
            'data': results
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
