from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from datetime import datetime
from bson.objectid import ObjectId

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

# New collection for ratings
ratings_collection = db['ratings']

@app.route('/api/rate', methods=['POST'])
def submit_rating():
    try:
        data = request.get_json()
        print("Received data:", data)  # <== ADD THIS LINE

        required_fields = ['member_name', 'rating', 'message']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Insert the rating into MongoDB
        rating_document = {
            'member_name': data['member_name'],
            'rating': int(data['rating']),  # Make sure rating is integer
            'message': data['message'],
            'submitted_at': datetime.utcnow()
        }

        ratings_collection.insert_one(rating_document)

        print(f"✅ New rating inserted: {rating_document}")
        return jsonify({'success': True, 'message': 'Rating submitted!'}), 201

    except Exception as e:
        print(f"❌ Error processing rating: {str(e)}")
        return jsonify({'error': str(e)}), 500

from flask import request, jsonify
from bson.objectid import ObjectId
from datetime import datetime

posts_collection = db['posts']

# Get all posts
@app.route('/api/post', methods=['GET'])
def display_posts():
    try:
        posts = list(posts_collection.find())
        for post in posts:
            post['_id'] = str(post['_id'])
        return jsonify(posts), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Create new post
@app.route('/api/post', methods=['POST'])
def create_post():
    try:
        data = request.get_json()
        required = ['auteur', 'subject', 'description']
        for field in required:
            if field not in data or not str(data[field]).strip():
                return jsonify({'error': f'{field} is required'}), 400
        
        post = {
            'auteur': data['auteur'],
            'subject': data['subject'],
            'description': data['description'],
            'responses': [],
            'created_at': datetime.utcnow()
        }
        result = posts_collection.insert_one(post)
        return jsonify({'_id': str(result.inserted_id), 'message': 'Post created'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get a single post
@app.route('/api/post/<post_id>', methods=['GET'])
def get_post(post_id):
    try:
        post = posts_collection.find_one({'_id': ObjectId(post_id)})
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        post['_id'] = str(post['_id'])
        return jsonify(post), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Add a response to a post
@app.route('/api/post/<post_id>/response', methods=['POST'])
def add_response(post_id):
    try:
        data = request.get_json()
        if 'author' not in data or 'message' not in data:
            return jsonify({'error': 'author and message required'}), 400
        
        response = {
            'author': data['author'],
            'message': data['message'],
            'timestamp': datetime.utcnow()
        }

        result = posts_collection.update_one(
            {'_id': ObjectId(post_id)},
            {'$push': {'responses': response}}
        )

        if result.modified_count == 0:
            return jsonify({'error': 'Post not found or unchanged'}), 404

        return jsonify({'message': 'Response added'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete a post
@app.route('/api/post/<post_id>', methods=['DELETE'])
def delete_post(post_id):
    try:
        result = posts_collection.delete_one({'_id': ObjectId(post_id)})
        if result.deleted_count == 0:
            return jsonify({'error': 'Post not found'}), 404
        return jsonify({'message': 'Post deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
