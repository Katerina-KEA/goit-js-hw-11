import axios from 'axios';
import Notiflix from 'notiflix';
import { createGalleryImages } from './js/createGalleryImages';
import { toFetchImages } from './js/toFetchImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: '250',
});

searchForm.addEventListener('submit', submitForm);
btnLoadMore.addEventListener('click', loadMore);

let page = 1;
let querySearch;
const perPage = 40;

function submitForm(evt) {
    evt.preventDefault();

    querySearch = evt.currentTarget.searchQuery.value.trim();
    console.log(querySearch);
    gallery.innerHTML = '';
    page = 1;
    btnLoadMore.classList.add('hidden')
    render()

    async function render() {
        try {
            const { data: response } = await toFetchImages(querySearch, page, perPage);
            if (querySearch === '') {
                return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            }
            if (response.totalHits === 0) {
                return Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
            }
            else {
                createGalleryImages(response.hits);
                Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
                lightbox.refresh();
                if (response.totalHits > perPage) {
                    btnLoadMore.classList.remove('hidden');
                }
            }   
        }
        catch (error) {
            console.log(error);
        }
    }

}

async function loadMore() {
    page += 1;
    try {
        const { data: response } = await toFetchImages(querySearch, page, perPage);
        createGalleryImages(response.hits);
        lightbox.refresh();
        const totalPages = Math.ceil(response.totalHits / perPage)
        if (page === totalPages) {
            btnLoadMore.classList.add('hidden');
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
    }
    catch (error) {
        console.log(error);
    }
};