from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json
import sys
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def root():
    return {"message": "Biblical NLP Service is running"}

@app.route('/extract-movements', methods=['POST'])
def extract_movements():
    try:
        data = request.get_json()
        text = data.get('text', '')
        reference = data.get('reference', {})
        locations = data.get('locations', {})
        
        # Call the movement extractor script
        input_data = {
            'text': text,
            'reference': reference,
            'locations': locations
        }
        
        # Run the Python script
        process = subprocess.Popen([
            sys.executable, 'movementExtractor.py'
        ], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        stdout, stderr = process.communicate(input=json.dumps(input_data))
        
        if process.returncode == 0:
            try:
                movements = json.loads(stdout)
                return jsonify({
                    'success': True,
                    'data': movements
                })
            except json.JSONDecodeError:
                return jsonify({
                    'success': False,
                    'error': 'Failed to parse NLP results'
                }), 500
        else:
            return jsonify({
                'success': False,
                'error': f'NLP processing failed: {stderr}'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)
