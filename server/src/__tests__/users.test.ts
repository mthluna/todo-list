import setupDB from '../setup-test'

setupDB();

import supertest from 'supertest'
import app from '../app'
const request = supertest(app);

describe('User', () => {
    it('should save user to database', async () => {
      const response = await request
        .post('/api/user')
        .send({
            name: 'Teste name',
            email: 'test@email.com',
            password: '123456',
        })
  
        expect(response.status).toBe(200);
        expect(response.body.name).toBeTruthy()
        expect(response.body.email).toBeTruthy()
        expect(response.body.password).toBeTruthy()
    });

    it ('should get a specific user and his projects', async () => {
        const { body: { _id } } = await request
            .post('/api/user')
            .send({
                name: 'Teste name',
                email: 'test@email.com',
                password: '123456',
            })

        await request
            .post('/api/project')
            .send({
                name: 'Tarefas Domésticas',
                user_id: _id,
                tasks: [
                    {
                        name: 'Varrer a casa',
                        done: false,
                    },
                    {
                        name: 'Lavar a louça',
                        done: false
                    }
                ]
            })

        const response = await request
            .get(`/api/user/${_id}`)


        expect(response.status).toBe(200);
        expect(response.body._id).toContain(_id);
        expect(response.body.projects).toHaveLength(1);
        expect(response.body.projects[0].name).toContain('Tarefas Domésticas');
        expect(response.body.projects[0].tasks).toHaveLength(2);
        expect(response.body.projects[0].tasks[0].name).toContain('Varrer a casa');
    })

    it('should not save user if it has already been defined', async () => {
        await request
            .post('/api/user')
            .send({
                name: 'Teste name',
                email: 'test@email.com',
                password: '123456',
            })

        const response = await request
            .post('/api/user')
            .send({
                name: 'Teste name 2',
                email: 'test@email.com',
                password: '123',
            })

        expect(response.status).toBe(500);
    });

    it('should list all users', async () => {
        const response = await request
          .get('/api/users')
    
        expect(response.status).toBe(200);
    });

    it('should update a specific user', async () => {
        const { body: { _id } } = await request
            .post('/api/user')
            .send({
                name: 'Teste name',
                email: 'test@email.com',
                password: '123456',
            })

        const response = await request
            .put(`/api/user/${_id}`)
            .send({
                name: 'Matheus Luna',
                email: 'test@email.com.br',
                password: '123456',
            })

        expect(response.status).toBe(200);
        expect(response.body.nModified).toBe(1);
    });

    it('should delete a specific user', async () => {
        const { body: { _id } } = await request
            .post('/api/user')
            .send({
                name: 'Teste name',
                email: 'test@email.com',
                password: '123456',
            })

        const response = await request
            .delete(`/api/user/${_id}`)

        expect(response.status).toBe(204);
    });
});