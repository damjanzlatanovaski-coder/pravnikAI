# Pravnik.ai - Production Deployment Guide

## Overview
Pravnik.ai is an AI-powered legal case management platform for Macedonian lawyers. This guide covers production deployment, configuration, and optimization.

## Prerequisites
- Node.js 18+ 
- npm or yarn
- Gemini API key (https://ai.google.dev/)
- Modern browser support (Chrome, Firefox, Safari, Edge)

## Setup

### 1. Environment Configuration
Copy `env.example` to `.env` and configure:

```bash
cp env.example .env
```

**Required Variables:**
- `GEMINI_API_KEY` - Your Google Gemini API key (from https://ai.google.dev/)
- `NODE_ENV` - Set to `production` for production deployments
- `PORT` - Server port (default: 3000)

**Optional Variables:**
- `PROD_URL` - Production domain for CORS
- `DATABASE_URL` - PostgreSQL connection string (for future expansion)

### 2. Install Dependencies
```bash
npm install
```

### 3. Build for Production
```bash
npm run build
```

This will:
- Compile React with Vite
- Optimize CSS with Tailwind
- Bundle and minify JavaScript
- Generate production assets in `dist/`

### 4. Start Server
```bash
npm run start
```

Server will start on `http://localhost:3000`

## Features

### Core Capabilities
- **AI Legal Search** - Search through Macedonian laws and constitution using Gemini
- **Contract Analysis** - AI-powered risk assessment for legal documents
- **Document Translation** - Professional legal document translation
- **Case Management** - Track legal cases, clients, and deadlines
- **Secure Messaging** - Encrypted client communication
- **Audit Trail** - Complete logging of all system activities

### Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Express.js, Node.js
- **AI**: Google Gemini 1.5 Flash
- **Build**: Vite with optimized bundling
- **Styling**: Luxury glassmorphism design with mobile optimization

## Performance Optimizations

### Build Optimizations
- CSS code splitting
- JavaScript minification with Terser
- Vendor chunk separation
- Lazy loading of components
- Image optimization

### Runtime Optimizations
- Gzip/Brotli compression
- Browser caching (1 day for assets)
- Scrollbar performance optimization
- Font preloading
- Reduced motion support for accessibility

### Mobile Optimization
- Responsive design (mobile-first)
- Touch-friendly targets (44x44px minimum)
- Mobile-optimized scrollbars
- Adaptive text sizing
- Viewport optimization

## Security

### Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: enabled
- Referrer-Policy: strict-origin-when-cross-origin
- CORS properly configured

### Data Protection
- HTTPS recommended for production
- Environment variables for sensitive data
- No console logs in production
- Secure session handling

## Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Cloud Deployment
- **Google Cloud Run**: Use `npm run build` then deploy `dist/` folder
- **Vercel**: Configure build command as `npm run build`
- **Heroku**: Buildpack automatically detects Node.js
- **AWS**: Use with API Gateway + Lambda or EC2

## Monitoring

### Health Check
```bash
curl http://localhost:3000
```

### Logs
- Check server logs for errors
- Monitor Gemini API usage
- Track user activities via audit trail

### Performance Metrics
- Dashboard KPI reports show case statistics
- Audit logs track all system actions
- Response times tracked automatically

## API Endpoints

### Legal Operations
- `GET /api/laws` - List indexed laws
- `POST /api/chat` - AI legal search
- `POST /api/translate` - Document translation
- `POST /api/contract-analysis` - Risk assessment

### Case Management
- `GET /api/cases` - List cases
- `POST /api/cases` - Create case
- `GET /api/audit-trail` - Activity log
- `GET /api/reports/kpis` - Performance metrics

### Communication
- `GET /api/messages` - Client messages
- `POST /api/messages` - Send message
- `GET /api/alerts` - Legal alerts
- `POST /api/alerts` - Create alert

## Troubleshooting

### API Key Issues
```
Error: "GEMINI_API_KEY is not configured"
```
- Verify `.env` file contains valid Gemini API key
- Restart server after changing `.env`
- Check key permissions at https://ai.google.dev/

### Build Failures
```
Error: "Build output not found at dist/"
```
- Run `npm run build` before starting production
- Check Node.js version (18+ required)
- Verify all dependencies installed with `npm install`

### Connection Issues
```
Error: "Cannot connect to server"
```
- Check PORT environment variable
- Verify firewall allows port 3000
- Ensure no other service using port 3000

## Maintenance

### Regular Tasks
1. Monitor Gemini API usage and costs
2. Update laws database files in `./laws` folder
3. Review audit logs for security
4. Backup case data regularly
5. Update Node.js and dependencies quarterly

### Updates
```bash
npm update
npm audit fix
npm run build
npm run start
```

## Support

For issues or questions:
1. Check error logs in terminal
2. Review API response messages
3. Verify environment configuration
4. Test with sample data in demo mode

## License

Pravnik.ai - Designed for Macedonian legal professionals.
All rights reserved. Used in compliance with Bar Association of Republic of Macedonia regulations.

---

**Version**: 1.0.0
**Last Updated**: May 2026
**Status**: ✅ Production Ready
