/* ======================
   HERO CAROUSEL SCRIPT
====================== */
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

// Show specific slide
function showSlide(n) {
  slides.forEach(slide => slide.classList.remove('active'));
  indicators.forEach(indicator => indicator.classList.remove('active'));

  if (n >= totalSlides) currentSlide = 0;
  else if (n < 0) currentSlide = totalSlides - 1;
  else currentSlide = n;

  slides[currentSlide].classList.add('active');
  indicators[currentSlide].classList.add('active');
}

// Move slides
function moveSlide(direction) {
  showSlide(currentSlide + direction);
}

// Go to specific slide
function goToSlide(n) {
  showSlide(n);
}

// Auto-play
let autoPlayInterval = setInterval(() => {
  moveSlide(1);
}, 5000);

// Pause on hover
const carousel = document.querySelector('.carousel');
carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
carousel.addEventListener('mouseleave', () => {
  autoPlayInterval = setInterval(() => moveSlide(1), 5000);
});

// Touch events (swipe on mobile)
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  if (touchEndX < touchStartX - 50) moveSlide(1);
  if (touchEndX > touchStartX + 50) moveSlide(-1);
}


/* ======================
   IMAGE EDITOR SCRIPT
====================== */
let filterA = document.getElementById("blur");
let filterB = document.getElementById("contrast");
let filterC = document.getElementById("hue-rotate");
let filterD = document.getElementById("sepia");

let noFlipBtn = document.getElementById("no-flip");
let flipXBtn = document.getElementById("flip-x");
let flipYBtn = document.getElementById("flip-y");

let resetBtn = document.getElementById("reset-btn");
let saveBtn = document.getElementById("save-btn");

let uploadButton = document.getElementById("upload-button");
let image = document.getElementById("chosen-image");

// Reset all filters and flip options
function resetFilter() {
  filterA.value = "0";
  filterB.value = "100";
  filterC.value = "0";
  filterD.value = "0";

  noFlipBtn.checked = true;
  addFilter();
  flipImage();
}

// Save edited image
function saveImage() {
  if (!image.src) {
    alert("Please upload an image first!");
    return;
  }

  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  let filterString = `blur(${filterA.value}px) contrast(${filterB.value}%) hue-rotate(${filterC.value}deg) sepia(${filterD.value}%)`;
  ctx.filter = filterString;

  let scaleX = flipXBtn.checked ? -1 : 1;
  let scaleY = flipYBtn.checked ? -1 : 1;

  ctx.translate(scaleX === -1 ? canvas.width : 0, scaleY === -1 ? canvas.height : 0);
  ctx.scale(scaleX, scaleY);

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  let link = document.createElement('a');
  link.download = 'edited-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Upload image
uploadButton.onchange = () => {
  resetFilter();
  document.querySelector(".image-container").style.display = "block";
  let reader = new FileReader();
  reader.readAsDataURL(uploadButton.files[0]);
  reader.onload = () => {
    image.setAttribute("src", reader.result);
  }
}

// Filter sliders
let sliders = document.querySelectorAll(".filter input[type='range']");
sliders.forEach(slider => {
  slider.addEventListener("input", addFilter);
});

function addFilter() {
  image.style.filter = `blur(${filterA.value}px) contrast(${filterB.value}%) hue-rotate(${filterC.value}deg) sepia(${filterD.value}%)`;
}

// Flip radio buttons
let radioBtns = document.querySelectorAll(".flip-option input[type='radio']");
radioBtns.forEach(radioBtn => {
  radioBtn.addEventListener("click", flipImage);
});

function flipImage() {
  if (flipXBtn.checked) {
    image.style.transform = "scaleX(-1)";
  }
  else if (flipYBtn.checked) {
    image.style.transform = "scaleY(-1)";
  }
  else {
    image.style.transform = "scale(1,1)";
  }
}

// Button events
resetBtn.addEventListener("click", resetFilter);
saveBtn.addEventListener("click", saveImage);



