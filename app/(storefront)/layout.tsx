import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { StoreProvider } from "@/components/providers/store-provider";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export default function StorefrontLayout({ children }: LayoutProps<"/">) {
  return (
    <StoreProvider>
      <div className="flex min-h-full flex-col pb-14 md:pb-0">
        <AnnouncementBar />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <MobileBottomNav />
      </div>
    </StoreProvider>
  );
}
