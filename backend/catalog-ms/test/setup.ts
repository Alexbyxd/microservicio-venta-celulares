// Test setup - mock environment variables BEFORE any imports
process.env.PORT = '3002';
process.env.RABBITMQ_HOST = 'amqp://localhost:5672';
process.env.DATABASE_URL = 'mongodb://localhost:27017/test';
process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
process.env.CLOUDINARY_API_KEY = 'test-key';
process.env.CLOUDINARY_API_SECRET = 'test-secret';