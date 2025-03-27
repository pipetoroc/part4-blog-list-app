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

  response.body.forEach(blog => {
    assert.ok(blog.id, 'The field id must be defined')
    assert.strictEqual(blog._id, undefined, 'The field __id must not be defined')
  })
})

test('HTTP post create an unique blog', async () => {
  const newBlog = {
    title: 'Studing Jest and Test',
    author: 'PipeToroC',
    url: 'www.hotmail.com',
    likes: 23
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  console.log(response, 'response')

  const titles = response.body.map(blog => blog.title)
  console.log(titles, 'contents')

  assert.strictEqual(response.body.length, initialBlogs.length + 1)
  assert(titles.includes('Studing Jest and Test'))
})

after(async () => {
  await mongoose.connection.close()
})
