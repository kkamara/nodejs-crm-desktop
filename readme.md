<img src="https://github.com/kkamara/useful/blob/main/nodejs-crm-desktop3.png?raw=true" alt="nodejs-crm-desktop3.png" />

<img src="https://github.com/kkamara/useful/blob/main/nodejs-crm-desktop.png?raw=true" alt="nodejs-crm-desktop.png" />

# nodejs-crm-desktop

(04-Jul-2023) Electronjs.

## Download

* [macOs](https://github.com/kkamara/nodejs-crm-desktop/releases).

## Code snippet

```js
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
```

## Installation

* [Node.js](https://nodejs.org/en/) (arrives with [npmjs](https://www.npmjs.com/))
* [Yarn](https://yarnpkg.com/)

```bash
  npm i -g yarn
  yarn install # and yarn
```

## Usage

```bash
  yarn start
```

###### To refresh build on project file save.

```bash
  yarn dev
```

## Building target: your machine

```bash
  yarn build
```

## Building target: cross-platform

```bash
  # --linux --win --mac --x64 --ia32
  yarn run release
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[BSD](https://opensource.org/licenses/BSD-3-Clause)
