const { test, describe } = require('node:test')
const assert = require('node:assert')

const mostBlogs = require('../utils/list_helper').mostBlogs

describe('The author with more blogs', () => {
  const blogs = [
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    },
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 9
    }
  ]
  test('This author has 2 blogs', () => {
    assert.deepEqual(mostBlogs(blogs), {
      author: 'Edsger W. Dijkstra',
      blogs: 2
    })
  })
})
