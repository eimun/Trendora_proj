from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Auto-create tables on startup
from database import init_db
init_db()

# Run migrations
from migrations.add_virality_score import migrate as add_virality
from migrations.add_gap_analysis import migrate as add_gaps
from migrations.add_style_learning import migrate as add_style
from migrations.add_forecasting import migrate as add_forecasting
add_virality()
add_gaps()
add_style()
add_forecasting()

# Register blueprints
from auth import auth_bp
from routes.trends import trends_bp
from routes.generate import generate_bp
from routes.calendar import calendar_bp
from routes.gaps import gaps_bp
from routes.virality import virality_bp
from routes.style import style_bp
from routes.predictions import predictions_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(trends_bp, url_prefix='/api/trends')
app.register_blueprint(generate_bp, url_prefix='/api/generate')
app.register_blueprint(calendar_bp, url_prefix='/api/calendar')
app.register_blueprint(gaps_bp, url_prefix='/api/gaps')
app.register_blueprint(virality_bp, url_prefix='/api/virality')
app.register_blueprint(style_bp, url_prefix='/api/style')
app.register_blueprint(predictions_bp, url_prefix='/api/predictions')

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy", "message": "Trendora API is running"})

from error_handlers import register_error_handlers
register_error_handlers(app)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
