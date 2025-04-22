import { ref } from 'vue';

const loadBooks = () => {
  const savedBooks = localStorage.getItem('mockBooksDatabase');
  return savedBooks ? JSON.parse(savedBooks) : {
    items: [
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        title: 'Harry Potter e a Pedra Filosofal',
        author: 'J.K. Rowling',
        description: 'O primeiro livro da saga do jovem bruxo Harry Potter.',
        createdAt: '2023-01-15T10:30:00Z'
      },
      {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
        title: 'O Senhor dos Anéis: A Sociedade do Anel',
        author: 'J.R.R. Tolkien',
        description: 'A jornada épica para destruir o um anel e salvar a Terra-média.',
        createdAt: '2023-02-20T14:45:00Z'
      }
    ],
    totalCount: 2
  };
};

const mockBooksDatabase = ref(loadBooks());

const saveBooks = () => {
  localStorage.setItem('mockBooksDatabase', JSON.stringify(mockBooksDatabase.value));
};

const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export const bookServiceMock = {
  async getBooks(page = 1, pageSize = 10, search = '') {
    await simulateNetworkDelay();
    
    let filteredItems = [...mockBooksDatabase.value.items];
    
    if (search) {
      const query = search.toLowerCase();
      filteredItems = filteredItems.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query)
      );
    }
    
    const sortedItems = filteredItems.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt));
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedItems = sortedItems.slice(start, end);
    
    return {
      items: paginatedItems,
      totalCount: filteredItems.length,
      page,
      pageSize
    };
  },

  async createBook(bookData) {
    await simulateNetworkDelay();
    
    const titleExists = mockBooksDatabase.value.items.some(
      book => book.title.toLowerCase() === bookData.title.toLowerCase()
    );
    
    if (titleExists) {
      throw new Error('Já existe um livro com este título');
    }
    
    const newBook = {
      ...bookData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    
    mockBooksDatabase.value.items.unshift(newBook);
    mockBooksDatabase.value.totalCount += 1;
    saveBooks();
    
    return newBook;
  },

  async updateBook(id, bookData) {
    await simulateNetworkDelay();
    
    const titleExists = mockBooksDatabase.value.items.some(
      book => book.title.toLowerCase() === bookData.title.toLowerCase() && 
             book.id !== id
    );
    
    if (titleExists) {
      throw new Error('Já existe um livro com este título');
    }
    
    const index = mockBooksDatabase.value.items.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Livro não encontrado');
    
    const updatedBook = { 
      ...mockBooksDatabase.value.items[index], 
      ...bookData,
      id,
      updatedAt: new Date().toISOString()
    };
    
    mockBooksDatabase.value.items[index] = updatedBook;
    saveBooks();
    return updatedBook;
  },

  async deleteBook(id) {
    await simulateNetworkDelay();
    
    const initialLength = mockBooksDatabase.value.items.length;
    mockBooksDatabase.value.items = mockBooksDatabase.value.items.filter(b => b.id !== id);
    
    if (mockBooksDatabase.value.items.length < initialLength) {
      mockBooksDatabase.value.totalCount -= 1;
      saveBooks();
      return true;
    }
    return false;
  },

  async checkTitleExists(title, excludeId = null) {
    await simulateNetworkDelay();
    
    const exists = mockBooksDatabase.value.items.some(
      book => book.title.toLowerCase() === title.toLowerCase() && 
             (!excludeId || book.id !== excludeId)
    );
    
    return { exists };
  }
};