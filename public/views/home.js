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
            'The server seems to be down right now. Please try again and contact the support team. '+
            'Please quit the app.'
          );
          reject(err);
        }
        resolve();
      });
    });
  } catch (err) {
    throw err;
  }
  const homeRes = await axios.get(`${apiDomain}/api/v1`)
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
    res = await getHome();
    console.log(res);
    document
      .querySelector('.page-header')
      .textContent = res.data.routeName;
    document
      .querySelector('.last-login')
      .textContent = 
        `Last logged in as ${res.data.user.auth.name} ${res.data.user.auth.lastLogin}`;

    renderNavbar(res.data.user.auth);
  } catch (err) {
    alert(err.message);
  }
};

run();