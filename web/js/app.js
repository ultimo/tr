/*! Smooth Scroll - v1.4.9 - 2013-01-21
* https://github.com/kswedberg/jquery-smooth-scroll
* Copyright (c) 2013 Karl Swedberg; Licensed MIT */

(function($) {

var version = '1.4.9',
    defaults = {
      exclude: [],
      excludeWithin:[],
      offset: 0,
      direction: 'top', // one of 'top' or 'left'
      scrollElement: null, // jQuery set of elements you wish to scroll (for $.smoothScroll).
                          //  if null (default), $('html, body').firstScrollable() is used.
      scrollTarget: null, // only use if you want to override default behavior
      beforeScroll: function() {},  // fn(opts) function to be called before scrolling occurs. "this" is the element(s) being scrolled
      afterScroll: function() {},   // fn(opts) function to be called after scrolling occurs. "this" is the triggering element
      easing: 'swing',
      speed: 400,
      autoCoefficent: 2 // coefficient for "auto" speed
    },

    getScrollable = function(opts) {
      var scrollable = [],
          scrolled = false,
          dir = opts.dir && opts.dir == 'left' ? 'scrollLeft' : 'scrollTop';

      this.each(function() {

        if (this == document || this == window) { return; }
        var el = $(this);
        if ( el[dir]() > 0 ) {
          scrollable.push(this);
        } else {
          // if scroll(Top|Left) === 0, nudge the element 1px and see if it moves
          el[dir](1);
          scrolled = el[dir]() > 0;
          if ( scrolled ) {
            scrollable.push(this);
          }
          // then put it back, of course
          el[dir](0);
        }
      });

      // If no scrollable elements, fall back to <body>,
      // if it's in the jQuery collection
      // (doing this because Safari sets scrollTop async,
      // so can't set it to 1 and immediately get the value.)
      if (!scrollable.length) {
        this.each(function(index) {
          if (this.nodeName === 'BODY') {
            scrollable = [this];
          }
        });
      }

      // Use the first scrollable element if we're calling firstScrollable()
      if ( opts.el === 'first' && scrollable.length > 1 ) {
        scrollable = [ scrollable[0] ];
      }

      return scrollable;
    },
    isTouch = 'ontouchend' in document;

$.fn.extend({
  scrollable: function(dir) {
    var scrl = getScrollable.call(this, {dir: dir});
    return this.pushStack(scrl);
  },
  firstScrollable: function(dir) {
    var scrl = getScrollable.call(this, {el: 'first', dir: dir});
    return this.pushStack(scrl);
  },

  smoothScroll: function(options) {
    options = options || {};
    var opts = $.extend({}, $.fn.smoothScroll.defaults, options),
        locationPath = $.smoothScroll.filterPath(location.pathname);

    this
    .unbind('click.smoothscroll')
    .bind('click.smoothscroll', function(event) {
      var link = this,
          $link = $(this),
          exclude = opts.exclude,
          excludeWithin = opts.excludeWithin,
          elCounter = 0, ewlCounter = 0,
          include = true,
          clickOpts = {},
          hostMatch = ((location.hostname === link.hostname) || !link.hostname),
          pathMatch = opts.scrollTarget || ( $.smoothScroll.filterPath(link.pathname) || locationPath ) === locationPath,
          thisHash = escapeSelector(link.hash);

      if ( !opts.scrollTarget && (!hostMatch || !pathMatch || !thisHash) ) {
        include = false;
      } else {
        while (include && elCounter < exclude.length) {
          if ($link.is(escapeSelector(exclude[elCounter++]))) {
            include = false;
          }
        }
        while ( include && ewlCounter < excludeWithin.length ) {
          if ($link.closest(excludeWithin[ewlCounter++]).length) {
            include = false;
          }
        }
      }

      if ( include ) {
        event.preventDefault();

        $.extend( clickOpts, opts, {
          scrollTarget: opts.scrollTarget || thisHash,
          link: link
        });

        $.smoothScroll( clickOpts );
      }
    });

    return this;
  }
});

$.smoothScroll = function(options, px) {
  var opts, $scroller, scrollTargetOffset, speed,
      scrollerOffset = 0,
      offPos = 'offset',
      scrollDir = 'scrollTop',
      aniProps = {},
      aniOpts = {},
      scrollprops = [];


  if (typeof options === 'number') {
    opts = $.fn.smoothScroll.defaults;
    scrollTargetOffset = options;
  } else {
    opts = $.extend({}, $.fn.smoothScroll.defaults, options || {});
    if (opts.scrollElement) {
      offPos = 'position';
      if (opts.scrollElement.css('position') == 'static') {
        opts.scrollElement.css('position', 'relative');
      }
    }
  }

  opts = $.extend({link: null}, opts);
  scrollDir = opts.direction == 'left' ? 'scrollLeft' : scrollDir;

  if ( opts.scrollElement ) {
    $scroller = opts.scrollElement;
    scrollerOffset = $scroller[scrollDir]();
  } else {
    $scroller = $('html, body').firstScrollable();
  }

  // beforeScroll callback function must fire before calculating offset
  opts.beforeScroll.call($scroller, opts);

  scrollTargetOffset = (typeof options === 'number') ? options :
                        px ||
                        ( $(opts.scrollTarget)[offPos]() &&
                        $(opts.scrollTarget)[offPos]()[opts.direction] ) ||
                        0;

  aniProps[scrollDir] = scrollTargetOffset + scrollerOffset + opts.offset;
  speed = opts.speed;

  // automatically calculate the speed of the scroll based on distance / coefficient
  if (speed === 'auto') {

    // if aniProps[scrollDir] == 0 then we'll use scrollTop() value instead
    speed = aniProps[scrollDir] || $scroller.scrollTop();

    // divide the speed by the coefficient
    speed = speed / opts.autoCoefficent;
  }

  aniOpts = {
    duration: speed,
    easing: opts.easing,
    complete: function() {
      opts.afterScroll.call(opts.link, opts);
    }
  };

  if (opts.step) {
    aniOpts.step = opts.step;
  }

  if ($scroller.length) {
    $scroller.stop().animate(aniProps, aniOpts);
  } else {
    opts.afterScroll.call(opts.link, opts);
  }
};

$.smoothScroll.version = version;
$.smoothScroll.filterPath = function(string) {
  return string
    .replace(/^\//,'')
    .replace(/(index|default).[a-zA-Z]{3,4}$/,'')
    .replace(/\/$/,'');
};

// default options
$.fn.smoothScroll.defaults = defaults;

function escapeSelector (str) {
  return str.replace(/(:|\.)/g,'\\$1');
}

})(jQuery);

// Generated by CoffeeScript 1.4.0

/*
jQuery Waypoints - v2.0.1
Copyright (c) 2011-2013 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/


(function() {
  var $, $w, Context, Waypoint, allWaypoints, contextCounter, contextKey, contexts, jQMethods, methods, resizeEvent, scrollEvent, waypointCounter, waypointKey, wp, wps,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  $ = window.jQuery;

  $w = $(window);

  allWaypoints = {
    horizontal: {},
    vertical: {}
  };

  contextCounter = 1;

  contexts = {};

  contextKey = 'waypoints-context-id';

  resizeEvent = 'resize.waypoints';

  scrollEvent = 'scroll.waypoints';

  waypointCounter = 1;

  waypointKey = 'waypoints-waypoint-ids';

  wp = 'waypoint';

  wps = 'waypoints';

  Context = (function() {

    function Context($element) {
      var _this = this;
      this.$element = $element;
      this.element = $element[0];
      this.didResize = false;
      this.didScroll = false;
      this.id = 'context' + contextCounter++;
      this.oldScroll = {
        x: $element.scrollLeft(),
        y: $element.scrollTop()
      };
      this.waypoints = {
        horizontal: {},
        vertical: {}
      };
      $element.data(contextKey, this.id);
      contexts[this.id] = this;
      $element.bind(scrollEvent, function() {
        var scrollHandler;
        if (!_this.didScroll) {
          _this.didScroll = true;
          scrollHandler = function() {
            _this.doScroll();
            return _this.didScroll = false;
          };
          return window.setTimeout(scrollHandler, $[wps].settings.scrollThrottle);
        }
      });
      $element.bind(resizeEvent, function() {
        var resizeHandler;
        if (!_this.didResize) {
          _this.didResize = true;
          resizeHandler = function() {
            $[wps]('refresh');
            return _this.didResize = false;
          };
          return window.setTimeout(resizeHandler, $[wps].settings.resizeThrottle);
        }
      });
    }

    Context.prototype.doScroll = function() {
      var axes,
        _this = this;
      axes = {
        horizontal: {
          newScroll: this.$element.scrollLeft(),
          oldScroll: this.oldScroll.x,
          forward: 'right',
          backward: 'left'
        },
        vertical: {
          newScroll: this.$element.scrollTop(),
          oldScroll: this.oldScroll.y,
          forward: 'down',
          backward: 'up'
        }
      };
      if (__indexOf.call(window, 'ontouchstart') >= 0 && (!axes.vertical.oldScroll || !axes.vertical.newScroll)) {
        $[wps]('refresh');
      }
      $.each(axes, function(aKey, axis) {
        var direction, isForward, triggered;
        triggered = [];
        isForward = axis.newScroll > axis.oldScroll;
        direction = isForward ? axis.forward : axis.backward;
        $.each(_this.waypoints[aKey], function(wKey, waypoint) {
          var _ref, _ref1;
          if ((axis.oldScroll < (_ref = waypoint.offset) && _ref <= axis.newScroll)) {
            return triggered.push(waypoint);
          } else if ((axis.newScroll < (_ref1 = waypoint.offset) && _ref1 <= axis.oldScroll)) {
            return triggered.push(waypoint);
          }
        });
        triggered.sort(function(a, b) {
          return a.offset - b.offset;
        });
        if (!isForward) {
          triggered.reverse();
        }
        return $.each(triggered, function(i, waypoint) {
          if (waypoint.options.continuous || i === triggered.length - 1) {
            return waypoint.trigger([direction]);
          }
        });
      });
      return this.oldScroll = {
        x: axes.horizontal.newScroll,
        y: axes.vertical.newScroll
      };
    };

    Context.prototype.refresh = function() {
      var axes, cOffset, isWin,
        _this = this;
      isWin = $.isWindow(this.element);
      cOffset = this.$element.offset();
      this.doScroll();
      axes = {
        horizontal: {
          contextOffset: isWin ? 0 : cOffset.left,
          contextScroll: isWin ? 0 : this.oldScroll.x,
          contextDimension: this.$element.width(),
          oldScroll: this.oldScroll.x,
          forward: 'right',
          backward: 'left',
          offsetProp: 'left'
        },
        vertical: {
          contextOffset: isWin ? 0 : cOffset.top,
          contextScroll: isWin ? 0 : this.oldScroll.y,
          contextDimension: isWin ? $[wps]('viewportHeight') : this.$element.height(),
          oldScroll: this.oldScroll.y,
          forward: 'down',
          backward: 'up',
          offsetProp: 'top'
        }
      };
      return $.each(axes, function(aKey, axis) {
        return $.each(_this.waypoints[aKey], function(i, waypoint) {
          var adjustment, elementOffset, oldOffset, _ref, _ref1;
          adjustment = waypoint.options.offset;
          oldOffset = waypoint.offset;
          elementOffset = $.isWindow(waypoint.element) ? 0 : waypoint.$element.offset()[axis.offsetProp];
          if ($.isFunction(adjustment)) {
            adjustment = adjustment.apply(waypoint.element);
          } else if (typeof adjustment === 'string') {
            adjustment = parseFloat(adjustment);
            if (waypoint.options.offset.indexOf('%') > -1) {
              adjustment = Math.ceil(axis.contextDimension * adjustment / 100);
            }
          }
          waypoint.offset = elementOffset - axis.contextOffset + axis.contextScroll - adjustment;
          if ((waypoint.options.onlyOnScroll && (oldOffset != null)) || !waypoint.enabled) {
            return;
          }
          if (oldOffset !== null && (oldOffset < (_ref = axis.oldScroll) && _ref <= waypoint.offset)) {
            return waypoint.trigger([axis.backward]);
          } else if (oldOffset !== null && (oldOffset > (_ref1 = axis.oldScroll) && _ref1 >= waypoint.offset)) {
            return waypoint.trigger([axis.forward]);
          } else if (oldOffset === null && axis.oldScroll >= waypoint.offset) {
            return waypoint.trigger([axis.forward]);
          }
        });
      });
    };

    Context.prototype.checkEmpty = function() {
      if ($.isEmptyObject(this.waypoints.horizontal) && $.isEmptyObject(this.waypoints.vertical)) {
        this.$element.unbind([resizeEvent, scrollEvent].join(' '));
        return delete contexts[this.id];
      }
    };

    return Context;

  })();

  Waypoint = (function() {

    function Waypoint($element, context, options) {
      var idList, _ref;
      options = $.extend({}, $.fn[wp].defaults, options);
      if (options.offset === 'bottom-in-view') {
        options.offset = function() {
          var contextHeight;
          contextHeight = $[wps]('viewportHeight');
          if (!$.isWindow(context.element)) {
            contextHeight = context.$element.height();
          }
          return contextHeight - $(this).outerHeight();
        };
      }
      this.$element = $element;
      this.element = $element[0];
      this.axis = options.horizontal ? 'horizontal' : 'vertical';
      this.callback = options.handler;
      this.context = context;
      this.enabled = options.enabled;
      this.id = 'waypoints' + waypointCounter++;
      this.offset = null;
      this.options = options;
      context.waypoints[this.axis][this.id] = this;
      allWaypoints[this.axis][this.id] = this;
      idList = (_ref = $element.data(waypointKey)) != null ? _ref : [];
      idList.push(this.id);
      $element.data(waypointKey, idList);
    }

    Waypoint.prototype.trigger = function(args) {
      if (!this.enabled) {
        return;
      }
      if (this.callback != null) {
        this.callback.apply(this.element, args);
      }
      if (this.options.triggerOnce) {
        return this.destroy();
      }
    };

    Waypoint.prototype.disable = function() {
      return this.enabled = false;
    };

    Waypoint.prototype.enable = function() {
      this.context.refresh();
      return this.enabled = true;
    };

    Waypoint.prototype.destroy = function() {
      delete allWaypoints[this.axis][this.id];
      delete this.context.waypoints[this.axis][this.id];
      return this.context.checkEmpty();
    };

    Waypoint.getWaypointsByElement = function(element) {
      var all, ids;
      ids = $(element).data(waypointKey);
      if (!ids) {
        return [];
      }
      all = $.extend({}, allWaypoints.horizontal, allWaypoints.vertical);
      return $.map(ids, function(id) {
        return all[id];
      });
    };

    return Waypoint;

  })();

  methods = {
    init: function(f, options) {
      var _ref;
      if (options == null) {
        options = {};
      }
      if ((_ref = options.handler) == null) {
        options.handler = f;
      }
      this.each(function() {
        var $this, context, contextElement, _ref1;
        $this = $(this);
        contextElement = (_ref1 = options.context) != null ? _ref1 : $.fn[wp].defaults.context;
        if (!$.isWindow(contextElement)) {
          contextElement = $this.closest(contextElement);
        }
        contextElement = $(contextElement);
        context = contexts[contextElement.data(contextKey)];
        if (!context) {
          context = new Context(contextElement);
        }
        return new Waypoint($this, context, options);
      });
      $[wps]('refresh');
      return this;
    },
    disable: function() {
      return methods._invoke(this, 'disable');
    },
    enable: function() {
      return methods._invoke(this, 'enable');
    },
    destroy: function() {
      return methods._invoke(this, 'destroy');
    },
    prev: function(axis, selector) {
      return methods._traverse.call(this, axis, selector, function(stack, index, waypoints) {
        if (index > 0) {
          return stack.push(waypoints[index - 1]);
        }
      });
    },
    next: function(axis, selector) {
      return methods._traverse.call(this, axis, selector, function(stack, index, waypoints) {
        if (index < waypoints.length - 1) {
          return stack.push(waypoints[index + 1]);
        }
      });
    },
    _traverse: function(axis, selector, push) {
      var stack, waypoints;
      if (axis == null) {
        axis = 'vertical';
      }
      if (selector == null) {
        selector = window;
      }
      waypoints = jQMethods.aggregate(selector);
      stack = [];
      this.each(function() {
        var index;
        index = $.inArray(this, waypoints[axis]);
        return push(stack, index, waypoints[axis]);
      });
      return this.pushStack(stack);
    },
    _invoke: function($elements, method) {
      $elements.each(function() {
        var waypoints;
        waypoints = Waypoint.getWaypointsByElement(this);
        return $.each(waypoints, function(i, waypoint) {
          waypoint[method]();
          return true;
        });
      });
      return this;
    }
  };

  $.fn[wp] = function() {
    var args, method;
    method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (methods[method]) {
      return methods[method].apply(this, args);
    } else if ($.isFunction(method)) {
      return methods.init.apply(this, arguments);
    } else if ($.isPlainObject(method)) {
      return methods.init.apply(this, [null, method]);
    } else if (!method) {
      return $.error("jQuery Waypoints needs a callback function or handler option.");
    } else {
      return $.error("The " + method + " method does not exist in jQuery Waypoints.");
    }
  };

  $.fn[wp].defaults = {
    context: window,
    continuous: true,
    enabled: true,
    horizontal: false,
    offset: 0,
    triggerOnce: false
  };

  jQMethods = {
    refresh: function() {
      return $.each(contexts, function(i, context) {
        return context.refresh();
      });
    },
    viewportHeight: function() {
      var _ref;
      return (_ref = window.innerHeight) != null ? _ref : $w.height();
    },
    aggregate: function(contextSelector) {
      var collection, waypoints, _ref;
      collection = allWaypoints;
      if (contextSelector) {
        collection = (_ref = contexts[$(contextSelector).data(contextKey)]) != null ? _ref.waypoints : void 0;
      }
      if (!collection) {
        return [];
      }
      waypoints = {
        horizontal: [],
        vertical: []
      };
      $.each(waypoints, function(axis, arr) {
        $.each(collection[axis], function(key, waypoint) {
          return arr.push(waypoint);
        });
        arr.sort(function(a, b) {
          return a.offset - b.offset;
        });
        waypoints[axis] = $.map(arr, function(waypoint) {
          return waypoint.element;
        });
        return waypoints[axis] = $.unique(waypoints[axis]);
      });
      return waypoints;
    },
    above: function(contextSelector) {
      if (contextSelector == null) {
        contextSelector = window;
      }
      return jQMethods._filter(contextSelector, 'vertical', function(context, waypoint) {
        return waypoint.offset <= context.oldScroll.y;
      });
    },
    below: function(contextSelector) {
      if (contextSelector == null) {
        contextSelector = window;
      }
      return jQMethods._filter(contextSelector, 'vertical', function(context, waypoint) {
        return waypoint.offset > context.oldScroll.y;
      });
    },
    left: function(contextSelector) {
      if (contextSelector == null) {
        contextSelector = window;
      }
      return jQMethods._filter(contextSelector, 'horizontal', function(context, waypoint) {
        return waypoint.offset <= context.oldScroll.x;
      });
    },
    right: function(contextSelector) {
      if (contextSelector == null) {
        contextSelector = window;
      }
      return jQMethods._filter(contextSelector, 'horizontal', function(context, waypoint) {
        return waypoint.offset > context.oldScroll.x;
      });
    },
    enable: function() {
      return jQMethods._invoke('enable');
    },
    disable: function() {
      return jQMethods._invoke('disable');
    },
    destroy: function() {
      return jQMethods._invoke('destroy');
    },
    extendFn: function(methodName, f) {
      return methods[methodName] = f;
    },
    _invoke: function(method) {
      var waypoints;
      waypoints = $.extend({}, allWaypoints.vertical, allWaypoints.horizontal);
      return $.each(waypoints, function(key, waypoint) {
        waypoint[method]();
        return true;
      });
    },
    _filter: function(selector, axis, test) {
      var context, waypoints;
      context = contexts[$(selector).data(contextKey)];
      if (!context) {
        return [];
      }
      waypoints = [];
      $.each(context.waypoints[axis], function(i, waypoint) {
        if (test(context, waypoint)) {
          return waypoints.push(waypoint);
        }
      });
      waypoints.sort(function(a, b) {
        return a.offset - b.offset;
      });
      return $.map(waypoints, function(waypoint) {
        return waypoint.element;
      });
    }
  };

  $[wps] = function() {
    var args, method;
    method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (jQMethods[method]) {
      return jQMethods[method].apply(null, args);
    } else {
      return jQMethods.aggregate.call(null, method);
    }
  };

  $[wps].settings = {
    resizeThrottle: 100,
    scrollThrottle: 30
  };

  $w.load(function() {
    return $[wps]('refresh');
  });

}).call(this);

$(document).ready(function() {
	var setHomeHeight = function(animateHeader) {
		$('#home').animate({'height':$(window).height()-60}, 0, function() {
			if (animateHeader) {
				$('.page-header').animate({'opacity':1}, 800);
			}
		});
	};

	setHomeHeight(true);

	$(window).resize(function (argument) {
		setHomeHeight(false);
	});

	$('nav a').smoothScroll();

	$('#toolbelt li').popover({placement: 'bottom', trigger: 'click'}).click(function() {
		$(this).siblings().popover('hide');
	});

	$('#skills .bar').width(0);

	$('#skills').waypoint(function(direction) {
		if (direction == 'down') {
			$('#skills .bar').width(function(){
				$(this).width($(this).attr('data-width')+'%');
			});
		}
	}, {offset: '50%'});
});