from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-fallback-key')

@app.route('/')
def home():
    return jsonify({"message": "Trendora API"})

@app.route('/api/health')
def health():
    return jsonify({"status": "healthy", "message": "Trendora API is running"})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
