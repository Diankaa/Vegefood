/* eslint-disable require-jsdoc */
// dropdown
const width = $(window).width();
if (width > 922) {
  $('.dropdown').hover(function () {
    $('.dropdown-menu').addClass('show');
  }, function () {
    $('.dropdown-menu').removeClass('show');
  });
} else {
  $('.dropdown').click(function () {
    $('.dropdown-menu').slideToggle('show');
  });
}

$('#toggle').click(function () {
  $('.nav-list').toggleClass('show');
  $('.nav-list').slideToggle();
});

// hero slider
if ($('.hero-slider').length > 0) {
  $('.hero-slider').cycle({
    fx: 'fade',
    speed: 1100,
    timeout: 3000,
    containerResize: false,
    slideResize: false,
  });
}

// scroll
const scrollWindow = () => {
  $(window).scroll(() => {
    const $w = $(window);
    const st = $w.scrollTop();
    const nav = $('.nav');
    if (st > 150) {
      if (!nav.hasClass('scrolled')) {
        nav.addClass('scrolled');
      }
    }
    if (st < 150) {
      if (nav.hasClass('scrolled')) {
        nav.removeClass('scrolled sleep');
      }
    }
    if (st > 350) {
      if (!nav.hasClass('awake')) {
        nav.addClass('awake');
      }
    }
    if (st < 350) {
      if (nav.hasClass('awake')) {
        nav.removeClass('awake');
        nav.addClass('sleep');
      }
    }
  });
};

scrollWindow();

// timer
function setTimer() {
  let endTime = new Date('31 January 2020 9:56:00 GMT+01:00');
  endTime = (Date.parse(endTime) / 1000);

  let now = new Date();
  now = (Date.parse(now) / 1000);

  const timeLeft = endTime - now;

  const days = Math.floor(timeLeft / 86400);
  let hours = Math.floor((timeLeft - (days * 86400)) / 3600);
  let minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60);
  let seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) -
    (minutes * 60)));

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < '10') {
    minutes = '0' + minutes;
  }
  if (seconds < '10') {
    seconds = '0' + seconds;
  }

  $('#days').html(days + '<span>Days</span>');
  $('#hours').html(hours + '<span>Hours</span>');
  $('#minutes').html(minutes + '<span>Minutes</span>');
  $('#seconds').html(seconds + '<span>Seconds</span>');
}

setInterval(function () {
  setTimer();
}, 1000);


const loader = function() {
  setTimeout(function() { 
    // loader    
    if($('#ftco-loader').length > 0) {
      $('#ftco-loader').removeClass('show');
    }

    // animation
    new WOW({
      offset: 200,
    }).init();
  }, 1000);
};
loader();