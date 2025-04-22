<template>
  <div class="pagination">
    <button 
      :disabled="currentPage === 1 || loading" 
      @click="changePage(currentPage - 1)"
      class="page-btn"
    >
      Anterior
    </button>
    
    <span class="page-info">
      Página {{ currentPage }} de {{ totalPages }}
    </span>
    
    <button 
      :disabled="currentPage === totalPages || loading" 
      @click="changePage(currentPage + 1)"
      class="page-btn"
    >
      Próxima
    </button>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['page-change'],
  setup(props, { emit }) {
    const totalPages = computed(() => {
      return Math.ceil(props.totalItems / props.itemsPerPage);
    });

    const changePage = (page) => {
      emit('page-change', page);
    };

    return {
      totalPages,
      changePage
    };
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 3rem;
}

.page-btn {
  padding: 0.75rem 1.5rem;
  background-color: #0c66a3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  min-width: 100px;
  transition: background-color 0.2s;
}

.page-btn:hover:not(:disabled) {
  background-color: #094b7a;
}

.page-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.page-info {
  font-weight: bold;
  color: #333;
}
</style>