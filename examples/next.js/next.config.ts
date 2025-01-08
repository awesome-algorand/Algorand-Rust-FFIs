import type { NextConfig } from "next";
import NextBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = NextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})
const nextConfig: NextConfig = {
    webpack: function (config, options) {
        config.experiments = { ...config.experiments, asyncWebAssembly: true, syncWebAssembly: true };
        return config;
    },
};

export default withBundleAnalyzer(nextConfig);
