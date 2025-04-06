import React from "react";

interface PreviewProps {
  imageUrl: string;
  isLoading: boolean;
}

const Preview: React.FC<PreviewProps> = ({ imageUrl, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your art...</p>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-medium text-gray-800 mb-3">Generated Art</h2>
      <img
        src={imageUrl}
        alt="Generated Art"
        className="w-full rounded-md border border-gray-200"
      />
      <div className="mt-4 text-right">
        <a
          href={imageUrl}
          download="generated-art.png"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Download Image
        </a>
      </div>
    </div>
  );
};

export default Preview;
