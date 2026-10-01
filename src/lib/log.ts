type LogFields = Record<string, string | number | boolean | null | undefined>;

/**
 * Writes a single-line JSON log entry to stdout so it shows up in
 * `docker logs` and is easy to grep. Never pass user-entered free text
 * (e.g. match notes) as a field.
 */
const logEvent = (event: string, fields: LogFields): void => {
  console.info(JSON.stringify({ event, ...fields }));
};

export { logEvent };
