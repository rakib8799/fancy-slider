const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const search = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');

// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images
const showImages = images => {
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
        /* 
        Extra Parts-2 & 3:
            // Extra Part-2: Accordion will be appeared after each of the images.
            // Extra Part-3: Modal will be opened after clicking on Accordion's 'click' button.
        */
        const {
            id,
            views,
            likes,
            comments,
            downloads,
            user_id,
            user,
            userImageURL,
        } = image;
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-xs-6 mb-2';
        div.innerHTML = ` 
        <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">

        <div class="accordion" id="accordionExample-${id}">
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${id}" aria-expanded="false" aria-controls="collapse-${id}">Click to see details</button>
                </h2>
                <div id="collapse-${id}" class="accordion-collapse collapse hide" aria-labelledby="headingOne" data-bs-parent="#accordionExample-${id}">
                    <div class="accordion-body bg-dark text-white text-center">
                        <p>${views} Views</p>
                        <p>${likes} Likes</p>
                        <p>${comments} Comments</p>
                        <p>${downloads} Downloads</p>
                        <button type="button" class='btn btn-primary' data-bs-toggle="modal" data-bs-target="#exampleModal-${id}">Click</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="modal fade" id="exampleModal-${id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content text-center">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Contributor's Information</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body m-auto">  
                        <p>${user_id}</p>
                        <h5>${user}</h5>
                        <img src="${userImageURL}" class='img-fluid rounded-circle'>
                    </div>
                </div>
            </div>
        </div>
        `;
        gallery.appendChild(div);
    });
};

const getImages = query => {
    fetch(
        `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
    )
        .then(response => response.json())
        .then(data => showImages(data.hits))
        .catch(err => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
    let element = event.target;
    element.classList.add('added');

    let item = sliders.indexOf(img);
    if (item === -1) {
        sliders.push(img);
    } else {
        element.classList.remove('added');
        sliders.pop();
    }
};
var timer;
const createSlider = () => {
    // check slider image length
    if (sliders.length < 2) {
        alert('Select at least 2 image.');
        return;
    }
    // crate slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className =
        'prev-next d-flex w-100 justify-content-between align-items-center';
    prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext);
    document.querySelector('.main').style.display = 'block';
    // hide image aria
    imagesArea.style.display = 'none';
    const duration =
        Math.abs(document.getElementById('duration').value) || 1000;
    sliders.forEach(slide => {
        let item = document.createElement('div');
        item.className = 'slider-item';
        item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
        sliderContainer.appendChild(item);
    });
    changeSlide(0);
    timer = setInterval(function () {
        slideIndex++;
        changeSlide(slideIndex);
    }, duration);
};

// change slider index
const changeItem = index => {
    changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = index => {
    const items = document.querySelectorAll('.slider-item');
    if (index < 0) {
        slideIndex = items.length - 1;
        index = slideIndex;
    }

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach(item => {
        item.style.display = 'none';
    });

    items[index].style.display = 'block';
};

searchBtn.addEventListener('click', function () {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const search = document.getElementById('search');
    getImages(search.value);
    sliders.length = 0;
});

search.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
        searchBtn.click();
    }
});

sliderBtn.addEventListener('click', function () {
    createSlider();
});
