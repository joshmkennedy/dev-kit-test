import { SessionProvider } from "next-auth/react";
import { Text } from "@/lib/copy/text";
import { getSupportedLocaleCodes } from "@/lib/i18n/i18n-config";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { DevToolWrapper } from "../_dev-tool";
import { _Layout as Layout } from "../components/layout/hotdawglayout";
import { Nav } from "../components/layout/nav";

export async function generateStaticParams() {
  const codes = await getSupportedLocaleCodes();
  return codes.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
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
        <DevToolWrapper />
      </LocaleProvider>
    </SessionProvider>
  );
}
