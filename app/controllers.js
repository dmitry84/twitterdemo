/*jslint node: true */
/*global angular, app*/

'use strict';


app.controller('TwitterController', function ($scope, $q, twitterService) {

	$scope.tweets = []; //array of tweets

	//using the OAuth authorization result get the latest tweets from twitter for the user
	$scope.refreshTimeline = function (maxId) {

		twitterService.getLatestTweets(maxId).then(function (data) {
			$scope.tweets = $scope.tweets.concat(data);
		}).catch(function (error) {
			$scope.rateLimitError = true; //most likely
			console.log("ERROR", error);
		});
	}

	//when the user clicks the connect twitter button, the popup authorization window opens
	$scope.connectButton = function () {

		twitterService.connectTwitter().then(function () {
			if (twitterService.isReady()) {
				//if the authorization is successful
				$('#connectButton').fadeOut(function () {
					$('#getTimelineButton, #signOut').fadeIn();
					$scope.refreshTimeline();
					$scope.connectedTwitter = true;
				});
			} else {
				console.log("Twitter disconnected");
			}
		});
	}

	//sign out clears the OAuth cache, the user will have to reauthenticate when returning
	$scope.signOut = function () {
		twitterService.clearCache();
		$scope.tweets.length = 0;

		$('#getTimelineButton, #signOut').fadeOut(function () {
			$('#connectButton').fadeIn();
			$scope.$apply(function () {
				$scope.connectedTwitter = false
			})
		});

		$scope.rateLimitError = false;
	}



// --------------------------------------------------------------------------------


	function init() {
		twitterService.initialize();

		//if the user is a returning user, hide the sign in button and display the tweets
		if (twitterService.isReady()) {
			$('#connectButton').hide();
			$('#getTimelineButton, #signOut').show();

			$scope.connectedTwitter = true;
			$scope.refreshTimeline();
		}
	}

	init();
});
