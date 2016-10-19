// export a constructor that returns mocked request objects
module.exports = function(params) {

  // params are optional
  params = params || {};

  // initialize a req object
  const req = {
    
    post: function(reqparams, callback) {
      callback(null, { statusCode: params.statusCode || 200 }, reqparams);
    },

    defaults: function(reqparams) {
      return reqparams;
    },

  };

  // return the req object
  return req;
};
