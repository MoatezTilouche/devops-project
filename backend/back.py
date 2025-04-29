from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)


app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['contact_db']
contacts_collection = db['contacts']

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    try:
        data = request.get_json()
        
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if field not in data or not data[field].strip():
                return jsonify({'error': f'{field} is required'}), 400

        contact_document = {
            'name': data['name'],
            'email': data['email'],
            'subject': data.get('subject', ''),
            'message': data['message'],
            'submitted_at': datetime.utcnow()
        }

        result = contacts_collection.insert_one(contact_document)
        print(f"Document inserted with ID: {result.inserted_id}")

        return jsonify({
            'success': True,
            'message': 'Thank you for your message!'
        })

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
