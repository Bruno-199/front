const API_URL = 'https://api-h8wy.onrender.com';

// Estado de la aplicación
let editingBookId = null;

// Elementos del DOM
const bookForm = document.getElementById('bookForm');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const booksListDiv = document.getElementById('booksList');

// Funciones principales
async function loadBooks() {
    try {
        const response = await fetch(`${API_URL}/books`);
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error al cargar los libros:', error);
    }
}

function displayBooks(books) {
    booksListDiv.innerHTML = books.map(book => `
        <div class="book-card">
            <h3>${book.name || book.title}</h3>
            <p>Autor: ${book.author}</p>
            <p>Año: ${book.year}</p>
            <div class="book-actions">
                <button onclick="editBook(${book.id})" class="edit-btn">Editar</button>
                <button onclick="deleteBook(${book.id})" class="delete-btn">Eliminar</button>
            </div>
        </div>
    `).join('');
}

async function handleSubmit(event) {
    event.preventDefault();
    
    const bookData = {
        name: document.getElementById('name').value,
        author: document.getElementById('author').value,
        year: parseInt(document.getElementById('year').value)
    };

    try {
        if (editingBookId) {
            await updateBook(editingBookId, bookData);
        } else {
            await createBook(bookData);
        }
        
        bookForm.reset();
        resetFormState();
        loadBooks();
    } catch (error) {
        console.error('Error al guardar el libro:', error);
    }
}

async function createBook(bookData) {
    await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
    });
}

async function updateBook(id, bookData) {
    await fetch(`${API_URL}/books/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
    });
}

async function deleteBook(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
        try {
            await fetch(`${API_URL}/books/${id}`, {
                method: 'DELETE'
            });
            loadBooks();
        } catch (error) {
            console.error('Error al eliminar el libro:', error);
        }
    }
}

async function editBook(id) {
    try {
        const response = await fetch(`${API_URL}/books/${id}`);
        const book = await response.json();
        
        document.getElementById('name').value = book.name || book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('year').value = book.year;
        
        editingBookId = id;
        submitBtn.textContent = 'Actualizar Libro';
        cancelBtn.style.display = 'inline';
    } catch (error) {
        console.error('Error al cargar el libro:', error);
    }
}

function resetFormState() {
    editingBookId = null;
    submitBtn.textContent = 'Añadir Libro';
    cancelBtn.style.display = 'none';
}

// Event Listeners
bookForm.addEventListener('submit', handleSubmit);
cancelBtn.addEventListener('click', () => {
    bookForm.reset();
    resetFormState();
});

// Cargar libros al iniciar
loadBooks();
