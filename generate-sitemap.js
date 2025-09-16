import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Ottieni il percorso corrente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definisci le rotte del tuo router
const routes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/dashboard', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.7 },
  { url: '/explore', changefreq: 'weekly', priority: 0.8 },
  { url: '/brands', changefreq: 'weekly', priority: 0.8 },
  { url: '/edu', changefreq: 'weekly', priority: 0.8 },
  { url: '/pub', changefreq: 'weekly', priority: 0.8 },
  { url: '/about', changefreq: 'monthly', priority: 0.6 },
  { url: '/faq', changefreq: 'monthly', priority: 0.6 },
  { url: '/comingsoon', changefreq: 'monthly', priority: 0.5 },
  { url: '/partners', changefreq: 'monthly', priority: 0.7 },
  { url: '/logos', changefreq: 'monthly', priority: 0.7 },
  { url: '/typography', changefreq: 'monthly', priority: 0.7 },
  { url: '/colors', changefreq: 'monthly', priority: 0.7 },
];

(async () => {
  const sitemap = new SitemapStream({ hostname: 'https://bitcoinbeer.events' });

  // Scrivi il file sitemap.xml
  const writeStream = createWriteStream(path.resolve(__dirname, 'public/sitemap.xml'));
  sitemap.pipe(writeStream);

  // Aggiungi ogni percorso alla Sitemap
  routes.forEach((route) => {
    sitemap.write(route);
  });

  sitemap.end();

  // Verifica il risultato
  const sitemapXML = await streamToPromise(sitemap).then((data) => data.toString());
  console.log('Sitemap generata con successo:', sitemapXML);
})();
