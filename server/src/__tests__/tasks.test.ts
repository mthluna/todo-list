import setupDB, { request } from '../setup-test'
setupDB();

describe('Tasks', () => {
    it('should save a task to database', async () => {

        const {body: { _id: user_id }} = await request
        .post('/api/user')
        .send({
            name: 'Teste name',
            email: 'test@email.com.br',
            password: '123456',
        })

        const  {body: { _id } } = await request
        .post('/api/project')
        .send({
            name: 'Tarefas Domésticas',
            user_id
        })

        const response = await request
          .post('/api/task')
          .send({
                name: 'Varrer a casa',
                done: false,
                projectId: _id
          })

        expect(response.status).toBe(200);
        expect(response.body.name).toBeTruthy();
        expect(response.body.projectId).toEqual(_id);
    })

    it('should update a task to database', async () => {
        const {body: { _id: user_id }} = await request
        .post('/api/user')
        .send({
            name: 'Teste name',
            email: 'test@email.com.br',
            password: '123456',
        })

        const  {body: { _id: projectId } } = await request
            .post('/api/project')
            .send({
                name: 'Tarefas Domésticas',
                user_id
            })

        const { body: { _id }} = await request
          .post('/api/task')
          .send({
                name: 'Varrer a casa',
                done: false,
                projectId
          })

        const response = await request
            .put(`/api/task/${_id}`)
            .send({
                name: 'Varrer a sala',
            })
        
        expect(response.status).toBe(200);
        expect(response.body.nModified).toBe(1);
    })

    it('should delete a specific task', async () => {
        const {body: { _id: user_id }} = await request
        .post('/api/user')
        .send({
            name: 'Teste name',
            email: 'test@email.com.br',
            password: '123456',
        })

        const  {body: { _id: projectId } } = await request
            .post('/api/project')
            .send({
                name: 'Tarefas Domésticas',
                user_id
            })

        const { body: { _id } } = await request
            .post('/api/task')
            .send({
                name: 'Varrer a casa',
                projectId
            })

        const response = await request
            .delete(`/api/task/${_id}`)

        expect(response.status).toBe(204);
    });

    it ('should get a specific task', async () => {
        const {body: { _id: user_id }} = await request
        .post('/api/user')
        .send({
            name: 'Teste name',
            email: 'test@email.com.br',
            password: '123456',
        })

        const  {body: { _id: projectId } } = await request
            .post('/api/project')
            .send({
                name: 'Tarefas Domésticas',
                user_id
            })

        const { body: { _id } } = await request
            .post('/api/task')
            .send({
                name: 'Varrer a casa',
                projectId
            })

        const response = await request
            .get(`/api/task/${_id}`)

        expect(response.status).toBe(200);
        expect(response.body._id).toContain(_id);
        expect(response.body.name).toContain('Varrer a casa');
    })

    it ('should not get a task if it not exists', async () => {
        const response = await request
            .get(`/api/task/some-task-id`)

        expect(response.status).toBe(500);
    })
});