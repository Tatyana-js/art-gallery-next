import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactCompiler: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'app/styles')],
    additionalData: `
      @use "app/styles/variables" as *;
      @use "app/styles/mixins" as *;
    `,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'internship-front.framework.team',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
