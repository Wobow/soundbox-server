import process from 'process';

const dev_config = {
	"port": 4242,
	"bodyLimit": "100kb",
  "corsHeaders": ["Link"],
  "mongoDB": "mongodb://localhost/dev_sbox",
  "secret": "laturlute"
};

const prod_config = {
	"port": 4242,
	"bodyLimit": "100kb",
  "corsHeaders": ["Link"],
  "mongoDB": "mongodb://localhost/prod_sbox",
  "secret": "laturlute"
};

const test_config = {
	"port": 4242,
	"bodyLimit": "100kb",
  "corsHeaders": ["Link"],
  "mongoDB": "mongodb://localhost/test_sbox",
  "secret": "laturlute"
};

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'dev';
}

let config = eval(`${process.env.NODE_ENV}_config`);

if (!config) {
  config = dev_config;
}

export default config;