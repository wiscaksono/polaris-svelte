import http from 'k6/http';
import { check, sleep, group } from 'k6';

// Define the base URL for the API. 
// You can override this with an environment variable when you run the test.
// For example, if your Bun server runs on a different port:
// k6 run -e API_BASE_URL='http://localhost:3001' benchmark.js
const API_BASE_URL = __ENV.API_BASE_URL || 'http://localhost:3000';

// This is a much more intensive stress test configuration.
export const options = {
  stages: [
    // A gradual ramp-up to start
    { duration: '20s', target: 50 },
    // Ramp up to the peak load of 250 users
    { duration: '40s', target: 250 },
    // Stay at 250 users for 1 minute to test performance at peak load
    { duration: '1m', target: 250 },
    // Ramp down to 0
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    // 95% of requests should finish in under 8 seconds.
    // This is a higher threshold to account for the extreme load.
    http_req_duration: ['p(95)<8000'],
    // We still expect the service to be highly reliable.
    'checks{scenario:screenshot_api}': ['rate>0.99'],
  },
};

// This is the main function that each virtual user will run in a loop.
export default function () {
  const endpoint = '/api/screenshot';
  const url = `${API_BASE_URL}${endpoint}`;

  const payload = JSON.stringify({
    url: 'https://wiscaksono.com',
    selector: 'main',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    // Set a timeout for the request to avoid hangs
    timeout: '60s',
  };

  // We'll group the request under a name for clearer results.
  group('Screenshot API Endpoint', function () {
    const res = http.post(url, payload, params);

    // Here we check if the request was successful.
    check(res, {
      'is status 200': (r) => r.status === 200,
      'response time is < 15s': (r) => r.timings.duration < 15000,
    },
      // Tagging the check allows us to create specific thresholds for it.
      { scenario: 'screenshot_api' });
  });

  // Add a 1-second pause between requests to simulate real-user behavior.
  sleep(1);
}
