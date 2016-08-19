var express = require('express');
var cons = require('consolidate');
var _ = require('underscore');
var app = express();
var cors = require('cors');
var foursquare = (require('foursquarevenues'))(process.env.FOURSQUARECLIENTIDKEY, process.env.FOURSQUARECLIENTSECRETKEY);

var fsParams = {
	'll': '5.4183315,100.3204833',
	'section': 'food',
	'limit': 50,
	'venuePhotos': 1,
	'query': 'food',
};

// using consolidate for simple templating.
// use hbs if wanted to configure custom helpers for handlebars
app.engine('html', cons.handlebars);

// set .html as the default extension
app.set('view engine', 'html');
app.set('views', __dirname + '/public');

app.use(cors());

app.get('/', function(req, res) {
	if(req.query.lat) {
		fsParams.ll = req.query.lat + ',' + req.query.long;
		foursquare.exploreVenues(fsParams, function(error, venues) {
			if(!error) {
				var allPlaces = venues.response.groups[0].items;
				var selectedPlace = allPlaces[_.random(0, allPlaces.length - 1)]; //allPlaces[Math.floor(Math.random() * (allPlaces.length))];
				res.render('index', {
					'selected_place': selectedPlace
				});
			}
		});
	} else {
		res.render('geo');
	}
});

app.listen(process.env.PORT || 3000);
