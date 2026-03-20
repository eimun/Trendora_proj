from flask import Blueprint, jsonify, request
from auth import token_required
from database import get_db_connection
from datetime import datetime

calendar_bp = Blueprint('calendar', __name__)

@calendar_bp.route('/save', methods=['POST'])
@token_required
def save_to_calendar():
    data = request.json
    content_id = data.get('content_id')
    scheduled_date = data.get('date')
    scheduled_time = data.get('time', '09:00')
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO content_calendar (user_id, content_id, scheduled_date, scheduled_time)
        VALUES (%s, %s, %s, %s)
        RETURNING id
    ''', (request.user_id, content_id, scheduled_date, scheduled_time))
    
    calendar_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify({"calendar_id": calendar_id})

@calendar_bp.route('/list', methods=['GET'])
@token_required
def get_calendar():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        SELECT c.id, c.scheduled_date, c.scheduled_time, c.status, 
               g.trend_keyword, g.content_type
        FROM content_calendar c
        JOIN generated_content g ON c.content_id = g.id
        WHERE c.user_id = %s
        ORDER BY c.scheduled_date, c.scheduled_time
    ''', (request.user_id,))
    
    events = cur.fetchall()
    cur.close()
    conn.close()
    
    return jsonify([
        {
            "id": e[0],
            "date": e[1].isoformat(),
            "time": str(e[2]),
            "status": e[3],
            "keyword": e[4],
            "type": e[5]
        }
        for e in events
    ])
