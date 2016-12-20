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

					$(document).bind('keydown', 'c', function(){
						$('.mode-button[data-mode="quantity"]').click();
					});



				});
			})
	    }

	});



   
 });
