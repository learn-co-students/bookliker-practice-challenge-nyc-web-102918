document.addEventListener("DOMContentLoaded", function() {

  let allBooks = []

  const bookList = document.querySelector('#list-panel')
  const showPanel = document.querySelector('#show-panel')

  fetch('http://localhost:3000/books')
  .then(res => res.json())
  .then(data => {
    allBooks = data
    renderBookTitles(data)
  })
  function renderBookTitles(array) {
    array.forEach((book) => {
      bookList.innerHTML += `
      <button data-id='${book.id}' class='book-btn'>${book.title}</button>
      `
    })
  }
  function renderBookDetails(book) {
    const bookUsers = book.users.map( user => user.username).join(' ')
    showPanel.innerHTML = `
    <h3>${book.title}</h3>
    <img src='${book.img_url}'/>
    <p>${book.description}</p>
    <h4>${bookUsers}</h4>
    <buttton data-action='like-book' data-id='${book.id}'>👍</button>`
  }
  bookList.addEventListener('click', (e) => {
    if(e.target.className === 'book-btn') {
      const clickedBook = allBooks.find(book => book.id == e.target.dataset.id)
      renderBookDetails(clickedBook)
    }
  })
  showPanel.addEventListener('click', (e) => {
    if(e.target.dataset.action === 'like-book') {
      const clickedBookId = e.target.dataset.id
      const clickedBook = allBooks.find(book => book.id == clickedBookId)
      const bookUsers = clickedBook.users.map(user => user.username).join(' ')
      if(bookUsers.includes('pouros')) {
        alert("You've already liked this book")
      }
      else {
        clickedBook.users.push({'id':1, 'username':'pouros'})
        fetch(`http://localhost:3000/books/${clickedBookId}`, {
           method: 'PATCH',
           headers: {
             'Content-Type': 'application/json',
             'Accept': 'application/json'
           },
           body: JSON.stringify({
             users: clickedBook.users
           })
         })
         .then(res => res.json())
         .then(data => renderBookDetails(data))
      }
    }
  })
});
