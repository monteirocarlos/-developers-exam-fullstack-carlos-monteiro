<template>
  <div class="app">
    <Navbar />
    <router-view @book-created="handleNewBook"></router-view>
  </div>
</template>

<script>
import Navbar from '@/components/common/Navbar.vue'

export default {
  components: {
    Navbar
  },
  methods: {
    handleNewBook(book) {
      console.log('[Email Service] Notificação de novo livro:');
      console.log('Destinatário: developers@inspand.com.br');
      console.log('Assunto: Novo livro cadastrado - ' + book.title);
      console.log('Corpo:', {
        title: book.title,
        author: book.author,
        description: book.description,
        timestamp: new Date().toISOString()
      });
    }
  }
}
</script>

<style>
.app {
  font-family: Arial, sans-serif;
}
</style>