import { fetchImages, fetchMoreImages } from './api.js';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

import Card from './card.js';

const form = document.getElementById('searchForm');

const gallery = document.querySelector('.gallery');

gallery.style.maxWidth = '1440px';

form.addEventListener('submit', async e => {
  e.preventDefault();

  let pageNumber = 1;

  let q = e.target.elements['searchForm'].value;

  if (q.trim() === '') {
    return;
  }

  // Limpiar contenido de la galería antes de agregar nuevas imágenes

  gallery.innerHTML = '';

  let data = await fetchImages(q, pageNumber);

  data.forEach(image => {
    const card = new Card(image);

    gallery.appendChild(card.newCard());
  });

  // No es necesario agregar un listener para 'click' en este punto

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsDelay: '250ms',
  });

  window.onscroll = async function () {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;

    var windowHeight = window.innerHeight;

    var documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight === documentHeight) {
      pageNumber += 1;

      data = await fetchMoreImages(q, pageNumber);

      data.forEach(image => {
        const card = new Card(image);

        gallery.appendChild(card.newCard());
      });

      lightbox.refresh();
    }
  };
});
