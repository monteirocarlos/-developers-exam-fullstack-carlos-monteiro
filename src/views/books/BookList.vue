<template>
  <div class="book-list">
    <div class="header-actions">
      <h1>Lista de Livros</h1>
      <div class="search-add-container">
        <div class="search-box">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Buscar por título, autor ou descrição..."
            type="text"
          />
        </div>
        <button @click="openCreateForm" class="btn-add">
          Adicionar Livro
        </button>
      </div>
    </div>

    <div v-if="statusMessage" :class="['status-message', statusType]">
      {{ statusMessage }}
    </div>

    <div v-if="loading" class="loading">
      <span class="loader"></span> Carregando...
    </div>

    <template v-else>
      <div v-if="searchQuery && books.length === 0" class="no-results">
        Nenhum livro encontrado para "{{ searchQuery }}"
      </div>

      <div class="books-container">
        <BookCard 
          v-for="book in books" 
          :key="book.id" 
          :book="book"
          @edit="openEditForm"
          @delete="confirmDelete"
        />
      </div>

      <div v-if="books.length === 0 && !searchQuery" class="no-books">
        Nenhum livro encontrado.
      </div>

      <Pagination
        v-if="!searchQuery || books.length > 0"
        :current-page="currentPage"
        :total-items="totalItems"
        :items-per-page="pageSize"
        :loading="loading"
        @page-change="changePage"
      />
    </template>

    <BookFormModal
      v-if="showFormModal"
      :initial-data="selectedBook"
      :is-edit="isEditMode"
      @saved="handleBookSaved"
      @cancel="closeFormModal"
    />

    <ConfirmationModal
      v-if="showDeleteModal"
      title="Confirmar Exclusão"
      message="Tem certeza que deseja excluir este livro?"
      @confirm="deleteBook"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { bookService } from '@/services/api';
import BookCard from '@/components/books/BookCard.vue';
import Pagination from '@/components/common/Pagination.vue';
import BookFormModal from '@/components/books/BookFormModal.vue';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';

export default {
  components: {
    BookCard,
    Pagination,
    BookFormModal,
    ConfirmationModal
  },
  emits: ['book-created'],
  setup(props, { emit }) {
    const books = ref([]);
    const originalBooks = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(5);
    const totalItems = ref(0);
    const loading = ref(false);
    const statusMessage = ref('');
    const statusType = ref('info');
    const showFormModal = ref(false);
    const showDeleteModal = ref(false);
    const selectedBook = ref(null);
    const isEditMode = ref(false);
    const bookToDelete = ref(null);
    const searchQuery = ref('');
    const searchTimeout = ref(null);

    const fetchBooks = async () => {
      loading.value = true;
      statusMessage.value = '';
      try {
        const response = await bookService.getBooks(
          currentPage.value, 
          pageSize.value, 
          searchQuery.value
        );
        books.value = response.items;
        if (!searchQuery.value) {
          originalBooks.value = [...response.items];
          totalItems.value = response.totalCount;
        }
      } catch (error) {
        showStatus('Erro ao carregar livros: ' + error.message, 'error');
      } finally {
        loading.value = false;
      }
    };

    const handleSearch = () => {
      clearTimeout(searchTimeout.value);
      searchTimeout.value = setTimeout(() => {
        if (searchQuery.value.trim()) {
          fetchBooks();
        } else {
          fetchBooks();
        }
      }, 300);
    };

    const openCreateForm = () => {
      selectedBook.value = { title: '', author: '', description: '' };
      isEditMode.value = false;
      showFormModal.value = true;
    };

    const openEditForm = (book) => {
      selectedBook.value = { ...book };
      isEditMode.value = true;
      showFormModal.value = true;
    };

    const handleBookSaved = async ({ action, book }) => {
      showFormModal.value = false;
      if (action === 'created') {
        emit('book-created', book);
      }
      await fetchBooks();
      showStatus(`Livro ${action === 'created' ? 'adicionado' : 'atualizado'} com sucesso!`, 'success');
    };

    const confirmDelete = (book) => {
      bookToDelete.value = book;
      showDeleteModal.value = true;
    };

    const deleteBook = async () => {
      try {
        await bookService.deleteBook(bookToDelete.value.id);
        await fetchBooks();
        showStatus('Livro excluído com sucesso', 'success');
      } catch (error) {
        showStatus('Erro ao excluir livro: ' + error.message, 'error');
      } finally {
        showDeleteModal.value = false;
      }
    };

    const changePage = (page) => {
      currentPage.value = page;
      fetchBooks();
    };

    const showStatus = (message, type = 'info') => {
      statusMessage.value = message;
      statusType.value = type;
      setTimeout(() => statusMessage.value = '', 5000);
    };

    watch(currentPage, () => {
      searchQuery.value = '';
    });

    onMounted(fetchBooks);

    return {
      books,
      currentPage,
      pageSize,
      totalItems,
      loading,
      statusMessage,
      statusType,
      showFormModal,
      showDeleteModal,
      selectedBook,
      isEditMode,
      bookToDelete,
      searchQuery,
      fetchBooks,
      handleSearch,
      openCreateForm,
      openEditForm,
      handleBookSaved,
      confirmDelete,
      deleteBook,
      changePage,
      closeFormModal: () => showFormModal.value = false,
      closeDeleteModal: () => showDeleteModal.value = false
    };
  }
};
</script>

<style scoped>
.book-list {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.search-add-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.search-box {
  position: relative;
  flex-grow: 1;
  min-width: 250px;
  max-width: 950px;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-box input:focus {
  border-color: #0c66a3;
  box-shadow: 0 0 0 2px rgba(12, 102, 163, 0.2);
  outline: none;
}



.btn-add {
  background-color: #0c66a3;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.btn-add:hover {
  background-color: #094b7a;
}

.status-message {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.status-message.info {
  background-color: #e6f7ff;
  color: #0052cc;
}

.status-message.success {
  background-color: #e6ffed;
  color: #0b6238;
}

.status-message.error {
  background-color: #ffebee;
  color: #d32f2f;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #666;
}

.loader {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #0c66a3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.books-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.no-books, .no-results {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
}

.no-results {
  font-style: italic;
}

@media (max-width: 768px) {
  .book-list {
    padding: 1rem;
  }
  
  .books-container {
    grid-template-columns: 1fr;
  }
}
</style>