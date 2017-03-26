app.directive("header", function headerDirective() {
	return {
		restrict: "E",
		controller: "HeaderController",
		templateUrl: "views/components/header/header.tpl.html"
	}
})
.controller("HeaderController", function headerController($scope) {
	$scope.header = "this is a sample header";

	$scope.userProfileInitial = "RS";
});
