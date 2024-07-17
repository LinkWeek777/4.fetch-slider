const global = {
  url: 'https://api.themoviedb.org/3',
  API_KEY: 'fb7bb23f03b6994dafc674c074d01761',
  urlToImage: 'https://image.tmdb.org/t/p/w500',
  urlToBackdrop: 'https://image.tmdb.org/t/p/original',
};

async function fetchData(endpoint) {
  try {
    const response = await fetch(
      `${global.url}${endpoint}?api_key=${global.API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Request failed');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}

async function showPopular() {
  const { results } = await fetchData('/movie/popular');
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
    <div class='card__image'><a href="movie_details.html?id=${movie.id}">
    
      <img  src="${
        movie.poster_path
          ? global.urlToImage + movie.poster_path
          : '/images/no-image.jpg'
      }" alt="" />
    </a></div>
        <div class="card__caption">
            <h2 class="card__title">${movie.title}</h2>
            <p class="card__release">Release: ${movie.release_date}</p>
        </div>
        
        `;
    document.querySelector('.popular-movies__content').appendChild(div);
  });
}

async function showNowPlaying() {
  const { results } = await fetchData('/movie/now_playing');
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
    <div class="swiper-image"><a href="movie_details.html?id=${movie.id}">

    <img src=${
      movie.poster_path
        ? global.urlToImage + movie.poster_path
        : '/images/no-image.jpg'
    }>
    
    </a>
    </div>
    <div class="now-playing__rating">
          <i class="fas fa-star fa-xs star gold-text py-1"> <span class="text">${movie.vote_average.toFixed(
            1
          )}
           <span style="font-size: 27px; vertical-align: bottom;">/</span> 10</span></i>
        </div>
    `;
    document.querySelector('.swiper-wrapper').appendChild(div);
  });
}

function loadSlider() {
  document.addEventListener('DOMContentLoaded', function () {
    const swiper = new Swiper('.swiper', {
      // loop: true,
      speed: 1000,
      spaceBetween: 30,
      freeMode: true,
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
}

async function showDetails() {
  const id = location.search.split('=')[1];
  const movie = await fetchData(`/movie/${id}`);
  const section = document.querySelector('.movie-details');
  movie.backdrop_path &&
    (section.style.backgroundImage = `linear-gradient(115deg,
  hsla(0, 0%, 0%, 0.8), rgba(0, 0, 0, 0.8)), url(
    ${global.urlToBackdrop}${movie.backdrop_path}
  )`);
  const div = document.querySelector('.movie-details__hero');
  console.log(movie);
  div.innerHTML = `
  <div class="poster"><img src="${
    movie.poster_path
      ? global.urlToBackdrop + movie.poster_path
      : '/images/no-image.jpg'
  }" alt="${movie.title}" /></div>
          <div class="description ms-1">
            <h2 class="description__title">${movie.title}</h2>
            <i class="fas fa-star fa-xs star gold-text my-1">
              <span class="light-text"
                >${movie.vote_average.toFixed(1)}
                <span style="font-size:25px; vertical-align:sub;">/</span>
                10</span
              ></i
            >
            <p class="description__release my-1">Release Date: ${
              movie.release_date
            }</p>
            <p class="description__text my-1">
              ${movie.overview}
            </p>
            <h5 class="description__genres-title">Genres</h5>
            <ul class="description__list-genres">

            </ul>
            <a href=${
              movie.homepage
            } class="btn description__button mt-1"> Visit Movie Homepage </a>
          </div>`;
  const genres = movie.genres;

  genres.forEach((genre) => {
    const li = document.createElement('li');
    const text = document.createTextNode(genre.name);
    li.appendChild(text);
    document.querySelector('.description__list-genres').appendChild(li);
  });

  // display movie-info
  const container = document.querySelector('.movie-info').firstElementChild;
  container.innerHTML = `<div class="budget my-0">
          <p class="budget__text">
            <span class="gold-text">Budget: </span>$${movie.budget.toLocaleString(
              'ru-RU'
            )}
          </p>
        </div>
        <hr />
        <div class="revenue my-0">
          <p class="revenue__text">
            <span class="gold-text">Revenue: </span>$${movie.revenue.toLocaleString(
              'ru-RU'
            )}
          </p>
        </div>
        <hr />
        <div class="runtime my-0">
          <p class="runtime__text">
            <span class="gold-text">Runtime: </span>${movie.runtime} min
          </p>
        </div>
        <hr />
        <div class="status my-0">
          <p class="status__text">
            <span class="gold-text">Status: </span>${movie.status}
          </p>
        </div>
        <hr />
        <div class="production-companies my-0">
          <h4 class="production-companies__title">Production Companies</h4>
          <p class="production-companies__text"></p>
        </div>`;

  const companiesText = movie.production_companies
    .map((company) => company.name)
    .join(', ');

  document
    .querySelector('.production-companies__text')
    .appendChild(document.createTextNode(companiesText));
}

//router
switch (location.pathname) {
  case '/':
  case '/index.html':
    showPopular();
    showNowPlaying();
    loadSlider();
    break;
  case '/movie_details.html':
    showDetails();
}
