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
	    	$('div.product-list > .product').each(function(){
	    		if( type == 'right' ){

	    			$(this).css({
	    				'background' : '#cccccc'
	    			})
	    		}
	    	});
	    },
	    addEvents : function(){
	    	var self = this;

	    	$(document).bind('keydown', 'c', function(){
				$('.mode-button[data-mode="quantity"]').click();
			});

			$(document).bind('keydown', 'd', function(){
				$('.mode-button[data-mode="discount"]').click();
			});

			$(document).bind('keydown', 'p', function(){
				$('.mode-button[data-mode="price"]').click();
			});

			$(document).bind('keydown', 'backspace', function(){
				$('.numpad-backspace')[0].click();
			});
			
			$(document).bind('keydown', 'Ctrl+b', function(){
				$('.search-clear').click();
			});

			$(document).bind('keydown', 'Ctrl+c', function(){
				$('.set-customer').click();
			});

			$(document).bind('keydown', 'Ctrl+return', function(){
				$('.pay').click();
			});

			$(document).bind('keydown', 'Ctrl+up', function(){
				self.eventOrderLine('up');
			});

			$(document).bind('keydown', 'Ctrl+down', function(){
				self.eventOrderLine('down');
			});

			$(document).bind('keydown', 'tab', function(){
				$('.breadcrumb-button').click();
				
			});

			$(document).bind('keydown', 'right', function(){
				self.eventProduct('right');
			});

			$(document).bind('keydown', 'left', function(){
				self.eventProduct('left');
			});

			setTimeout(function(){

				var s = [];
				$('div[class="numpad"] > button.number-char').each(function(){
					var num = $(this).html();
					var obj = $(this);

					if( s.indexOf( num ) == -1 ){
						s.push( num );

						$(document).bind('keydown', num, function(){
							obj.click();
						});	
					}

					
					
				});	


			}, 3000);
			
	    }

	});



   
 });
