/*jslint node: true */
/*global angular, app, moment*/

'use strict';


/**
 * Convert twitter time to human readable
 */
app.filter('convertTime', ['moment', function (moment) {
		return function (value) {
			//FIXME: Check bug in the moment where it can not parse cistom date.
			// remove new Date once fixed
			var date = moment(new Date(value));
			return moment.utc(date).format('D MMM YYYY HH:mm:ss');
		};
	}]);



/**
 * Sort twits by matched text
 */
app.filter('sortByText', function () {
	
	/**
	 * Return substring position
	 * @param {string} str  - string where to search 
	 * @param {string} searchStr - substring to search
	 * @returns {int}
	 */
	function getSubstrPosition(str, searchStr) {
		var pos = str.indexOf(searchStr);
		return pos;
	}

	return function (items, searchText) {
		var filtered = [];
		
		angular.forEach(items, function (item) {
			filtered.push(item);
		});
		
		
		filtered.sort(function (a, b) {

			var pos1 = getSubstrPosition(a.text, searchText);
			var pos2 = getSubstrPosition(b.text, searchText);

			if (pos1 > -1 && pos2 > -1) {
				return pos1 - pos2;
			} else {
				return  pos1 < pos2 ? 1 : -1;
			}
		});

		return filtered;
	};
});