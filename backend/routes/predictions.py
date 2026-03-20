from flask import Blueprint, jsonify, request
from auth import token_required
from prediction_engine import batch_predict_trends, predict_trend_trajectory, save_predictions_to_db
from database import get_db_connection

predictions_bp = Blueprint('predictions', __name__)

@predictions_bp.route('/forecast', methods=['POST'])
@token_required
def forecast_trends():
    """Generate predictions for a niche"""
    data = request.json
    niche = data.get('niche', 'tech')
    
    # Run predictions
    predictions = batch_predict_trends(niche)
    
    if not predictions:
        return jsonify({"error": "Not enough historical data. Check back in 3-5 days."}), 400
    
    # Save to database
    save_predictions_to_db(predictions)
    
    return jsonify({"predictions": predictions})

@predictions_bp.route('/cached', methods=['GET'])
@token_required
def get_cached_predictions():
    """Get today's cached predictions"""
    niche = request.args.get('niche', 'tech')
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute('''
        SELECT keyword, current_volume, predicted_volume, growth_rate, 
               confidence_score, predicted_peak_date, prediction_made_at
        FROM predicted_trends
        WHERE niche = %s
        AND DATE(prediction_made_at) = CURRENT_DATE
        ORDER BY growth_rate DESC
        LIMIT 20
    ''', (niche,))
    
    predictions = cur.fetchall()
    cur.close()
    conn.close()
    
    return jsonify([
        {
            "keyword": p[0],
            "current_volume": p[1],
            "predicted_volume_7d": p[2],
            "growth_rate": p[3],
            "confidence": p[4],
            "predicted_peak_date": p[5].isoformat() if p[5] else None,
            "cached_at": p[6].isoformat()
        }
        for p in predictions
    ])

@predictions_bp.route('/single', methods=['POST'])
@token_required
def predict_single():
    """Predict trajectory for a specific keyword"""
    data = request.json
    keyword = data.get('keyword')
    niche = data.get('niche', 'tech')
    
    if not keyword:
        return jsonify({"error": "Keyword required"}), 400
    
    prediction = predict_trend_trajectory(keyword, niche)
    
    if not prediction:
        return jsonify({"error": "Not enough historical data for this keyword"}), 400
    
    return jsonify(prediction)
