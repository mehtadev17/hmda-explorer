// Scope
// -----

// To avoid global scope pollution, declare all variables and functions inside a
// PDP object, first checking if the object already exists.

var PDP = PDP || (function(){

  'use strict';

  var gary = new EventEmitter(),
      app = {},
      query = {},
      form = {},
      preview = {};

  // The App Object
  // ----------------
  // The `app` object stores general app properties and methods.

  // Cache a reference to the app's jQuery object.

  app.$el = $('body');

  // The `start` method is called when we're ready for the app to start chooglin'.

  app.start = function() {

    console.log('App started!');

  };

  // The `startLoading` method adds a class to the app's element so we can
  // visualize the loading of content.

  app.startLoading = function() {

    this.$el.addClass('loading');

  };

  // The `stopLoading` method removes the app's loading class.

  app.stopLoading = function() {

    this.$el.removeClass('loading');

  };

  // The `redirect` method redirects the browser to a new URL.
  // It is used to send the user to the Qu URL with their results.

  app.redirect = function() {
    console.log('The user has been redirected!');
  };

  // The Query Object
  // ----------------
  // The `query` object is used to cache filter values and store methods 
  // that manipulate filter values. 

  // Set a default format for the data download.

  query.format = 'json';

  // `query`'s `params` stores filter values.

  query.params = {};

  // The `reset` method resets the params object to some defaults.

  query.reset = function() {
    this.params = {
      as_of_year: [2012]
    };
  };

  // The `updateAll` method runs through all the filter field values the user has selected
  // and stores them in the `params` object.

  query.updateAll = function() {

    var $fields = app.$el.find('.param'),
        url;

    // Broadcast that an update is beginning.

    gary.emitEvent('update:started');

    // Clear out current params

    this.reset();

    // Iterate over all the filter field values

    $fields.each(function(){

      var $this = $( this ),
          field = form.getField( $this );

      // If the field has a value AND it's either a `select` element or it's checked
      // (meaning it's a radio or checkbox)

      if ( field.value && ( field.tagName === 'select' || $this.is(':checked') ) ) {

        // Initalize an empty array if need be
        console.log(query.params[ field.name ]);

        if ( typeof query.params[ field.name ] === 'undefined' ) {
          query.params[ field.name ] = [];
        }

        query.params[ field.name ].push( field.value );

      }

    });

    url = this.getUrl();

    gary.emitEvent('update:stopped');

    console.log(url);

  };

  // The `getUrl` method builds and returns a Qu URL from `query`'s `params`.

  query.getUrl = function() {

    var url,
        params = [];

    // Set a base url to append params to

    url = 'http://qu.demo.cfpb.gov/data/hmda/hmda_lar';

    // Convert each param to a proper [`$where` clause](http://cfpb.github.io/qu/articles/queries.html#where_in_detail).

    function buildParam( val, key ) {
      if ( val.length > 0 ) {
        params.push( key + '=' + val );
      }
    }

    _.forEach( query.params, buildParam );

    // Join params with `AND` operators

    url += '?$where=' + params.join(' AND ');

    return url;

  };

  // The `fetch` method requests and returns JSON from Qu matching the
  // user's filter and grouping clauses

  query.fetch = function() {

  };

  // The Form Object
  // ----------------
  // The `form` object stores stuff specific to the DOM form.

  // Cache a reference to the form's jQuery object.

  form.$el = $('form');

  // Cache a reference to all the filter fields.

  form.$fields = form.$el.find('.field');

  // The 'getField' method returns a field's name and value when given
  // a jQuery object wrapping the field's HTML element.

  form.getField = function( $el ) {

    var tagName = $el.prop('tagName').toLowerCase(),
        type = $el.attr('type'),
        name = $el.attr('name') || 'untitled',
        value = $el.val(),
        field = {};

    // If the element has no tag name or type, or it has no `value`, abort.
    // It's either not selected or broken.

    if ( !( tagName || type ) || !value ) {
      return false;
    }

    // If it's a radio or checkbox element, abort if it's not selected. Otherwise,
    // remove the empty array from the value name (which really only applies to checkboxes).

    if ( type === 'radio' || type === 'checkbox' ) {
      if ( !$el.is(':checked') ) {
        return false;
      } else {
        name = name.replace( '[]', '' );
      }
    }

    // Build and return the field's deets.

    field = {
      name: name,
      tagName: tagName,
      type: type,
      value: value
    };

    return field;

  };

  // Check if any filter fields need to be shown or hidden.

  form.checkDeps = function() {



  };

  // The Preview Table
  // ----------------

  // Cache a reference to the preview table's jQuery object.

  preview.$el = $('#preview-table');

  // The Observer
  // ----------------
  // The [observer pattern](http://en.wikipedia.org/wiki/Observer_pattern) 
  // is used to decouple DOM elements from events. The [EventEmitter](https://github.com/Wolfy87/EventEmitter)
  // library is used.

  // Listen for specific events and act accordingly.

  gary.addListeners({
    'dom:loaded': app.start.bind( app ),
    'filter:changed': [
      query.updateAll.bind( query ),
      form.checkDeps.bind( form )
    ],
    'update:started': app.startLoading.bind( app ),
    'update:stopped': app.stopLoading.bind( app ),
    'download': app.redirect.bind( app )

  });

  // DOM Interactions
  // ----------------
  // jQuery is used to attach event handlers to DOM elements.

  // Whenever a `select` element is changed, emit an event.

  $('select, input').on( 'change', function(){
    gary.emitEvent('filter:changed');
  });

  // Export the public API.

  return {
    query: query,
    observer: gary
  };

}());

// When the DOM is Ready
// ----------------

$(function() {

  'use strict';

  PDP.observer.emitEvent('dom:loaded');

});