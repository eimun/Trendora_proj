from flask import Blueprint, jsonify, request
from auth import token_required
from database import get_db_connection
from style_analyzer import analyze_writing_style
import json

style_bp = Blueprint('style', __name__)

@style_bp.route('/train', methods=['POST'])
@token_required
def train_style():
    """Analyze user's past content to create style profile"""
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Get user's past scripts (need at least 3)
        cur.execute('''
            SELECT script_text FROM generated_content
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT 10
        ''', (request.user_id,))
        
        scripts = cur.fetchall()
        print(f"📝 Found {len(scripts)} scripts for user {request.user_id}")
        
        if len(scripts) < 3:
            cur.close()
            conn.close()
            return jsonify({"error": f"Need at least 3 saved scripts to train style (you have {len(scripts)})"}), 400
        
        # Extract text from scripts
        sample_texts = []
        for script_json in scripts:
            try:
                script = json.loads(script_json[0])
                text = f"{script.get('hook', '')} {script.get('body', '')} {script.get('cta', '')}"
                sample_texts.append(text)
            except Exception as parse_err:
                print(f"⚠️ Failed to parse script: {parse_err}")
                continue
        
        print(f"📄 Extracted {len(sample_texts)} sample texts")
        
        if len(sample_texts) < 1:
            cur.close()
            conn.close()
            return jsonify({"error": "Could not parse any saved scripts"}), 400
        
        # Analyze style
        style_profile = analyze_writing_style(sample_texts)
        
        if not style_profile:
            cur.close()
            conn.close()
            return jsonify({"error": "Style analysis failed - check Render logs for Gemini error details"}), 500
        
        # Save to database
        cur.execute('''
            UPDATE users
            SET style_trained = TRUE, style_profile = %s
            WHERE id = %s
        ''', (json.dumps(style_profile), request.user_id))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            "message": "Style profile created!",
            "profile": style_profile
        })
    except Exception as e:
        print(f"❌ Style training error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Style training failed: {str(e)}"}), 500

@style_bp.route('/status', methods=['GET'])
@token_required
def get_style_status():
    """Check if user has style profile trained"""
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute('''
        SELECT style_trained, style_profile FROM users WHERE id = %s
    ''', (request.user_id,))
    
    user_data = cur.fetchone()
    cur.close()
    conn.close()
    
    if not user_data:
        return jsonify({"trained": False})
    
    trained, profile = user_data
    
    return jsonify({
        "trained": trained or False,
        "profile": json.loads(profile) if profile else None
    })

@style_bp.route('/reset', methods=['POST'])
@token_required
def reset_style():
    """Reset user's style profile"""
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute('''
        UPDATE users
        SET style_trained = FALSE, style_profile = NULL
        WHERE id = %s
    ''', (request.user_id,))
    
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify({"message": "Style profile reset"})
