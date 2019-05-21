/**
 * Adds support for count blueprint and binds :model/count route for each RESTful model.
 */

var _ = require('lodash');
var actionUtil = require('./actionUtil');
var pluralize = require('pluralize');

const defaultCountBlueprint = function(req, res) {
  var Model = actionUtil.parseModel(req);

  var countQuery = Model.count(actionUtil.parseCriteria(req));

  countQuery
    .then(function(count) {
      return res.ok({count : count})
    });
};

module.exports = function (sails) {
  return {
      initialize: function(cb) {
        var config = sails.config.blueprints;
        var countFn = _.get(sails.middleware, 'blueprints.count') || defaultCountBlueprint;

        sails.on('router:before', function() {
          _.forEach(sails.models, function(model) {
            // Validate blueprint config for this controller
            if ( config.prefix ) {
              if ( !_(config.prefix).isString() ) {
                return;
              }
              if ( !config.prefix.match(/^\//) ) {
                config.prefix = '/' + config.prefix;
              }
            }

            // Validate REST route blueprint config for this controller
	          if ( config.restPrefix ) {
              if ( !_(config.restPrefix).isString() ) {
                return;
              }
              if ( !config.restPrefix.match(/^\//) ) {
                config.restPrefix = '/' + config.restPrefix;
              }
            }

            // Sets the prefix that will be used in count blueprint
	          var prefix = config.prefix + config.restPrefix;
            
            // Sets base route for this model
            var baseRoute = [prefix, model.identity].join('/');

            // Pluralize model if needed
            if (config.pluralize) {
              baseRoute = pluralize(baseRoute);
            }

            // Sets the final route
            var route = baseRoute + '/count';

            // Binds the route to the counting function
            sails.router.bind(route, countFn, null, {controller: model.identity});
          });
        });

        cb();
      }
  }
};

