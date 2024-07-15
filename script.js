const url = 'https://api.themoviedb.org/3';
const API_KEY = 'fb7bb23f03b6994dafc674c074d01761';
const urlToImage = 'https://image.tmdb.org/t/p/w500';

async function fetchData(endpoint) {
  const response = await fetch(`${url}${endpoint}?api_key=${API_KEY}`);
  const { results } = await response.json();
  return results;
}

async function showPopular() {
  const movies = await fetchData('/movie/popular');
  movies.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `
    <div class='card__image'><img  src="${urlToImage}${movie.poster_path}" alt="" /></div>
        <div class="card__caption">
            <h2 class="card__title">${movie.title}</h2>
            <p class="card__release">Release: ${movie.release_date}</p>
        </div>
        
        `;
    document.querySelector('.popular-movies__content').appendChild(div);
  });
}

async function showNowPlaying() {
  const nowPlaying = await fetchData('/movie/now_playing');
  nowPlaying.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
    <div class="swiper-image"><img src=${urlToImage}${movie.poster_path}>
    </div>
    <div class="now-playing__rating">
          <i class="fas fa-star fa-xs star py-1"> <span class="text">${movie.vote_average.toFixed(
            1
          )}
           <span style="font-size: 27px; vertical-align: bottom;">/</span> 10</span></i>
        </div>
    `;
    document.querySelector('.swiper-wrapper').appendChild(div);
    console.log(nowPlaying);
  });
}

showPopular();
showNowPlaying();

document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.swiper', {
    // loop: true,
    speed: 1000,
    spaceBetween: 30,
    // freeMode: true,
    slidesPerView: 1,

    autoplay: {
      delay: 3000, // Задержка перед автоматической сменой слайда (в миллисекундах)
      disableOnInteraction: false, // Отключение автопрокрутки при взаимодействии пользователя
    },

    breakpoints: {
      500: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      700: {
        slidesPerView: 3,
      },
      1000: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });
});
