import * as Sentry from 'sentry-expo';
{
    Sentry.init({
        dsn: "https://1b0826e1997f4a2095fde32a9b2c7431@o51109.ingest.sentry.io/5690948",
        enableInExpoDevelopment: true,
        debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
    });
}
export default Sentry;