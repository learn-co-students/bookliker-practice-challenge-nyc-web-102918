document.addEventListener("DOMContentLoaded", function() {

  let allBooks = []

  const bookList = document.querySelector('#list')
  const showPanel = document.querySelector('#show-panel')

  fetch('http://localhost:3000/books')
  .then( result => result.json() )
  .then( parsedResult => {
    allBooks = parsedResult
    allBooks.forEach( book => {
      bookList.innerHTML += `
        <li data-id='${book.id}' class='book-title'> ${book.title} </li>
      `
    })
  })

  function showBookDetails(book) {
    const bookUsers = book.users.map( user => user.username ).join(', ')

    showPanel.innerHTML = `
      <h3> ${book.title} </h3>
      <img src=${book.img_url} >
      <p> ${book.description} </p>
      <h4> ${bookUsers} </h4>
      <button data-action='read-book' data-id=${book.id}> Read Book </button>
    `
  }

  bookList.addEventListener('click', event => {
    if (event.target.className === 'book-title') {
      const clickedBook = allBooks.find( book => book.id == event.target.dataset.id )
      showBookDetails(clickedBook)
    }
  })

  showPanel.addEventListener('click', event => {
    if (event.target.dataset.action === 'read-book') {
      const clickedBookId = event.target.dataset.id
      const clickedBook = allBooks.find( book => book.id == clickedBookId )
      const bookUsers = clickedBook.users.map( user => user.username )

      if (bookUsers.includes('pouros')) {
        alert('You read this already!')
      }
      else {
        clickedBook.users.push({"id":1, "username":"pouros"})
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
        .then( result => result.json() )
        .then( parsedResult => showBookDetails(parsedResult) )
      }
    }
  })

})
