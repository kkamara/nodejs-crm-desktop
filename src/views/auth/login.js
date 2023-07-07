/** @var {null|string} */
let apiDomain = null;

/* @returns {object} */
const getLogin = async () => {
  let loginRes = null;
  try {
    await new Promise((resolve, reject) => {
      window.api.send('getApiDomain');
      window.api.receive('getApiDomainData', function (domain) {
        apiDomain = domain;
        if (null === domain) {
          const err = Error(
            'The server seems to be down right now. Please try again and contact the support team. '
          );
          reject(err);
        }
        resolve();
      });
    });
  } catch (err) {
    throw err;
  }
  try {
    await new Promise((resolve, reject) => {
      window.api.send('getLogin');
      window.api.receive('getLoginData', function (domain) {
        loginRes = domain;
        if (null === domain) {
          const err = Error(
            'The server seems to be down right now. Please try again and contact the support team. '
          );
          reject(err);
        }
        resolve();
      });
    });
  } catch (err) {
    throw err;
  }
  return loginRes;
};

const run = async () => {
  let res = null;
  try {
    /** @param event */
    const handleSubmit = (event) => {};
    
    res = await getLogin();    
    console.log(res);
    
    document
      .querySelector('.page-header')
      .textContent = res.data.user.page.title;

    renderNavbar(res.data.user.auth);

    const loginForm = document.querySelector('.login-form');

    document.querySelector('.creds-container')
      .innerHTML = `
        <p style='color:#000'>Creds</p>
        <ul>
          ${res.data.user.page.loginEmails.map((email, key) => '<li>'+email+'</li>').join('')}
        </ul>
      `;
    
    const handleErrors = page => {
        document.querySelector('.errors-container')
          .innerHTML = `
            <li class="list-group-item-danger">${page.error}</li>
          `;

        document.querySelector('.errors-container')
          .classList
          .remove('hide');
    };
  } catch (err) {
    alert(err.message+' Please quit the app.');
  }
};

run();