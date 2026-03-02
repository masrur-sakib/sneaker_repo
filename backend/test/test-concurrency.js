const API_URL = 'http://localhost:4000/api';
const DROP_ID = '58185a3f-ecc1-472d-b7d5-3abfb43d0be2';

const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch users:', error.message);
    return [];
  }
};

const makeReservation = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        dropId: DROP_ID,
        quantity: 1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { userId, success: false, error: data.error };
    }

    return { userId, success: true, data };
  } catch (error) {
    return { userId, success: false, error: error.message };
  }
};

const runConcurrencyTest = async () => {
  console.log('🔍 Fetching users from database...\n');

  const users = await fetchUsers();

  if (users.length === 0) {
    console.log('❌ No users found. Please create users first.');
    return;
  }

  const NUM_REQUESTS = 10;
  const userIds = [];

  for (let i = 0; i < NUM_REQUESTS; i++) {
    userIds.push(users[i % users.length].id);
  }

  console.log(`👥 Found ${users.length} users in database`);
  console.log('🚀 Starting concurrency test...');
  console.log(`📦 Drop ID: ${DROP_ID}`);
  console.log(`🔄 Concurrent requests: ${NUM_REQUESTS}\n`);

  const startTime = Date.now();
  const results = await Promise.all(
    userIds.map((userId) => makeReservation(userId)),
  );
  const endTime = Date.now();

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log('='.repeat(50));
  console.log('📊 RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ Successful reservations: ${successful.length}`);
  console.log(`❌ Failed reservations: ${failed.length}`);
  console.log(`⏱️  Total time: ${endTime - startTime}ms`);
  console.log('='.repeat(50));

  if (successful.length > 0) {
    console.log('\n✅ Successful user IDs:');
    successful.forEach((r) => console.log(`   User ID: ${r.userId}`));
  }

  if (failed.length > 0) {
    console.log('\n❌ Sample errors:');
    const uniqueErrors = [...new Set(failed.map((r) => r.error))];
    uniqueErrors.forEach((err) => console.log(`   - ${err}`));
  }

  console.log('\n🔍 Verifying final stock...');
  try {
    const dropResponse = await fetch(`${API_URL}/drops/${DROP_ID}`);
    const drop = await dropResponse.json();
    console.log(`   Final stock: ${drop.availableStock}`);
  } catch (error) {
    console.log('   Could not fetch drop info');
  }
};

runConcurrencyTest();
