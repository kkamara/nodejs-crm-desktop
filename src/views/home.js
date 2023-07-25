/** @var {null|string} */
let apiDomain = null;

/* @returns {object} */
const getHome = async () => {
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
  const token = localStorage.getItem('token');
  if (null === token) {
    return window.api.send('showLogin');
  }

  const homeRes = await axios.post(
    `${apiDomain}/api/v1/auth/authenticate`,
    null,
    {
      headers: {
        Authorization: `Basic ${token}`,
      },
    },
  )
    .then(data => data.data)
    .catch(err => {
      if (err) {
        throw err;
      }
    });
  return homeRes;
};

const run = async () => {
  let res = null;
  try {
    const handleFlashes = () => {
      if (res.data.user.auth.flashSuccess) {
        document.querySelector('.flash-success')
          .classList
          .remove('hide');
      }
      if (res.data.user.auth.flashDanger) {
        document.querySelector('.flash-danger')
          .classList
          .remove('hide');
      }
    };
    
    res = await getHome();
    
    console.log(res);
    document
      .querySelector('.page-header')
      .textContent = res.data.user.page.title;

    handleFlashes();
    
    const lastLoggedIn = moment(res.data.user.auth.lastLogin).fromNow();
    document
      .querySelector('.last-login')
      .textContent = 
        `Last logged in as ${res.data.user.auth.name} ${lastLoggedIn}`;

    renderNavbar(res.data.user.auth);
  } catch (err) {
    alert(err.message+' Please quit and reopen the app.');
  }
};

run();