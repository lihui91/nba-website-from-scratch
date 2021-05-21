(function ($, document, window) {
  'use strict';

  function Tour(container, options) {

    
    this.defaults = {
      /* 初始下标 */
      startingStep: 0,
      tooltipClass: 'tour-tooltip',
      overlayClass: 'tour-overlay',
      buttonClass: 'tour-button',
      nextLabel: undefined,
      previousLabel: undefined,
      closeLabel: '&times;',
      skipHidden: true,
      offset: 10,
      steps: []
    };

    /*
     * title: 'Simple Test',
     * content: '<p>This is an important area.</p>',
     * element: '.test-1', html的class名！！！
     * position: 'top'
     */


    this.options = $.extend({}, this.defaults, options);

    if(this.options.nextLabel == undefined){
      this.options.nextLabel = 'Next';
    }
    if(this.options.previousLabel == undefined){
      this.options.previousLabel = 'Previous';
    }
    this.$container = $(container);
  }

  Tour.prototype = {
    init: function () {
      var self = this
        , timeout;

      this.running = false;

      /* ? */
      this.steps = this.options.steps.slice(0);

      //!
      if (this.options.skipHidden) {
        $.each(this.steps, function (index, step) {
          if (step.element && (!$(step.element).length || $(step.element).is(':hidden'))) {
            self.steps[index] = null;
          }
        });
      }
      
      //! why grep as filter？
      this.steps = $.grep(this.steps, function (n) {
        return n;
      });

      this.stepCount = this.steps.length;

      $(window).on('resize', function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          if (self.running) {
            self.setStep(self.currentIndex);
          }
        }, 25);
      });
    },

    reset: function () {
      var self = this;

      this.running = false;

      this.currentIndex = this.options.startingStep;
      /* 清空数组 */
      $.each(['$tooltip', '$baseOverlay', '$topOverlay', '$leftOverlay', '$bottomOverlay', '$rightOverlay'], function () {
        if (typeof self[this] !== 'undefined') {
          self[this].remove();
        }
      });

      this.createTooltip();
      this.createOverlay();
    },

    /*
     * brief@ 开始 
     */
    start: function () {
      this.reset();
      this.running = true;
      this.setStep(this.currentIndex);
    },

    createOverlay: function () {
      var self = this;

      this.$baseOverlay = $('<div>')
        .addClass(this.options.overlayClass)
        .css({
          position: 'absolute',
          zIndex: 100000,
          display: 'none'
        })
        .appendTo('body');

      $.each(['$topOverlay', '$leftOverlay', '$bottomOverlay', '$rightOverlay'], function (index, value) {
        self[value] = self.$baseOverlay
          .clone()
          .css({
            width: 0,
            height: 0,
            top: 0,
            left: 0
          })
          .appendTo('body');
      });
    },

    /*
     * brief@ 新建Tool tip，即简单弹窗方框！
     */
    createTooltip: function () {
      var self = this;

      this.$tooltip = $('<div>')
        .addClass(this.options.tooltipClass)
        .css({
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 100001
        })
        .append(
          $('<div>')
            .addClass(this.options.tooltipClass + '-heading')
        )
        /* 添加当前前进页数 */
        .append(
          $('<div>')
            .addClass('tour-count')
            .append(
              $('<span>')
                .addClass('current-index')
            )
            .append(
              $('<span>')
                .addClass('total')
                .text('/' + this.stepCount)
            )
        )
        /* 内容 */
        .append(
          $('<div>')
            .addClass(this.options.tooltipClass + '-content')
        )

        .append(
          $('<div>')
            .addClass(this.options.tooltipClass + '-buttons')
            /* 添加前进和后退的按钮 */
            .append(
              $('<button>')
                .addClass(this.options.buttonClass + ' ' + this.options.buttonClass + '-previous')
                .text(this.options.previousLabel)
                .on('click', function () {

                  var oldIndex = self.currentIndex;
                  self.previousStep();
                  self.$container.trigger('stepchange', [self.steps[oldIndex], self.steps[self.currentIndex]]);
                })
            )
            .append(
              $('<button>')
                .addClass(this.options.buttonClass + ' ' + this.options.buttonClass + '-next')
                .text(this.options.nextLabel)
                .on('click', function () {
                  var oldIndex = self.currentIndex;
                  if (self.currentIndex < self.stepCount - 1) {
                    self.nextStep();
                    self.$container.trigger('stepchange', [self.steps[oldIndex], self.steps[self.currentIndex]]);
                  } else {
                    self.reset();
                    self.$container.trigger('tourend');
                  }
                })
            )
            /* 最后一页的close */
            .append(
              $('<button>')
                .addClass(this.options.buttonClass + ' ' + this.options.buttonClass + '-done')
                .text(this.options.doneLabel)
                .on('click', function () {
                  self.reset();
                  /* 激活tourend函数，即同时执行 */
                  self.$container.trigger('tourend');
                })
            )
        )
        .append(
          /* ❌ */
          $('<a>')
            .attr('href', '#')
            .addClass(this.options.buttonClass + '-close')
            .html(this.options.closeLabel)
            .on('click', function () {
              self.reset();
              self.$container.trigger('tourend');
            })
        )
        .appendTo('body')
        .hide();
    },

    getCurrentStep: function () {
      return this.currentIndex < this.stepCount ? this.steps[this.currentIndex] : null;
    },

    nextStep: function () {
      if (this.currentIndex < this.stepCount) {
        this.currentIndex += 1;
      }

      this.setStep(this.currentIndex);
    },

    previousStep: function () {
      if (this.currentIndex > 0) {
        this.currentIndex -= 1;
      }

      this.setStep(this.currentIndex);
    },

    /*
     * brief@ 设置提醒框的内容
     */
    setStep: function (step) {
      var currentStep = this.getCurrentStep()
        , $element = $(currentStep.element)
        , containerMetrics = this.getElementMetrics(this.$container)
        , flipArrow = false
        , cssPosition = $element.css('position') === 'fixed' ? 'fixed' : 'absolute'
        , targetMetrics, scrollTo, tooltipWidth, tooltipHeight, tooltipTop, tooltipLeft, position;

      $('.' + this.options.overlayClass).css('position', cssPosition);

      this.$tooltip.show();

      /* 找到相应的class，并修改html */
      this.$tooltip
        .find('.' + this.options.tooltipClass + '-heading')
        .html(currentStep.title || '');

      this.$tooltip
        .find('.current-index')
        .html(step + 1);

      this.$tooltip
        .find('.' + this.options.tooltipClass + '-content')
        .html(currentStep.content || '');

      this.$tooltip
        .find('.' + this.options.buttonClass + '-previous')
        .toggle(step !== 0);

      this.$tooltip
        .find('.' + this.options.buttonClass + '-next')
        .text(step === this.stepCount - 1 ? this.options.doneLabel : this.options.nextLabel);

      tooltipWidth = this.$tooltip.outerWidth(true);
      tooltipHeight = this.$tooltip.outerHeight(true);

      if (!currentStep.element) {
        /* 当前没有元素！ 即刚刚开始的第一幅，直接在正中央画框！ */
        this.$tooltip
          .removeClass('top left bottom right')
          .css({
            top: containerMetrics.top + (containerMetrics.height / 2) - (tooltipHeight / 2),
            left: containerMetrics.left + (containerMetrics.width / 2) - (tooltipWidth / 2)
          });

        scrollTo = this.$tooltip.offset().top;

        $(window).scrollTop(scrollTo - this.options.offset > 0 ? scrollTo - this.options.offset : scrollTo);

        this.highlightElement(currentStep.element);

        return;
      }
      
      /* 不然就去找这个元素的位置 */
      targetMetrics = this.getElementMetrics($element);
      position = currentStep.position;

      /* ?? */
      switch (position) {
        case 'left':
          tooltipTop = targetMetrics.top;
          tooltipLeft = targetMetrics.left - tooltipWidth - this.options.offset;
          break;
        case 'bottom':
          tooltipTop = targetMetrics.bottom + this.options.offset;
          tooltipLeft = targetMetrics.left;
          break;
        case 'right':
          tooltipTop = targetMetrics.top;
          tooltipLeft = targetMetrics.right + this.options.offset;
          break;
        case 'top':
        default:
          tooltipTop = targetMetrics.top - tooltipHeight - this.options.offset;
          tooltipLeft = targetMetrics.left;
          position = 'top';
      }

      this.$tooltip
        .removeClass('flip-arrow top left bottom right')
        .addClass(position)
        .css({
          position: cssPosition,
          top: tooltipTop,
          left: tooltipLeft
        });

      // If the tooltip is outside the bounds, put it below the element
      if (tooltipLeft < 0 || tooltipLeft + tooltipWidth > containerMetrics.width || tooltipTop < 0) {
        tooltipTop = targetMetrics.bottom;
        tooltipLeft = targetMetrics.left;

        if (tooltipLeft + tooltipWidth > containerMetrics.width) {
          tooltipLeft = targetMetrics.right - tooltipWidth;
          flipArrow = true;
        }

        this.$tooltip
          .removeClass(position)
          .addClass('bottom' + (flipArrow ? ' flip-arrow' : ''))
          .css({
            top: tooltipTop + this.options.offset,
            left: tooltipLeft
          });
      }

      scrollTo = Math.min(this.$tooltip.offset().top, $element.offset().top);

      $(window).scrollTop(scrollTo - this.options.offset > 0 ? scrollTo - this.options.offset : scrollTo);

      this.highlightElement(currentStep.element);
    },

    /*
     * brief@ 返回位置元素的位置信息（宽、高、顶点的坐标位置） 
     */
    getElementMetrics: function (element) {
      var offset = element.offset()
        , metrics = {
            width: element.outerWidth(),
            height: element.outerHeight(),
            top: offset.top,
            left: offset.left
          };

      if (element.css('position') === 'fixed') {
         metrics.top = metrics.top - $(document).scrollTop();
         metrics.left = metrics.left - $(document).scrollLeft();
      }

      metrics.bottom = metrics.top + metrics.height;
      metrics.right = metrics.left + metrics.width;

      return metrics;
    },

    /*
     */
    highlightElement: function (element) {
      var $element = $(element)
        , containerMetrics = this.getElementMetrics(this.$container)
        , targetMetrics;

      if (!$element.length) {
        this.$topOverlay.hide();
        this.$leftOverlay.hide();
        this.$bottomOverlay.hide();
        this.$rightOverlay.hide();

        /* 添加一个？ */
        this.$baseOverlay
          .css({
            position: 'fixed',
            width: containerMetrics.width,
            height: containerMetrics.height,
            left: containerMetrics.left,
            right: containerMetrics.left + containerMetrics.width,
            top: containerMetrics.top,
            bottom: containerMetrics.top + containerMetrics.height,
            display: 'block'
          });

        return;
      } else {
        this.$baseOverlay.hide();
      }

      targetMetrics = this.getElementMetrics($element);

      this.$topOverlay
        .css({
          width: targetMetrics.width,
          height: targetMetrics.top - containerMetrics.top,
          top: containerMetrics.top,
          left: targetMetrics.left,
          display: 'block'
        });

      this.$leftOverlay
        .css({
          width: targetMetrics.left - containerMetrics.left,
          height: containerMetrics.height,
          top: containerMetrics.top,
          left: containerMetrics.left,
          display: 'block'
        });

      this.$bottomOverlay
        .css({
          width: targetMetrics.width,
          height: containerMetrics.bottom - targetMetrics.bottom,
          top: targetMetrics.bottom,
          left: targetMetrics.left,
          display: 'block'
        });

      this.$rightOverlay
        .css({
          width: containerMetrics.right - targetMetrics.right,
          height: containerMetrics.height,
          top: containerMetrics.top,
          left: targetMetrics.right,
          display: 'block'
        });
    }
  };

  /* 初始函数 */
  $.fn.tour = function (options) {
    if (this.length) {
      this.each(function () {
        /* 更新函数 */
        var tour = new Tour(this, options);

        tour.init();
        $(this).data('tour', tour);
      });
    }
  };

}(jQuery, document, window));
