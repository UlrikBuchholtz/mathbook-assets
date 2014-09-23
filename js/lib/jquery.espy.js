;(function ($, w, undefined) {
	'use strict';

	// Plugin names
	var pluginName = 'espy',
		pluginClass = 'Espy',
		namespace  = pluginName;

	$[pluginClass] = function(context, callback, options) {
		// Optional arguments delay
		if (typeof callback !== 'function') {
			options = callback;
			callback = 0;
		}

		/**
		 * Constructor for Spy settings objects.
		 * We can override the prototype to update defaults on the fly.
		 * We restrict settings to this seperate object so that client code
		 * can't clobber Spy properties that we haven't exposed as options.
		 */
		var SpySettings = function(options) {
			// Copy options properties over
			$.extend(this,options);
		};

		/**
		 * Constructor for spied elements.
		 */
		var Spy = function(id, el, callback, options) {
			this.id = id;
			this.el = el;
			this.$el = $(el);
			this.callback = callback;
			this.settings = new SpySettings(options);

			this.configure  = function(callback, options) {
				if($.isPlainObject(callback)) {
					options = callback;
					callback = null;
				}

				$.extend(this.settings, options);
				if(callback !== null) {
					this.callback = callback;
				}
			};
		};

		////////////////////////////////////////////////////////////////////////
		// Private variables
		////////////////////////////////////////////////////////////////////////
		var self     = this;
		var $context = $(context);
		var defaults = $.fn[pluginName].defaults;
		var mainCallback;

		var spies    = {};
		var lastId   = 0;
		var pos      = {
			top: $context.scrollTop(),
			left: $context.scrollLeft(),
			width: $context.innerWidth(),
			height: $context.innerHeight(),
			offset: $context.offset() || {
				top: 0,
				left: 0
			}
		};

		configure(callback, $.extend({}, defaults, options));

		/**
		 * Add new element(s) to spies list.
		 *
		 * @param {Node}     element
		 * @param {Function} callback
		 * @param {Object}   options
		 *
		 * @return {Object} Spy object with basic control methods.
		 */
		self.add = function (element, callback, options) {
			// Optional arguments logic
			if ($.isPlainObject(callback)) {
				options = callback;
				callback = 0;
			}

			$(element).each(function (i, el) {
				var spyId = getId(el) || 's' + lastId++;

				// Add new element to spying list
				spies[spyId] = new Spy(spyId, el, callback, options);

				// Load the element data
				load(spyId);
				check(spyId);
			});
		};

		/**
		 * Configures the main instance
		 *
		 * @param {Function} callback
		 * @param {Object} options
		 */
		function configure(callback, options) {
			if($.isPlainObject(callback)) {
				options = callback;
				callback = null;
			}

			// We are configuring the main Espy instance
			$.extend(SpySettings.prototype, options);
			if(callback !== null) {
				mainCallback = callback;
			}
		}

		/**
		 * Changes the settings of a spy or alters the global defaults
		 *
		 * @param {Node}     element
		 * @param {Function} callback
		 * @param {Object}   options
		 */
		self.configure = function(element, callback, options) {
			// Optional arguments logic
			// If callback first
			if(typeof element === "function") {
				callback = element;
				element = null;
				if($.isPlainObject(callback)) {
					// Only callback
					options = callback;
					callback = null;
				}
			} else if($.isPlainObject(element)) {
				// Only options
				options = element;
				element = null;
				callback = null;
			} else if($.isPlainObject(callback)) {
				// element and options
				options = callback;
				callback = null;
			}

			if(element === null) {
				configure(callback, options);
				$.each(spies, function(i, el) {
					load(el);
				});
			} else {
				$(element).each(function (i, el) {
					var spy = getSpy(el);
					if(spy) {
						spy.configure(callback, options);
						load(el);
					}
				});
			}
		};

		/**
		 * (Re)Load spy object's dimensions.
		 *
		 * @param  {Mixed} element
		 *
		 * @return {Void}
		 */
		function load(element) {
			var spy = getSpy(element);
			if (!spy) {
				return;
			}

			var start = spy.$el.offset()[spy.settings.horizontal ? 'left' : 'top'] - pos.offset[spy.settings.horizontal ? 'left' : 'top'];
			var size  = spy.$el[spy.settings.horizontal ? 'outerWidth' : 'outerHeight']();

			// Add new element to spying list
			$.extend(spy, {
				start: start,
				elSize: size,
				end: start + size
			});
		}

		/**
		 * Reload element's dimensions.
		 *
		 * @param  {Node} element
		 *
		 * @return {Void}
		 */
		self.reload = function (element) {
			if (element === undefined) {
				$.each(spies, function(){
					load(this.id);
				});
				return;
			}

			$(element).each(function (i, el) {
				var spyId = getId(el);
				if (spyId) {
					load(spyId);

					// Check the element for its state
					check(spyId);
				}
			});
		};

		/**
		 * Remove element(s) from spying list.
		 *
		 * @param  {Node} element
		 *
		 * @return {Void}
		 */
		self.remove = function (element) {
			$(element).each(function (i, el) {
				var spyId = getId(el);
				if (spyId) {
					delete spies[spyId];
				}
			});
		};

		/**
		 * Check element state, and trigger callback on change.
		 *
		 * @param  {Mixed} element Can be element node, spy ID, or spy object. Omit to check all elements.
		 *
		 * @return {Void}
		 */
		function check(element) {
			if (element === undefined) {
				$.each(spies, check);
				return;
			}

			// Check whether the element/ID exist in spying list.
			var spy = getSpy(element);
			if (!spy) {
				return;
			}

			// Variables necessary for determination.
			var viewSize     = pos[spy.settings.horizontal ? 'width' : 'height'];
			var triggerSize  = parseRatio(spy.settings.size, viewSize);
			var triggerStart = pos[spy.settings.horizontal ? 'left' : 'top'] + parseRatio(spy.settings.offset, viewSize, -triggerSize);
			var triggerEnd   = triggerStart + triggerSize;
			var newState;

			// Calculate element state in relation to trigger area.
			if (spy.settings.contain) {
				if (triggerStart <= spy.start && triggerEnd >= spy.end) {
					newState = 'inside';
				} else if (triggerStart + triggerSize / 2 > spy.start + spy.elSize / 2) {
					newState = spy.settings.horizontal ? 'left' : 'up';
				} else {
					newState = spy.settings.horizontal ? 'right' : 'down';
				}
			} else {
				if (
					triggerStart > spy.start && triggerStart < spy.end ||
					triggerEnd > spy.start && triggerEnd < spy.end ||
					triggerStart <= spy.start && triggerEnd >= spy.start ||
					triggerStart <= spy.end && triggerEnd >= spy.end
				) {
					newState = 'inside';
				} else if (triggerStart > spy.end) {
					newState = spy.settings.horizontal ? 'left' : 'up';
				} else {
					newState = spy.settings.horizontal ? 'right' : 'down';
				}
			}

			// Trigger callbacks on change.
			if (spy.state !== newState) {
				spy.state = newState;
				if (typeof mainCallback === 'function') {
					mainCallback.call(spy.el, newState === 'inside', newState);
				}
				if (typeof spy.callback === 'function') {
					spy.callback.call(spy.el, newState === 'inside', newState);
				}
			}
		}

		/**
		 * Check whether the element is already spied on, and return the spy ID.
		 *
		 * @param  {Node}  element
		 *
		 * @return {Mixed} Spy ID string, or false.
		 */
		function getId(element) {
			// Return when ID has been passed.
			if (spies.hasOwnProperty(element)) {
				return element;
			}

			// Return ID when spy object has been passed.
			if ($.isPlainObject(element) && spies.hasOwnProperty(element.id)) {
				return element.id;
			}

			// Ensure the element is a single Node
			element = $(element)[0];

			// Check for existence and return the ID.
			var is = false;
			$.each(spies, function (id, spy) {
				if (spy.el === element) {
					is = id;
				}
			});
			return is;
		}

		/**
		 * Return spy object of an element.
		 *
		 * @param  {Node}  element
		 *
		 * @return {Object} Spy ID string, or false.
		 */
		function getSpy(element) {
			var spyId = getId(element);
			return spyId ? spies[spyId] : false;
		}

		/**
		 * Destroy Espy instance.
		 *
		 * @return {Void}
		 */
		self.destroy = function () {
			$context.off('.' + namespace);
			spies = {};
			self = undefined;
		};

		/**
		 * Update the context dimensions.
		 *
		 * @return {Void}
		 */
		self.resize = function() {

			// Resizing may change the height or position of some objects
			// so we reload that are not known to be fixed-size
			$.each(spies, function(){
				if(this.reloadOnResize) {
					load(this);
				}
			});

			pos.width  = $context.innerWidth();
			pos.height = $context.innerHeight();
			check();
		};

		// Register scroll handler
		$context.on('scroll.' + namespace, throttle(defaults.delay, function(){
			pos.top  = $context.scrollTop();
			pos.left = $context.scrollLeft();
			check();
		}));

		// Register resize handler
		$context.on('resize.' + namespace, throttle(defaults.delay, function(){
			self.resize();
		}));
	};

	/**
	 * Parse string like -200% and return the final dimension.
	 *
	 * @param  {Mixed}   value  Integer, or percent string.
	 * @param  {Integer} total  Total value representing 100%.
	 * @param  {Integer} offset Optional offset for negative numbers.
	 *
	 * @return {Integer}
	 */
	function parseRatio(value, total, offset) {
		var matches = (value+'').match(/^(-?[0-9]+)(%)?$/);
		if (!matches) {
			return false;
		}
		var num = parseInt(matches[1], 10);
		if (matches[2]) {
			num = total / 100 * num;
		}
		return num < 0 ? total + num + (offset || 0) : num;
	}

	/**
	 * Create a throttled version of a callback function.
	 *
	 * Copied & pasted with slight adjustments from
	 * https://github.com/cowboy/jquery-throttle-debounce/
	 *
	 * @param  {Integer}  delay
	 * @param  {Function} callback
	 *
	 * @return {Function}
	 */
	function throttle(delay, callback) {
		var timeoutId;
		var lastExec = 0;

		// The `wrapper` function encapsulates all of the throttling functionality
		// and when executed will limit the rate at which `callback` is executed.
		function wrapper() {
			/*jshint validthis:true */
			var that = this;
			var elapsed = +new Date() - lastExec;
			var args = arguments;

			function clear() {
				if (timeoutId) {
					timeoutId = clearTimeout(timeoutId);
				}
			}

			function exec() {
				lastExec = +new Date();
				callback.apply(that, args);
				clear();
			}

			clear();

			if (elapsed > delay) {
				exec();
			} else {
				timeoutId = setTimeout(exec, delay - elapsed);
			}
		}

		// Set the guid of `wrapper` function to the same of original callback, so it can be
		// removed in jQuery 1.4+ .unbind or .off by using the original callback as a reference.
		if ($.guid) {
			wrapper.guid = callback.guid = callback.guid || $.guid++;
		}

		// Return the wrapper function.
		return wrapper;
	}

	// Extend jQuery
	$.fn[pluginName] = function (callback, options) {
		var method, methodArgs;
		var context = options && options.context || w;
		var espy = $.data(context, namespace) || $.data(context, namespace, new $[pluginClass](context));

		if(typeof callback !== "string") {
			espy.add(this, callback, options);
		} else {
			method = callback;
			// Copy array
			methodArgs = Array.prototype.slice.call(arguments);
			// Replace callback with this, our jQuery object of elements
			methodArgs[0] = this;

			// Call plugin method
			if (typeof espy[method] === 'function') {
				espy[method].apply(espy, methodArgs);
			}
		}

		// Apply to all elements
		return this;
	};

	// Default options
	$.fn[pluginName].defaults = {
		delay:      100,    // Events throttling delay in milliseconds.
		context:    window, // Scrolling context.
		horizontal: 0,      // Enable for horizontal scrolling.
		offset:     0,      // Target area offset from start (top in vert., left in hor.).
		size:       '100%', // Target area size (height in vert., width in hor.).
		contain:    0,       // Trigger as entered only when element is completely within the target area.
		reloadOnResize: true // Whether or not to reload spy on resize, disable for spies that will not change size on resize.
	};
}(jQuery, window));
