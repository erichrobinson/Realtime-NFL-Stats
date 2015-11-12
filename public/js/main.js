angular.module('nflFantasy', [])

angular.module('nflFantasy')
	.controller('mainController', ['$scope', '$http', function($scope, $http){
		$scope.testing = "123"

		$http.get('/getPlayers')
			.then(function(returnData){
				$scope.allPlayers = returnData
			})
	
	}])