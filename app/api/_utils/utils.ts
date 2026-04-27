const green = '\x1b[32m';
const yellow = '\x1b[33m';
const reset = '\x1b[0m';

export function logErrorResponse(error: unknown) {
  console.log(`${green}=>${reset} ${yellow}Error Response Data:${reset}`);
  console.dir(error, { depth: null, colors: true });
}
