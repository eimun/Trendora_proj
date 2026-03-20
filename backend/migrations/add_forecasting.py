from database import get_db_connection

def migrate():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Historical trends table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS trends_history (
            id SERIAL PRIMARY KEY,
            keyword VARCHAR(255) NOT NULL,
            niche VARCHAR(100),
            volume INT,
            velocity VARCHAR(50),
            snapshot_date DATE DEFAULT CURRENT_DATE,
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(keyword, niche, snapshot_date)
        )
    ''')
    
    # Create index for fast queries
    cur.execute('''
        CREATE INDEX IF NOT EXISTS idx_trends_history_date 
        ON trends_history(snapshot_date DESC)
    ''')
    
    cur.execute('''
        CREATE INDEX IF NOT EXISTS idx_trends_history_keyword 
        ON trends_history(keyword, niche)
    ''')
    
    # Predicted trends table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS predicted_trends (
            id SERIAL PRIMARY KEY,
            keyword VARCHAR(255) NOT NULL,
            niche VARCHAR(100),
            current_volume INT,
            predicted_volume INT,
            growth_rate FLOAT,
            confidence_score FLOAT,
            predicted_peak_date DATE,
            prediction_made_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(keyword, niche, prediction_made_at)
        )
    ''')
    
    conn.commit()
    cur.close()
    conn.close()
    print("✅ Forecasting tables created!")

if __name__ == '__main__':
    migrate()
