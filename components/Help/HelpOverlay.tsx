import React from 'react';

interface HelpOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpOverlay: React.FC<HelpOverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 m-4 border border-[#8B7355] shadow-[0_2px_4px_rgba(210,180,140,0.15)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-black hover:text-gray-700"
        >
          ✕
        </button>
        <div className="mt-2">
          <h2 className="text-xl font-semibold mb-4 text-black">Help & Resources</h2>
          
          <div className="space-y-6 text-black max-h-[70vh] overflow-y-auto">
            <div>
              <h3 className="font-medium text-lg mb-2">Getting Started</h3>
              <p>Welcome to the Concert Program Interface! Here you can manage and organize your concert programs.</p>
              
              <div className="mt-2">
                <h4 className="font-medium mb-1">Key Features</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Create and edit concert programs</li>
                  <li>Manage repertoire and performers</li>
                  <li>Organize program details and scheduling</li>
                  <li>Export and share programs</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Using AI Safely</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-1">1. Protect our privacy</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Do not submit personal information (SSN, bank details, etc.)</li>
                    <li>Be cautious with Davidson-specific data, avoid sharing very personal/secret information</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-1">2. Do not rely solely on AI</h4>
                  <ul className="list-disc pl-4">
                    <li>Fact-check with reputable sources (academic papers, government websites, scholarly sources)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-1">3. Use AI ethically and avoid plagiarism</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Be vigilant about potential plagiarism in AI-generated content</li>
                    <li>Cite AI-generated content when used</li>
                    <li>Do not use AI for assignments, essays, or creating fake citations</li>
                    <li>Check your professor's AI policies</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-1">4. Be aware of AI biases</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>AI models can contain biases and misinformation</li>
                    <li>Exercise caution with sensitive topics (history, politics, social issues)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-1">5. Choose reputable AI tools</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Use reliable tools like ChatGPT, Google Gemini, etc.</li>
                    <li>Avoid apps requesting personal data and social media access</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-1">6. Balance AI with Real-World Learning</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Continue challenging yourself in learning</li>
                    <li>Use AI as a tool, not a crutch</li>
                    <li>Maintain critical thinking and reasoning skills</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Need More Help?</h3>
              <p>
                Contact us at{' '}
                <a
                  href="mailto:amplify@vanderbilt.edu"
                  className="text-blue-500 hover:text-blue-600"
                >
                  amplify@vanderbilt.edu
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpOverlay; 