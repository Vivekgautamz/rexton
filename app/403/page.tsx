import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Access denied" };

export default function ForbiddenPage() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow text-destructive">Error 403</p>
      <h1 className="mt-8 text-[clamp(2.5rem,10vw,5.5rem)] leading-none">
        Not your door.
      </h1>
      <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
        Your account does not have permission to open this area. If you believe
        this is a mistake, contact the team and we will sort it out.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" className="h-12 px-8">
          <Link href="/">Return home</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 px-8">
          <Link href="/account">Your account</Link>
        </Button>
      </div>
    </div>
  );
}
