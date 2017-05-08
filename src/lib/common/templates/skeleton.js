const gcs = require('./GetCollectionSkeleton');
const gos = require('./GetOneSkeleton');
const pcs = require('./PostCollectionSkeleton');
const pos = require('./PostOneSkeleton');
const putcs = require('./PutCollectionSkeleton');
const putos = require('./PutOneSkeleton');
const dcs = require('./DeleteCollectionSkeleton');
const dos = require('./DeleteOneSkeleton');

const skeletons = {
  getCollection: gcs,
  getOne: gos,
  postCollection: pcs,
  postOne: pos,
  putCollection: putcs,
  putOne: putos,
  deleteCollection: dcs,
  deleteOne: dos,
};

exports.getTest = ({ baseURL, method = 'get', endpointPath, isAuthenticated = false, username = 'test_user', userpasswd = 'test_passw0rd', isError = false, statusCode = 200, description = 'WRITE YOUR TEST CASE DESCRIPTION HERE' }) => {
  let resourceName = endpointPath.split('/').join('-');
  if (resourceName.endsWith('-')) resourceName = resourceName.slice(0, resourceName.length - 1);
  const skeletonName = (resourceName.match(/{.+}/) !== null) ? `${method.toLowerCase()}One` : `${method.toLowerCase()}Collection`;
  return {
    name: `test-${method.toUpperCase()}${resourceName}`,
    skeleton: skeletons[skeletonName].getTest({
      baseURL,
      method,
      endpointPath,
      isAuthenticated,
      username,
      userpasswd,
      isError,
      statusCode,
      description,
    }),
  };
};

