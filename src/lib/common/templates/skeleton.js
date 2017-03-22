const skeletons = {
    getCollection: require('./GetCollectionSkeleton'),
    getOne: require('./GetOneSkeleton'),
    postCollection: require('./PostCollectionSkeleton'),
    postOne: require('./PostOneSkeleton'),
    putCollection: require('./PutCollectionSkeleton'),
    putOne: require('./PutOneSkeleton'),
    deleteCollection: require('./DeleteCollectionSkeleton'),
    deleteOne: require('./DeleteOneSkeleton')
};
exports.getTest = ( {baseURL, method='get', endpointPath, isAuthenticated=false, username = 'test_user', userpasswd = 'test_passw0rd', isError=false, statusCode=200, description='WRITE YOUR TEST CASE DESCRIPTION HERE'} ) => {
    let resourceName = endpointPath.split('/').join('-'); 
    if(resourceName.endsWith('-')) resourceName = resourceName.slice(0, resourceName.length-1);
    const skeletonName = (resourceName.match(/{.+}/) !== null) ? `${method.toLowerCase()}One` : `${method.toLowerCase()}Collection`;
    return {
        name: `test-${method.toUpperCase()}${resourceName}`, 
        skeleton: skeletons[skeletonName].getTest({baseURL, method, endpointPath, isAuthenticated, username, userpasswd, isError, statusCode, description})
    };
}

