const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting LMS Development Environment');
console.log('========================================');

// Check if .env file exists
const fs = require('fs');
if (!fs.existsSync('.env')) {
  console.log('❌ .env file not found!');
  console.log('📋 Please copy env.example to .env and configure your settings:');
  console.log('   cp env.example .env');
  console.log('   # Edit .env with your configuration');
  process.exit(1);
}

console.log('✅ Environment configuration loaded');

// Start Strapi
console.log('🔧 Starting Strapi backend...');
const strapiProcess = spawn('npm', ['run', 'strapi'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
});

// Wait for Strapi to start
setTimeout(() => {
  console.log('⏳ Waiting for Strapi to start...');
  
  // Start Next.js after a delay
  setTimeout(() => {
    console.log('🌐 Starting Next.js frontend...');
    const nextProcess = spawn('npm', ['run', 'dev'], {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: true
    });

    console.log('');
    console.log('🎉 Development servers started!');
    console.log('========================================');
    console.log('📊 Strapi Admin: http://localhost:1337/admin');
    console.log('🌐 Next.js App:  http://localhost:3000');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Access Strapi admin and create an API token');
    console.log('2. Set STRAPI_API_TOKEN in your .env file');
    console.log('3. Run: npm run load-data');
    console.log('4. Access the frontend and test the hierarchy');
    console.log('');
    console.log('Press Ctrl+C to stop all servers');

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('🛑 Stopping servers...');
      strapiProcess.kill('SIGINT');
      nextProcess.kill('SIGINT');
      process.exit(0);
    });

  }, 10000); // Wait 10 seconds for Strapi to start

}, 2000);
