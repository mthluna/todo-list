import mongoose, { ConnectionOptions } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

export default () => {
    let mongoServer: MongoMemoryServer;
    beforeAll(async () => {
      mongoServer = new MongoMemoryServer();
      const URI = await mongoServer.getUri();
    
      mongoose.connect(URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      });
    });
    
    afterAll(async done => {
      mongoose.disconnect(done);
      await mongoServer.stop();
    });
    
    afterEach(async () => {
      const connection: ConnectionOptions = await mongoose.connection;

      if (connection.db) {
        const collections = await connection.db.collections();
        for (let collection of collections) {
          await collection.deleteMany({});
        }
      }
    });
}
