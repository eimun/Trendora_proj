from flask import Blueprint, jsonify, request
from auth import token_required
from database import get_db_connection
from youtube_service import analyze_trend_gaps, get_channel_recent_videos

gaps_bp = Blueprint('gaps', __name__)

@gaps_bp.route('/add-competitor', methods=['POST'])
@token_required
def add_competitor():
    data = request.json
    channel_id = data.get('channel_id')
    channel_name = data.get('channel_name')
    niche = data.get('niche')
    
    if not channel_id or not niche:
        return jsonify({"error": "Channel ID and niche required"}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute('''
        INSERT INTO competitor_channels (user_id, channel_id, channel_name, niche)
        VALUES (%s, %s, %s, %s)
        RETURNING id
    ''', (request.user_id, channel_id, channel_name, niche))
    
    competitor_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify({"competitor_id": competitor_id, "message": "Competitor added successfully"})

@gaps_bp.route('/analyze', methods=['POST'])
@token_required
def analyze_gaps():
    data = request.json
    niche = data.get('niche', 'tech')
    
    gaps = analyze_trend_gaps(request.user_id, niche)
    
    return jsonify({"gaps": gaps})

@gaps_bp.route('/list-competitors', methods=['GET'])
@token_required
def list_competitors():
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute('''
        SELECT id, channel_id, channel_name, niche, added_at
        FROM competitor_channels
        WHERE user_id = %s
        ORDER BY added_at DESC
    ''', (request.user_id,))
    
    competitors = cur.fetchall()
    cur.close()
    conn.close()
    
    return jsonify([
        {
            "id": c[0],
            "channel_id": c[1],
            "channel_name": c[2],
            "niche": c[3],
            "added_at": c[4].isoformat()
        }
        for c in competitors
    ])
