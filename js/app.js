

	var searchApp = {};


	searchApp.formInput = function(moreInfo){
	$('#getAllInformation').on('submit', function(e){
		e.preventDefault();
		searchApp.userPrice = $('.priceOfDate:checked').map(function(val) {
			return this.value
		}).get().join();
		searchApp.foodChoice = $('#foodChoice option:selected').val();
		searchApp.personLocation = $('#currentLocation input[type=text]').val();
		$('#wrapper2').addClass('wrapper2');
		console.log($("#wrapper2").hasClass('wrapper2'))
		window.setTimeout(function(){
		$('html, body').animate({
			scrollTop: $("#wrapper2").offset().top
			})
		},500)
		console.log( searchApp.userPrice, searchApp.foodChoice, searchApp.personLocation);
		searchApp.getCurrentLocation(searchApp.userPrice, searchApp.foodChoice, searchApp.personLocation);
	});
}


	$("input[type=reset]").on('click', function() {
		location.reload().fadeOut();
	}); //end of reset.onClick

	searchApp.getCurrentLocation = function(userPrice,foodChoice, personLocation) {
		$.ajax({
			url: "https://maps.googleapis.com/maps/api/geocode/json",
			method: 'GET',
			dataType: 'json',
			data: {
				address: personLocation
			}
		}).then(function(result){
			var lat = (result.results[0].geometry.location.lat);
			var lng= (result.results[0].geometry.location.lng);
			var latLng = lat + "," + lng;
			console.log(result)
			searchApp.getEvent(latLng, userPrice,foodChoice);

			searchApp.myLatLng = {lat: lat, lng: lng}
			
			var marker = new google.maps.Marker ({
				position: searchApp.myLatLng,
				map: searchApp.map,
				title: "You Are Here!"
				
			})
		});
	}


		searchApp.getEvent = function(latLng, userPrice, foodChoice) {
			$.ajax({
				url: 'https://api.foursquare.com/v2/venues/explore/',
				method: 'GET',
				dataType: 'json',
				data : {
					ll: latLng,
					client_id: 'HW5ZHQHMBX3UNGP2RRUSJQLTC20B1IV1QTO25YOWYHOVKZPI',
					client_secret: '5FKDXXHYDEAPINLMAFP22S1NWNFJULSBGFUA02QGXOWFQ2UU',
					query: foodChoice,
					radius: 2000,
					time: 'any',
					openNow: 1,
					sortByDistance: 1,
					venuePhotos: 1,
					price: searchApp.userPrice.length > 0 ? searchApp.userPrice : "1,2,3,4",
					v: 20160217
				}
			}).then(function(res) {
					$('#food').empty();
					console.log(foodChoice, userPrice);
					searchApp.displayInfo(res.response.groups[0].items)
					console.log(res.response.groups[0].items)
						
				});
		}

		searchApp.displayInfo = function(information) {

			
			$.each(information, function(i, info){
		
				var photo = $('<img>').attr('src', info.venue.photos.groups[0].items[0].prefix + '375x150' + info.venue.photos.groups[0].items[0].suffix);

				var title = $('<h3>').text(info.venue.name);
				var location = $('<p>').text(info.venue.location.formattedAddress);
				var phone = $('<p>').text(info.venue.contact.formattedPhone);
				// var website = $('<p>').text(info.venue.url);
				var website =$('<a>').attr('href', info.venue.url).text(info.venue.url).attr('target', '_blank');

				if(info.venue.hours !== undefined){
					var hours = $('<p>').text('Hours: '+ info.venue.hours.status);
				        }

				// if(info.venue.price !== undefined){
				// 	var price = $('<p>').text('Price: ' + info.venue.price.message);
				//         }

				if(info.venue.price.tier === 1) {
						var placePrice = $('<p>').addClass('placePrice').text('Price: $');
					}
					else if (info.venue.price.tier === 2){
						var placePrice = $('<p>').addClass('placePrice').text('Price: $$');
					}
					else if (info.venue.price.tier === 3){
						var placePrice = $('<p>').addClass('placePrice').text('Price: $$$');
					}
					else if (info.venue.price.tier === 4){
						var placePrice = $('<p>').addClass('placePrice').text('Price: $$$$');
					}
					else {
						var placePrice = $('<p>').addClass('placePrice').text('');
					}

				console.log(photo, title, location, phone, website, hours, placePrice)
				var finalAnswer = $('<div>').addClass('foodanswer').append(photo, title, location, phone, website, hours, placePrice);

				$('#food').append(finalAnswer);
				$('#map').show().addClass('animated fadeInLeft');
				google.maps.event.trigger(document.getElementById('map'), 'resize');
				google.maps.event.addListenerOnce(map, 'idle', function() {
				       google.maps.event.trigger(map, 'resize');
				       map.setCenter({lat:app.bandsIn2Lat,lng:app.bandsIn2Long});

				  	});

// MAP INFO!!!!
					var dateLat = info.venue.location.lat;
			 		var dateLng = info.venue.location.lng;
			 		
			 		searchApp.map.setCenter(searchApp.myLatLng);
			 		// var image = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
					var marker = new google.maps.Marker({
					   position: {
			 		 		lat: dateLat,
			 		 		lng: dateLng
			 		 	},
					   map: searchApp.map,
					   icon: 'images/marker2.png'
					   
					 });
			 		var infowindow = new google.maps.InfoWindow({
			 		    content: '<h2>'+ title.text() +'</h2>' + '<h4>' + location.text() + '</h4>' + '<h5>' + website.text() + '</h5>'
			 		});

				marker.addListener('click', function() {
					 	infowindow.open(searchApp.map, marker);
					 	
				});

			});

		}


// Inital Document To Start Application
	searchApp.init = function() {
			searchApp.formInput();


		};

// document ready
		$(function(){
			searchApp.init();
			searchApp.map;
			initMap = function() {
			  	searchApp.map = new google.maps.Map(document.getElementById('map'), {
			    	center: {lat: 43.67, lng: -79.38},
			    	zoom: 14,
			    	scrollwheel: false,
			    	styles: [{
				        "featureType": "landscape.natural",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "visibility": "on"
				            },
				            {
				                "color": "#e0efef"
				            }
				        ]
				    },
				    {
				        "featureType": "poi",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "visibility": "on"
				            },
				            {
				                "hue": "#1900ff"
				            },
				            {
				                "color": "#c0e8e8"
				            }
				        ]
				    },
				    {
				        "featureType": "road",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "lightness": 100
				            },
				            {
				                "visibility": "simplified"
				            }
				        ]
				    },
				    {
				        "featureType": "road",
				        "elementType": "labels",
				        "stylers": [
				            {
				                "visibility": "off"
				            }
				        ]
				    },
				    {
				        "featureType": "transit.line",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "visibility": "on"
				            },
				            {
				                "lightness": 700
				            }
				        ]
				    },
				    {
				        "featureType": "water",
				        "elementType": "all",
				        "stylers": [
				            {
				                "color": "#7dcdcd"
				            }
				        ]
				    }
				]
		});
			$('#map').hide();
	};
						
});
