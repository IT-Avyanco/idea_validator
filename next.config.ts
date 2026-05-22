import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to silence the webpack warning/error
  turbopack: {},
  webpack: (config, { isServer, webpack }) => {
    // jsPDF bundles canvg for SVG support, but canvg pulls in a broken
    // core-js version. We don't need SVG rendering for our PDF reports,
    // so we safely ignore canvg entirely.
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(canvg|dompurify|html2canvas)$/,
      })
    );

    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback ?? {}),
        canvas: false,
        fs: false,
        path: false,
        stream: false,
        zlib: false,
      };
    }

    return config;
  },
};

export default nextConfig;
