var app = {};
app.UI = {};

app.player = (function(SC) {
	'use strict';

	var ready,
			tracks,
			player,
			currentTrack;
	
	SC.initialize({
		client_id: '46e4972be31cf907df3fbaa4204a5d3e'
	});	

	ready = SC.get('/users/68470387/tracks')
		.then(function(data) {
			tracks = data;
		})
		.catch(function(err) {
			console.log(err);
		});
	
	function play(track) {
		if (track) {
			player = undefined;
			currentTrack = track;
		} else {
			currentTrack = tracks[0];
		}

		if(!player) {
			SC.stream('/tracks/' + currentTrack.id)
				.then(function(newPlayer) {
					player = newPlayer;
					player.play();
				});
		} else {
			player.play();
		}
	}

	function init() {
		ready.then(play);	
	}

	function pause() {
		player.pause();
	}

	function next() {
		var currentIndex,
				nextIndex;

		currentIndex = tracks.indexOf(currentTrack);
		
		if(currentIndex === tracks.length - 1) {
			nextIndex = 0;
		} else {
			nextIndex = currentIndex + 1;
		}
		
		play(tracks[nextIndex]);
	}

	function prev() {
		var currentIndex,
				prevIndex;

		currentIndex = tracks.indexOf(currentTrack);
		
		if(currentIndex === 0) {
			prevIndex = tracks.length - 1;
		} else {
			prevIndex = currentIndex - 1;
		}
		
		play(tracks[prevIndex]);	
  }
	
	function toggleRepeat() {
	}

	return {
		play: init,
		pause: pause,
		next: next,
		prev: prev,
		toggleRepeat: toggleRepeat
	};

})(SC);

app.UI.player = (function(app) {
	'use strict';
	
	var playing = false;
	var player = document.querySelector('#music-player');
	var btnPrev = player.querySelector('.btn-prev');
	var btnToggle = player.querySelector('.btn-play');
	var btnNext = player.querySelector('.btn-next');
	var lblMusicName = player.querySelector('#music-name');
	
	function togglePlayer() {
		if(playing) {
			app.player.pause();
		} else {
			app.player.play();
		}
		
		playing = !playing;
	}

	btnPrev.addEventListener('click', app.player.prev);
	
	btnToggle.addEventListener('click', togglePlayer);

	btnNext.addEventListener('click', app.player.next);
	
	
	return {
		toggle: togglePlayer
	};
})(app);

app.init = (function(app) {
	'use strict';
	
	return function() {
		app.UI.player.toggle();
	};

})(app);

app.init();
