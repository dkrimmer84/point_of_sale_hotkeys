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

	    	$(document).bind('keydown', 'c', function(){
	    		if( ! $('.next').is(":visible") ){
	    			$('.mode-button[data-mode="quantity"]').click();
	    		}
				
			});

			$(document).bind('keydown', 'd', function(){
				if( ! $('.next').is(":visible") ){
					$('.mode-button[data-mode="discount"]').click();
				}
			});

			$(document).bind('keydown', 'p', function(){
				if( ! $('.next').is(":visible") ){
					$('.mode-button[data-mode="price"]').click();
				}
				
			});

			$(document).bind('keydown', 'backspace', function(){
				if( ! $('.next').is(":visible") ){
					$('.numpad-backspace')[0].click();	
				}
				
			});
			
			$(document).bind('keydown', 'Ctrl+b', function(){
				if( ! $('.next').is(":visible") ){
					$('.search-clear').click();	

					$('.searchbox > input').bind('keydown', 'tab', function(){
						console.log('Entraaaaaa');
						//$(this).blur();
						//$('.select-order.selected').click();
						$('.fa-home').click();						
					});
				}
			});

			$(document).bind('keydown', 'Ctrl+c', function(){
				if( ! $('.next').is(":visible") ){
					$('.set-customer').click();
				}
				
			});

			$(document).bind('keydown', 'Ctrl+return', function(){
				if( ! $('.next').is(":visible") ){
					$('.pay').click();
				}
			});

			$(document).bind('keydown', 'return', function(){
				if( ! $('.next').is(":visible") ){
					var product_selected = $('.product').hasClass('product_selected');

					if( product_selected ){
						$('.product.product_selected').click();
						$('.product').removeClass('product_selected');
					}
				}
				

				
			});

			$(document).bind('keydown', 'Ctrl+up', function(){
				if( ! $('.next').is(":visible") ){
					self.eventOrderLine('up');
				}
				
			});

			$(document).bind('keydown', 'Ctrl+down', function(){
				if( ! $('.next').is(":visible") ){
					self.eventOrderLine('down');
				}
				
			});

			/*$(document).bind('keydown', 'tab', function(){
				console.log('Entraaa');
				$('.breadcrumb-button').click();
				
			});*/

			$(document).bind('keydown', 'Shift+down', function(){
				if( ! $('.next').is(":visible") ){
					self.eventProduct('down');
				}
				
			});

			$(document).bind('keydown', 'Shift+up', function(){
				if( ! $('.next').is(":visible") ){
					self.eventProduct('up');
				}
				
			});

			$(document).bind('keydown', 'Shift+right', function(){
				if( ! $('.next').is(":visible") ){
					self.eventProduct('right');
				}
				
			});

			$(document).bind('keydown', 'Shift+left', function(){
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

						$(document).bind('keydown', num, function(){
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
