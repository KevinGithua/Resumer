import React from 'react';

interface CoverLetterWritingFormProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  formData: { [key: string]: any };
  categories: string[]; // Added for selected categories
  amount: number; // Added for total price
  error: string | null; // Added for error messages
  loading: boolean; // Added for loading state
  onSubmit: (formData: any) => void; // Updated for form submission
}

const CoverLetterWritingForm: React.FC<CoverLetterWritingFormProps> = ({
  onChange,
  formData,
  categories,
  amount,
  error,
  loading,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page refresh
    onSubmit(formData); // Call the provided onSubmit handler with formData
  };

  return (
    <form
      className="relative max-w-3xl mx-auto bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg shadow-xl p-8"
      onSubmit={handleSubmit}
    >
      <h2 className="text-3xl text-teal-800 font-semibold mb-6">Cover Letter Writing</h2>
      <p className="mb-6 text-lg text-gray-600">Create a compelling cover letter that complements your resume and boosts your chances of success.</p>

      {/* Categories Section */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium">Selected Categories</label>
        <p className="border-2 border-teal-300 rounded-lg p-3 text-gray-700 bg-teal-50">
          {categories.length > 0 ? categories.join(", ") : "No categories selected"}
        </p>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 mb-4 text-sm font-semibold">{error}</p>}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 text-white rounded-lg">
          <span className="text-xl font-semibold">Uploading your details...</span>
        </div>
      )}

      {/* Job Applying For */}
      <div className="mb-6">
        <label htmlFor="jobApplyingFor" className="block text-gray-700 font-medium mb-2">Job or Field of Interest</label>
        <input
          type="text"
          id="jobApplyingFor"
          name="jobApplyingFor"
          value={formData.jobApplyingFor || ''}
          onChange={onChange}
          required
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Company Applying To */}
      <div className="mb-6">
        <label htmlFor="companyApplyingTo" className="block text-gray-700 font-medium mb-2">Company or Type of industry</label>
        <input
          type="text"
          id="companyApplyingTo"
          name="companyApplyingTo"
          value={formData.companyApplyingTo || ''}
          onChange={onChange}
          required
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Existing Resume */}
      <div className="mb-6">
        <label htmlFor="existingResume" className="block text-gray-700 font-medium mb-2">Upload Resume</label>
        <input
          type="file"
          id="resumeUpload"
          name="resumeUpload"
          onChange={onChange}
          required
          className="mt-1 w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
        />
        {formData.resumeUpload && (
          <a href={formData.resumeUpload} target="_blank" rel="noopener noreferrer" className="text-teal-600 text-sm mt-2 inline-block">
            View uploaded resume
          </a>
        )}
      </div>

      {/* Total Price */}
      <div className="mb-6">
        <p className="text-lg font-semibold text-gray-800">Total Price: <span className="text-teal-600">${amount.toFixed(2)}</span></p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
      >
        Proceed to Pay
      </button>
    </form>
  );
};

export default CoverLetterWritingForm;
