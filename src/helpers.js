import APIError from "./error";
import User from './models/users';
import mongoose from "mongoose";

export const wrapInPromise = (value) => {
  return new Promise((resolve) => resolve(value));
};

export default {
  wrapInPromise: wrapInPromise,
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

};
