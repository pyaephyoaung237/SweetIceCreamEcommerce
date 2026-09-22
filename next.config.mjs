/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    // bike photos are uploaded through server actions (max 5 MB image + form fields)
    serverActions: { bodySizeLimit: "6mb" },
    serverComponentsExternalPackages: ["pg", "bcryptjs"],
  },
};

export default nextConfig;
