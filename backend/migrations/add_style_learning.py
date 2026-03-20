from database import get_db_connection

def migrate():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Add columns to users table
    cur.execute('''
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS style_trained BOOLEAN DEFAULT FALSE
    ''')
    
    cur.execute('''
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS style_profile TEXT
    ''')
    
    conn.commit()
    cur.close()
    conn.close()
    print("✅ Style learning columns added!")

if __name__ == '__main__':
    migrate()
