document.addEventListener("DOMContentLoaded", function() {

const bookList = document.querySelector('#list')
const showPanel = document.querySelector('#show-panel')
const self = {id: 1, username: 'pouros'}
let books;

  fetch('http://localhost:3000/books')
    .then(response => response.json())
    .then(data => {
      books = data
      data.forEach(book => {
        bookList.innerHTML += `
                              <li data-id='${book.id}'>${book.title}</li>
                              `
      })
    })

  bookList.addEventListener('click', (event) => {
    bookClicked = parseInt(event.target.dataset.id)
    bookShown = books.find((book) => book.id === bookClicked)
    const users = bookShown.users
    showPanel.innerHTML = `
                            <img src="${bookShown.img_url}">
                            <p id=data-name="desc">${bookShown.description}</p>
                            <ul id="user-likes"></ul>
                            <button type="button" id="btn" data-id="">Read Book</button>
    `
    const usersLiked = document.querySelector('#user-likes')
    const btn = document.querySelector('#btn')
    let usersArray = []
    users.forEach(user => {
      let li = document.createElement('li')
      li.textContent = user.username
      li.dataset.id = user.id
      usersLiked.appendChild(li)
      usersArray.push(user.username)
    })

    btn.addEventListener('click', (event) => {
      let newUsers = [...users]
      if (usersArray.includes('pouros')) {
        window.alert('you already liked this book')
      } else {
        newUsers.push(self)
        let li = document.createElement('li')
        li.textContent = self.username
        li.dataset.id = self.id
        usersLiked.appendChild(li)
      }
      fetch(`http://localhost:3000/books/${bookShown.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          users: newUsers
        })
      })
    })
  })
})
