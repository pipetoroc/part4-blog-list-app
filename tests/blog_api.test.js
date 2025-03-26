const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Este es mi nuevo blog',
    author: 'Felipe Toro',
    url: 'www.facebook.com',
    likes: 10
  },
  {
    title: 'Un blog de programación',
    author: 'Laura Toro',
    url: 'www.snapchat.com',
    likes: 23
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('Unique identifier property of the blog is id', async () => {
  const response = await api.get('/api/blogs')

  console.log(response.body, 'response')

  response.body.forEach(blog => {
    assert.ok(blog.id, 'The field id must be defined')
    assert.strictEqual(blog._id, undefined, 'The field __id must not be defined')
  })
})

after(async () => {
  await mongoose.connection.close()
})
