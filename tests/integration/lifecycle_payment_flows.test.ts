// Integration tests for payment flows. THESE TESTS REQUIRE A WORKING DATABASE.
// They are skipped by default. To run against SQLite set env:
//   DATABASE_URL="file:./test-dev.db" LIFECYCLE_ALLOW_SQLITE=true npm run lifecycle:test

describe.skip('Lifecycle payment integration (requires DB)', () => {
  test('payPal capture via lifecycle service', async () => {
    // Placeholder: implement when running against a seeded test DB
  });
});
