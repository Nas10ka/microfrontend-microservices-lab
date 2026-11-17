export function validateEnvironment(env: Record<string, unknown>) {
  const port = Number(env.PORT ?? 5001);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  const mongoEnabled = env.MONGO_ENABLED ?? 'false';
  if (mongoEnabled !== 'true' && mongoEnabled !== 'false') {
    throw new Error('MONGO_ENABLED must be true or false.');
  }

  if (mongoEnabled === 'true' &&
      (typeof env.MONGO_URI !== 'string' || !env.MONGO_URI.trim())) {
    throw new Error('MONGO_URI is required when MONGO_ENABLED=true.');
  }

  return { ...env, PORT: port, MONGO_ENABLED: mongoEnabled };
}
