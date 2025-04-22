<template>
  <form @submit.prevent="submitForm" class="book-form">
    <div class="form-group">
      <label for="title">Título *</label>
      <input
        id="title"
        v-model="book.title"
        @blur="validateTitle"
        :class="{ 'invalid': errors.title || errors.titleExists }"
        type="text"
        maxlength="100"
      />
      <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
      <span v-if="errors.titleExists" class="error-message">{{ errors.titleExists }}</span>
      <div class="char-counter">
        {{ book.title.length }}/100 caracteres
        <span v-if="book.title.length < 10" class="warning"> (mínimo 10)</span>
        <span v-else-if="!errors.titleExists" class="valid"> ✓</span>
      </div>
    </div>

    <div class="form-group">
      <label for="author">Autor *</label>
      <input
        id="author"
        v-model="book.author"
        @blur="validateAuthor"
        :class="{ 'invalid': errors.author }"
        type="text"
        maxlength="100"
      />
      <span v-if="errors.author" class="error-message">{{ errors.author }}</span>
      <div class="char-counter">
        {{ book.author.length }}/100 caracteres
        <span v-if="book.author.length < 10" class="warning"> (mínimo 10)</span>
      </div>
    </div>

    <div class="form-group">
      <label for="description">Descrição *</label>
      <textarea
        id="description"
        v-model="book.description"
        @input="validateDescription"
        :class="{ 'invalid': errors.description }"
        rows="5"
        maxlength="1024"
      ></textarea>
      <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
      <div class="char-counter">
        {{ book.description.length }}/1024 caracteres
      </div>
    </div>

    <div class="form-actions">
      <button type="button" @click="cancel" class="btn-secondary">
        Cancelar
      </button>
      <button type="submit" :disabled="isSubmitting || hasErrors" class="btn-primary">
        {{ isSubmitting ? 'Salvando...' : 'Salvar' }}
      </button>
    </div>
  </form>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { bookService } from '@/services/api';

export default {
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
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const book = ref({ ...props.initialData });
    const errors = ref({
      title: '',
      author: '',
      description: '',
      titleExists: ''
    });
    const isSubmitting = ref(false);
    const titleCheckTimeout = ref(null);

    watch(
      () => book.value.title,
      (newTitle) => {
        if (newTitle && newTitle.length >= 10) {
          clearTimeout(titleCheckTimeout.value);
          titleCheckTimeout.value = setTimeout(async () => {
            try {
              const response = await bookService.checkTitleExists(
                newTitle,
                props.isEdit ? book.value.id : null
              );
              errors.value.titleExists = response.exists ? 'Já existe um livro com este título' : '';
            } catch (error) {
              console.error('Erro ao verificar título:', error);
            }
          }, 500);
        } else {
          errors.value.titleExists = '';
        }
      }
    );

    const hasErrors = computed(() => {
      return Object.values(errors.value).some(error => error !== '');
    });

    const validateTitle = () => {
      if (!book.value.title) {
        errors.value.title = 'O título é obrigatório';
        return false;
      }
      if (book.value.title.length < 10 || book.value.title.length > 100) {
        errors.value.title = 'O título deve ter entre 10 e 100 caracteres';
        return false;
      }
      errors.value.title = '';
      return true;
    };

    const validateAuthor = () => {
      if (!book.value.author) {
        errors.value.author = 'O autor é obrigatório';
        return false;
      }
      if (book.value.author.length < 10 || book.value.author.length > 100) {
        errors.value.author = 'O autor deve ter entre 10 e 100 caracteres';
        return false;
      }
      errors.value.author = '';
      return true;
    };

    const validateDescription = () => {
      if (!book.value.description) {
        errors.value.description = 'A descrição é obrigatória';
        return false;
      }
      if (book.value.description.length > 1024) {
        errors.value.description = 'A descrição não pode exceder 1024 caracteres';
        return false;
      }
      errors.value.description = '';
      return true;
    };

    const validateForm = () => {
      const validTitle = validateTitle();
      const validAuthor = validateAuthor();
      const validDescription = validateDescription();
      
      return validTitle && validAuthor && validDescription && 
             !errors.value.titleExists;
    };

    const submitForm = async () => {
      if (!validateForm()) return;
      
      isSubmitting.value = true;
      try {
        const result = props.isEdit
          ? await bookService.updateBook(book.value.id, book.value)
          : await bookService.createBook(book.value);
        
        emit('submit', {
          action: props.isEdit ? 'updated' : 'created',
          book: result
        });
      } catch (error) {
        console.error('Erro ao salvar livro:', error);
        errors.value.form = 'Erro ao salvar livro: ' + error.message;
      } finally {
        isSubmitting.value = false;
      }
    };

    const cancel = () => {
      emit('cancel');
    };

    return {
      book,
      errors,
      isSubmitting,
      hasErrors,
      validateTitle,
      validateAuthor,
      validateDescription,
      submitForm,
      cancel
    };
  }
};
</script>

<style scoped>
.book-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
  max-width: 100%;
  box-sizing: border-box;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #0c66a3;
}

input.invalid, textarea.invalid {
  border-color: #ff4444;
}

textarea {
  resize: vertical;
  min-height: 100px;
  max-height: 300px;
}

.error-message {
  color: #ff4444;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

.char-counter {
  text-align: right;
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

.char-counter .warning {
  color: #ff9800;
}

.char-counter .valid {
  color: #4caf50;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary {
  background-color: #0c66a3;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #094b7a;
}

.btn-primary:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}
</style>