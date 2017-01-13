odoo.define('hotkeys', function (require) {
	"use strict";

	// Se importan los modulos necesarios
	var core = require('web.core');
	var models = require('point_of_sale.models');
	var session = require('web.session');
	var PosDB = require('point_of_sale.DB');
	var Gui = require('point_of_sale.gui');
	var chrome = require('point_of_sale.chrome');
	var ajax = require('web.ajax');
	var Model = require('web.Model');
	var data = require('web.data');
	var PosBaseWidget = require('point_of_sale.BaseWidget');
	var Screens = require('point_of_sale.screens');



	var _super_posmodel = models.PosModel.prototype;
	models.PosModel = models.PosModel.extend({
	    initialize: function(session, attributes) {
	    	var self = this;
	    	_super_posmodel.initialize.call(this,session,attributes);
	    	self.guiIsReady();
	    },
	    guiIsReady : function(){
	    	var self = this;
	    	$(document).ready(function(){
				self.ready.done(function(){

					self.addEvents();

					


				});
			})
	    },
	    eventPayment : function( type ){
			var self = this;
	    	var payment_selected = $('.paymentmethod').hasClass('payment_selected');
	    	if( ! payment_selected ){
				$('.paymentmethod').each(function(){
					$(this).addClass('payment_selected');
	    			return false;					
				});	    		
	    	} else {
	    		payment_selected = false;
	    		var payment_obj = false;

	    		if( type == 'down' ){
	    			$('.paymentmethods > .paymentmethod').each(function(){
		    			if( payment_selected ){
		    				payment_obj.removeClass('payment_selected');
		    				$(this).addClass('payment_selected');

		    				payment_obj = false;
		    				payment_selected = false;

		    				return false;
		    			}

		    			payment_selected = $(this).hasClass('payment_selected');
		    			payment_obj = $(this);
		    		});
	    		} else if ( type == 'up' ) {
	    			
	    			$('.paymentmethods > .paymentmethod').each(function(){
	    				payment_selected = $(this).hasClass('payment_selected');

	    				if( $('.product:first').hasClass('payment_selected') ){
	    					return false;
	    				}

	    				if( payment_selected  ){
	    					$(this).removeClass('payment_selected');
	    					payment_obj.addClass('payment_selected');

	    					payment_obj = false;
		    				payment_selected = false;

		    				return false;
	    				}

	    				payment_obj = $(this);

	    				
	    			});
	    		}
	    	}
	    },
	    eventOrderLine : function( type ){
	    	var selected = false;
	    	var obj = false;
			$('li.orderline').each(function(){
				if( type == 'down' ){
					if( selected ){
						$(this).click();
						selected = false;
					}

					if( $(this).hasClass('selected') ){
						selected = true
					}
				} else if( type == 'up' ) {
					if( $(this).hasClass('selected') ){
						if( obj  ){
							obj.click();	
						}
						
					}
					obj = $(this);

				}
				

				
			});
	    },
	    eventProduct : function( type ){
	    	var self = this;
	    	var product_selected = $('.product').hasClass('product_selected');
	    	if( ! product_selected ){
				$('div.product-list > .product').each(function(){
					$(this).addClass('product_selected');
	    			return false;					
				});	    		
	    	} else {
	    		product_selected = false;
	    		var product_obj = false;

	    		if( type == 'right' ){
	    			$('div.product-list > .product').each(function(){
		    			if( product_selected ){
		    				product_obj.removeClass('product_selected');
		    				$(this).addClass('product_selected');

		    				product_obj = false;
		    				product_selected = false;

		    				return false;
		    			}

		    			product_selected = $(this).hasClass('product_selected');
		    			product_obj = $(this);
		    		});
	    		} else if ( type == 'left' ) {
	    			
	    			$('div.product-list > .product').each(function(){
	    				product_selected = $(this).hasClass('product_selected');

	    				if( $('.product:first').hasClass('product_selected') ){
	    					return false;
	    				}

	    				if( product_selected  ){
	    					$(this).removeClass('product_selected');
	    					product_obj.addClass('product_selected');

	    					product_obj = false;
		    				product_selected = false;

		    				return false;
	    				}

	    				product_obj = $(this);

	    				
	    			});
	    		} else if ( type == 'down' ) {
	    			var width = $('.product-list').width();
	    			var products = Math.round(width / 142);
	    			if( (width / 142 ) < 3 ){
	    				products = 2;
	    			}

	    			console.log('testt', products);

	    			for( var n = 1; n <= products; n++ ){
	    				self.eventProduct('right');
	    			}

	    		} else if ( type == 'up' ) {
	    			var width = $('.product-list').width();
	    			var products = Math.round(width / 142);

	    			if( (width / 142 ) < 3 ){
	    				products = 2;
	    			}
	    			for( var n = 1; n <= products; n++ ){
	    				self.eventProduct('left');
	    			}

	    		}

	    		
	    	}


	    	/*$('div.product-list > .product').each(function(){
	    		if( type == 'right' ){

	    			$(this).addClass('product_selected');
	    			return false;
	    		}
	    	});*/
	    },
	    addEvents : function(){
	    	var self = this;

	    	Mousetrap.bind('c', function(){
	    		if( ! $('.next').is(":visible") ){
	    			$('.mode-button[data-mode="quantity"]').click();
	    		}
				
			});

			Mousetrap.bind('d', function(){
				if( ! $('.next').is(":visible") ){
					$('.mode-button[data-mode="discount"]').click();
				}
			});

			Mousetrap.bind('p', function(){
				if( ! $('.next').is(":visible") ){
					$('.mode-button[data-mode="price"]').click();
				}
				
			});

			Mousetrap.bind('backspace', function(){
				if( ! $('.next').is(":visible") ){
					$('.numpad-backspace')[0].click();	
				} else {

					if( $('.back').is(":visible") ){
						$('.back').click();
					}

				}
				
			});

			
			Mousetrap.bind('ctrl+b', function(){
				if( ! $('.next').is(":visible") ){
					$('.search-clear').click();
					$('.searchbox > input').focus();


				}
			});

			Mousetrap.bindGlobal('esc', function(){
				if( ! $('.next').is(":visible") ){
					$('.searchbox > input').blur();

				}
			});



			Mousetrap.bind('ctrl+c', function() {
			    if( ! $('.next').is(":visible") ){
					$('.set-customer').click();
				}
			});


			Mousetrap.bind('ctrl+return', function(){
				if( ! $('.next').is(":visible") ){
					$('.pay').click();
				} else {
					//$('.next').click();
				}
			});

			Mousetrap.bind('return', function(){
				if( ! $('.next').is(":visible") ){
					var product_selected = $('.product').hasClass('product_selected');

					if( product_selected ){
						$('.product.product_selected').click();
						$('.product').removeClass('product_selected');
					}
				} else {

					if($('.print').is(":visible")){
						$('.next').click();
					}
				}



			});

			Mousetrap.bind('ctrl+up', function(){
				if( ! $('.next').is(":visible") ){
					self.eventOrderLine('up');
				} else {
					self.eventPayment('up');
				}

			});

			Mousetrap.bind('ctrl+down', function(){
				if( ! $('.next').is(":visible") ){
					self.eventOrderLine('down');
				} else {
					self.eventPayment('down');
				}

			});

			Mousetrap.bind('right', function(){
				if( ! $('.next').is(":visible") ){

				} else {
					var payment_selected = $('.payment_selected');
					if( payment_selected.length > 0 ){
						payment_selected.click();
						$('.paymentmethod').removeClass('payment_selected');
					}
				}

			});



			/*Mousetrap.bind('tab', function(){
				console.log('Entraaa');
				$('.breadcrumb-button').click();

			});*/

			Mousetrap.bind('shift+down', function(){
				if( ! $('.next').is(":visible") ){
					self.eventProduct('down');
				}

			});

			Mousetrap.bind('shift+up', function(){
				if( ! $('.next').is(":visible") ){
					self.eventProduct('up');
				}

			});

			Mousetrap.bind('shift+right', function(){
				if( ! $('.next').is(":visible") ){
					self.eventProduct('right');
				}

			});

			Mousetrap.bind('shift+left', function(){
				if( ! $('.next').is(":visible") ){
					self.eventProduct('left');
				}

			});

			setTimeout(function(){

				var s = [];
				$('div[class="numpad"] > button.number-char').each(function(){
					var num = $(this).html();
					var obj = $(this);

					if( s.indexOf( num ) == -1 ){
						s.push( num );

						Mousetrap.bind(num, function(){
							if( ! $('.next').is(":visible") ){
								obj.click();
							}

						});
					}



				});


			}, 3000);




	    }

	});




 });