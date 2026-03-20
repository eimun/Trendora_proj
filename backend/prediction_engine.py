import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
from database import get_db_connection

def fetch_historical_data(keyword, niche, days=14):
    """Get historical volume data for a keyword"""
    
    conn = get_db_connection()
    
    query = '''
        SELECT snapshot_date, volume
        FROM trends_history
        WHERE keyword = %s AND niche = %s
        AND snapshot_date >= CURRENT_DATE - INTERVAL '%s days'
        ORDER BY snapshot_date ASC
    '''
    
    df = pd.read_sql_query(query, conn, params=(keyword, niche, days))
    conn.close()
    
    return df

def calculate_growth_velocity(volumes):
    """Calculate how fast the trend is growing"""
    
    if len(volumes) < 2:
        return 0
    
    # Calculate day-over-day growth rates
    growth_rates = []
    for i in range(1, len(volumes)):
        if volumes[i-1] > 0:
            rate = ((volumes[i] - volumes[i-1]) / volumes[i-1]) * 100
            growth_rates.append(rate)
    
    # Return average growth rate
    return np.mean(growth_rates) if growth_rates else 0

def predict_trend_trajectory(keyword, niche):
    """
    Predict if a trend will continue growing and when it might peak
    
    Returns:
    {
        'keyword': str,
        'current_volume': int,
        'predicted_volume_7d': int,
        'growth_rate': float,
        'confidence': float,
        'predicted_peak_date': str,
        'recommendation': str
    }
    """
    
    # Get historical data
    df = fetch_historical_data(keyword, niche, days=14)
    
    if len(df) < 3:
        return None  # Not enough data
    
    # Prepare data for regression
    df['day_number'] = (df['snapshot_date'] - df['snapshot_date'].min()).dt.days
    X = df['day_number'].values.reshape(-1, 1)
    y = df['volume'].values
    
    # Fit linear regression model
    model = LinearRegression()
    model.fit(X, y)
    
    # Calculate R² score (confidence)
    confidence = model.score(X, y)
    
    # Predict 7 days ahead
    future_day = df['day_number'].max() + 7
    predicted_volume = int(model.predict([[future_day]])[0])
    
    # Calculate growth rate
    current_volume = int(y[-1])
    growth_rate = calculate_growth_velocity(y)
    
    # Determine if trend is rising or falling
    slope = model.coef_[0]
    
    # Predict peak date
    if slope > 0:
        # Still rising - estimate when it might plateau
        # Assume plateau when growth rate drops below 5%
        days_to_peak = max(3, min(int(abs(100 / growth_rate)) if growth_rate != 0 else 7, 14))
        predicted_peak_date = datetime.now() + timedelta(days=days_to_peak)
    else:
        # Declining - peak was probably recent
        predicted_peak_date = datetime.now() + timedelta(days=1)
    
    # Generate recommendation
    if slope > 1000 and growth_rate > 10:
        recommendation = "🔥 Act NOW! Explosive growth detected."
    elif slope > 500 and growth_rate > 5:
        recommendation = "⚡ Strong uptrend. Create content in next 2-3 days."
    elif slope > 0:
        recommendation = "📈 Moderate growth. Good opportunity."
    elif slope > -500:
        recommendation = "⚠️ Plateauing. Consider if still relevant."
    else:
        recommendation = "❌ Declining. Look for fresher topics."
    
    return {
        'keyword': keyword,
        'niche': niche,
        'current_volume': current_volume,
        'predicted_volume_7d': max(0, predicted_volume),
        'growth_rate': round(growth_rate, 2),
        'confidence': round(confidence, 2),
        'predicted_peak_date': predicted_peak_date.strftime('%Y-%m-%d'),
        'recommendation': recommendation,
        'slope': slope
    }

def batch_predict_trends(niche):
    """Predict trajectories for all trends in a niche"""
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Get unique keywords from recent history
    cur.execute('''
        SELECT DISTINCT keyword
        FROM trends_history
        WHERE niche = %s
        AND snapshot_date >= CURRENT_DATE - INTERVAL '14 days'
    ''', (niche,))
    
    keywords = [row[0] for row in cur.fetchall()]
    cur.close()
    conn.close()
    
    predictions = []
    
    for keyword in keywords:
        prediction = predict_trend_trajectory(keyword, niche)
        if prediction and prediction['confidence'] > 0.5:  # Only confident predictions
            predictions.append(prediction)
    
    # Sort by slope (fastest growing first)
    predictions.sort(key=lambda x: x['slope'], reverse=True)
    
    return predictions[:20]  # Top 20

def save_predictions_to_db(predictions):
    """Cache predictions in database"""
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    for pred in predictions:
        cur.execute('''
            INSERT INTO predicted_trends 
            (keyword, niche, current_volume, predicted_volume, growth_rate, confidence_score, predicted_peak_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (keyword, niche, prediction_made_at) DO UPDATE
            SET current_volume = EXCLUDED.current_volume,
                predicted_volume = EXCLUDED.predicted_volume,
                growth_rate = EXCLUDED.growth_rate,
                confidence_score = EXCLUDED.confidence_score,
                predicted_peak_date = EXCLUDED.predicted_peak_date
        ''', (
            pred['keyword'],
            pred['niche'],
            pred['current_volume'],
            pred['predicted_volume_7d'],
            pred['growth_rate'],
            pred['confidence'],
            pred['predicted_peak_date']
        ))
    
    conn.commit()
    cur.close()
    conn.close()
