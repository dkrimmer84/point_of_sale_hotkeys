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
	    addEvents : function(){
	    	var self = this;
	    	console.log('entra');

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
			


			$(document).bind('keydown', 'Ctrl+c', function(){
				$('.set-customer').click();
			});

			$(document).bind('keydown', 'Ctrl+return', function(){
				$('.pay').click();
			});

			$(document).bind('keydown', 'up', function(){
				self.eventOrderLine('up');
			});

			$(document).bind('keydown', 'down', function(){
				self.eventOrderLine('down');
			});

			setTimeout(function(){

				var s = [];
				$('div[class="numpad"] > button.number-char').each(function(){
					var num = $(this).html();
					var obj = $(this);

					if( s.indexOf( num ) == -1 ){
						s.push( num );

						console.log('evento para ', num);
						$(document).bind('keydown', num, function(){
							obj.click();
						});	
					}

					
					
				});	


			}, 3000);
			
	    }

	});



   
 });
