/**
 * @param {object} auth - The authenticated user's auth details.
 * @returns {void}
 */
const renderNavbar = (auth) => {
  if (!auth || !auth.permissions) {
    return;
  }
  if (auth.permissions.includes('view client')) {
    document.querySelector('.client-options')
      .classList
      .remove('hide');
  }
  if (auth.permissions.includes('create client')) {
    document.querySelector('.create-client')
      .classList
      .remove('hide');
  }
  if (auth.permissions.includes('view user')) {
    document.querySelector('.user-options')
      .classList
      .remove('hide');
  }
  if (auth.permissions.includes('create user')) {
    document.querySelector('.create-user')
      .classList
      .remove('hide');
  }
  if (auth.permissions.includes('view log')) {
    document.querySelector('.log-options')
      .classList
      .remove('hide');
  }
  if (auth.permissions.includes('create log')) {
    document.querySelector('.create-log')
      .classList
      .remove('hide');
  }
};