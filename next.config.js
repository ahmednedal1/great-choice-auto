/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        // Replace with your actual Supabase project hostname,
        // e.g. abcdefghij.supabase.co
        hostname: "*.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
