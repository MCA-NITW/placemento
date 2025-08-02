const axios = require('axios');

// Test the stats API endpoints
async function testStatsAPI() {
	const baseURL = 'http://localhost:8000/api';

	console.log('Testing Stats API...\n');

	try {
		// Test stats endpoint
		console.log('1. Testing /stats endpoint...');
		const statsResponse = await axios.get(`${baseURL}/stats`);
		console.log('✅ Stats API response:', JSON.stringify(statsResponse.data, null, 2));

		// Test placement stats
		console.log('\n2. Testing /stats/placements endpoint...');
		const placementStatsResponse = await axios.get(`${baseURL}/stats/placements`);
		console.log('✅ Placement Stats API response:', JSON.stringify(placementStatsResponse.data, null, 2));

		// Test company stats
		console.log('\n3. Testing /stats/companies endpoint...');
		const companyStatsResponse = await axios.get(`${baseURL}/stats/companies`);
		console.log('✅ Company Stats API response:', JSON.stringify(companyStatsResponse.data, null, 2));

		console.log('\n🎉 All stats API tests passed!');
	} catch (error) {
		console.error('❌ Stats API test failed:', error.response?.data || error.message);

		if (error.response?.status === 404) {
			console.log('\n💡 Tip: Make sure the server is running on http://localhost:8000');
		}
	}
}

// Test with empty database (edge case)
async function testEmptyDatabase() {
	console.log('\n\nTesting edge cases with empty database...\n');

	try {
		const response = await axios.get('http://localhost:8000/api/stats');
		console.log('✅ Empty database handling:', JSON.stringify(response.data, null, 2));
	} catch (error) {
		console.error('❌ Empty database test failed:', error.response?.data || error.message);
	}
}

// Run tests
async function runTests() {
	console.log('🚀 Starting Stats API Tests...\n');

	await testStatsAPI();
	await testEmptyDatabase();

	console.log('\n✨ Test completed!');
	console.log('\n📝 Next steps:');
	console.log('1. If tests fail, run: node seedDatabase.js');
	console.log('2. Start server: npm run dev');
	console.log('3. Run tests again: node testStats.js');
}

if (require.main === module) {
	runTests();
}

module.exports = { testStatsAPI, testEmptyDatabase };
