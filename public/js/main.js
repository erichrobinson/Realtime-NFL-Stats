angular.module('nflFantasy', [])

angular.module('nflFantasy')
	.controller('mainController', ['$scope', '$http', function($scope, $http){
		$scope.testing = "123"

		console.log("hey hey hey")


		$http.get('/getPlayers')
			.then(function(returnData){
				console.log(returnData)
				$scope.allPlayers = returnData
			})
	
		
		$http.get('/createUser')
			.then(function(returnData){
				console.log(returnData)
			})

	}])