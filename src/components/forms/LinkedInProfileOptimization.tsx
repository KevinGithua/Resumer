import React from 'react';

interface LinkedInProfileOptimizationFormProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  formData: { [key: string]: any };
  categories: string[]; // Added for selected categories
  amount: number; // Added for total price
  error: string | null; // Added for error messages
  loading: boolean; // Added for loading state
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // Added for form submission
}

const LinkedInProfileOptimizationForm: React.FC<LinkedInProfileOptimizationFormProps> = ({
  onChange,
  formData,
  categories,
  amount,
  error,
  loading,
  onSubmit,
}) => {
  return (
    <form
      className="relative max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6"
      onSubmit={onSubmit}
    >
      <h2 className="text-2xl text-teal-800 mb-6">LinkedIn Profile Optimization</h2>
      <p className="mb-4">Enhance your LinkedIn profile to attract recruiters and job opportunities.</p>

      <div className="mb-4">
        <label className="block text-gray-700">Selected Categories</label>
        <p className="border border-gray-300 rounded-md p-2">
          {categories.length > 0 ? categories.join(", ") : "No categories selected"}
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="linkedInUsername" className="block text-gray-700 font-medium mb-1">LinkedIn Username</label>
        <input
          type="text"
          id="linkedInUsername"
          name="linkedInUsername"
          required
          value={formData.linkedInUsername || ''}
          onChange={onChange}
          className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="linkedInPassword" className="block text-gray-700 font-medium mb-1">LinkedIn Password</label>
        <input
          type="password"
          id="linkedInPassword"
          name="linkedInPassword"
          required
          value={formData.linkedInPassword || ''}
          onChange={onChange}
          className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="jobApplyingFor" className="block text-gray-700 font-medium mb-1">Job Applying For</label>
        <input
          type="text"
          id="jobApplyingFor"
          name="jobApplyingFor"
          required
          value={formData.jobApplyingFor || ''}
          onChange={onChange}
          className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
        />
      </div>

      <p className="text-gray-800 font-semibold mb-6">Total Price: ${amount.toFixed(2)}</p>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 text-white">
          Uploading your details...
        </div>
      )}

      <button
        type="submit"
        className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition duration-200"
      >
        Proceed to Pay
      </button>
    </form>
  );
};

export default LinkedInProfileOptimizationForm;
