import helmet from 'helmet';

const HelmetConfig = helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [`'self'`, 'unpkg.com'],
      styleSrc: [
        `'self'`,
        `'unsafe-inline'`,
        'cdn.jsdelivr.net',
        'fonts.googleapis.com',
        'unpkg.com',
      ],
      fontSrc: [`'self'`, 'fonts.scalar.com', 'fonts.gstatic.com', 'data:'],
      imgSrc: [
        `'self'`,
        'data:',
        'cdn.jsdelivr.net',
        'https://archive.org',
        'https://ia800603.us.archive.org',
        'https://covers.openlibrary.org',
        'https://plus.unsplash.com',
        'https://pagedone.io',
        'https://api.dicebear.com',
      ],
      scriptSrc: [
        `'self'`,
        `'unsafe-inline'`,
        `https:`,
        `cdn.jsdelivr.net`,
        `'unsafe-eval'`,
      ],
    },
  },
});

export { HelmetConfig };
