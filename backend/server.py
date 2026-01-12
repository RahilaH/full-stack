from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import io

app = Flask(__name__)
CORS(app)

# In-memory store for demo purposes
enquiries = [
    {"name": "Sample Student", "email": "sample@example.com", "course": "Demo Course", "status": "New", "dropouts": "0"}
]

@app.route('/enquiries', methods=['GET'])
def get_enquiries():
    return jsonify(enquiries), 200

@app.route('/enquiries/add', methods=['POST'])
def add_enquiry():
    data = request.get_json() or {}
    if not data.get('name') or not data.get('email') or not data.get('course'):
        return jsonify({"error": "Missing required fields"}), 400
    enquiries.append(data)
    return jsonify(data), 201

@app.route('/enquiries/upload-csv', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    f = request.files['file']
    content = f.stream.read().decode('utf-8')
    reader = csv.DictReader(io.StringIO(content))
    count = 0
    for row in reader:
        enquiries.append({
            'name': row.get('name') or row.get('Name') or '',
            'email': row.get('email') or row.get('Email') or '',
            'course': row.get('course') or row.get('Course') or '',
            'status': row.get('status') or row.get('Status') or 'New',
            'dropouts': row.get('dropouts') or row.get('Dropouts') or '-'
        })
        count += 1
    return jsonify({"added": count}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
