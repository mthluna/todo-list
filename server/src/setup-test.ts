import mongoose, { ConnectionOptions } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import supertest from 'supertest';
import app from './app'

let TOKEN = '';

type m = "get" | "post" | "put" | "delete"
const hook = (method: m) => (route: string) => {
  const test = supertest(app);

  return test[method](route)
    .set('Authorization', `Bearer ${TOKEN}`);
}

export const request = {
  post: hook('post'),
  get: hook('get'),
  put: hook('put'),
  delete: hook('delete')
}

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

      const {body: {email}} = await request
        .post('/api/user')
        .send({
            name: 'matheus',
            email: 'matheus@email.com',
            password: '123456',
        })

      const response = await request
        .post('/api/login')
        .send({
          email, password: '123456'
        })

        TOKEN = response.body.token
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