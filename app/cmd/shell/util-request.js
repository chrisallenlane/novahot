module.exports = function(config, request, state) {

  // decorate a request object
  const req = request.defaults({
    url     : config.target.uri,
    json    : true,
    headers : config.target.headers || {},
    body : {
      auth : config.target.password,
      cwd  : state.cwd,
    },
  });

  // return the decorated object
  return req;
};
