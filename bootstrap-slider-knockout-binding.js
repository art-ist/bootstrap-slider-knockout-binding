ko.bindingHandlers.sliderValue = {
	init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
		//get Name as slider-plugin falls back to alternative name, if there is already a slider-plugin registered (e.g. jQueryUI)
		var widgetName = $(element).bootstrapSlider ? 'bootstrapSlider' : 'slider';

		var params = valueAccessor();

		// Check whether the value observable is either placed directly or in the paramaters object.
		if (!(ko.isObservable(params) || params['value']))
			throw "You need to define an observable value for the sliderValue. Either pass the observable directly or as the 'value' field in the parameters.";

		// Identify the value and initialize the slider
		var valueObservable;
		if (ko.isObservable(params)) {
			valueObservable = params;
			$(element)[widgetName]({value: ko.unwrap(params)});
		}
		else {
			valueObservable = params['value'];
			if (!Array.isArray(valueObservable)) {
				// Replace the 'value' field in the options object with the actual value
				params['value'] = ko.unwrap(valueObservable);
				$(element)[widgetName](params);
			} 
			else {
				valueObservable = [params['value'][0], params['value'][1]];
				params['value'][0] = ko.unwrap(valueObservable[0]);
				params['value'][1] = ko.unwrap(valueObservable[1]);
				$(element)[widgetName](params);
			}
		}

		// Make sure we update the observable when changing the slider value
		$(element).on('slide', function (ev) {
			if (!Array.isArray(valueObservable)) {
				valueObservable(ev.value);
			} 
			else {
				valueObservable[0](ev.value[0]);
				valueObservable[1](ev.value[1]);
			}
		});
		
		// Clean up
		ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
			$(element)[widgetName]('destroy');
			$(element).off('slide');
		});

	},
	update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
		//get Name as slider-plugin falls back to alternative name, if there is already a slider-plugin registered (e.g. jQueryUI)
		var widgetName = $(element).bootstrapSlider ? 'bootstrapSlider' : 'slider';

		var modelValue = valueAccessor();
		var valueObservable;
		if (ko.isObservable(modelValue))
			valueObservable = modelValue;
		else 
			valueObservable = modelValue['value'];

		if (!Array.isArray(valueObservable)) {
			$(element)[widgetName]('setValue', parseFloat(valueObservable()));
		} 
		else {
			$(element)[widgetName]('setValue', [parseFloat(valueObservable[0]()),parseFloat(valueObservable[1]())]);
		}
	}
};
