import React from 'react';

interface HelpOverlayProps {
  onClose: () => void;
}

const HelpOverlay: React.FC<HelpOverlayProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close help overlay"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Help & Information</h2>
        <div className="space-y-4">
          <section>
            <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
            <p>Welcome to the Concert Program Interface! Here you can manage and organize your concert programs.</p>
          </section>
          <section>
            <h3 className="text-lg font-semibold mb-2">Key Features</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Create and edit concert programs</li>
              <li>Manage repertoire and performers</li>
              <li>Organize program details and scheduling</li>
              <li>Export and share programs</li>
            </ul>
          </section>
          <section>
            <h3 className="text-lg font-semibold mb-2">Need More Help?</h3>
            <p>If you need additional assistance, please contact our support team or refer to the documentation.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpOverlay; 