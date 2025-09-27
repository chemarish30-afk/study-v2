const axios = require('axios');
const fs = require('fs');
const path = require('path');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL || 'admin@lms.com';
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD || 'admin123';

async function setupStrapi() {
  try {
    console.log('Setting up Strapi...');

    // Wait for Strapi to be ready
    let retries = 0;
    const maxRetries = 30;
    
    while (retries < maxRetries) {
      try {
        await axios.get(`${STRAPI_URL}/admin`);
        console.log('Strapi is ready!');
        break;
      } catch (error) {
        retries++;
        console.log(`Waiting for Strapi... (${retries}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (retries >= maxRetries) {
      throw new Error('Strapi failed to start within timeout');
    }

    // Create admin user
    try {
      const response = await axios.post(`${STRAPI_URL}/admin/register-admin`, {
        firstname: 'Admin',
        lastname: 'User',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });

      console.log('✅ Admin user created successfully');
      console.log('Email:', ADMIN_EMAIL);
      console.log('Password:', ADMIN_PASSWORD);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error?.message?.includes('already registered')) {
        console.log('✅ Admin user already exists');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 Strapi setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Access Strapi admin at:', `${STRAPI_URL}/admin`);
    console.log('2. Login with:', ADMIN_EMAIL);
    console.log('3. Create API token in Settings > API Tokens');
    console.log('4. Set STRAPI_API_TOKEN environment variable');
    console.log('5. Run: node scripts/load-sample-data.js');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupStrapi();
