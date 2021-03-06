basePath = '../';

files = [
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  'test/e2e/**/*.js'
];

autoWatch = true;

browsers = ['PhantomJS'];

// singleRun = true;

urlRoot = '/__testacular/'; // Stop Testacular server serving it's own page rather than proxing the request.

proxies = {
  '/': 'http://localhost:3001/'
};

junitReporter = {
  outputFile:
      'test_out/e2e.xml',
  suite: 'e2e'
};
