const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const bcrypt = require('bcrypt')

const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')

let token = ''

const createUserAndLogin = async ({ username, password }) => {
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username, passwordHash })
  await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username, password })
    .expect(200)

  return loginResponse.body.token
}

const getAllBlogs = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

const getAllUsers = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

describe('Blog API tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    token = await createUserAndLogin({
      username: 'miduroot',
      password: 'pswd'
    })
  })

  test('a valid blog can be added with a token', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Someone',
      url: 'http://example.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await getAllBlogs()
    assert.strictEqual(blogsAtEnd.length, 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('async/await simplifies making async calls'))
  })

  test('adding a blog fails with 401 if token is not provided', async () => {
    const newBlog = {
      title: 'This should not be saved',
      author: 'Hacker',
      url: 'http://evil.com',
      likes: 0
    }

    await api.post('/api/blogs').send(newBlog).expect(401)

    const blogsAtEnd = await getAllBlogs()
    assert.strictEqual(blogsAtEnd.length, 0)
  })

  test('a fresh username can be created', async () => {
    const usersAtStart = await getAllUsers()

    const newUser = {
      username: 'midudev',
      name: 'Miguel',
      password: 'tw1tch'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getAllUsers()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes('midudev'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
