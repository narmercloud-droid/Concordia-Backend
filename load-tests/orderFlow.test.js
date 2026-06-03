import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '30s'
};

export default function () {
  const res = http.get('http://localhost:4000/api/health');
  sleep(1);
}
