from flask import Blueprint, jsonify, request
from auth import token_required
from ai_service import generate_script, generate_hooks, generate_hashtags
from database import get_db_connection
import json

generate_bp = Blueprint('generate', __name__)

@generate_bp.route('/script', methods=['POST'])
@token_required
def create_script():
    try:
        data = request.json
        trend_keyword = data.get('keyword')
        content_type = data.get('type', 'video')
        use_style = data.get('use_style', False)
        
        if not trend_keyword:
            return jsonify({"error": "Keyword required"}), 400
        
        # Generate content (with optional style)
        try:
            script = generate_script(trend_keyword, content_type, request.user_id, use_style)
        except Exception as e:
            print(f"⚠️ generate_script failed: {e}")
            script = {
                "hook": f"Let's talk about {trend_keyword}...",
                "body": "Content generation encountered an issue. Please try again.",
                "cta": "Follow for more!",
                "visual_cues": []
            }
        
        try:
            hooks = generate_hooks(trend_keyword)
        except Exception as e:
            print(f"⚠️ generate_hooks failed: {e}")
            hooks = [f"Why {trend_keyword} matters", f"The truth about {trend_keyword}", f"How to use {trend_keyword}"]
        
        try:
            hashtags = generate_hashtags(trend_keyword)
        except Exception as e:
            print(f"⚠️ generate_hashtags failed: {e}")
            hashtags = [f"#{trend_keyword.replace(' ', '')}", "#trending", "#viral"]
        
        # Save to database
        content_id = None
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute('''
                INSERT INTO generated_content (user_id, trend_keyword, content_type, script_text, hooks, hashtags)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (request.user_id, trend_keyword, content_type, json.dumps(script), hooks, hashtags))
            
            content_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
        except Exception as e:
            print(f"⚠️ Failed to save content to DB: {e}")
        
        return jsonify({
            "content_id": content_id,
            "script": script,
            "hooks": hooks,
            "hashtags": hashtags
        })
    
    except Exception as e:
        print(f"❌ Error in create_script: {e}")
        return jsonify({"error": str(e)}), 500
