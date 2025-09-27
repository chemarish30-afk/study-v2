const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

async function testSetup() {
  console.log('🧪 Testing LMS Setup');
  console.log('===================');

  if (!API_TOKEN) {
    console.log('❌ STRAPI_API_TOKEN not set');
    console.log('📋 Please set your API token:');
    console.log('   export STRAPI_API_TOKEN=your_token_here');
    return;
  }

  try {
    // Test Strapi connection
    console.log('🔍 Testing Strapi connection...');
    const response = await axios.get(`${STRAPI_URL}/api/exams`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Strapi connection successful');

    // Test data structure
    const exams = response.data.data || [];
    console.log(`📊 Found ${exams.length} exams`);

    if (exams.length > 0) {
      const exam = exams[0];
      console.log(`📚 Sample exam: ${exam.title}`);
      
      if (exam.subjects && exam.subjects.length > 0) {
        console.log(`📖 Subjects: ${exam.subjects.length}`);
        
        const subject = exam.subjects[0];
        if (subject.units && subject.units.length > 0) {
          console.log(`📝 Units: ${subject.units.length}`);
          
          const unit = subject.units[0];
          if (unit.chapters && unit.chapters.length > 0) {
            console.log(`📄 Chapters: ${unit.chapters.length}`);
            
            const chapter = unit.chapters[0];
            if (chapter.modules && chapter.modules.length > 0) {
              console.log(`📦 Modules: ${chapter.modules.length}`);
              
              const module = chapter.modules[0];
              if (module.module_contents && module.module_contents.length > 0) {
                console.log(`🎯 Content items: ${module.module_contents.length}`);
                
                // Test content types
                const contentTypes = module.module_contents.map(c => c.contentType);
                const uniqueTypes = [...new Set(contentTypes)];
                console.log(`📋 Content types: ${uniqueTypes.join(', ')}`);
              }
            }
          }
        }
      }
    }

    // Test content types
    console.log('\n🔍 Testing content types...');
    
    const contentTypes = ['paragraphs', 'tables', 'images', 'mcqs'];
    for (const type of contentTypes) {
      try {
        const typeResponse = await axios.get(`${STRAPI_URL}/api/${type}`, {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        const count = typeResponse.data.data?.length || 0;
        console.log(`✅ ${type}: ${count} items`);
      } catch (error) {
        console.log(`❌ ${type}: Error - ${error.message}`);
      }
    }

    console.log('\n🎉 Setup test completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start Next.js frontend: npm run dev');
    console.log('2. Access http://localhost:3000');
    console.log('3. Test the hierarchy display');
    console.log('4. Verify content rendering');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if Strapi is running: http://localhost:1337');
    console.log('2. Verify API token permissions');
    console.log('3. Check environment variables');
    console.log('4. Review Strapi logs');
  }
}

testSetup();
