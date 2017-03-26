app.directive("footer", function footerDirective() {
	return {
		restrict: "E",
		controller: "FooterController",
		templateUrl: "views/components/footer/footer.tpl.html"
	}
})
.controller("FooterController", function footerController($scope) {
	$scope.title = "Footer title";
	$scope.subtitle = " - subtitle";
});
