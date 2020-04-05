'use strict';

/**
 * Module dependencies
 */
var formsPolicy = require('../policies/forms.server.policy'),
  forms = require('../controllers/forms.server.controller');

module.exports = function(app) {
  // Forms Routes
  app.route('/api/forms') //.all(formsPolicy.isAllowed)
    .get(forms.list)
    .post(forms.create);

  app.route('/api/forms/:formId').all(formsPolicy.isAllowed)
    .get(forms.read)
    .put(forms.update)
    .delete(forms.delete);

  // app.route('/api/forms/pdf/:formId').all(formsPolicy.isAllowed).get(forms.getPdf);

  app.use('/api/forms/pdf/:id', forms.getPdf);


  // Finish by binding the Form middleware
  app.param('formId', forms.formByID);
};
