import APIError from "./error";

export default {
  checkBody: (body, bodyParams) => {
    bodyParams.forEach(key => {
      if (!body[key] || !body[key].length) {
        throw new APIError(`Field '${key}' is missing.`, null, 400);
      }
    });
  },

  safeUser: (source) => {
    const out = JSON.parse(JSON.stringify(source));
    delete out.hash;
    delete out.salt;
    return out;
  },

  isConnectedUserPermissionHandler: (req, res, next) => {
    if (req.user._id == req.params.id) return next();
    return next(new APIError('Forbidden', 'You cannot perform this action on this resource as it is not yours', 403));
  },
};
