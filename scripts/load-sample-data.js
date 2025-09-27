const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error('Please set STRAPI_API_TOKEN environment variable');
  process.exit(1);
}

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

async function createSampleData() {
  try {
    console.log('Creating sample data...');

    // 1. Create JEE 2026 Physics Exam
    const jeeExam = await api.post('/exams', {
      data: {
        title: 'JEE 2026',
        description: 'Joint Entrance Exam 2026 (Engineering entrance)',
        year: 2026,
        publishedAt: new Date().toISOString(),
      },
    });

    console.log('Created JEE 2026 exam:', jeeExam.data.data.id);

    // 2. Create Physics Subject
    const physicsSubject = await api.post('/subjects', {
      data: {
        title: 'Physics',
        description: 'Covers Mechanics, Electricity, Magnetism',
        exam: jeeExam.data.data.id,
        publishedAt: new Date().toISOString(),
      },
    });

    console.log('Created Physics subject:', physicsSubject.data.data.id);

    // 3. Create Mechanics Unit
    const mechanicsUnit = await api.post('/units', {
      data: {
        title: 'Mechanics',
        description: 'Laws of motion, Kinematics, Work & Energy',
        subject: physicsSubject.data.data.id,
        publishedAt: new Date().toISOString(),
      },
    });

    console.log('Created Mechanics unit:', mechanicsUnit.data.data.id);

    // 4. Create Kinematics Chapter
    const kinematicsChapter = await api.post('/chapters', {
      data: {
        title: 'Kinematics',
        description: 'Study of motion in one and two dimensions',
        unit: mechanicsUnit.data.data.id,
        publishedAt: new Date().toISOString(),
      },
    });

    console.log('Created Kinematics chapter:', kinematicsChapter.data.data.id);

    // 5. Create Projectile Motion Module
    const projectileModule = await api.post('/modules', {
      data: {
        title: 'Projectile Motion',
        description: 'Motion under gravity at an angle',
        chapter: kinematicsChapter.data.data.id,
        publishedAt: new Date().toISOString(),
      },
    });

    console.log('Created Projectile Motion module:', projectileModule.data.data.id);

    // 6. Create Content Items
    const paragraph = await api.post('/paragraphs', {
      data: {
        content: '<p>Projectile motion is a two-dimensional motion under gravity where an object is thrown at an angle to the horizontal. The path followed is a parabola.</p>',
        publishedAt: new Date().toISOString(),
      },
    });

    const table = await api.post('/tables', {
      data: {
        content: '<table><thead><tr><th>Variable</th><th>Symbol</th><th>Description</th></tr></thead><tbody><tr><td>Initial velocity</td><td>u</td><td>Speed at launch</td></tr><tr><td>Final velocity</td><td>v</td><td>Speed at any time</td></tr><tr><td>Acceleration</td><td>a</td><td>Due to gravity</td></tr><tr><td>Time</td><td>t</td><td>Duration</td></tr><tr><td>Displacement</td><td>s</td><td>Distance traveled</td></tr></tbody></table>',
        caption: 'Projectile Motion Variables',
        publishedAt: new Date().toISOString(),
      },
    });

    const image = await api.post('/images', {
      data: {
        file: null, // This would be uploaded separately
        caption: 'Projectile Path',
        altText: 'Parabolic motion trajectory',
        publishedAt: new Date().toISOString(),
      },
    });

    const mcq = await api.post('/mcqs', {
      data: {
        question: 'At the highest point, vertical velocity is?',
        choices: ['0', 'g', 'u sinθ', 'v cosθ'],
        correctAnswer: '0',
        feedback: 'At the highest point, the vertical component of velocity becomes zero as the object momentarily stops before falling back down.',
        publishedAt: new Date().toISOString(),
      },
    });

    console.log('Created content items:', {
      paragraph: paragraph.data.data.id,
      table: table.data.data.id,
      image: image.data.data.id,
      mcq: mcq.data.data.id,
    });

    // 7. Create Module Content Links
    await api.post('/module-contents', {
      data: {
        position: 1,
        module: projectileModule.data.data.id,
        paragraph: paragraph.data.data.id,
        contentType: 'paragraph',
        publishedAt: new Date().toISOString(),
      },
    });

    await api.post('/module-contents', {
      data: {
        position: 2,
        module: projectileModule.data.data.id,
        table: table.data.data.id,
        contentType: 'table',
        publishedAt: new Date().toISOString(),
      },
    });

    await api.post('/module-contents', {
      data: {
        position: 3,
        module: projectileModule.data.data.id,
        image: image.data.data.id,
        contentType: 'image',
        publishedAt: new Date().toISOString(),
      },
    });

    await api.post('/module-contents', {
      data: {
        position: 4,
        module: projectileModule.data.data.id,
        mcq: mcq.data.data.id,
        contentType: 'mcq',
        publishedAt: new Date().toISOString(),
      },
    });

    console.log('Created module content links');

    // 8. Create Python Data Science Course
    const pythonCourse = await api.post('/courses', {
      data: {
        title: 'Python for Data Science',
        description: 'Learn Python and its libraries for data analysis',
        duration: '12 weeks',
        publishedAt: new Date().toISOString(),
      },
    });

    console.log('Created Python Data Science course:', pythonCourse.data.data.id);

    // 9. Create Programming Subject
    const programmingSubject = await api.post('/subjects', {
      data: {
        title: 'Programming',
        description: 'Core Python and syntax',
        course: pythonCourse.data.data.id,
        publishedAt: new Date().toISOString(),
      },
    });

    console.log('Created Programming subject:', programmingSubject.data.data.id);

    // 10. Create Python Basics Unit
    const pythonBasicsUnit = await api.post('/units', {
      data: {
        title: 'Python Basics',
        description: 'Variables, loops, data types',
        subject: programmingSubject.data.data.id,
        publishedAt: new Date().toISOString(),
      },
    });

    console.log('Created Python Basics unit:', pythonBasicsUnit.data.data.id);

    // 11. Create NumPy Arrays Chapter
    const numpyChapter = await api.post('/chapters', {
      data: {
        title: 'NumPy Arrays',
        description: 'Array creation and vectorization',
        unit: pythonBasicsUnit.data.data.id,
        publishedAt: new Date().toISOString(),
      },
    });

    console.log('Created NumPy Arrays chapter:', numpyChapter.data.data.id);

    // 12. Create Vectorization Module
    const vectorizationModule = await api.post('/modules', {
      data: {
        title: 'Vectorization vs Loops',
        description: 'Performance differences',
        chapter: numpyChapter.data.data.id,
        publishedAt: new Date().toISOString(),
      },
    });

    console.log('Created Vectorization module:', vectorizationModule.data.data.id);

    // 13. Create Python Content Items
    const pythonParagraph = await api.post('/paragraphs', {
      data: {
        content: '<p>Vectorized operations in NumPy are faster than traditional loops because they are implemented in C and can take advantage of SIMD (Single Instruction, Multiple Data) instructions.</p>',
        publishedAt: new Date().toISOString(),
      },
    });

    const pythonTable = await api.post('/tables', {
      data: {
        content: '<table><thead><tr><th>Operation</th><th>Loop Time (ms)</th><th>Vectorized Time (ms)</th><th>Speedup</th></tr></thead><tbody><tr><td>Addition</td><td>100</td><td>5</td><td>20x</td></tr><tr><td>Multiplication</td><td>95</td><td>4</td><td>24x</td></tr><tr><td>Sum</td><td>120</td><td>3</td><td>40x</td></tr></tbody></table>',
        caption: 'Performance Comparison',
        publishedAt: new Date().toISOString(),
      },
    });

    const pythonImage = await api.post('/images', {
      data: {
        file: null, // This would be uploaded separately
        caption: 'Memory layout',
        altText: 'Array memory visualization',
        publishedAt: new Date().toISOString(),
      },
    });

    const pythonMcq = await api.post('/mcqs', {
      data: {
        question: 'Which performs element-wise addition?',
        choices: ['numpy.add', 'np.dot', 'sum(list)', 'map(lambda)'],
        correctAnswer: 'numpy.add',
        feedback: 'numpy.add performs element-wise addition, while np.dot performs matrix multiplication.',
        publishedAt: new Date().toISOString(),
      },
    });

    console.log('Created Python content items:', {
      paragraph: pythonParagraph.data.data.id,
      table: pythonTable.data.data.id,
      image: pythonImage.data.data.id,
      mcq: pythonMcq.data.data.id,
    });

    // 14. Create Python Module Content Links
    await api.post('/module-contents', {
      data: {
        position: 1,
        module: vectorizationModule.data.data.id,
        paragraph: pythonParagraph.data.data.id,
        contentType: 'paragraph',
        publishedAt: new Date().toISOString(),
      },
    });

    await api.post('/module-contents', {
      data: {
        position: 2,
        module: vectorizationModule.data.data.id,
        table: pythonTable.data.data.id,
        contentType: 'table',
        publishedAt: new Date().toISOString(),
      },
    });

    await api.post('/module-contents', {
      data: {
        position: 3,
        module: vectorizationModule.data.data.id,
        image: pythonImage.data.data.id,
        contentType: 'image',
        publishedAt: new Date().toISOString(),
      },
    });

    await api.post('/module-contents', {
      data: {
        position: 4,
        module: vectorizationModule.data.data.id,
        mcq: pythonMcq.data.data.id,
        contentType: 'mcq',
        publishedAt: new Date().toISOString(),
      },
    });

    console.log('Created Python module content links');

    console.log('✅ Sample data created successfully!');
    console.log('\n📊 Summary:');
    console.log('- JEE 2026 Physics exam with complete hierarchy');
    console.log('- Python Data Science course with complete hierarchy');
    console.log('- All content types: Paragraph, Table, Image, MCQ');
    console.log('- Proper M2M relationships with position ordering');

  } catch (error) {
    console.error('Error creating sample data:', error.response?.data || error.message);
  }
}

createSampleData();
