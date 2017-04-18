(function ($) {

	/**
	* Build the jQuery plugin.
	*
	* Assigning the following function $.fn.[module] allows it to be ran and chained off of a jQuery selector. Example: $(selector).navigation(options);
	*
	* @param {object} [options={}] - The custom options used to init the jQuery plugin.
	*
	* @returns {object} this
	*/
	$.fn.navigation = function(options) {

		/**
		* Run the plugin in a loop so each element can have it's own settings.
		*/
		return this.each(function() {
			/**
			* Select the necessary elements.
			*/
			var $nav = $(this),
				$menu = $nav.children('ul');
			

			/**
			* Extend the default options.
			*/
			var config = $.extend({
				activateSubmenu: 'li',
				animation: 'slide',
				animationSpeed: 'fast',
				controlClass: 'menu-control',
				hasSubClass: 'has-sub-menu',
				jqSlide: true,
				openClass: 'open'
			}, options);
		

			/**
			* Add openClass to the nav if the menu is visible.
			*/
			if ($menu.is(':visible')) {
				$nav.addClass(config.openClass);
			}


			/**
			* Add hasSubClass to all <li> with a <ul> child.
			*/
			$menu.find('li > ul').each(function(index, value) {
				$.fn.navigation.hasSubmenu(this, config);
			});


			/**
			* Reset the menus when the window resizes.
			*/
			$(window).resize(function(e) {
				$.fn.navigation.reset($nav, config);
			});


			/**
			* Toggle the navigation menu.
			*/
			$nav.children('.' + config.controlClass).on('click', function(e) {
				e.preventDefault();

				$.fn.navigation.close($menu.children().find('ul'), config);
				$.fn.navigation.toggle($menu, config);
			});


			/**
			* Toggle submenus.
			*/
			$menu.find(config.activateSubmenu).on('click', function(e) {
				var $subMenu = '';

				if (config.activateSubmenu == 'li') {
					$subMenu = $(this).children('ul');
				}
				else {
					$subMenu = $(this).parent('li').children('ul');
				}

				var	$otherSubs = $menu.find('li.' + config.openClass).children('ul').not($subMenu).not($subMenu.parents('ul')).not($subMenu.find('ul'));

				e.stopPropagation();

				if ($subMenu.length < 1) {
					return;
				}

				e.preventDefault();

				if ($subMenu.is(':visible')) {
					$.fn.navigation.close($subMenu.find('ul'), config);
					$.fn.navigation.close($subMenu, config);
				}
				else {
					$.fn.navigation.close($otherSubs, config);
					$.fn.navigation.open($subMenu, config);
				}
			});
		});
	};


	/**
	* Animate showing or hiding an element.
	*
	* @param {object|string} element - The collection or selector of the element to open.
	* @param {object|string} visibility - The visibility to animate, show or hide.
	* @param {object} [config=$.fn.navigation.options] - The config object.
	*/
	$.fn.navigation.animate = function (element, visibility, config) {
		var $element = $(element);

		if (config.animation === 'fade') {
			if (visibility === 'show') {
				$element.fadeIn(config.animationSpeed);
			}
			else {
				$element.fadeOut(config.animationSpeed);
			}
		}
		else {
			if (visibility === 'show') {
				$element.slideDown(config.animationSpeed);
			}
			else {
				$element.slideUp(config.animationSpeed);
			}
		}
	};


	/**
	* Close a submenu.
	*
	* @param {object|string} element - The collection or selector of the element to close.
	* @param {object} [config=$.fn.navigation.options] - The config object.
	*/
	$.fn.navigation.close = function (element, config) {
		var $element = $(element);

		$element.parent().removeClass(config.openClass);

		if (config.animation) {
			$.fn.navigation.animate($element, 'hide', config);
		}
	};


	/**
	* Add the config.hasSubClass class to the parent <li> of a submenu.
	*
	* @param {object|string} element - The collection or selector of the element to identify.
	* @param {object} [config=$.fn.navigation.options] - The config object.
	*/
	$.fn.navigation.hasSubmenu = function (element, config) {
		$(element).parent('li').addClass(config.hasSubClass);
	};


	/**
	* Open a submenu.
	*
	* @param {object|string} element - The collection or selector of the element to open.
	* @param {object} [config=$.fn.navigation.options] - The config object.
	*/
	$.fn.navigation.open = function (element, config) {
		var $element = $(element);

		$element.parent().addClass(config.openClass);

		if (config.animation) {
			$.fn.navigation.animate($element, 'show', config);
		}
	};


	/**
	* Reset all submenus.
	*
	* @param {object|string} element - The collection or selector of the navigation to reset.
	* @param {object} [config=$.fn.navigation.options] - The config object.
	*/
	$.fn.navigation.reset = function (element, config) {
		$element = $(element);

		$element.removeClass(config.openClass).find('ul').removeAttr('style');
		$element.find('li').removeClass(config.openClass);
	};


	/**
	* Toggle a menu open or close. Will also close all children <ul>.
	*
	* @param {object|string} element - The collection or selector of the element to toggle.
	* @param {object} [config=$.fn.navigation.options] - The config object.
	*/
	$.fn.navigation.toggle = function (element, config) {
		var $element = $(element),
			visible = $element.is(':visible');

			if (visible) {
				$.fn.navigation.close($element, config);
				$.fn.navigation.close($element.find('ul'), config);
			}
			else {
				$.fn.navigation.open($element, config);
			}
	};
}(jQuery));