const books = [];
const RENDER_EVENT = "render-book";
const STORAGE_KEY = "Bookshelf";
const form = document.getElementById("form");
const inputSearchBook = document.getElementById("searchBookTitle");
const formSearchBook = document.getElementById("searchBook");
const cekBox = document.getElementById('ubah')

inputSearchBook.addEventListener("keyup", (e) => {
   e.preventDefault();
   searchBooks();
});

formSearchBook.addEventListener("submit", (e) => {
   e.preventDefault();
   searchBooks();
});

// check webstorage browser
function isStorageExist() {
   if (typeof Storage === "undefined") {
      swal("Upss", "Maaf, Browser anda tidak mendukung web storage. Silahkan gunakan Browser yang lainnya", "info");
      return false;
   }
   return true;
}

// generate id book
const generateId = () => +new Date();

// generate book object
const generateBookItem = (id, title, penulis, tahun, pesan, isCompleted) => {
   return {
      id,
      title,
      penulis,
      tahun,
      pesan,
      isCompleted,
   };
};

// checkbox function
function checkStatusBook() {
   const isCheckComplete = document.getElementById("cekDibaca");
   if (isCheckComplete.checked) {
      return true;
   }
   return false;
}



// add book to bookshelf
function addBook() {
   const bookTitle = document.getElementById("nama-buku").value;
   const bookPenulis = document.getElementById("penulis").value;
   const bookTahun = document.getElementById("tahun").value;
   const bookPesan = document.getElementById("pesan").value;
   const isCompleted = checkStatusBook();

   const id = generateId();
   const newBook = generateBookItem(id, bookTitle, bookPenulis, bookTahun,bookPesan, isCompleted);

   books.unshift(newBook);
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
  

   swal("Berhasil", "Buku baru sudah ditambahkan ke rak", "success");
}

// find book index using book id
function findBookIndex(bookId) {
   for (const index in books) {
      if (books[index].id == bookId) {
         return index;
      }
   }
   return null;
}

// function remove book
function removeBook(bookId) {
   const bookTarget = findBookIndex(bookId);
   swal({
      title: "Apakah Anda Yakin?",
      text: "Buku akan dihapus secara permanen, Anda tidak bisa memulihkannya kembali!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
   }).then((willDelete) => {
      if (willDelete) {
         books.splice(bookTarget, 1);
         document.dispatchEvent(new Event(RENDER_EVENT));
         saveData();

         swal("Berhasil", "Satu buku sudah dihapus dari rak", "success");
      } else {
         swal("Buku tidak jadi dihapus");
      }
   });
}


// reset bookshelf to empety
function resetRak() {
   swal({
      title: "Apakah Anda Yakin?",
      text: "Semua buku akan dihapus secara permanen dari rak, Anda tidak bisa memulihkannya kembali!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
   }).then((willDelete) => {
      if (willDelete) {
         books.splice(0, books.length);
         document.dispatchEvent(new Event(RENDER_EVENT));
         saveData();

         swal("Berhasil", "Semua buku sudah dihapus dari rak", "success");
      } else {
         swal("Rak batal dikosongkan");
      }
   });
}

//change status book (read or unread) / click the button
function changeBookStatus(bookId) {
   const bookIndex = findBookIndex(bookId);
   for (const index in books) {
      if (index === bookIndex) {
         if (books[index].isCompleted === true) {
            books[index].isCompleted = false;
            swal("Berhasil", "Buku kamu sudah dipindahkan ke rak belum selesai dibaca", "success");
         } else {
            books[index].isCompleted = true;
            swal("Berhasil", "Buku kamu sudah dipindahkan ke rak selesai dibaca", "success");
         }
      }
      
   }

   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
   
}

// function search book
function searchBooks() {
   const inputSearchValue = document.getElementById("searchBookTitle").value.toLowerCase();
   const bookBelumbaca = document.getElementById("bookBelumbaca");
   const bookDibaca = document.getElementById("bookDibaca");
   bookBelumbaca.innerHTML = "";
   bookDibaca.innerHTML = "";

   if (inputSearchValue == "") {
      document.dispatchEvent(new Event(RENDER_EVENT));
      return;
   }

   for (const book of books) {
      if (book.title.toLowerCase().includes(inputSearchValue)) {
         if (book.isCompleted == false) {
            let el = `
            <li class="list-book bg-warning rounded-4 bg-white shadow p-3 mb-3 rounded" > 

            <div class="d-flex justify-content-between">
              <span class="judul fs-5 mb-1 fw-semibold text-warning">${book.title}</span>
              <div class="aksi">
                <a href="#" onclick="editBookData(${book.id})"><i class="bi bi-pencil-square fs-5"></i> </a>
                <a href="#" onclick="removeBook(${book.id})"><i class="bi bi-trash fs-5 "></i></a>
            </div>
            </div>

              <span class="text-small penulis pt-4 "><span class="fw-semibold">Penulis : </span>${book.penulis}</span><br>
              <span class="text-small date"><span class="fw-semibold">Tanggal : </span>${book.tahun}</span>
              <p class="textComment mt-3"><span class="fw-semibold">Comment : </span> ${book.pesan}</p>

              <div class="icon-pindah d-flex kesamping">
                <a onclick="changeBookStatus(${book.id})"><i class="bi bi-arrow-return-right fs-5 ms-1 kanan" ></i> </a>
              </div> 
          </li>      `;

          bookBelumbaca.innerHTML += el;
         } else {
            let el = `
            <li class="list-book bg-warning rounded-4 bg-white shadow p-3 mb-3 rounded" > 

            <div class="d-flex justify-content-between">
              <span class="judul fs-5 mb-1 fw-semibold text-warning">${book.title}</span>
              <div class="aksi">
                <a href="#" onclick="editBookData(${book.id})"><i class="bi bi-pencil-square fs-5"></i> </a>
                <a href="#" onclick="removeBook(${book.id})"><i class="bi bi-trash fs-5 "></i></a>
            </div>
            </div>

              <span class="text-small penulis pt-4 "><span class="fw-semibold">Penulis : </span>${book.penulis}</span><br>
              <span class="text-small date"><span class="fw-semibold">Tanggal : </span>${book.tahun}</span>
              <p class="textComment mt-3"><span class="fw-semibold">Comment : </span> ${book.pesan}</p>

              <div class="icon-pindah d-flex kesamping">
                <a href="#" onclick="changeBookStatus(${book.id})"><i class="bi bi-arrow-return-right fs-5 ms-1 kanan" ></i> </a>
              </div> 
          </li>   
            `;

            bookDibaca.innerHTML += el;
         }
      }
   }
}



// function edit book data
function editBookData(bookId) {

   const editTitle = document.getElementById("nama-buku");
   const editAuthor = document.getElementById("penulis");
   const editYear = document.getElementById("tahun");
   const editPesan = document.getElementById("pesan");
   
   const SubmitEdit = document.getElementById("ubah");
   const cekBox = document.getElementById("cek")
   
   bookTarget = findBookIndex(bookId);


   // menghilangkan checkbox ketika edit
   if (cekBox.style.display === "none") {
      cekBox.style.display = "none";
  } else {
   cekBox.style.display = "none";
  }

   // set old value
   editTitle.setAttribute("value", books[bookTarget].title);
   editAuthor.setAttribute("value", books[bookTarget].penulis);
   editYear.setAttribute("value", books[bookTarget].tahun);
   editPesan.setAttribute("value", books[bookTarget].pesan);

   // update data
   SubmitEdit.addEventListener("click", (e) => {

      books[bookTarget].title = editTitle.value;
      books[bookTarget].penulis = editAuthor.value;
      books[bookTarget].tahun = editYear.value;
      books[bookTarget].pesan = editPesan.value;

      document.dispatchEvent(new Event(RENDER_EVENT));
      
      saveData();
      swal("Berhasil", "Data bukumu sudah berhasil diedit", "success");
      
      window.location.reload()
   });
   
}

// function save data to local storage
function saveData() {
   if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);

      document.dispatchEvent(new Event(RENDER_EVENT));
   }
   
}

// load data from storage
function loadDataFromStorage() {
   const serializedData = localStorage.getItem(STORAGE_KEY);
   let data = JSON.parse(serializedData);

   if (data !== null) {
      data.forEach((book) => {
         books.unshift(book);
      });
   }
   document.dispatchEvent(new Event(RENDER_EVENT));
   return books;
}

// show data
function showBook(books = []) {
   const bookBelumbaca = document.getElementById("bookBelumbaca");
   const bookDibaca = document.getElementById("bookDibaca");

   bookBelumbaca.innerHTML = "";
   bookDibaca.innerHTML = "";

   books.forEach((book) => {
      if (book.isCompleted == false) {
         let el = `<li class="list-book bg-warning rounded-4 bg-white shadow p-3 mb-3 rounded book-list" > 

         <div class="d-flex justify-content-between">
           <span class="judul fs-5 mb-1 fw-semibold text-warning">${book.title}</span>
           <div class="aksi">
             <a href="#" class="text-decoration-none" onclick="editBookData(${book.id})"><i class="bi bi-pencil-square fs-5"></i> </a>
             <a href="#" onclick="removeBook(${book.id})"><i class="bi bi-trash fs-5 "></i></a>
         </div>
         </div>

           <span class="text-small penulis pt-4 "><span class="fw-semibold">Penulis : </span>${book.penulis}</span><br>
           <span class="text-small date"><span class="fw-semibold">Tanggal : </span>${book.tahun}</span>
           <p class="textComment mt-3"><span class="fw-semibold">Comment : </span> ${book.pesan}</p>

           <div class="icon-pindah d-flex kesamping">
             <a href="#" class="arrowRight text-end w-100" onclick="changeBookStatus(${book.id})"><i class="bi bi-arrow-return-right fs-5 ms-1 text-end" ></i> </a>
           </div> 
       </li> `;

            bookBelumbaca.innerHTML += el;
      } else {
         let el = `
         <li class="list-book bg-warning rounded-4 bg-white shadow p-3 mb-3 rounded book-list" > 

         <div class="d-flex justify-content-between">
           <span class="judul fs-5 mb-1 fw-semibold text-primary">${book.title}</span>
           <div class="aksi">
             <a href="#" class="text-decoration-none" onclick="editBookData(${book.id})"><i class="bi bi-pencil-square fs-5"></i> </a>
             <a href="#" onclick="removeBook(${book.id})"><i class="bi bi-trash fs-5 "></i></a>
         </div>
         </div>

           <span class="text-small penulis pt-4 "><span class="fw-semibold">Penulis : </span>${book.penulis}</span><br>
           <span class="text-small date"><span class="fw-semibold">Tanggal : </span>${book.tahun}</span>
           <p class="textComment mt-3"><span class="fw-semibold">Comment : </span> ${book.pesan}</p>

           <div class="icon-pindah d-flex ">
             <a href="#" class="text-start"  onclick="changeBookStatus(${book.id})"><i class="bi bi-arrow-return-left fs-5 ms-1" ></i> </a>
           </div> 
       </li>   
            `;

            bookDibaca.innerHTML += el;
      }
      form.reset()
   });
}



// content loaded & submit form
document.addEventListener("DOMContentLoaded", function () {
   form.addEventListener("submit", function (e) {
      e.preventDefault();
      addBook();

      // form.reset();
   });

   if (isStorageExist()) {
      loadDataFromStorage();
   }

  
});

// render event addeventlistener
document.addEventListener(RENDER_EVENT, () => {
   const btnResetRak = document.getElementById("resetRak");
   if (books.length <= 0) {
      btnResetRak.style.display = "none";
   } else {
      btnResetRak.style.display = "block";
   }

   showBook(books);
   
});
