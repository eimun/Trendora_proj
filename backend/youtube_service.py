from googleapiclient.discovery import build  # pyre-ignore[21]
from youtubesearchpython import VideosSearch  # pyre-ignore[21]
import os
from datetime import datetime, timedelta

YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

def _get_youtube_client():
    return build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

def get_channel_recent_videos(channel_id, days=30):
    """Get recent videos from a channel"""
    
    # Calculate date threshold
    since_date = (datetime.now() - timedelta(days=days)).isoformat() + 'Z'
    
    try:
        youtube = _get_youtube_client()
        request = youtube.search().list(
            part='snippet',
            channelId=channel_id,
            type='video',
            publishedAfter=since_date,
            maxResults=50,
            order='date'
        )
        response = request.execute()
        
        videos = []
        for item in response.get('items', []):
            videos.append({
                'title': item['snippet']['title'],
                'description': item['snippet']['description'],
                'published_at': item['snippet']['publishedAt']
            })
        
        return videos
    
    except Exception as e:
        print(f"Error fetching channel videos: {e}")
        return []

def search_videos_by_keyword(keyword, max_results=10):
    """Search YouTube for videos about a keyword"""
    
    try:
        results = VideosSearch(keyword, limit=max_results).result()
        return len(results.get('result', []))
    except:
        return 0

def extract_keywords_from_videos(videos):
    """Extract keywords from video titles and descriptions"""
    
    keywords = set()
    
    for video in videos:
        # Simple keyword extraction (split on spaces, lowercase)
        title_words = video['title'].lower().split()
        keywords.update([w for w in title_words if len(w) > 4])
    
    return list(keywords)

def analyze_trend_gaps(user_id, niche):
    """Find trends that competitors haven't covered"""
    
    from database import get_db_connection  # pyre-ignore[21]
    from trends_service import get_cached_trends  # pyre-ignore[21]
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Get user's tracked competitors
    cur.execute('''
        SELECT channel_id, channel_name FROM competitor_channels
        WHERE user_id = %s AND niche = %s
    ''', (user_id, niche))
    
    competitors: list[tuple[str, str]] = cur.fetchall()
    
    if not competitors:
        cur.close()
        conn.close()
        return {"error": "No competitors tracked for this niche"}
    
    # Get trending topics
    trends = get_cached_trends(niche, max_age_hours=24)
    
    gap_analysis = []
    
    for trend in trends:
        keyword = trend['keyword']
        
        # Check how many competitors covered this
        coverage_count: int = 0
        
        for channel_id, channel_name in competitors:
            videos = get_channel_recent_videos(channel_id, days=14)
            covered_keywords: list[str] = extract_keywords_from_videos(videos)  # pyre-ignore
            
            # Check if trend keyword appears in their content
            if any(keyword.lower() in kw for kw in covered_keywords):
                coverage_count += 1  # pyre-ignore
        
        # Calculate gap score (higher = better opportunity)
        total_competitors: int = len(competitors)
        coverage_ratio: float = coverage_count / total_competitors if total_competitors > 0 else 0  # pyre-ignore
        gap_score: float = (1 - coverage_ratio) * (trend['volume'] / 100000)  # Normalize
        
        gap_analysis.append({
            'keyword': keyword,
            'volume': trend['volume'],
            'competitor_coverage': coverage_count,
            'total_competitors': total_competitors,
            'gap_score': round(gap_score, 2),  # pyre-ignore
            'opportunity': 'High' if gap_score > 0.7 else 'Medium' if gap_score > 0.4 else 'Low'
        })
        
        # Save to database
        cur.execute('''
            INSERT INTO trend_gaps (user_id, keyword, niche, volume, competitor_coverage, gap_score)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (user_id, keyword, niche, trend['volume'], coverage_count, gap_score))
    
    conn.commit()
    cur.close()
    conn.close()
    
    # Sort by gap score
    gap_analysis.sort(key=lambda x: x['gap_score'], reverse=True)
    
    return gap_analysis[:10]  # pyre-ignore  # Return top 10 opportunities
