var app = angular.module('myTodoApp', []);

app.controller('myTodoCtrl', ['$scope', '$http', function ($scope, $http) {
  $scope.url = 'http://localhost:8081/';
  $scope.endpoints = {
    getTodo: $scope.url + 'getTodo',
    saveTodo: $scope.url + 'saveTodo',
	setTodoDone: $scope.url + 'setTodoDone',
    removeTodo: $scope.url + 'removeTodo'
  };
  $scope.myTodo = {
    _id: '',
    name: '',
    description: '',
    priority: '',
    done: false
  };
  $scope.myTodoPriorities = [
    {id: 0, name: 'low'},
    {id: 1, name: 'med'},
    {id: 2, name: 'high'}
  ];
  $scope.myTodos = [];

  $scope.getTodo = function (id) {
    var url = $scope.endpoints.getTodo;
    if (id) {
      url + '/' + id;
    }
    $http.get(url)
      .then(function (res) {
        // success
        $scope.myTodos = res.data;
      }, function (err) {
        // fail
		console.log(err);
      });
  };

  $scope.getTodo();

  $scope.saveTodo = function () {
	/*
    var data = $.param({
      name: $scope.myTodo.name,
      description: $scope.myTodo.description,
      priority: $scope.myTodo.priority,
      done: false
    });
	*/
	var data = {
      name: $scope.myTodo.name,
      description: $scope.myTodo.description,
      priority: $scope.myTodo.priority,
      done: false
    };
    var config = {
      method: 'POST',
      url: $scope.endpoints.saveTodo,
      data: data,
      headers: {'Content-Type':'application/json;charset=utf-8'}
    };
    $http(config)
      .then(function (data) {
        // success
        console.log(data);
		$scope.getTodo();
      }, function (err) {
        // fail
        console.log(err);
		$scope.getTodo();
      });
  };
  
  $scope.setTodoDone = function(id) {
	  var data = {
		  id: id
	  };
	  var config = {
		method: 'POST',
		url: $scope.endpoints.setTodoDone,
		data: data,
		headers: {'Content-Type':'application/json;charset=utf-8'}
	  };
	  $http(config)
		.then(function (data) {
			// success
			console.log(data);
			$scope.getTodo();
		}, function (err) {
			// fail
			console.log(err);
			$scope.getTodo();
		});
  };

  $scope.removeTodo = function (id) {
    var url = $scope.endpoints.removeTodo + '/' + id;
	
	var config = {
      method: 'GET',
      url: url
    };
	
    $http(config)
      .then(function (res) {
        // success
        console.log(res.data);
		$scope.getTodo();
      }, function (err) {
        // fail
		console.log(err);
		$scope.getTodo();
      });
  };

}]);
