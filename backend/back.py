from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'default-secret-key')

# MongoDB Connection Setup
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')  # Example default
client = MongoClient(MONGO_URI)
db = client['contact_db']  # Database name
contacts_collection = db['contacts']  # Collection name

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if field not in data or not data[field].strip():
                return jsonify({'error': f'{field} is required'}), 400
        
        # Prepare document to insert
        contact_document = {
            'name': data['name'],
            'email': data['email'],
            'message': data['message'],
            'submitted_at': datetime.utcnow()  # Save the timestamp
        }
        
        # Insert into MongoDB
        contacts_collection.insert_one(contact_document)
        
        print(f"New contact saved: {contact_document}")  # For debugging
        
        return jsonify({
            'success': True,
            'message': 'Thank you for your message! We will get back to you soon.'
        })
    
    except Exception as e:
        print(f"Error processing contact form: {str(e)}")
        return jsonify({'error': 'An error occurred while processing your request'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
