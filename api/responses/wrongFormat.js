/**
 * 400 (Bad Request) Handler
 *
 * Usage:
 * return res.badRequest();
 * return res.badRequest(data);
 * return res.badRequest(data, 'some/specific/badRequest/view');
 *
 * e.g.:
 * ```
 * return res.badRequest(
 *   'Please choose a valid `password` (6-12 characters)',
 *   'trial/signup'
 * );
 * ```
 */

module.exports = function wrongFormat(data, options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  
  return res.json({'status':100,'message':data});


};

