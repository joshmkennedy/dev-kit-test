import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { DevToolWrapper } from "../_dev-tool";
import { _Layout as Layout } from "../components/layout/hotdawglayout";
import { Nav } from "../components/layout/nav";
import { Text } from "@/lib/copy/text";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { i18nConfig } from "@/lib/i18n/i18n-config";

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <LocaleProvider locale={locale}>
            <Layout
              copyright={
                <Text
                  cid="layout.copyright"
                  description="Copyright notice"
                >
                  Suck IT!
                </Text>
              }
              nav={<Nav />}
            >
              {children}
            </Layout>
          </LocaleProvider>

          <DevToolWrapper />
        </SessionProvider>
      </body>
    </html>
  );
}
