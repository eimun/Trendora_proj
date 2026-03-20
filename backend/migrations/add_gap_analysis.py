from database import get_db_connection

def migrate():
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute('''
        CREATE TABLE IF NOT EXISTS competitor_channels (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            channel_id VARCHAR(255) NOT NULL,
            channel_name VARCHAR(255),
            niche VARCHAR(100),
            added_at TIMESTAMP DEFAULT NOW()
        )
    ''')
    
    cur.execute('''
        CREATE TABLE IF NOT EXISTS trend_gaps (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            keyword VARCHAR(255),
            niche VARCHAR(100),
            volume INT,
            competitor_coverage INT,
            gap_score FLOAT,
            analyzed_at TIMESTAMP DEFAULT NOW()
        )
    ''')
    
    conn.commit()
    cur.close()
    conn.close()
    print("✅ Gap analysis tables created!")

if __name__ == '__main__':
    migrate()
