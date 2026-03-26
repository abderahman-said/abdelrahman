import './globals.css';

export const metadata = {
  title: {
    default: 'Abdulrahman Elsaeid | Frontend Developer',
    template: '%s | Abdulrahman Elsaeid',
  },
  description:
    'Frontend Developer متخصص في React.js و Next.js لبناء تطبيقات سريعة وقابلة للتوسع مع أفضل تجربة مستخدم.',
  
  keywords: [
    'Frontend Developer',
    'React.js',
    'Next.js',
    'JavaScript',
    'Portfolio',
  ],

  authors: [{ name: 'Abdulrahman Elsaeid' }],
  creator: 'Abdulrahman Elsaeid',

  openGraph: {
    title: 'Frontend Developer | Abdulrahman Elsaeid',
    description:
      'Portfolio يعرض مشاريع React و Next.js مع تركيز على الأداء وتجربة المستخدم.',
    url: 'https://abdelrahman-five.vercel.app/',
    siteName: 'Abdo Portfolio',
    images: [
      {
        url: 'https://cdn.prod.website-files.com/683703490bc01e1b8c052e06/68381362603d6402ee03c00e_favicon.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Frontend Developer | Abdulrahman Elsaeid',
    description:
      'Portfolio يعرض مشاريع React و Next.js.',
    images: ['https://cdn.prod.website-files.com/683703490bc01e1b8c052e06/68381362603d6402ee03c00e_favicon.png'],
  },

  icons: {
        icon: 'https://cdn.prod.website-files.com/683703490bc01e1b8c052e06/68381362603d6402ee03c00e_favicon.png',
    shortcut: 'https://cdn.prod.website-files.com/683703490bc01e1b8c052e06/68381362603d6402ee03c00e_favicon.png',
    apple: 'https://cdn.prod.website-files.com/683703490bc01e1b8c052e06/68381362603d6402ee03c00e_favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}