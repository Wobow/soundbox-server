import process from 'process';

const dev_config = {
	"port": 8080,
	"bodyLimit": "100kb",
  "corsHeaders": ["Link"],
  "mongoDB": "mongodb://localhost/dev_morbak",
  "secret": "laturlute"
};

const prod_config = {
	"port": 8081,
	"bodyLimit": "100kb",
  "corsHeaders": ["Link"],
  "mongoDB": "mongodb://localhost/prod_morbak",
  "secret": "laturlute"
};

const test_config = {
	"port": 1337,
	"bodyLimit": "100kb",
  "corsHeaders": ["Link"],
  "mongoDB": "mongodb://localhost/test_morbak",
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