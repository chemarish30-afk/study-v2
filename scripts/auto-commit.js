const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const COMMIT_MESSAGES = [
  'feat: add new feature',
  'fix: resolve issue',
  'docs: update documentation',
  'style: improve formatting',
  'refactor: restructure code',
  'perf: optimize performance',
  'test: add tests',
  'chore: update dependencies',
  'build: configure build system',
  'ci: update CI configuration'
];

const EXCLUDED_PATTERNS = [
  'node_modules',
  '.git',
  '.next',
  'strapi/.tmp',
  'strapi/build',
  'strapi/dist',
  'strapi/exports',
  'strapi/.cache',
  '.env',
  '*.log'
];

function getRandomCommitMessage() {
  return COMMIT_MESSAGES[Math.floor(Math.random() * COMMIT_MESSAGES.length)];
}

function isExcluded(filePath) {
  return EXCLUDED_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(filePath);
    }
    return filePath.includes(pattern);
  });
}

function getChangedFiles() {
  try {
    const output = execSync('git status --porcelain', { encoding: 'utf8' });
    return output.split('\n')
      .filter(line => line.trim())
      .map(line => line.substring(3)) // Remove status indicators
      .filter(file => !isExcluded(file));
  } catch (error) {
    console.log('Not a git repository or git not available');
    return [];
  }
}

function commitAndPush() {
  try {
    const changedFiles = getChangedFiles();
    
    if (changedFiles.length === 0) {
      console.log('📝 No changes to commit');
      return;
    }

    console.log(`📝 Found ${changedFiles.length} changed files:`);
    changedFiles.forEach(file => console.log(`  - ${file}`));

    // Add all changes
    execSync('git add .', { stdio: 'inherit' });
    
    // Check if there are staged changes
    const stagedChanges = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    
    if (stagedChanges.trim()) {
      const commitMessage = getRandomCommitMessage();
      console.log(`💾 Committing with message: "${commitMessage}"`);
      
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
      
      console.log('🚀 Pushing to remote...');
      execSync('git push', { stdio: 'inherit' });
      
      console.log('✅ Changes committed and pushed successfully!');
    } else {
      console.log('📝 No staged changes to commit');
    }
    
  } catch (error) {
    console.error('❌ Error during commit/push:', error.message);
  }
}

function watchForChanges() {
  console.log('👀 Watching for file changes...');
  console.log('📁 Monitoring directory:', process.cwd());
  console.log('⏹️  Press Ctrl+C to stop');
  
  let timeout;
  
  // Watch for changes in the current directory
  fs.watch(process.cwd(), { recursive: true }, (eventType, filename) => {
    if (filename && !isExcluded(filename)) {
      console.log(`📝 File changed: ${filename}`);
      
      // Debounce: wait 2 seconds after last change
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        commitAndPush();
      }, 2000);
    }
  });
}

// Main execution
if (require.main === module) {
  console.log('🤖 Auto-commit script started');
  console.log('================================');
  
  // Initial commit if there are changes
  commitAndPush();
  
  // Start watching for changes
  watchForChanges();
}

module.exports = { commitAndPush, watchForChanges };
