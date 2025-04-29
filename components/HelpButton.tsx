import React from 'react';
import { useState } from 'react';
import AISafetyOverlay from './Help/AISafetyOverlay';
import { useSession } from 'next-auth/react';

const HelpButton: React.FC = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  if (!isAuthenticated) return null;

  return (
    <>
      <button
        onClick={() => setShowOverlay(true)}
        className="fixed bottom-4 right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:bg-red-700 transition-colors z-50"
        aria-label="Help"
      >
        ?
      </button>
      <AISafetyOverlay isOpen={showOverlay} onClose={() => setShowOverlay(false)} />
    </>
  );
};

export default HelpButton; 