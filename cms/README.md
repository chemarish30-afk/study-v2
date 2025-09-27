# Learning Management System (LMS)

A comprehensive Learning Management System built with **Strapi Cloud** and **Next.js** featuring a complete educational content hierarchy with many-to-many relationships.

## 🏗️ Architecture

- **Backend**: Strapi Cloud with PostgreSQL
- **Frontend**: Next.js 14 with TypeScript
- **Authentication**: NextAuth.js with Strapi JWT
- **Styling**: Tailwind CSS
- **Storage**: AWS S3 for media files

## 📚 Content Hierarchy

The system supports a complete educational hierarchy:

```
Exam/Course → Subject → Unit → Chapter → Module → Content
```

### Content Types
- **Paragraph**: Rich text content
- **Table**: CKEditor 5 table with captions
- **Image**: Media with caption and alt text
- **MCQ**: Multiple Choice Questions with feedback

## 🔐 Role-Based Access Control (RBAC)

- **Author**: Create and edit content
- **Reviewer**: Review and approve content
- **Publisher**: Full access including publishing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- AWS S3 bucket (for file uploads)

### 1. Install Dependencies

```bash
npm run setup
```

### 2. Environment Configuration

Copy `env.example` to `.env` and configure:

```bash
cp env.example .env
```

Update the following variables:
- `STRAPI_URL`: Your Strapi Cloud URL
- `STRAPI_API_TOKEN`: Your Strapi API token
- `NEXTAUTH_SECRET`: Random secret for NextAuth
- Database credentials
- AWS S3 credentials

### 3. Start Development Servers

```bash
# Terminal 1: Start Strapi
npm run strapi

# Terminal 2: Start Next.js
npm run dev
```

### 4. Load Sample Data

```bash
# Set your API token first
export STRAPI_API_TOKEN=your_token_here

# Load sample data
node scripts/load-sample-data.js
```

## 📊 Sample Data

The system includes two complete examples:

### 1. JEE 2026 Physics
- **Exam**: JEE 2026
- **Subject**: Physics
- **Unit**: Mechanics
- **Chapter**: Kinematics
- **Module**: Projectile Motion
- **Content**: Paragraph, Table, Image, MCQ

### 2. Python Data Science Course
- **Course**: Python for Data Science
- **Subject**: Programming
- **Unit**: Python Basics
- **Chapter**: NumPy Arrays
- **Module**: Vectorization vs Loops
- **Content**: Paragraph, Table, Image, MCQ

## 🔧 Key Features

### Many-to-Many Relationships
- Exams can have multiple subjects
- Subjects can belong to multiple exams/courses
- Content can be shared across modules

### Position Ordering
- `module_contents` table includes `position` field
- Content displays in correct sequence
- Easy reordering in Strapi admin

### Draft/Publish Workflow
- All content types support draft/publish
- RBAC controls who can publish
- Content only visible when published

### Rich Content Support
- CKEditor 5 for rich text
- Image uploads with captions
- Interactive MCQ with feedback
- Responsive table rendering

## 🎯 Usage

### For Content Editors
1. Log into Strapi admin panel
2. Create exams/courses and build hierarchy
3. Add content with proper positioning
4. Use draft/publish workflow

### For Students
1. Log into Next.js frontend
2. Browse exam/course hierarchy
3. View content in proper sequence
4. Interactive MCQ questions

## 🛠️ Development

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── components/        # React components
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── strapi/               # Strapi backend
│   ├── config/          # Strapi configuration
│   └── api/             # Content type schemas
├── scripts/             # Utility scripts
└── package.json         # Dependencies
```

### Key Components
- `HierarchyViewer`: Main content display
- `ExamCard`: Exam hierarchy rendering
- `CourseCard`: Course hierarchy rendering
- `LoadingSpinner`: Loading states

## 🔒 Security

- JWT-based authentication
- Role-based permissions
- API token protection
- Secure file uploads

## 📈 Performance

- Optimized database queries
- Image optimization
- Lazy loading for large hierarchies
- Efficient state management

## 🚀 Deployment

### Strapi Cloud
1. Deploy to Strapi Cloud
2. Configure PostgreSQL database
3. Set up AWS S3 for file storage
4. Configure environment variables

### Next.js
1. Deploy to Vercel/Netlify
2. Configure environment variables
3. Set up domain and SSL
4. Test authentication flow

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues:
- Check the documentation
- Review the sample data
- Test with provided examples
- Contact the development team