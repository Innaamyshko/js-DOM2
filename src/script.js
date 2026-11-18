const galleryContainer = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('loadMore');
const clearGalleryBtn = document.getElementById('clearGallery');
const removeLastBtn = document.getElementById('removeLast');
const reverseGalleryBtn = document.getElementById('reverseGallery');
const shuffleGalleryBtn = document.getElementById('shuffleGallery');

let photosList = [];
let currentPage = 1;
const IMAGES_PER_REQUEST = 4;

function renderGallery() {
  galleryContainer.innerHTML = '';

  if (photosList.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'gallery-empty';
    emptyMessage.textContent = 'Галерея порожня. Натисніть «Завантажити ще 4 картинки», щоб додати нові фото.';
    galleryContainer.appendChild(emptyMessage);
    return;
  }

  photosList.forEach(function (photo) {
    const card = document.createElement('article');
    card.className = 'gallery-card';

    const img = document.createElement('img');
    img.src = `https://picsum.photos/id/${photo.id}/600/450`;
    img.alt = `Фото автора ${photo.author}`;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.className = 'gallery-card-info';

    const author = document.createElement('span');
    author.className = 'gallery-author';
    author.textContent = photo.author;

    const idBadge = document.createElement('span');
    idBadge.className = 'gallery-badge';
    idBadge.textContent = `#${photo.id}`;

    info.appendChild(author);
    info.appendChild(idBadge);
    card.appendChild(img);
    card.appendChild(info);
    galleryContainer.appendChild(card);
  });
}

async function fetchMorePhotos() {
  loadMoreBtn.disabled = true;
  const originalText = loadMoreBtn.textContent;
  loadMoreBtn.textContent = 'Завантаження...';

  try {
    const response = await fetch(
      `https://picsum.photos/v2/list?page=${currentPage}&limit=${IMAGES_PER_REQUEST}`
    );

    if (!response.ok) {
      throw new Error('Помилка завантаження даних із сервера');
    }

    const data = await response.json();
    photosList = photosList.concat(data);
    currentPage += 1;
    renderGallery();
  } catch (error) {
    galleryContainer.innerHTML = `<p class="gallery-empty">Не вдалося завантажити картинки: ${error.message}</p>`;
  } finally {
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = originalText;
  }
}

loadMoreBtn.addEventListener('click', fetchMorePhotos);

clearGalleryBtn.addEventListener('click', function () {
  photosList = [];
  renderGallery();
});

removeLastBtn.addEventListener('click', function () {
  if (photosList.length === 0) return;
  photosList.pop();
  renderGallery();
});

reverseGalleryBtn.addEventListener('click', function () {
  if (photosList.length < 2) return;
  photosList.reverse();
  renderGallery();
});

if (shuffleGalleryBtn) {
  shuffleGalleryBtn.addEventListener('click', function () {
    if (photosList.length < 2) return;
    for (let i = photosList.length - 1; i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const temp = photosList[i];
      photosList[i] = photosList[randomIndex];
      photosList[randomIndex] = temp;
    }
    renderGallery();
  });
}

fetchMorePhotos();
