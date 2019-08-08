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
      $this.add($this.prev('label')).add($this.closest('.form-unit')).toggleClass(mod, cond);
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

    // Is disabled
    $.each($elem, function () {
      toggleStateClass.call(this, 'disabled', $(this).is(':disabled'));
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
 * !Background parallax
 */
function bgParallax() {
  // init controller
  var controller = new ScrollMagic.Controller({globalSceneOptions: {triggerHook: "onEnter", duration: "200%"}});

  // build scenes
  new ScrollMagic.Scene({triggerElement: "#bg-parallax-1"})
      .setTween("#bg-parallax-1", {y: "25%", ease: Linear.easeNone})
      .addTo(controller);

  // build scenes
  new ScrollMagic.Scene({triggerElement: "#bg-parallax-2"})
      .setTween("#bg-parallax-2", {y: "40%", ease: Linear.easeNone})
      .addTo(controller);
}

/**
 * !Sticky sidebar
 */
function stickySidebar() {
  $('.sidebar').stick_in_parent();
}

/**
 * !Sticky c-aside
 */
function stickyCAside() {
  $('.c-aside__holder').stick_in_parent({
    parent: '.c-content',
    offset_top: 20
  });
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
        loop: true,
        loopedSlides: 5,
        // freeMode: true,
        shortSwipes: false,
        parallax: true,
        // slideToClickedSlide: true,
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
        loopedSlides: 5,
        allowTouchMove: false,
        parallax: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        pagination: {
          el: $pagination,
          type: 'bullets',
          clickable: true
        },
        thumbs: {
          swiper: thumbs
        },
        // controller: {
        //   swiper: thumbs
        // },
        breakpoints: {
          639: {
            allowTouchMove: true,
          }
        },
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
        // loop: true,
        watchSlidesVisibility: true,
        pagination: {
          el: $pagination,
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          1440: {
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

  // Reviews slider
  var $partnersSlider = $('.partners-slider-js');

  if($partnersSlider.length){
    $partnersSlider.each(function () {
      var $thisSlider = $(this),
          $pagination = $thisSlider.find('.swiper-pagination');

      var reviewsSlider = new Swiper ($thisSlider, {
        init: false,
        spaceBetween: 20,
        slidesPerView: 7,
        slidesPerGroup: 7,
        loop: true,
        watchSlidesVisibility: true,
        pagination: {
          el: $pagination,
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          1440: {
            slidesPerView: 6,
            slidesPerGroup: 6
          },
          1200: {
            slidesPerView: 5,
            slidesPerGroup: 5
          },
          992: {
            slidesPerView: 6,
            slidesPerGroup: 6
          },
          768: {
            slidesPerView: 5,
            slidesPerGroup: 5
          },
          480: {
            slidesPerView: 4,
            slidesPerGroup: 4
          },
          360: {
            slidesPerView: 3,
            slidesPerGroup: 3
          },
        }
      });

      reviewsSlider.on('init', function() {
        $thisSlider.addClass('is-loaded');
      });

      reviewsSlider.init();
    });
  }
}

/**
 * !Multi accordion jquery plugin
 * */
(function ($) {
  var MultiAccordion = function (settings) {
    var options = $.extend({
      collapsibleAll: false, // если установить значение true, сворачиваются идентичные панели НА СТРАНИЦЕ, кроме текущего
      resizeCollapsible: false, // если установить значение true, при ресайзе будут соворачиваться все элементы
      container: null, // общий контейнер
      item: null, // непосредственный родитель открывающегося элемента
      handler: null, // открывающий элемента
      handlerWrap: null, // если открывающий элемент не является непосредственным соседом открывающегося элемента, нужно указать элемент, короный является оберткой открывающего элемета и лежит непосредственно перед открывающимся элементом (условно, является табом)
      panel: null, // открывающийся элемент
      openClass: 'active', // класс, который добавляется при открытии
      currentClass: 'current', // класс текущего элемента
      animateSpeed: 300, // скорость анимации
      collapsible: false // сворачивать соседние панели
    }, settings || {});

    this.options = options;
    var container = $(options.container);
    this.$container = container;
    this.$item = $(options.item, container);
    this.$handler = $(options.handler, container);
    this.$handlerWrap = $(options.handlerWrap, container);
    this._animateSpeed = options.animateSpeed;
    this.$totalCollapsible = $(options.totalCollapsible);
    this._resizeCollapsible = options.resizeCollapsible;

    this.modifiers = {
      active: options.openClass,
      current: options.currentClass
    };

    this.bindEvents();
    this.totalCollapsible();
    this.totalCollapsibleOnResize();

  };

  MultiAccordion.prototype.totalCollapsible = function () {
    var self = this;
    self.$totalCollapsible.on('click', function () {
      self.$panel.slideUp(self._animateSpeed, function () {
        self.$container.trigger('accordionChange');
      });
      self.$item.removeClass(self.modifiers.active);
    })
  };

  MultiAccordion.prototype.totalCollapsibleOnResize = function () {
    var self = this;
    $(window).on('resize', function () {
      if (self._resizeCollapsible) {
        self.$panel.slideUp(self._animateSpeed, function () {
          self.$container.trigger('accordionChange');
        });
        self.$item.removeClass(self.modifiers.active);
      }
    });
  };

  MultiAccordion.prototype.bindEvents = function () {
    var self = this;
    var $container = this.$container;
    var $item = this.$item;
    var panel = this.options.panel;

    $container.on('click', self.options.handler, function (e) {
      var $currentHandler = self.options.handlerWrap ? $(this).closest(self.options.handlerWrap) : $(this);
      var $currentItem = $currentHandler.closest($item);

      if ($currentItem.has($(panel)).length) {
        e.preventDefault();

        if ($currentHandler.siblings(panel).is(':visible')) {
          self.closePanel($currentItem);

          return;
        }

        if (self.options.collapsibleAll) {
          self.closePanel($($container).not($currentHandler.closest($container)).find($item));
        }

        if (self.options.collapsible) {
          self.closePanel($currentItem.siblings());
        }

        self.openPanel($currentItem, $currentHandler);
      }
    })
  };

  MultiAccordion.prototype.closePanel = function ($currentItem) {
    var self = this;
    var panel = self.options.panel;
    var openClass = self.modifiers.active;

    $currentItem.removeClass(openClass).find(panel).filter(':visible').slideUp(self._animateSpeed, function () {
      self.$container.trigger('mAccordionAfterClose').trigger('mAccordionAfterChange');
    });

    $currentItem
        .find(self.$item)
        .removeClass(openClass);
  };

  MultiAccordion.prototype.openPanel = function ($currentItem, $currentHandler) {
    var self = this;
    var panel = self.options.panel;

    $currentItem.addClass(self.modifiers.active);

    $currentHandler.siblings(panel).slideDown(self._animateSpeed, function () {
      self.$container.trigger('mAccordionAfterOpened').trigger('mAccordionAfterChange');
    });
  };

  window.MultiAccordion = MultiAccordion;
}(jQuery));

/**
 * !Navigation accordion
 * */
function navAccordionInit() {
  // Main navigation
  var nav = '.nav-js';

  if ($(nav).length) {
    new MultiAccordion({
      container: nav,
      item: 'li',
      handler: '.nav__angle-js',
      panel: 'ul',
      openClass: 'is-open',
      animateSpeed: 250,
      collapsible: true
    });

    $(nav).on('mAccordionAfterChange', function () {
      $('.sidebar').trigger('sticky_kit:recalc');
    })
  }
}

/*!==================================================
/*!jquery.switch-class.js
/*!Version: 2.0
/*!Description: Extended toggle class
/*!==================================================*/

(function ($) {
  'use strict';

  // Нужно для корректной работы с доп. классом блокирования скролла
  var countFixedScroll = 0;

  // Inner Plugin Modifiers
  var CONST_MOD = {
    instanceClass: 'swc-instance',
    initClass: 'swc-initialized',
    activeClass: 'swc-active',
    preventRemoveClass: 'swc-prevent-remove'
  };

  // Class definition
  // ================

  var SwitchClass = function (element, config) {
    var self = this, elem;
    self.element = element;
    self.config = config;
    self.mixedClasses = {
      initialized: CONST_MOD.initClass + ' ' + (config.modifiers.initClass || ''),
      active: CONST_MOD.activeClass + ' ' + (config.modifiers.activeClass || ''),
      scrollFixedClass: 'css-scroll-fixed'
    };
    self.$switchClassTo = $(config.toggleEl).add(config.addEl).add(config.removeEl).add(config.switchClassTo);
    self._classIsAdded = false;
  };

  $.extend(SwitchClass.prototype, {
    callbacks: function () {
      var self = this;
      /** track events */
      $.each(self.config, function (key, value) {
        if (typeof value === 'function') {
          $(self.element).on('switchClass.' + key, function (e, param) {
            return value(e, $(self.element), param);
          });
        }
      });
    },
    prevent: function (event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    },
    toggleFixedScroll: function () {
      var self = this;
      $('html').toggleClass(self.mixedClasses.scrollFixedClass, !!countFixedScroll);
    },
    add: function () {
      var self = this;
      var $currentEl = self.config.selector ? $(self.config.selector) : $(self.element);

      if (self._classIsAdded) return;

      // Callback before added class
      // $(self.element)
      $currentEl
          .trigger('switchClass.beforeAdd')
          .trigger('switchClass.beforeChange');

      if (self.config.removeExisting) {
        $.switchClass.remove(true);
      }

      // Добавить активный класс на:
      // 1) Основной элемент
      // 2) Дополнительный переключатель
      // 3) Элементы указанные в настройках экземпляра плагина
      $currentEl.add(self.$switchClassTo)
          .addClass(self.mixedClasses.active);

      // Сохранить в дата-атрибут текущий объект this
      // $(self.element).data('SwitchClass', self);
      $currentEl.addClass(CONST_MOD.instanceClass).data('SwitchClass', self);

      self._classIsAdded = true;

      if (self.config.cssScrollFixed) {
        // Если в настойках указано, что нужно добавлять класс фиксации скролла,
        // То каждый раз вызывая ДОБАВЛЕНИЕ активного класса, увеличивается счетчик количества этих вызовов
        ++countFixedScroll;
        self.toggleFixedScroll();
      }

      // callback after added class
      // $(self.element)
      $currentEl
          .trigger('switchClass.afterAdd')
          .trigger('switchClass.afterChange');
    },
    remove: function () {
      var self = this;
      var $currentEl = self.config.selector ? $(self.config.selector) : $(self.element);

      if (!self._classIsAdded) return;

      // callback beforeRemove
      $currentEl
          .trigger('switchClass.beforeRemove')
          .trigger('switchClass.beforeChange');

      // Удалять активный класс с:
      // 1) Основной элемент
      // 2) Дополнительный переключатель
      // 3) Элементы указанные в настройках экземпляра плагина
      $currentEl.add(self.$switchClassTo)
          .removeClass(self.mixedClasses.active);

      // Удалить дата-атрибут, в котором хранится объект
      $currentEl.removeClass(CONST_MOD.instanceClass).removeData('SwitchClass');

      self._classIsAdded = false;

      if (self.config.cssScrollFixed) {
        // Если в настойках указано, что нужно добавлять класс фиксации скролла,
        // То каждый раз вызывая УДАЛЕНИЕ активного класса, уменьшается счетчик количества этих вызовов
        --countFixedScroll;
        self.toggleFixedScroll();
      }

      // callback afterRemove
      $currentEl
          .trigger('switchClass.afterRemove')
          .trigger('switchClass.afterChange');
    },
    events: function () {
      var self = this;

      function _toggleClass (e) {
        if (self._classIsAdded) {
          self.remove();

          e.preventDefault();
          return false;
        }

        self.add();

        self.prevent(e);
      }

      if (self.config.selector) {
        $(self.element)
            .off('click', self.config.selector)
            .on('click', self.config.selector, _toggleClass);
      } else {
        $(self.element)
            .off('click')
            .on('click', _toggleClass);
      }

      $(self.config.toggleEl).on('click', _toggleClass);

      $(self.config.addEl).on('click', function (event) {
        self.add();
        self.prevent(event);
      });

      $(self.config.removeEl).on('click', function (event) {
        self.remove();
        self.prevent(event);
      })

    },
    removeByClickOutside: function () {
      var self = this;

      $('html').on('click', function (event) {
        
        if ($(event.target).closest('.' + CONST_MOD.preventRemoveClass).length) {
          return;
        }

        if ($(event.target).closest('[data-swc-prevent-remove]').length) {
          return;
        }

        if (self.config.preventRemoveClass && $(event.target).closest('.' + self.config.preventRemoveClass).length) {
          return;
        }

        if (self._classIsAdded && self.config.removeOutsideClick) {
          self.remove();
        }
      });
    },
    removeByClickEsc: function () {
      var self = this;

      $('html').keyup(function (event) {
        if (self._classIsAdded && self.config.removeEscClick && event.keyCode === 27) {
          self.remove();
        }
      });
    },
    init: function () {
      var self = this;
      var $currentEl = self.config.selector ? $(self.config.selector) : $(self.element);

      if ($currentEl.hasClass(self.config.modifiers.activeClass) || $currentEl.hasClass(CONST_MOD.activeClass)) {
        self.add();
      }

      $currentEl.addClass(self.mixedClasses.initialized);
      $currentEl.trigger('switchClass.afterInit');
    }
  });

  $.switchClass = {
    version: "2.0",
    getInstance: function (command) {
      var instance = $('.' + CONST_MOD.instanceClass + '.' + CONST_MOD.activeClass + ':last').data("SwitchClass"),
          args = Array.prototype.slice.call(arguments, 1);

      if (instance instanceof SwitchClass) {
        if ($.type(command) === "string") {
          instance[command].apply(instance, args);
        } else if ($.type(command) === "function") {
          command.apply(instance, args);
        }

        return instance;
      }

      return false;
    },
    remove: function (all) {
      // Получить текущий инстанс
      var instance = this.getInstance();

      // Если инстанс существует
      if (instance) {

        instance.remove();

        // Try to find and close next instance
        // 2) Если на вход функуии передан true,
        if (all === true) {
          // то попитаться найти следующий инстанс и запустить метод .close для него
          this.remove(all);
        }
      }
    },
  };

  function _run (el) {
    el.switchClass.callbacks();
    el.switchClass.events();
    el.switchClass.removeByClickOutside();
    el.switchClass.removeByClickEsc();
    el.switchClass.init();
  }

  $.fn.switchClass = function (options) {
    var self = this,
        args = Array.prototype.slice.call(arguments, 1),
        l = self.length,
        i,
        ret;

    for (i = 0; i < l; i++) {
      if (typeof options === 'object' || typeof options === 'undefined') {
        self[i].switchClass = new SwitchClass(self[i], $.extend(true, {}, $.fn.switchClass.defaultOptions, options));
        _run(self[i]);
      } else {
        ret = self[i].switchClass[options].apply(self[i].switchClass, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return self;
  };

  $.fn.switchClass.defaultOptions = {
    // Remove existing classes
    // Set this to false if you do not need to stack multiple instances
    removeExisting: false,

    // Бывает необходимо инициализировать плагин на динамически добавленном элемента.
    // Чтобы повесить на этот элемент событие, нужно добавить его через совойство selector
    // Example:
    // $('.parents-element').switchClass({
    //     selector : '.box a.opener:visible'
    // });
    selector: null,

    // Дополнительный элемент, которым можно ДОБАВЛЯТЬ класс
    // Example: '.some-class-js' or $('.some-class-js')
    addEl: null,

    // Дополнительный элемент, которым можно УДАЛЯТЬ класс
    // Example: '.some-class-js' or $('.some-class-js')
    removeEl: null,

    // Дополнительный элемент, которым можно ДОБАВЛЯТЬ/УДАЛЯТЬ класс
    // Example: '.some-class-js' or $('.some-class-js')
    toggleEl: null,

    // Один или несколько эелментов, на которые будет добавляться/удаляться активный класс (modifiers.activeClass)
    // Example 1: $('html, .popup-js, .overlay-js')
    // Example 2: $('html').add('.popup-js').add('.overlay-js')
    switchClassTo: null,

    // Удалать класс по клику по пустому месту на странице?
    // Если по клику на определенный элемент удалять класс не нужно,
    // то на этот элемент нужно добавить класс ".swc-prevent-remove" или дата-атрибудт "data-swc-prevent-remove",
    // или класс указанный в параметре "preventRemoveClass"
    // Example: true or false
    removeOutsideClick: true,

    // Удалять класс по клику на клавишу Esc?
    // Example: true or false
    removeEscClick: true,

    // Добавлять на html дополнительный класс 'css-scroll-fixed'?
    // Через этот класс можно фиксировать скролл методами css
    // _mixins.sass, scroll-blocked()
    // Example: true or false
    cssScrollFixed: false,

    // Если кликнуть по элементу с этим классом, то событие удаления активного класса не будет вызвано.
    // По умолчанию можно использовать класс ".swc-prevent-remove" или дата-атрибудт "data-swc-prevent-remove".
    // Example: class = "some-class"
    preventRemoveClass: null,

    // Классы-модификаторы
    modifiers: {
      initClass: null,
      activeClass: 'active'
    }
  };

})(jQuery);

/**
 * !Toggle search field
 * */
function toggleMobMenu() {
  var $html = $('html');

  // Navigation popup
  var $openNav = $('.menu-open-js');
  var $popupNav = $('.menu-js');
  var $overlayNav = $('.menu-overlay-js');

  if ($openNav.length) {
    $openNav.switchClass({
      switchClassTo: $popupNav.add($overlayNav),
      removeEl: $('.menu-close-js'),
      cssScrollFixed: true,
      removeOutsideClick: true,
      modifiers: {
        activeClass: 'is-open'
      },
      afterAdd: function () {
        $html.add($popupNav).add($overlayNav).addClass('open-only-mob');
      },
      afterRemove: function () {
        $html.add($popupNav).add($overlayNav).removeClass('open-only-mob');
      }
    });
  }
}

/**
 * !Scroll to form
 */
function scrollToForm() {
  var $btn = $('.donate-el__btn');

  if ($btn.length) {
    var $page = $('html');

    $btn.on('click', function (e) {
      e.preventDefault();

      var $curBtn = $(this);

      if (!$page.is(':animated')) {
        var $target = $($curBtn.attr('href'));
        $page.stop().animate({scrollTop: $target.offset().top}, 300, function () {
          setTimeout(function () {
            $target.closest('form').find('.first-field-js').focus();
          }, 50)
        });
      }
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
  bgParallax();
  stickySidebar();
  stickyCAside();
  toggleLang();
  slidersInit();
  navAccordionInit();
  toggleMobMenu();
  scrollToForm();

  formValidation();
});