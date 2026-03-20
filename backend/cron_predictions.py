"""
Daily cron to generate predictions
Run daily after archiver: python cron_predictions.py
"""

from prediction_engine import batch_predict_trends, save_predictions_to_db
import schedule
import time
from datetime import datetime

NICHES = ['tech', 'finance', 'lifestyle', 'health']

def generate_daily_predictions():
    """Run predictions for all niches"""
    print(f"[{datetime.now()}] Generating daily predictions...")
    
    for niche in NICHES:
        print(f"Predicting {niche} trends...")
        
        try:
            predictions = batch_predict_trends(niche)
            
            if predictions:
                save_predictions_to_db(predictions)
                print(f"✅ Saved {len(predictions)} predictions for {niche}")
            else:
                print(f"⚠️ Not enough data for {niche} predictions yet")
        
        except Exception as e:
            print(f"❌ Error predicting {niche}: {e}")
            continue
    
    print(f"[{datetime.now()}] Predictions complete!\n")

# Schedule for 1 AM daily (after archiver runs at midnight)
schedule.every().day.at("01:00").do(generate_daily_predictions)

def run_scheduler():
    print("🤖 Prediction Engine started. Waiting for scheduled runs...")
    print("Next run: 1 AM daily")
    
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == '__main__':
    # Run once immediately
    print("Running initial prediction generation...")
    generate_daily_predictions()
    
    # Start scheduler
    run_scheduler()
