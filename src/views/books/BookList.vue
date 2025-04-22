<template>
  <div class="book-list">

    <div class="header-actions">
      <h1>Lista de Livros</h1>
      <button @click="openCreateForm" class="btn-add">
        Adicionar Livro
      </button>
    </div>

    <div v-if="statusMessage" :class="['status-message', statusType]">
      {{ statusMessage }}
    </div>

    <div v-if="loading" class="loading">
      <span class="loader"></span> Carregando...
    </div>

    <template v-else>
      <div class="books-container">
        <BookCard 
          v-for="book in books" 
          :key="book.id" 
          :book="book"
          @edit="openEditForm"
          @delete="confirmDelete"
        />
      </div>

      <div v-if="books.length === 0" class="no-books">
        Nenhum livro encontrado.
      </div>

      <Pagination
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
import { ref, onMounted } from 'vue';
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
    const currentPage = ref(1);
    const pageSize = ref(6);
    const totalItems = ref(0);
    const loading = ref(false);
    const statusMessage = ref('');
    const statusType = ref('info');
    const showFormModal = ref(false);
    const showDeleteModal = ref(false);
    const selectedBook = ref(null);
    const isEditMode = ref(false);
    const bookToDelete = ref(null);

    const fetchBooks = async () => {
      loading.value = true;
      statusMessage.value = '';
      try {
        const response = await bookService.getBooks(currentPage.value, pageSize.value);
        books.value = response.items;
        totalItems.value = response.totalCount;
      } catch (error) {
        showStatus('Erro ao carregar livros: ' + error.message, 'error');
      } finally {
        loading.value = false;
      }
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

        await fetchBooks();
      } else {

        await fetchBooks();
      }
      
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
      fetchBooks,
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.mock-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.btn-add {
  background-color: #0c66a3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
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

.no-books {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>