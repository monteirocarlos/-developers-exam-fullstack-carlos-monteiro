import { bookServiceMock } from './api-mock';

const USE_MOCK = true;
const API_URL = '/api';

const apiReal = {
  async getBooks(page, pageSize, search = '') {
    const url = `${API_URL}/books?page=${page}&pageSize=${pageSize}&sort=-createdAt${
      search ? `&search=${encodeURIComponent(search)}` : ''
    }`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  async createBook(bookData) {
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData)
    });
    return handleResponse(response);
  },

  async updateBook(id, bookData) {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData)
    });
    return handleResponse(response);
  },

  async deleteBook(id) {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },

  async checkTitleExists(title, excludeId = null) {
    const url = excludeId 
      ? `${API_URL}/books/check-title?title=${encodeURIComponent(title)}&excludeId=${excludeId}`
      : `${API_URL}/books/check-title?title=${encodeURIComponent(title)}`;
    
    const response = await fetch(url);
    return handleResponse(response);
  }
};

function handleResponse(response) {
  if (!response.ok) {
    return response.json().then(err => { throw new Error(err.message || 'API request failed') });
  }
  return response.json();
}

export const bookService = USE_MOCK ? bookServiceMock : apiReal;

export const setUseMock = (useMock) => {
  bookService = useMock ? bookServiceMock : apiReal;
};