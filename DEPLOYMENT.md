# 🚀 LMS Deployment Guide

This guide covers deploying the Learning Management System to production using Strapi Cloud and Vercel.

## 📋 Prerequisites

- Strapi Cloud account
- Vercel account (or similar hosting platform)
- AWS S3 bucket for file storage
- PostgreSQL database (provided by Strapi Cloud)

## 🏗️ Strapi Cloud Deployment

### 1. Create Strapi Cloud Project

1. Go to [Strapi Cloud](https://cloud.strapi.io/)
2. Create a new project
3. Choose PostgreSQL database
4. Select your preferred region

### 2. Configure Environment Variables

In your Strapi Cloud dashboard, set these environment variables:

```bash
# Database (automatically configured by Strapi Cloud)
DATABASE_HOST=your-database-host
DATABASE_PORT=5432
DATABASE_NAME=your-database-name
DATABASE_USERNAME=your-database-username
DATABASE_PASSWORD=your-database-password
DATABASE_SSL=true

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_ACCESS_SECRET=your-aws-secret-key
AWS_REGION=your-aws-region
AWS_BUCKET=your-s3-bucket-name

# JWT Configuration
JWT_SECRET=your-jwt-secret
ADMIN_JWT_SECRET=your-admin-jwt-secret
```

### 3. Deploy Content Types

1. Access your Strapi Cloud admin panel
2. Go to Content-Type Builder
3. Import the content types from the project:
   - Exam
   - Course
   - Subject
   - Unit
   - Chapter
   - Module
   - Paragraph
   - Table
   - Image
   - MCQ
   - Module Content

### 4. Configure RBAC

1. Go to Settings > Users & Permissions > Roles
2. Create the following roles:
   - Author
   - Reviewer
   - Publisher
3. Set appropriate permissions for each role

### 5. Create API Token

1. Go to Settings > API Tokens
2. Create a new token with full access
3. Copy the token for use in Next.js

## 🌐 Next.js Deployment (Vercel)

### 1. Prepare for Deployment

1. Update `next.config.js` with production URLs:

```javascript
const nextConfig = {
  env: {
    STRAPI_URL: process.env.STRAPI_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  images: {
    domains: ['your-strapi-cloud-domain.com'],
  },
}
```

### 2. Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:

```bash
# Strapi Configuration
STRAPI_URL=https://your-strapi-cloud-project.strapiapp.com
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-cloud-project.strapiapp.com

# NextAuth Configuration
NEXTAUTH_URL=https://your-vercel-app.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret

# Optional: Database URL for direct access
DATABASE_URL=your-database-url
```

### 3. Configure Custom Domain

1. In Vercel dashboard, go to Domains
2. Add your custom domain
3. Update `NEXTAUTH_URL` to match your domain

## 🔧 Production Configuration

### 1. Strapi Cloud Settings

```javascript
// strapi/config/server.js
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
```

### 2. Database Configuration

```javascript
// strapi/config/database.js
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD', 'strapi'),
      ssl: env.bool('DATABASE_SSL', false) && {
        key: env('DATABASE_SSL_KEY', undefined),
        cert: env('DATABASE_SSL_CERT', undefined),
        ca: env('DATABASE_SSL_CA', undefined),
        capath: env('DATABASE_SSL_CAPATH', undefined),
        cipher: env('DATABASE_SSL_CIPHER', undefined),
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      },
    },
    pool: { 
      min: env.int('DATABASE_POOL_MIN', 2), 
      max: env.int('DATABASE_POOL_MAX', 10) 
    },
  },
});
```

### 3. File Upload Configuration

```javascript
// strapi/config/plugins.js
module.exports = {
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET'),
        },
      },
    },
  },
};
```

## 📊 Load Sample Data

### 1. Using the Script

```bash
# Set your API token
export STRAPI_API_TOKEN=your-production-token

# Load sample data
node scripts/load-sample-data.js
```

### 2. Manual Data Entry

1. Access Strapi Cloud admin panel
2. Create the hierarchy manually:
   - JEE 2026 Physics exam
   - Python Data Science course
3. Add content with proper relationships

## 🔒 Security Considerations

### 1. API Security

- Use HTTPS for all communications
- Implement rate limiting
- Validate all inputs
- Use CORS properly

### 2. Authentication

- Use strong JWT secrets
- Implement session timeout
- Use secure cookies
- Enable CSRF protection

### 3. File Uploads

- Validate file types
- Implement file size limits
- Use secure S3 bucket policies
- Enable virus scanning

## 📈 Performance Optimization

### 1. Database Optimization

- Add proper indexes
- Use connection pooling
- Optimize queries
- Implement caching

### 2. Frontend Optimization

- Enable Next.js image optimization
- Implement lazy loading
- Use CDN for static assets
- Optimize bundle size

### 3. Strapi Optimization

- Enable caching
- Optimize API responses
- Use database indexes
- Implement pagination

## 🔍 Monitoring and Logging

### 1. Application Monitoring

- Set up error tracking (Sentry)
- Monitor performance metrics
- Track user analytics
- Set up alerts

### 2. Database Monitoring

- Monitor query performance
- Track connection usage
- Set up backup alerts
- Monitor disk usage

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check Strapi CORS settings
   - Verify domain configuration

2. **Authentication Issues**
   - Check JWT configuration
   - Verify API token permissions

3. **File Upload Issues**
   - Check S3 bucket permissions
   - Verify AWS credentials

4. **Database Connection Issues**
   - Check connection string
   - Verify SSL settings

### Debug Steps

1. Check environment variables
2. Verify API endpoints
3. Test authentication flow
4. Check browser console for errors

## 📞 Support

For deployment issues:

1. Check the logs in Strapi Cloud dashboard
2. Review Vercel deployment logs
3. Test API endpoints manually
4. Contact support if needed

## 🎯 Post-Deployment Checklist

- [ ] Strapi Cloud is accessible
- [ ] Database connection working
- [ ] File uploads working
- [ ] API authentication working
- [ ] Next.js frontend deployed
- [ ] Custom domain configured
- [ ] SSL certificates active
- [ ] Sample data loaded
- [ ] User roles configured
- [ ] Monitoring set up
