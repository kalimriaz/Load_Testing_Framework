import http from 'k6/http';
import { check, sleep } from 'k6';

const TARGET = __ENV.TARGET || 'https://test.k6.io';
const ITERATIONS = Number(__ENV.ITERATIONS) || 1;

export let options = {
  vus: Number(__ENV.VUS) || 10,
  iterations: ITERATIONS * (Number(__ENV.VUS) || 10)
};

export default function () {
  const res = http.get(TARGET);
  check(res, {
    'status is 200': (r) => r.status === 200
  });
  sleep(1);
}
