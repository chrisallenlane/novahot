module.exports = function(response) {

  // assert that response is an object
  if (typeof response !== 'object') {
    return false;
  }

  // assert that response has the appropriate number of keys
  if (Object.keys(response).length !== 3) {
    return false;
  }

  // assert that response has the appropriate properties
  if (!response.cwd || typeof response.cwd !== 'string') {
    return false;
  }
  
  if (!response.stdout || !Array.isArray(response.stdout)) {
    return false;
  }

  if (!response.stderr || !Array.isArray(response.stderr)) {
    return false;
  }

  return true;
};
