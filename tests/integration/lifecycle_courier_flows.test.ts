// Integration tests for courier flows. THESE TESTS REQUIRE A WORKING DATABASE.
// They are skipped by default. To run against SQLite set env:
//   DATABASE_URL="file:./test-dev.db" LIFECYCLE_ALLOW_SQLITE=true npm run lifecycle:test

describe.skip('Lifecycle courier integration (requires DB)', () => {
  test('courier token generation and expiration', async () => {
    // Placeholder: implement when running against a seeded test DB
  });
});
