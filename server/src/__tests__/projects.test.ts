import setupDB from '../setup-test'

setupDB();

import supertest from 'supertest'
import app from '../server'
const request = supertest(app);

describe('Project', () => {
    it('should save project with two tasks to database', async () => {
        const response = await request
          .post('/api/project')
          .send({
              name: 'Tarefas Domésticas',
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
    
          expect(response.status).toBe(200);
          expect(response.body.name).toBeTruthy()
          expect(response.body.tasks).toHaveLength(2);
          expect(response.body.tasks[0].projectId).toContain(response.body._id);
    });
  
    it('should save project with zero tasks to database', async () => {
        const response = await request
        .post('/api/project')
        .send({
            name: 'Tarefas Domésticas'
        })

        expect(response.status).toBe(200);
        expect(response.body.name).toBeTruthy()
        expect(response.body.tasks).toHaveLength(0);
    });

    it('should update project', async () => {
        const {body: {_id}} = await request
        .post('/api/project')
        .send({
            name: 'Tarefas Domésticas'
        })

        const response = await request
            .put(`/api/project/${_id}`)
            .send({
                name: 'Trabalhos Faculdade'
            })

        expect(response.status).toBe(200)
        expect(response.body.nModified).toBe(1);
    })

    it('should list all projects', async () => {
        await request
        .post('/api/project')
        .send({
            name: 'Tarefas Domésticas',
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

        await request
        .post('/api/project')
        .send({
            name: 'Trabalhos Faculdade',
        })

        const response = await request
        .get('/api/projects')

        expect(response.status).toBe(200);
        expect(response.body[0].tasks).toHaveLength(2)
        expect(response.body[0].tasks[0].name).toContain('Varrer a casa')
        expect(response.body[0].tasks[1].name).toContain('Lavar a louça')
    })

    it ('should get a specific project', async () => {
        const { body: { _id } } = await request
        .post('/api/project')
        .send({
            name: 'Tarefas Domésticas',
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
            .get(`/api/project/${_id}`)

        expect(response.status).toBe(200);
        expect(response.body._id).toContain(_id);
        expect(response.body.tasks).toHaveLength(2);
        expect(response.body.tasks[0].name).toContain('Varrer a casa');
        expect(response.body.tasks[1].name).toContain('Lavar a louça');
    })

    it ('should not get a project if it not exists', async () => {
        const response = await request
            .get(`/api/project/some-project-id`)

        expect(response.status).toBe(500);
    })

    it('should delete project and tasks', async () => {
        const {body: project} = await request
          .post('/api/project')
          .send({
              name: 'Tarefas Domésticas',
              tasks: [
                  {
                    name: 'Varrer a casa',
                    done: false,
                  },
                  {
                    name: 'Arrumar guarda roupa',
                    done: false,
                  }
              ]
          })

        const response = await request
          .delete(`/api/project/${project._id}`)

        expect(response.status).toEqual(200);
        expect(response.body.ok).toEqual(1);
    });

    it('should not delete project when id is invalid', async () => {
        const response = await request
        .delete(`/api/project/some-project-id`)

        expect(response.status).toBe(500);
    })
});