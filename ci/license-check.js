const fs = require('fs');
const checker = require('license-checker');

const config = JSON.parse(fs.readFileSync(`${__dirname}/../license-check.json`, 'utf8'));
const allowed = new Set(config.allowed || []);
const exceptions = config.exceptions || {};

const comparePossibleArrays = function(a, b) {
  return Array.isArray(a) && Array.isArray(b)
    && a.length === b.length
    && a.every((v, i) => v === b[i]);
};

const isAllowed = function(license) {
  if(license.licenses)

  return allowed.has(license.licenses)
    || exceptions[license.name] === license.licenses
    || comparePossibleArrays(exceptions[license.name], license.licenses);
};

checker.init({
  start: '.'
}, function(err, output) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  const unaccounted = [];
  const licenseNames = Object.keys(output);
  licenseNames.forEach(name => {
    const license = output[name];
    license.name = name;

    if(!isAllowed(license)) {
      unaccounted.push(license);
    }
  });

  if(unaccounted.length !== 0) {
    console.error(`Error: the following licenses are unaccounted for. Update 'license-checker.json' or remove the offending dependencies. ${JSON.stringify(unaccounted, null, 2)}.`);
    process.exit(unaccounted.length);
  }

  process.exit(0);
});
