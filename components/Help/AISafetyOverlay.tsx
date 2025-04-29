import React from 'react';

interface AISafetyOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const AISafetyOverlay: React.FC<AISafetyOverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-[#202123] m-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
        <div className="mt-2">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">How can we use AI safely on Davidson's Amplify?</h2>
          
          <div className="space-y-6 text-gray-600 dark:text-gray-300 max-h-[70vh] overflow-y-auto">
            <div>
              <h3 className="font-medium text-lg mb-2">1. Protect our privacy</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Do not submit personal information such as your social security number, your bank information, and more</li>
                <li>While this data is not being stored in the Cloud or used to train AI models, therefore we can submit some Davidson-specific data, be wary of giving very personal/secret information</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">2. Do not rely solely on AI</h3>
              <ul className="list-disc pl-5">
                <li>AI can easily have information that is quite convincing but incorrect. So, be sure to fact-check with reputable sources (academic papers, government websites, reputable news outlets) and scholarly sources (Google Scholar or Davidson's library databases)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">3. Use AI ethically and do not plagiarize</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>AI often uses the same words/phrases, or even copies complete blurbs from other sources to make their content. This means plagiarism is very possible, so stay vigilant and check your content</li>
                <li>If you do use AI content in your work, be sure to cite your sources</li>
                <li>Do not use AI to complete your assignments, write your essays, or make fake citations</li>
                <li>Be sure to check with your professor's policies on AI before you use it!</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">4. Be aware of biases in AI models</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Because AI models are trained on man-made data, there can be biases and misinformation. As well, cultural, political, and ideological biases can be prevalent</li>
                <li>Stay cautious when you use AI for sensitive topics like history, politics, or social issues</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">5. Choose reputable AI tools</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Stick with what is reliable and well-known... ChatGPT, Google Gemini, etc</li>
                <li>Avoid apps that request access to personal data and social media platforms</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">6. Balance AI with Real-World Learning</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>While AI can be really awesome to expedite your work, it is important to continue to challenge yourself in learning</li>
                <li>Be sure to not use AI as a crutch, but as a tool to aid your work</li>
                <li>It is crucial to not lose your critical thinking and reasoning skills by leaving them out of practice</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISafetyOverlay; 