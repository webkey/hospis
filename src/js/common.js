/**
 * !Detects overlay scrollbars (when scrollbars on overflowed blocks are visible).
 * This is found most commonly on mobile and OS X.
 * */
var HIDDEN_SCROLL = Modernizr.hiddenscroll;
var NO_HIDDEN_SCROLL = !HIDDEN_SCROLL;

/**
 * !Add touchscreen classes
 * */
function addTouchClasses() {
  if (!("ontouchstart" in document.documentElement)) {
    document.documentElement.className += " no-touchevents";
  } else {
    document.documentElement.className += " touchevents";
  }
}

/**
 * !Add placeholder for old browsers
 * */
function placeholderInit() {
  $('[placeholder]').placeholder();
}

/**
 * !Add classes to form elements
 * if they has a value or they are in focus
 * */
function formElementState() {
  var $elem = $('.field-js');
  
  if ($elem.length) {
    function toggleStateClass(mod, cond) {
      var $this = $(this);
      $this.add($this.prev('label')).toggleClass(mod, cond);
    }

    // Focus
    $elem.on('focus blur', function (e) {
      toggleStateClass.call(this, 'focused', e.handleObj.origType === "focus");
    });

    // Has value
    $.each($elem, function () {
      toggleStateClass.call(this, 'filled', $(this).val().length !== 0);
    });

    $elem.on('keyup change', function () {
      toggleStateClass.call(this, 'filled', $(this).val().length !== 0);
    });
  }
}

/**
 * !Initial custom select for cross-browser styling
 * */
function customSelect() {
  var $select = $('select.cselect');

  if ($select.length) {
    $.each($select, function () {
      var $thisSelect = $(this);
      $thisSelect.select2({
        theme: 'custom',
        language: 'ru',
        width: '100%',
        containerCssClass: 'cselect-head',
        dropdownCssClass: 'cselect-drop'
      });
    })

  }
}

/**
 * !Sticky sidebar
 */
function stickySidebar() {
  $(".sidebar").stick_in_parent();
}

/**
 * !Equal height of blocks by maximum height of them
 */
function equalHeight() {
  // equal height of elements
  var $equalHeight = $('.equal-height-js');

  if($equalHeight.length) {
    $equalHeight.children().matchHeight({
      byRow: true, property: 'height', target: null, remove: false
    });
  }
}

/**
 * ! jquery.drop.js
 */
(function($){
  var defaults = {
    opener: '.ms-drop__opener-js',
    openerText: 'span',
    drop: '.ms-drop__drop-js',
    dropOption: '.ms-drop__drop-js a',
    dropOptionText: 'span',
    initClass: 'ms-drop--initialized',
    closeOutsideClick: true, // Close all if outside click
    closeEscClick: true, // Close all if click on escape key
    closeAfterSelect: true, // Close drop after selected option
    preventOption: false, // Add preventDefault on click to option
    selectValue: true, // Display the selected value in the opener
    modifiers: {
      isOpen: 'is-open',
      activeItem: 'active-item'
    }

    // Callback functions
    // afterInit: function () {} // Fire immediately after initialized
    // afterChange: function () {} // Fire immediately after added or removed an open-class
  };

  function MsDrop(element, options) {
    var self = this;

    self.config = $.extend(true, {}, defaults, options);

    self.element = element;

    self.callbacks();
    self.event();
    // close drop if clicked outside active element
    if (self.config.closeOutsideClick) {
      self.closeOnClickOutside();
    }
    // close drop if clicked escape key
    if (self.config.closeEscClick) {
      self.closeOnClickEsc();
    }
    self.eventDropItems();
    self.init();
  }

  /** track events */
  MsDrop.prototype.callbacks = function () {
    var self = this;
    $.each(self.config, function (key, value) {
      if(typeof value === 'function') {
        self.element.on(key + '.msDrop', function (e, param) {
          return value(e, self.element, param);
        });
      }
    });
  };

  MsDrop.prototype.event = function () {
    var self = this;
    self.element.on('click', self.config.opener, function (event) {
      event.preventDefault();
      var curContainer = $(this).closest(self.element);

      if (curContainer.hasClass(self.config.modifiers.isOpen)) {

        curContainer.removeClass(self.config.modifiers.isOpen);

        // callback afterChange
        self.element.trigger('afterChange.msDrop');
        return;
      }

      self.element.removeClass(self.config.modifiers.isOpen);

      curContainer.addClass(self.config.modifiers.isOpen);

      // callback afterChange
      self.element.trigger('afterChange.msDrop');
    });
  };

  MsDrop.prototype.closeOnClickOutside = function () {

    var self = this;
    $(document).on('click', function(event){
      if( $(event.target).closest(self.element).length ) {
        return;
      }

      self.closeDrop();
      event.stopPropagation();
    });

  };

  MsDrop.prototype.closeOnClickEsc = function () {

    var self = this;
    $(document).keyup(function(e) {
      if (e.keyCode === 27) {
        self.closeDrop();
      }
    });

  };

  MsDrop.prototype.closeDrop = function (container) {

    var self = this,
        $element = $(container || self.element);

    if ($element.hasClass(self.config.modifiers.isOpen)) {
      $element.removeClass(self.config.modifiers.isOpen);
    }

  };

  MsDrop.prototype.eventDropItems = function () {

    var self = this;

    self.element.on('click', self.config.dropOption, function (e) {
      var cur = $(this);
      var curParent = cur.parent();

      if(curParent.hasClass(self.config.modifiers.activeItem)){
        e.preventDefault();
        return;
      }
      if(self.config.preventOption){
        e.preventDefault();
      }

      var curContainer = cur.closest(self.element);

      curContainer.find(self.config.dropOption).parent().removeClass(self.config.modifiers.activeItem);

      curParent
          .addClass(self.config.modifiers.activeItem);

      if(self.config.selectValue){
        curContainer
            .find(self.config.opener).find(self.config.openerText)
            .html(cur.find(self.config.dropOptionText).html());
      }

      if(self.config.closeAfterSelect) {
        self.closeDrop();
      }

    });

  };

  MsDrop.prototype.init = function () {

    this.element.addClass(this.config.initClass);

    this.element.trigger('afterInit.msDrop');

  };

  $.fn.msDrop = function (options) {
    'use strict';

    return this.each(function(){
      new MsDrop($(this), options);
    });

  };
})(jQuery);

/**
 * !Toggle lang
 */
function toggleLang() {
  $('.ms-drop__container-js--1').msDrop();
}

/**
 * !Slider document photos
 */
function slidersInit() {
  // Promo slider
  var $promoSlider = $('.promo-slider-js');

  if($promoSlider.length){
    $promoSlider.each(function () {
      var $thisSlider = $(this),
          $screen = $thisSlider.find('.promo-screen-js'),
          $thumbs = $thisSlider.find('.promo-thumbs-js'),
          $pagination = $thisSlider.find('.swiper-pagination'),
          $navPrev = $thisSlider.find('.swiper-button-prev'),
          $navNext = $thisSlider.find('.swiper-button-next');

      var thumbs = new Swiper($thumbs, {
        spaceBetween: 10,
        slidesPerView: 4,
        // freeMode: true,
        slideToClickedSlide: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        navigation: {
          nextEl: $navPrev,
          prevEl: $navNext,
        },
      });

      var screen = new Swiper ($screen, {
        init: false,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        loop: true,
        allowTouchMove: false,
        parallax: true,
        pagination: {
          el: $pagination,
          type: 'bullets',
          clickable: true
        },
        thumbs: {
          swiper: thumbs
        }
        // breakpoints: {
        //   991: {
        //     slidesPerView: 'auto',
        //     spaceBetween: 40
        //   },
        //   639: {
        //     slidesPerView: 'auto',
        //     spaceBetween: 10
        //   }
        // },
        // on: {
        //   resize: function () {
        //     if (window.innerWidth <= 992) {
        //       sampleSlider.slides.css('width', '');
        //     }
        //   }
        // }
      });

      screen.on('init', function() {
        $thisSlider.addClass('is-loaded');
      });

      screen.init();

      // screen.params.controller.control = thumbs;
      // thumbs.params.controller.control = screen;
    });
  }
  
  // Reviews slider
  var $reviewsSlider = $('.reviews-slider-js');

  if($reviewsSlider.length){
    $reviewsSlider.each(function () {
      var $thisSlider = $(this),
          $pagination = $thisSlider.find('.swiper-pagination');

      var reviewsSlider = new Swiper ($thisSlider, {
        init: false,
        spaceBetween: 14,
        slidesPerView: 3,
        loop: true,
        watchSlidesVisibility: true,
        pagination: {
          el: $pagination,
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          991: {
            slidesPerView: 2,
            spaceBetween: 14
          },
          639: {
            slidesPerView: 1,
            spaceBetween: 10
          }
        }
      });

      reviewsSlider.on('init', function() {
        $thisSlider.addClass('is-loaded');
        $(reviewsSlider.slides).not(':hidden').matchHeight({
          byRow: true,
          property: 'height',
          target: null,
          remove: false
        });
      });

      reviewsSlider.init();
    });
  }
}

/**
 * !Form validation
 * */
function formValidation() {
  $.validator.setDefaults({
    submitHandler: function(form) {
      // alert('Форма находится в тестовом режиме. Чтобы закрыть окно, нажмите ОК.');

      var $form = $(form);
      if($form.hasClass('subs-form')) {
        setTimeout(function () {
          $form.closest('.subs-js').addClass('completed');
        }, 50);
      }

      // return false;
    }
  });

  var $form = $('.validate-js');

  if ($form.length) {
    var changeClasses = function (elem, remove, add) {
      // console.log('changeClasses');
      elem
          .removeClass(remove).addClass(add);
      elem
          .closest('form').find('label[for="' + elem.attr('id') + '"]')
          .removeClass(remove).addClass(add);
      elem
          .closest('.input-wrap')
          .removeClass(remove).addClass(add);
    };

    $.each($form, function (index, element) {
      $(element).validate({
        errorClass: "error",
        validClass: "success",
        errorElement: false,
        errorPlacement: function (error, element) {
          return true;
        },
        highlight: function (element, errorClass, successClass) {
          changeClasses($(element), successClass, errorClass);
        },
        unhighlight: function (element, errorClass, successClass) {
          changeClasses($(element), errorClass, successClass);
        }
      });
    });
  }
}

/**
 * =========== !ready document, load/resize window ===========
 */

$(window).on('load', function () {
  // add functions
});

$(window).on('debouncedresize', function () {
  // $(document.body).trigger("sticky_kit:recalc");
});

$(document).ready(function () {
  // objectFitImages();
  addTouchClasses();
  placeholderInit();
  formElementState();
  customSelect();
  equalHeight();
  stickySidebar();
  toggleLang();
  slidersInit();

  formValidation();
});
