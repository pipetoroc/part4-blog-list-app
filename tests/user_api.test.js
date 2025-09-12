const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const User = require('../models/user')
const helper = require('./tests_helper')

const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  let userObject = new User(helper.initialUsers[0])
  await userObject.save()
  userObject = new User(helper.initialUsers[1])
  await userObject.save()
})

describe('get requests', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('there are two users in the DB', async () => {
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, 2)
  })
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
      username: 'fetora2',
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
