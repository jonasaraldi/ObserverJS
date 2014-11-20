
var Observable = (function(){
	'use strict';

	var subscribers = [];
	var options = {	
		method: 'update'
	};

	function _isObject(value) {
		return typeof value === 'object';
	}

	function _isFunction(value) {
		return typeof value === 'function';
	}

	function _extend(model,parent) {
		for(var prop in parent) {
			if (parent.hasOwnProperty(prop)) {
				model[prop] = parent[prop];
			}
		}
	}
	
	function _notify(publication) {
		if(!publication) 
			return;

		for (var i = subscribers.length - 1; i >= 0; i-=1) {
			subscribers[i][options.method](publication);
		};
	}

	function _subscribe(subscriber) {
		if(!_isObject(subscriber))
			return;

		if(!_isFunction(subscriber[options.method]))
			throw new Error('The method '+options.method+' was not implemented.');
		
		subscribers.push(subscriber);
	}

	function _unsubscribe(subscriber) {
		var index = subscribers.indexOf(subscriber);

		if(index !== -1)
			subscribers.shift(index,1);
	}

	function _getSubscribers() {
		return subscribers;
	}

	return function () {
		var args = Array.prototype.slice.call(arguments),
				model = args[0],
				opts = args[args.length-1];
		
		subscribers = [];

		switch(args.length){
			case 2:
				if(!_isObject(opts)) return;
			case 1:
				if(_isFunction(model)) model = new model();
				if(!_isObject(model)) return;
				break;
		}
		
		_extend(model,{
			notify: _notify,
			subscribe: _subscribe,
			unsubscribe: _unsubscribe,
			getSubscribers: _getSubscribers
		});
		
		_extend(options,opts);

		return model;
	}

})();


