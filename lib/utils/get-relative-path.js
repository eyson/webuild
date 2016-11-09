/**
 * get relative path relative to root param or process dirname;
 * 
 */

const path = require('path');

const getRelativePath = (currentPath, root) => currentPath.replace(root || process.cwd(), '');

module.exports = getRelativePath;
