function Carousel (containerID = '#carousel', sliderID = '.slide') {
   this.container = document.querySelector(containerID);
   this.slides = this.container.querySelectorAll(sliderID); 
   this.interval = 2000;
   this._initProps();
   this._initIndicators();
   this._initControls();
   this._initListeners();
}

Carousel.prototype = {
  _initProps() {
    this.CLASS_TRIGGER = 'active';
    this.FA_PAUSE ='<i class="far fa-pause-circle"></i>';
    this.FA_PLAY = '<i class="far fa-play-circle"></i>';
    this.SPACE = ' ';
    this.LEFT_ARROW = 'ArrowLeft';
    this.RIGTH_ARROW = 'ArrowRight';
    this.FA_PREV = '<i class="fas fa-angle-left"></i>';
    this.FA_NEXT = '<i class="fas fa-angle-right"></i>';
      
    this.currentSlide = 0;  
    this.slidesCount = this.slides.length;
    this.isPlaying = true;
     
  },

  _initIndicators() {
    const indicators = document.createElement('ol');

    indicators.setAttribute('class', 'indicators');
    indicators.setAttribute('id', 'indicators-container');
  
    for(let i = 0; i < this.slidesCount; i++) {
      const indicator = document.createElement('li');
      indicator.setAttribute('class', 'indicator');
      if(i === 0) indicator.classList.add('active');
      indicator.dataset.slideTo = `${i}`;

      indicators.appendChild(indicator);
    }

    this.container.appendChild(indicators);
    this.indicatorsContainer = this.container.querySelector('#indicators-container');
    this.indicators = this.indicatorsContainer.querySelectorAll('.indicator');

  },
  _initControls() {
      const controls = document.createElement('div');
      this.container.appendChild(controls);

      const PAUSE = `<span id="pause-btn" class="control control-pause">${this.FA_PAUSE}</span>`;
      const PREV = `<span id="prev-btn" class="control control-prev">${this.FA_PREV}</span>`;
      const NEXT = `<span id="next-btn" class="control control-next">${this.FA_NEXT}</span>`;
      controls.setAttribute('class','controls');
      controls.setAttribute('id', 'controls-container');

      controls.innerHTML = PAUSE + PREV + NEXT;
  

   this.controlsContainer = this.container.querySelector('#controls-container');
   this.pauseBtn = this.container.querySelector('#pause-btn');
   this.prevBtn = this.container.querySelector('#prev-btn');
   this.nextBtn = this.container.querySelector('#next-btn');
  },

  _initListeners() {
    this.pauseBtn.addEventListener('click', this.pausePlay.bind(this)); 
    this.prevBtn.addEventListener('click', this.prev.bind(this));  
    this.nextBtn.addEventListener('click', this.next.bind(this));  
    this.indicatorsContainer.addEventListener('click', this._indicate.bind(this)); 
    document.addEventListener('keydown', this._pressKey.bind(this));  
  },

  _indicate (e) {
    let target = e.target;
    if(target.classList.contains('indicator')) {
     this.pause();  
     this.gotoNth(+target.dataset.slideTo); 
    }
   },
  
   _pressKey(e) {
    if (e.key === this.LEFT_ARROW) this.prev();
    if (e.key === this.RIGTH_ARROW) this.next();
    if (e.key === this.SPACE) this.pausePlay();
   },
 
  

   gotoNth: function (n) {
    this.slides[this.currentSlide].classList.toggle(this.CLASS_TRIGGER);  
    this.indicators[this.currentSlide].classList.toggle(this.CLASS_TRIGGER);  
    this.currentSlide = (n + this.slidesCount) % this.slidesCount;  
    this.slides[this.currentSlide].classList.toggle(this.CLASS_TRIGGER);  
    this.indicators[this.currentSlide].classList.toggle(this.CLASS_TRIGGER);  
  },

  gotoNext() {
    this.gotoNth(this.currentSlide + 1);
  }, 

  gotoPrev() {
    this.gotoNth(this.currentSlide - 1);
  },
 
  pause() {
   this.isPlaying = false;
   clearInterval(this.timerID);
   this.pauseBtn.innerHTML = this.FA_PLAY;
  },

  play() {
   this.isPlaying = true;
   this.timerID = setInterval(() => {
      this.gotoNext();
   }, this.interval);  
   this.pauseBtn.innerHTML = this.FA_PAUSE; 
  },

  pausePlay() {
    this.isPlaying  ? this.pause() : this.play();
  }, 

  next() {
   this.pause();  
   this.gotoNext();
  },
  
  prev() {
   this.pause(); 
   this.gotoPrev();
  },
  
  init() {
    this.timerID = setInterval(() => {
     this.gotoNext() 
    }, this.interval); 
  }
};

// Разделили функционал. Сделали наследование

function SwipeCarousel() {
  Carousel.apply(this,arguments);
}

SwipeCarousel.prototype = Object.create(Carousel.prototype);
SwipeCarousel.prototype.constructor = SwipeCarousel;

SwipeCarousel.prototype._initListeners = function () {
  Carousel.prototype._initListeners.apply(this);
  this.container.addEventListener('touchstart', this._swipeStart.bind(this));
  this.container.addEventListener('touchend', this._swipeEnd.bind(this));
};   
SwipeCarousel.prototype._swipeStart = function (e) {
    if(e.changedTouches.length === 1) this.swipeStartX = e.changedTouches[0].pageX;
};
 
SwipeCarousel.prototype._swipeEnd = function (e) {
     if(e.changedTouches.length === 1) {
      this.swipeEndX = e.changedTouches[0].pageX;
     if (this.swipeStartX - this.swipeEndX < 0) this.prev();
     if (this.swipeStartX - this.swipeEndX > 0) this.next();
     }
}; 



