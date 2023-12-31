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
    const res = await axios.get(`${apiDomain}/api/v1/auth`);
    loginRes = res.data;
  } catch (err) {
    throw err;
  }
  return loginRes;
};

const run = async () => {
  const token = localStorage.getItem('token');
  if (null !== token) {
    return window.api.send('showHomepage');
  }
  let res = null;
  try {
    /** @param event */
    const handleSubmit = async (event) => {
      console.log(1);
      event.preventDefault();
      const email = event.target.elements.email.value;
      const password = event.target.elements.password.value;
      let res;
      try {
        res = await axios.post(
          `${apiDomain}/api/v1/auth`,
          { email, password, },
        );
        const loginRes = res.data;
        localStorage.setItem(
          'token',
          loginRes.data.data.auth.token,
        );
        window.api.send('showHomepage');      
      } catch (err) {
        throw err;
      }
    };
    
    res = await getLogin();    
    console.log(res);
    
    document
      .querySelector('.page-header')
      .textContent = res.data.user.page.title;

    renderNavbar(res.data.user.auth);

    document.querySelector('.loginForm')
      .addEventListener('submit', handleSubmit);
    
    document.querySelector('.creds-container')
      .innerHTML = `
        <p style='color:#000'>Creds</p>
        <ul>
          ${res.data.user.page.loginEmails.map((email, key) => '<li>'+email+'</li>').join('')}
        </ul>
      `;
    
    const handleErrors = error => {
        document.querySelector('.errors-container')
          .innerHTML = `
            <li class="list-group-item-danger">${error}</li>
          `;

        document.querySelector('.errors-container')
          .classList
          .remove('hide');
    };
  } catch (err) {
    console.log(err.message);
    alert(err.message+' Please quit and reopen the app.');
  }
};

run();