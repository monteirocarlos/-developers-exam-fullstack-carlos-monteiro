# Book Listing

Boa tarde Tiago! 

Segue avaliação para o teste front-end, realizei apenas os requisitos solicitados conforme alinhamos, criei uma "falsa" API, para trazermos os dados e testarmos a funcionalidades da aplicação. 

Obrigado desde já! 

---

##  Funcionalidades Principais

- Listagem paginada de livros  
- Sistema de busca por título, autor ou descrição  
- Adição de novos livros com validação  
- Edição de livros existentes  
- Exclusão com confirmação  
- Validação de títulos duplicados  
- Responsividade para diferentes telas  
- Notificação por e-mail ao cadastrar novos livros *(evento simulado)*  

---

##  Tecnologias Utilizadas

- [Vue 3 (Composition API)](https://vuejs.org/)
- [Vite (Build Tool)](https://vitejs.dev/)
- [Vue Router](https://router.vuejs.org/)
- LocalStorage *(para versão mockada)*

---
## Estrutura do Projeto

```bash
src/
├── components/
│   ├── books/
│   │   ├── BookCard.vue
│   │   ├── BookForm.vue
│   │   └── BookFormModal.vue
│   └── common/
│       ├── ConfirmationModal.vue
│       ├── Navbar.vue
│       └── Pagination.vue
├── router/
│   └── index.js
├── services/
│   ├── api.js
│   └── api-mock.js
├── views/
│   └── books/
│       └── BookList.vue
├── App.vue
└── main.js