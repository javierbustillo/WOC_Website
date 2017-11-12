$(function () {
	$(window).on('hashchange', function(){
		// On every hash change the render function is called with the new hash.
		// This is how the navigation of our app happens.
		render(decodeURI(window.location.hash));
	});

	function render(url) {
		// Get the keyword from the url.
		var temp = url.split('/')[0];

		// Hide whatever page is currently shown.
		$('.main-content .page').removeClass('visible');

		var map = {

			// The Homepage.
			'': function() {

				// Clear the filters object, uncheck all checkboxes, show all the products
				filters = {};
				checkboxes.prop('checked',false);

				renderProductsPage(products);
			},

			// Single Products page.
			'#event': function() {

				// Get the index of which event we want to show and call the appropriate function.
				var index = url.split('#event/')[1].trim();

				renderSingleEventPage(index, events);
			},

			// Page with filtered products
			'#category': function() {

				// Grab the string after the '#filter/' keyword. Call the filtering function.
				url = url.split('#category/')[1].trim();

				// Try and parse the filters object from the query string.
				try {
					categories = JSON.parse(url);
				}
				// If it isn't a valid json, go back to homepage ( the rest of the code won't be executed ).
				catch(err) {
					window.location.hash = '#';
				}

				renderFilterResults(categories, events);
			}

		};

		// Execute the needed function depending on the url keyword (stored in temp).
		if(map[temp]){
			map[temp]();
		}
		// If the keyword isn't listed in the above - render the error page.
		else {
			renderErrorPage();
		}
	}

	function generateAllEventsHTML(data){
		// Uses Handlebars to create a list of products using the provided data.
		// This function is called only once on page load.
		var list = $('.all-events .events-list');

		var theTemplateScript = $("events-template").html();
		//Compile Template
		var theTemplate = Handlebars.compile(theTemplateScript);
		list.append(theTemplate(data));

		list.find('div').on('click', function(e) {
			e.preventDefault();

			var eventIndex = $(this).data(índex);

			window.location.hash = 'event/' + eventIndex;
		})
	}

	function renderEventsPage(data){
		// Hides and shows products in the All Products Page depending on the data it recieves.

	}

	function renderSingleEventPage(index, data){
		// Shows the Single Product Page with appropriate data.
	}

	function renderCategoryResults(categories, events){
		// Crates an object with filtered products and passes it to renderProductsPage.
		renderCategoryPage(results);
	}

	function renderErrorPage(){
		// Shows the error page.
	}

	function createQueryHash(categories){
		// Get the filters object, turn it into a string and write it into the hash.
	}

});