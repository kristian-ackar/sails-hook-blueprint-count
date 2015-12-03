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
            var controller = sails.middleware.controllers[model.identity];

            if (!controller) return;

            var baseRoute = [config.prefix, model.identity].join('/');

            if (config.pluralize && _.get(controller, '_config.pluralize', true)) {
              baseRoute = pluralize(baseRoute);
            }

            var route = baseRoute + '/count';

            sails.router.bind(route, countFn, null, {controller: model.identity});
          });
        });

        cb();
      }
  }
};

