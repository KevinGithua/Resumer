import React from 'react';

interface JobApplicationAssistanceFormProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  formData: { [key: string]: any };
  categories: string[]; // Added for selected categories
  amount: number; // Added for total price
  error: string | null; // Added for error messages
  loading: boolean; // Added for loading state
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // Added for form submission
}

const JobApplicationAssistanceForm: React.FC<JobApplicationAssistanceFormProps> = ({
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
      <h2 className="text-2xl text-teal-800 mb-6">Job Application Assistance</h2>
      <p className="mb-4">Get guidance on applying for your desired jobs and perfecting your applications.</p>

      <div className="mb-4">
        <label className="block text-gray-700">Selected Categories</label>
        <p className="border border-gray-300 rounded-md p-2">
          {categories.length > 0 ? categories.join(", ") : "No categories selected"}
        </p>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 text-white">
          Uploading your details...
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="jobTitle" className="block text-gray-700 font-medium mb-1">Job Title</label>
        <input
          type="text"
          id="jobTitle"
          name="jobTitle"
          value={formData.jobTitle || ''}
          onChange={onChange}
          required
          className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="companyName" className="block text-gray-700 font-medium mb-1">Company Name</label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName || ''}
          onChange={onChange}
          required
          className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="resumeUpload" className="block text-gray-700 font-medium mb-1">Upload Resume</label>
        <input
          type="file"
          id="resumeUpload"
          name="resumeUpload"
          onChange={onChange}
          required
          className="mt-1 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
        />
      </div>

      <p className="text-gray-800 font-semibold mb-6">Total Price: ${amount.toFixed(2)}</p>

      <button
        type="submit"
        className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition duration-200"
      >
        Proceed to Pay
      </button>
    </form>
  );
};

export default JobApplicationAssistanceForm;
