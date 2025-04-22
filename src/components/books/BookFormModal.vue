<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>{{ isEdit ? 'Editar Livro' : 'Adicionar Novo Livro' }}</h2>
      <button class="close-button" @click="closeModal">×</button>
      
      <BookForm 
        :initial-data="initialData"
        :is-edit="isEdit"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </div>
  </div>
</template>

<script>
import BookForm from './BookForm.vue';

export default {
  components: {
    BookForm
  },
  props: {
    initialData: {
      type: Object,
      required: true
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['saved', 'cancel'],
  setup(props, { emit }) {
    const handleSubmit = (bookData) => {
      emit('saved', bookData);
    };

    const closeModal = () => {
      emit('cancel');
    };

    return {
      handleSubmit,
      closeModal
    };
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-content h2 {
  margin-top: 0;
  color: #0c66a3;
  margin-bottom: 1.5rem;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.close-button:hover {
  color: #333;
}
</style>