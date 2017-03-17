'use strict';

angular.module('salesUiApp').controller('OffersCtrl', ['$rootScope', '$scope', '$routeParams', '$http', '$filter', '$modal', '$log', '$sce', 'DataService', 'lodash',
function($rootScope, $scope, $routeParams, $http, $filter, $modal, $log, $sce, DataService, lodash) {

	var modalInstanceLoading;
	$scope.promoCats = {};
	$scope.totalsMonthly = 0.0;
	$scope.totalsOneTime = 0.0;
	$scope.monthlyOpen = true;
	$scope.oneTimeOpen = true;
	$scope.errorMsgsOpen = true;
	$scope.currentCart = [];
	$scope.dataForRC = [];
	$scope.dataforGP = {};
	$scope.attributeData = {};
	$scope.CurrentDate = new Date();

	DataService.getSegmentMetaData().then(function(resData) {
		$scope.attributes = resData;
	});

	$scope.browsePackages = function(currentPromotion) {
		$scope.getGPDone = false;
		$scope.dataForRC = [];
	};

	$scope.checkIsPicked = function(currentPromotion) {
		currentPromotion.eligibleOfferMap.price = parseFloat(currentPromotion.eligibleOfferMap.price).toFixed(2);
		if (currentPromotion.eligibleOfferMap.isPicked == true) {
			currentPromotion.added = true;
		}
	};

	$scope.launchShoppingCart = function() {
		console.log("sample");
		$scope.showOption = 'sample';
		//$scope.sample = '{"data" :[{"key" : "accountstatus","value" : "PEND"}, {"key" : "proprietarysegment","value" : "Y"}, {"key" : "marketingsourcecode","value" : "dtvErpKit"}, {"key" : "customerstatus","value" : "new"}, {"key" : "accounttype","value" : "GME"}, {"key" : "corpid","value" : "122334"}]}';
		$scope.dataforGPSample = {
			"data" : [{
				"key" : "accounttype",
				"value" : "HOS"
			}, {
				"key" : "proprietarysegment",
				"value" : "Y"
			}, {
				"key" : "marketingsourcecode",
				"value" : "DWSDefault"
			}, {
				"key" : "accountstatus",
				"value" : "PEND"
			}]
		};
		$scope.sample = angular.toJson($scope.dataforGPSample);
		$scope.dataforGPSample = angular.toJson($scope.dataforGPSample);
	};

	$scope.validateCart = function(promoCat, currentPromotion, isRemoved) {
		$scope.dataForRC = [];
		var vcInput = {};
		var VCInputJSON = [];
		var VCSelectedJSON = [];
		var currentPromoCat = promoCat.eligibleOfferMap;
		/**** Iterate to add or remove selections based on Control Type flag ****/
		//console.log("product Data is::" + currentPromoCat.controlType);
		if (angular.isDefined(currentPromoCat.controlType) && (currentPromoCat.controlType == null || currentPromoCat.controlType == "singleSelect")) {
			angular.forEach(currentPromoCat.offers, function(promotionData) {
				if (currentPromotion == promotionData && angular.isDefined(isRemoved) && isRemoved) {
					//console.log("single select removed");
					currentPromotion.added = false;
					VCInputJSON.push({
						id : promotionData.eligibleOfferMap.ID,
						category : promotionData.label,
						currentRemove : true
					});
					$scope.removeRelationshipPopulation(promotionData);
				} else if (currentPromotion == promotionData) {
					//console.log("In the category single select : " + currentPromotion.eligibleOfferMap.name);
					currentPromotion.added = true;
					VCInputJSON.push({
						id : promotionData.eligibleOfferMap.ID,
						category : promotionData.label,
						currentPick : true
					});
					$scope.addRelationshipPopulation(promotionData);
				} else {
					currentPromotion.added = false;
					//console.log("removed all single select other options");
					$scope.removeRelationshipPopulation(promotionData);
				}
			});
		} else {
			angular.forEach(currentPromoCat.offers, function(promotionData) {
				if (currentPromotion == promotionData && angular.isDefined(isRemoved) && isRemoved) {
					//console.log("multiselect removed");
					currentPromotion.added = false;
					VCInputJSON.push({
						id : promotionData.eligibleOfferMap.ID,
						category : promotionData.label,
						currentRemove : true
					});
					$scope.removeRelationshipPopulation(promotionData);
				} else if (currentPromotion == promotionData) {
					//console.log("In the category multiselect : " + currentPromotion.eligibleOfferMap.name + "With price::" + currentPromotion.eligibleOfferMap.price);
					currentPromotion.added = true;
					VCInputJSON.push({
						id : promotionData.eligibleOfferMap.ID,
						category : promotionData.label,
						currentPick : true
					});
					$scope.addRelationshipPopulation(promotionData);
				}
			});
		}
		vcInput.currentCart = $scope.currentCart;
		vcInput.requestdata = VCInputJSON;
		if ($scope.currentCart != "") {
			//console.log("not empty" + $scope.currentCart);
			$scope.dataForRC.push(vcInput);
		}
		//console.log("VC input request : " + angular.toJson($scope.dataForRC));
		$scope.getOffers();
	};

	$scope.removeFromCart = function(promoCat, currentPromotion) {
		currentPromotion.eligibleOfferMap.isPicked == false;
		$scope.validateCart(promoCat, currentPromotion, true);
	};

	$scope.getKeyValuePairs = function() {
		$scope.dataforGP.data = [];
		lodash.forEach($scope.attributeData, function(value, key) {
			$scope.dataforGP.data.push({
				"key" : key,
				"value" : value
			});
		});
	};

	$scope.getOffers = function() {
		$scope.loadingOpen();
		$scope.dataforGP = {};
		if ($scope.showOption == 'form') {
			$scope.getKeyValuePairs();
		} else if ($scope.showOption == 'data') {
			$scope.dataforGP = angular.fromJson($scope.dataforGPString);
		} else {
			$scope.dataforGP = angular.fromJson($scope.dataforGPSample);
		}
		if ($scope.dataForRC != "") {
			//console.log("not empty" + $scope.currentCart);
			$scope.dataforGP.shoppingCartItems = $scope.dataForRC;
		}
		//console.table($scope.dataforGP);
		DataService.getOffers($scope.dataforGP).then(function(res) {
			$scope.totalsMonthly = 0.0;
			$scope.totalsOneTime = 0.0;
			$scope.errorMessages = res.mpmErrorMessages;
			var promotionCategory = lodash.filter(res.mpmEligiblePromotions, function(p) {
				if (p[0].label === "promotion") {
					return p[0].eligibleOfferMap;
				}
			});

			//console.table(res.mpmEligiblePromotions);
			var promotionCategory = lodash.filter(res.mpmEligiblePromotions, function(p) {
				if (p[0].label === "promotion") {
					return p[0].eligibleOfferMap;
				}
			});
			//console.table(promotionCategory);

			var promoCategories = lodash.groupBy(promotionCategory, function(p) {
				if (angular.isDefined(p[0].eligibleOfferMap.have)) {
					return p[0].eligibleOfferMap.have[0];
				} else {
					return "others";
				}
			});
			//console.log("promotionGrouping:::" + angular.toJson(promoCategories));

			var promoCatLayout = lodash.filter(res.mpmLayout, function(p) {
				if (p.label == "productcategory") {
					return p.label;
				}
			});

			lodash.forEach(promoCategories, function(promoCatValue, promoCatkey) {
				//console.log("key is :::" + promoCatkey);
				lodash.find(promoCatLayout, function(promoCatLayoutValue, promoCatLayoutKey) {
					if (promoCatkey === promoCatLayoutValue.eligibleOfferMap.ID) {
						//console.log("promocat key is :::" + promoCatLayoutValue.eligibleOfferMap.name);
						promoCatLayoutValue.eligibleOfferMap.offers = lodash.flatten(promoCatValue);
						//console.log("promoCatValue is :::" + angular.toJson(promoCatLayoutValue.eligibleOfferMap.offers));
					}
				});
			});
			$scope.promoCats = promoCatLayout;
			//console.log("promoCats:::" + angular.toJson($scope.promoCats));
			$scope.getGPDone = true;
			$scope.loadingCancel();
		});
	};

	/*
	 * Add current cart values based of single select or user added logic
	 */
	$scope.addRelationshipPopulation = function(promotionData) {
		// Adding the single select product to current cart
		if ($scope.currentCart.indexOf(promotionData.eligibleOfferMap.ID) == -1) {
			$scope.currentCart.push(promotionData.eligibleOfferMap.ID);
			//console.log("pickedProduct is:" + promotionData.eligibleOfferMap.ID);
		}
	};

	/*
	 * eliminate current cart values based of single select or user removed logic
	 */
	$scope.removeRelationshipPopulation = function(promotionData) {
		// Removing the user removed product from current cart
		if ($scope.currentCart.indexOf(promotionData.eligibleOfferMap.ID) !== -1) {
			var arrayValue = $scope.currentCart.indexOf(promotionData.eligibleOfferMap.ID);
			$scope.currentCart.splice(arrayValue, 1);
			//console.log("removedProduct is :" + promotionData.eligibleOfferMap.ID);
		}
	};

	/*********************Totals for onetime and monthly charges - Starts ******************************/
	$scope.checkForMonthlyCharges = function(currentPromotion) {
		if (currentPromotion.eligibleOfferMap.isPicked == true && currentPromotion.eligibleOfferMap.displayInCart == "true" && currentPromotion.eligibleOfferMap.frequencyOfCharge == "monthly") {
			currentPromotion.monthlyShow = true;
			currentPromotion.eligibleOfferMap.price = parseFloat(currentPromotion.eligibleOfferMap.price).toFixed(2);
			//console.log("HEre monthly true::: " + currentPromotion.eligibleOfferMap.name + " Price is ::" + currentPromotion.eligibleOfferMap.price);

			// Final totals monthly
			$scope.totalsMonthly = parseFloat($scope.totalsMonthly) + parseFloat(currentPromotion.eligibleOfferMap.price);
			$scope.totalsMonthly = parseFloat($scope.totalsMonthly).toFixed(2);
			//console.log("total price monthly in RC :::" + $scope.totalsMonthly);
		}
	};

	$scope.checkForOneTimeCharges = function(currentPromotion) {
		if (currentPromotion.eligibleOfferMap.isPicked == true && currentPromotion.eligibleOfferMap.displayInCart == "true" && (angular.isUndefined(currentPromotion.eligibleOfferMap.frequencyOfCharge) || currentPromotion.eligibleOfferMap.frequencyOfCharge == "oneTime")) {
			currentPromotion.oneTimeShow = true;
			currentPromotion.eligibleOfferMap.price = parseFloat(currentPromotion.eligibleOfferMap.price).toFixed(2);
			//console.log("Here one time true::: " + currentPromotion.eligibleOfferMap.name + " Price is ::" + currentPromotion.eligibleOfferMap.price);
			// Final totals one time
			$scope.totalsOneTime = parseFloat($scope.totalsOneTime) + parseFloat(currentPromotion.eligibleOfferMap.price);
			$scope.totalsOneTime = parseFloat($scope.totalsOneTime).toFixed(2);
			//console.log("total price ome time:::" + $scope.totalsOneTime);
		}
	};
	/********************* Totals for onetime and monthly charges - Ends ******************************/

	/********************* Loading modal - Starts ******************************/
	$scope.loadingOpen = function(size) {
		modalInstanceLoading = $modal.open({
			template : '<div class="modal-body" id="pleaseWaitDialog"><h3 id="progress-animated">Please wait..</h3><div class="bs-component"><div class="progress active"><div class="progress-bar progress-bar-striped" style="width: 80%"></div></div></div></div>',
			size : size
		});
	};

	$scope.loadingCancel = function() {
		modalInstanceLoading.close('cancel');
	};

	/********************* Loading modal- Ends ********************************/

}]);
