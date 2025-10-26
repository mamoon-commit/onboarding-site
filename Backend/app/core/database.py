import certifi
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# MongoDB connection
uri = "mongodb+srv://mamoon:admin@cluster0.znonofh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

def get_database():
    """
    Establish connection to MongoDB and return database instance
    """
    try:
        # Try secure first
        client = MongoClient(
            uri,
            server_api=ServerApi('1'),
            serverSelectionTimeoutMS=15000,
            tls=True,
            tlsCAFile=certifi.where()
        )
        client.admin.command('ping')
        print("✅ Secure connection successful!")
        
    except Exception as e:
        print(f"⚠️ Secure connection failed: {str(e)[:50]}...")
        print("🔄 Using development bypass...")
        
        # Development bypass - still encrypted, just skips certificate validation
        client = MongoClient(
            uri,
            server_api=ServerApi('1'),
            serverSelectionTimeoutMS=15000,
            tls=True,
            tlsAllowInvalidCertificates=True  # Only for development!
        )
        client.admin.command('ping')
        print("✅ Connected with development configuration!")

    # Database setup
    if client:
        db = client.employee_onboarding
        print("✅ Database 'employee_onboarding' connected!")
        return db, client
    else:
        print("❌ Database setup failed!")
        return None, None

# Initialize database connection
db, client = get_database()

# Collections
users_collection = db.users if db is not None else None

if users_collection is not None:
    print("✅ Collection 'users' ready!")
else:
    print("❌ Collection setup failed!")


documents_collection = db.documents if db is not None else None

if documents_collection is not None:
    print("✅ Collection 'documents' ready!")
else:
    print("❌ Collection setup failed!")