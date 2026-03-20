import os
import json
from google import genai

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
MODEL = "gemini-2.0-flash"

def analyze_writing_style(sample_texts):
    """
    Analyze user's writing style from sample content
    Returns a style profile
    """
    
    combined_samples = "\n\n---\n\n".join(sample_texts)
    
    prompt = f"""
Analyze the writing style in these samples and create a detailed style profile:

{combined_samples}

Return a JSON object with:
{{
  "tone": "casual/professional/enthusiastic/etc",
  "vocabulary_level": "simple/intermediate/advanced",
  "sentence_structure": "short/mixed/complex",
  "humor_style": "none/sarcastic/playful/witty",
  "signature_phrases": ["phrase1", "phrase2"],
  "emoji_usage": "none/minimal/frequent",
  "pacing": "fast/moderate/slow",
  "perspective": "first-person/second-person/third-person",
  "key_characteristics": ["trait1", "trait2", "trait3"]
}}
"""
    
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt
        )
        text = response.text.strip()
        
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0].strip()
        
        return json.loads(text)
    except Exception as e:
        print(f"Style analysis error: {e}")
        return None

def generate_in_user_style(trend_keyword, style_profile, sample_scripts, content_type='video'):
    """Generate content matching user's style"""
    
    # Build context from style profile
    style_description = f"""
Tone: {style_profile.get('tone', 'casual')}
Vocabulary: {style_profile.get('vocabulary_level', 'simple')}
Sentence Structure: {style_profile.get('sentence_structure', 'short')}
Humor: {style_profile.get('humor_style', 'none')}
Emoji Usage: {style_profile.get('emoji_usage', 'minimal')}
Pacing: {style_profile.get('pacing', 'fast')}
Perspective: {style_profile.get('perspective', 'first-person')}
"""
    
    # Include sample scripts as examples
    examples = "\n\n".join([f"Example {i+1}:\n{script}" for i, script in enumerate(sample_scripts[:3])])
    
    if content_type == 'video':
        prompt = f"""
You are mimicking a specific content creator's style. Study these examples carefully:

{examples}

STYLE PROFILE:
{style_description}

Now create a 60-second TikTok/YouTube Shorts script about: {trend_keyword}

CRITICAL: Match the EXACT tone, vocabulary, pacing, and style of the examples above.

Return as JSON:
{{
  "hook": "First 3 seconds (use their style)",
  "body": "Main content (40 seconds, their voice)",
  "cta": "Call-to-action (their way)",
  "visual_cues": ["shot 1", "shot 2", "shot 3"]
}}
"""
    else:
        prompt = f"""
You are mimicking a specific content creator's style.

Examples:
{examples}

Style: {style_description}

Create a blog outline about: {trend_keyword}

Match their style EXACTLY. Return as JSON:
{{
  "title": "Their style title",
  "hook": "Opening paragraph (their voice)",
  "sections": ["Section 1", "Section 2", "Section 3"],
  "conclusion": "Closing (their style)"
}}
"""
    
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt
        )
        text = response.text.strip()
        
        if '```json' in text:
            text = text.split('```json')[1].split('```')[0].strip()
        
        return json.loads(text)
    except Exception as e:
        print(f"Style generation error: {e}")
        return None
