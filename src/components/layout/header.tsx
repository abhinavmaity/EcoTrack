import { Leaf } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Leaf size={28} />
          <h1 className="text-2xl font-bold">EcoTrack</h1>
        </Link>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}
