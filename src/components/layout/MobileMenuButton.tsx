'use client';
import { Menu } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export default function MobileMenuButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed bottom-5 right-5 z-50 w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-xl text-white hover:scale-105 transition-transform"
      aria-label="Open menu"
    >
      <Menu size={22} />
    </button>
  );
}
