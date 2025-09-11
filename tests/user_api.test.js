const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

test('get all users', async () => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

describe('post requests', () => {
  test('Username and password must be given', async () => {
    const newUser = {
      username: 'fetora',
      password: 'la pipe password',
      name: 'Felipe'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })
  test('The password and username must be at least 3 characters long', async () => {
    const newUser = {
      username: 'fetora',
      password: 'la pipe password',
      name: 'Felipe'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })
})

after(async () => {
  await mongoose.connection.close()
})
