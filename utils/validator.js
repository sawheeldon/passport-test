/**
 * return validated response (Obj)
 * {
 *    status: Number
 *    json: Object
 * }
 */
module.exports = function validator(model, req){
  switch (model) {
    case 'User':
      if (!req.body) {
        return {
          error: true,
          status: 400,
          json: { message: 'No request body ' }
        };
      }

      if (!('username' in req.body)) {
        return {
          error: true,
          status: 422,
          json: { message: 'Missing field: username' }
        };
      }

      var username = req.body.username;

      if (typeof username !== 'string') {
        return {
          error: true,
          status: 422,
          json: { message: 'Incorrect field type: username' }
        };
      }

      username = username.trim();

      if (username === '') {
        return {
          error: true,
          status: 422,
          json: { message: 'Incorrect field length: username' }
        };
      }

      if (!('password' in req.body)) {
        return {
          error: true,
          status: 422,
          json: { message: 'Missing field: password' }
        };
      }

      var password = req.body.password;

      if (typeof password !== 'string') {
        return {
          error: true,
          status: 422,
          json: { message: 'Incorrect field type: password' }
        };
      }

      password = password.trim();

      if (password === '') {
        return {
          error: true,
          status: 422,
          json: { message: 'Incorrect field length: password' }
        };
      }
      // ********************
      // end user validators
      // =====================


      return { 
        error: false,
        username: username,
        password: password
      };

    default:
      return { status: null, json: {} };
  }
}