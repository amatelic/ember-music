function userDosentExist() {
  return {
    error: 'User dosen\'t exist.',
    status: 404,
  };
}

function userExist() {
  return {
    error: 'User already exists.',
    status: 404,
  };
}

function normal(obj) {
  let res = {status: 200};
  Object.assign(res, obj);
  return res;
}

module.exports = {
  exist: userExist,
  dontExist: userDosentExist,
  normal,
};
