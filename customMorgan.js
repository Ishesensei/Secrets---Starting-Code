// morganTokens.js
import morgan from 'morgan';

morgan.token('req-query', (req) => `:query> ${JSON.stringify(req.query)}`);
morgan.token('req-params', (req) => `:params> ${JSON.stringify(req.params)}`);
morgan.token('req-body', (req) => `:body> ${JSON.stringify(req.body)}`);
morgan.token('req-headers-cookie', (req) => {
  if (req.headers.cookie) {
    return `:headers.cookie> ${
      JSON.stringify(
        req.headers.cookie.length + ` ${req.headers.cookie}`
      ).substring(0, 17) + `...`
    }`;
  } else {
    return `:headers.cookie> --
      `;
  }
});
morgan.token('line', () => '``````````````````````````````````````');

export default morgan;
