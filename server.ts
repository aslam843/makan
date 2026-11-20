import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  comparePropertiesByIds,
  createLead,
  enrichProperty,
  getAllEnrichedProperties,
  getBlogBySlug,
  getBlogs,
  getFaqs,
  getFilterMetadata,
  getLeads,
  getPlatformStats,
  getServiceBySlug,
  getServices,
  getTestimonials,
  queryProperties,
} from './src/server/store';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ---------------------------------------------------------------------------
  // REST API Endpoints
  // ---------------------------------------------------------------------------

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'MAKANI Advisory API' });
  });

  app.get('/api/stats', (_req, res) => {
    res.json({ stats: getPlatformStats() });
  });

  app.get('/api/properties/meta', (_req, res) => {
    res.json(getFilterMetadata());
  });

  app.get('/api/properties', (req, res) => {
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    const city = typeof req.query.city === 'string' ? req.query.city : undefined;
    const locality = typeof req.query.locality === 'string' ? req.query.locality : undefined;
    const minBudget = req.query.minBudget ? Number(req.query.minBudget) : undefined;
    const maxBudget = req.query.maxBudget ? Number(req.query.maxBudget) : undefined;
    const propertyType = typeof req.query.propertyType === 'string' ? req.query.propertyType : undefined;
    const bhk = req.query.bhk ? Number(req.query.bhk) : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const possessionYear = req.query.possessionYear ? Number(req.query.possessionYear) : undefined;
    const builder = typeof req.query.builder === 'string' ? req.query.builder : undefined;
    const amenitiesParam = typeof req.query.amenities === 'string' ? req.query.amenities : '';
    const amenities = amenitiesParam ? amenitiesParam.split(',').filter(Boolean) : [];
    const projectSize = typeof req.query.projectSize === 'string' ? req.query.projectSize : undefined;
    const vastu = typeof req.query.vastu === 'string' ? req.query.vastu : undefined;
    const sort = typeof req.query.sort === 'string' ? req.query.sort : 'popularity';

    const properties = queryProperties({
      q,
      city,
      locality,
      minBudget,
      maxBudget,
      propertyType,
      bhk,
      status,
      possessionYear,
      builder,
      amenities,
      projectSize,
      vastu,
      sort,
    });

    res.json({ total: properties.length, properties });
  });

  app.get('/api/properties/:slug', (req, res) => {
    const property = enrichProperty(req.params.slug);
    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    const similar = getAllEnrichedProperties()
      .filter((p) => p.id !== property.id && p.location.city === property.location.city)
      .slice(0, 3);
    res.json({ property, similar });
  });

  app.get('/api/compare', (req, res) => {
    const rawIds = typeof req.query.ids === 'string' ? req.query.ids : '';
    const ids = rawIds
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    res.json(comparePropertiesByIds(ids));
  });

  app.post('/api/compare', (req, res) => {
    const ids = Array.isArray(req.body?.propertyIds) ? req.body.propertyIds.map(String) : [];
    res.json(comparePropertiesByIds(ids));
  });

  app.get('/api/testimonials', (_req, res) => {
    res.json({ testimonials: getTestimonials() });
  });

  app.get('/api/faqs', (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    res.json({ faqs: getFaqs(category) });
  });

  app.get('/api/blogs', (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    res.json({ posts: getBlogs(category, q) });
  });

  app.get('/api/blogs/:slug', (req, res) => {
    const post = getBlogBySlug(req.params.slug);
    if (!post) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    const related = getBlogs()
      .filter((b) => b.slug !== post.slug)
      .slice(0, 3);
    res.json({ post, related });
  });

  app.get('/api/services', (_req, res) => {
    res.json({ services: getServices() });
  });

  app.get('/api/services/:slug', (req, res) => {
    const service = getServiceBySlug(req.params.slug);
    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    res.json({ service, allServices: getServices() });
  });

  app.post('/api/leads', (req, res) => {
    const {
      fullName,
      mobile,
      email,
      preferredCity,
      preferredLocality,
      budget,
      configuration,
      requirements,
      sourcePage,
      propertySlug,
      serviceSlug,
    } = req.body ?? {};

    const errors: Record<string, string> = {};

    if (!fullName || String(fullName).trim().length < 2) {
      errors.fullName = 'Please enter your full name (at least 2 characters).';
    }

    const cleanMobile = String(mobile ?? '').replace(/\D/g, '');
    const normalizedMobile = cleanMobile.length === 12 && cleanMobile.startsWith('91')
      ? cleanMobile.slice(2)
      : cleanMobile;
    if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
      errors.mobile = 'Enter a valid 10-digit Indian mobile number.';
    }

    const emailStr = String(email ?? '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!preferredCity || String(preferredCity).trim().length === 0) {
      errors.preferredCity = 'Please select your preferred city.';
    }

    if (!budget || String(budget).trim().length === 0) {
      errors.budget = 'Please select an estimated budget range.';
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ error: 'Validation failed', fields: errors });
      return;
    }

    const lead = createLead({
      fullName: String(fullName).trim(),
      mobile: normalizedMobile,
      email: emailStr,
      preferredCity: String(preferredCity).trim(),
      preferredLocality: String(preferredLocality ?? '').trim(),
      budget: String(budget).trim(),
      configuration: String(configuration ?? '3 BHK').trim(),
      requirements: String(requirements ?? '').trim(),
      sourcePage: String(sourcePage ?? '/').trim(),
      propertySlug: propertySlug ? String(propertySlug) : undefined,
      serviceSlug: serviceSlug ? String(serviceSlug) : undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Your consultation request has been confirmed. An advisor will reach out shortly.',
      lead,
    });
  });

  app.get('/api/leads', (_req, res) => {
    const leads = getLeads();
    res.json({ count: leads.length, leads });
  });

  // ---------------------------------------------------------------------------
  // SEO Routes: sitemap.xml & robots.txt
  // ---------------------------------------------------------------------------

  app.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`);
  });

  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    const staticRoutes = [
      '/',
      '/properties',
      '/compare',
      '/services',
      '/blog',
      '/about',
      '/contact',
      '/privacy-policy',
      '/terms',
    ];
    const propertyRoutes = getAllEnrichedProperties().map((p) => `/properties/${p.slug}`);
    const serviceRoutes = getServices().map((s) => `/services/${s.slug}`);
    const blogRoutes = getBlogs().map((b) => `/blog/${b.slug}`);
    const allRoutes = [...staticRoutes, ...propertyRoutes, ...serviceRoutes, ...blogRoutes];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>${route === '/' || route === '/properties' ? 'daily' : 'weekly'}</changefreq>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.type('application/xml').send(xml);
  });

  // ---------------------------------------------------------------------------
  // Vite Middleware (Dev) or Static Assets (Production)
  // ---------------------------------------------------------------------------

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MAKANI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
