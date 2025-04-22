<template>
  <div class="book-card">
    <div class="book-content">
      <h2 class="book-title">{{ book.title }}</h2>
      <p class="book-author"><strong>Autor:</strong> {{ book.author }}</p>
      <p class="book-description">{{ book.description }}</p>
    </div>
    <div class="book-actions">
      <button @click.stop="handleEdit" class="btn-edit">Editar</button>
      <button @click.stop="handleDelete" class="btn-delete">Excluir</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleEdit() {
      this.$emit('edit', this.book);
    },
    handleDelete() {
      if (confirm('Tem certeza que deseja excluir este livro?')) {
        this.$emit('delete', this.book);
      }
    }
  }
};
</script>

<style scoped>
.book-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.book-content {
  flex-grow: 1;
  overflow: hidden;
  margin-bottom: 1rem;
}

.book-title {
  color: #0c66a3;
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  word-break: break-word;
  overflow-wrap: break-word;
}

.book-author {
  color: #555;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  word-break: break-word;
}

.book-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.btn-edit {
  background-color: #0c66a3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-edit:hover {
  background-color: #094b7a;
}

.btn-delete {
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-delete:hover {
  background-color: #cc0000;
}
</style>