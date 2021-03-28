(function () {
  // Отлавливаем элементы 
const container = document.querySelector('#carousel');
const slides = container.querySelectorAll('.slide'); 
const indicatorsContainer = container.querySelector('#indicators-container');
const indicators = indicatorsContainer.querySelectorAll('.indicator');
const controlsContainer = container.querySelector('#controls-container');
const pauseBtn = controlsContainer.querySelector('#pause-btn');
const prevBtn = controlsContainer.querySelector('#prev-btn');
const nextBtn = controlsContainer.querySelector('#next-btn');

// Вводим константы
const CLASS_TRIGGER = 'active';
const FA_PAUSE ='<i class="far fa-pause-circle"></i>';
const FA_PLAY = '<i class="far fa-play-circle"></i>';
const SPACE = ' ';
const LEFT_ARROW = 'ArrowLeft';
const RIGTH_ARROW = 'ArrowRight';


// Инициализация переменных
let currentSlide = 0;  
let slidesCount = slides.length;
let isPlaying = true;
let timerID = null;
let interval = 2000;
let swipeStartX = null;
let swipeEndX = null;

// Функция для вывода слайдов
function gotoNth(n) {
  slides[currentSlide].classList.toggle(CLASS_TRIGGER); // 1-й слайд 
  indicators[currentSlide].classList.toggle(CLASS_TRIGGER); // 1-й слайд 

  currentSlide = (n + slidesCount) % slidesCount; // след. слайд и проверка на длину

  slides[currentSlide].classList.toggle(CLASS_TRIGGER); // выводим след слайд
  indicators[currentSlide].classList.toggle(CLASS_TRIGGER); // выводим след слайд
}

// Передаем слайд вперед
const gotoNext = () =>   gotoNth(currentSlide + 1);
// Слайд назад
const gotoPrev = () => gotoNth(currentSlide - 1);

// Функция pause
function pause() {
  isPlaying = false;
  clearInterval(timerID);
  pauseBtn.innerHTML = FA_PLAY;
}

// Функция play
function play() {
  isPlaying = true;
  timerID = setInterval(gotoNext, interval); // запускаем эту ф-ция для передачи параметра n
  pauseBtn.innerHTML = FA_PAUSE; // меняеться название у тега
}

// Функция pausePlay
const pausePlay = () => isPlaying  ? pause() : play();

 
/* Ф-ции next() и prev(), ставят setInterval на паузу,
   и вызывают gotoNext и gotoPrev
*/
function next() {
  pause(); //пауза когда тыцяем вперед
  gotoNext();
}

function prev() {
  pause();//пауза когда тыцяем назад
  gotoPrev();
}

// Контролсы(дилигированние) 
function indicate (e) {
  let target = e.target;
  if(target.classList.contains('indicator')) {
    pause(); // ставим на паузу, когда тыцяем индикатор
    gotoNth(+target.dataset.slideTo);// выводим число из атрибута(с помошью обьекта dataset)
  }

}
// Управление клавиатурой влево и вправо
function pressKey(e) {
  if (e.key === LEFT_ARROW) prev();
  if (e.key === RIGTH_ARROW) next();
  if (e.key === SPACE) pausePlay();
}

// Свайпаем слайды влево и вправо
function swipeStart (e) {
  if(e.changedTouches.length === 1) swipeStartX = e.changedTouches[0].pageX;
}

function swipeEnd(e) {
  if(e.changedTouches.length === 1) {
    swipeEndX = e.changedTouches[0].pageX;
    if (swipeStartX - swipeEndX < 0) prev();
    if (swipeStartX - swipeEndX > 0) next();
    
  }
}

// Обработчики
pauseBtn.addEventListener('click', pausePlay); // повесили обработчик
prevBtn.addEventListener('click', prev); // повесили обработчик
nextBtn.addEventListener('click', next); // повесили обработчик
indicatorsContainer.addEventListener('click', indicate);// дилигирование(родительский эл-т)
container.addEventListener('touchstart', swipeStart );
container.addEventListener('touchend', swipeEnd);
document.addEventListener('keydown', pressKey); //управление клавиатурой

timerID = setInterval(gotoNext, interval); // вызываем gotoNext

}())





 



 

 


 