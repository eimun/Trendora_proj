import os
import json
from google import genai

gemini_key = os.getenv('GEMINI_API_KEY')
print(f"🔑 GEMINI_API_KEY loaded: {'YES (' + gemini_key[:10] + '...)' if gemini_key else 'NO - KEY IS MISSING!'}")  # type: ignore[index]

client = genai.Client(api_key=gemini_key)
MODEL = "gemini-2.0-flash"

def generate_script(trend_keyword, content_type='video', user_id=None, use_style=False):
    """Generate content script using Gemini, optionally using user's style"""
    
    if use_style and user_id:
        try:
            # Check if user has style profile
            from database import get_db_connection
            from style_analyzer import generate_in_user_style
            
            conn = get_db_connection()
            cur = conn.cursor()
            
            cur.execute('''
                SELECT style_trained, style_profile FROM users WHERE id = %s
            ''', (user_id,))
            
            user_data = cur.fetchone()
            
            if user_data and user_data[0]:  # style_trained is True
                # Get user's past scripts
                cur.execute('''
                    SELECT script_text FROM generated_content
                    WHERE user_id = %s
                    ORDER BY created_at DESC
                    LIMIT 5
                ''', (user_id,))
                
                scripts = [json.loads(row[0]) for row in cur.fetchall()]
                sample_texts = [f"{s.get('hook', '')} {s.get('body', '')}" for s in scripts]
                
                style_profile = json.loads(user_data[1])
                
                cur.close()
                conn.close()
                
                # Generate using style
                result = generate_in_user_style(trend_keyword, style_profile, sample_texts, content_type)
                if result:
                    return result
            else:
                cur.close()
                conn.close()
        except Exception as e:
            print(f"⚠️ Style-based generation failed, falling back to standard: {e}")
    
    # Standard generation (fallback or default)
    if content_type == 'video':
        prompt = f"""
You are a viral content creator. Create a 60-second TikTok/YouTube Shorts script about: {trend_keyword}

Structure your response EXACTLY as valid JSON:
{{
  "hook": "An attention-grabbing first 3 seconds",
  "body": "Main content (40 seconds)",
  "cta": "Strong call-to-action",
  "visual_cues": ["shot 1", "shot 2", "shot 3"]
}}

Make it engaging, trendy, and actionable. Use simple language.
"""
    else:  # blog
        prompt = f"""
Create a blog outline about: {trend_keyword}

Structure as JSON:
{{
  "title": "SEO-optimized title",
  "hook": "Opening paragraph",
  "sections": ["Section 1", "Section 2", "Section 3"],
  "conclusion": "Closing paragraph"
}}
"""
    
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt
        )
        text = response.text.strip()
        
        # Extract JSON from response (handle markdown code blocks)
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0].strip()
        elif '```' in text:
            text = text.split('```')[1].split('```')[0].strip()
        
        return json.loads(text)
    
    except Exception as e:
        print(f"AI generation error: {e}")
        return {
            "hook": f"Talking about {trend_keyword}...",
            "body": "Content generation failed. Please try again.",
            "cta": "Like and subscribe!",
            "visual_cues": []
        }

def generate_hooks(trend_keyword, count=3):
    """Generate multiple hook variations"""
    
    prompt = f"""
Generate {count} different viral hooks/titles for content about: {trend_keyword}

Each hook should use a different psychological trigger:
1. Curiosity gap
2. Controversy/Hot take
3. How-to/Value promise

Return as JSON array:
["Hook 1", "Hook 2", "Hook 3"]
"""
    
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt
        )
        text = response.text.strip()
        
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0].strip()
        elif '```' in text:
            text = text.split('```')[1].split('```')[0].strip()
        
        return json.loads(text)
    except:
        return [
            f"You won't believe this about {trend_keyword}",
            f"Why everyone is talking about {trend_keyword}",
            f"How to use {trend_keyword} in 2024"
        ]

def generate_hashtags(trend_keyword):
    """Generate relevant hashtags"""
    
    prompt = f"""
Generate 10 relevant hashtags for content about: {trend_keyword}

Return as JSON array: ["#hashtag1", "#hashtag2", ...]
Mix of trending and niche hashtags.
"""
    
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt
        )
        text = response.text.strip()
        
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0].strip()
        elif '```' in text:
            text = text.split('```')[1].split('```')[0].strip()
        
        return json.loads(text)
    except:
        return [f"#{trend_keyword.replace(' ', '')}", "#viral", "#trending"]
