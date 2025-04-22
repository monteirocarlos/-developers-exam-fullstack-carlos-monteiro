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
  margin-top: 2rem;
  padding: 1rem 0;
}

.page-btn {
  padding: 0.75rem 1.5rem;
  background-color: #0c66a3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  min-width: 100px;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: #094b7a;
  transform: translateY(-1px);
}

.page-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
}

.page-info {
  font-weight: bold;
  color: #333;
  min-width: 120px;
  text-align: center;
}

@media (max-width: 480px) {
  .pagination {
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .page-btn {
    padding: 0.5rem 1rem;
    min-width: 80px;
  }
}
</style>