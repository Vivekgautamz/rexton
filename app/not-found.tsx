import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow text-gold">Error 404</p>
      <h1 className="mt-8 text-[clamp(3rem,12vw,7rem)] leading-none">
        Time stood still.
      </h1>
      <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
        The page you were looking for has moved, been retired, or never
        existed. Your account and cart are untouched.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" className="h-12 px-8">
          <Link href="/">Return home</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 px-8">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
