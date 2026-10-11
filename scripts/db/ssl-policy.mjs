// Local Postgres (docker-compose, see infra/local/) has no TLS listener;
// only require ssl for a remote host such as the real Scaleway instance.
export function shouldUseSsl(connectionString) {
  const { hostname } = new URL(connectionString)
  return !['localhost', '127.0.0.1'].includes(hostname)
}
