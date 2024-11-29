import React from 'react';
import { FaDollarSign } from 'react-icons/fa';

interface JobApplicationAssistanceFormProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  formData: { [key: string]: any };
  categories: string[];
  amount: number;
  error: string | null;
  loading: boolean;
  onSubmit: (formData: any) => void;
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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      className="relative max-w-2xl mx-auto bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg shadow-xl p-8 space-y-6"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl text-center text-fuchsia-800 font-semibold mb-4">
        Job Application Assistance
      </h2>
      <p className="mb-6 text-lg text-gray-600 text-center">
        Get guidance on applying for your desired jobs and perfecting your applications.
      </p>
  
      <div className="flex flex-col gap-6 text-lg">
        {/* Selected Categories */}
        <div>
          <label className="block text-teal-700 font-medium mb-2">Selected Categories</label>
          <p className="border-2 border-teal-300 rounded-lg p-2 text-gray-700 bg-teal-50">
            {categories.length > 0 ? categories.join(", ") : "No categories selected"}
          </p>
        </div>
  
        {/* Error Message */}
        {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
  
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 text-white rounded-lg z-10">
            <span className="text-lg font-semibold animate-pulse">Uploading your details...</span>
          </div>
        )}
  
        {/* Job Title */}
        <div>
          <label htmlFor="jobTitle" className="block text-teal-700 font-medium mb-2">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle || ''}
            onChange={onChange}
            required
            className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>
  
        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-teal-700 font-medium mb-2">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName || ''}
            onChange={onChange}
            required
            className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>
  
        {/* Additional Notes */}
        <div>
          <label htmlFor="additionalNotes" className="block text-teal-700 font-medium mb-2">
            Additional Notes
          </label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes || ''}
            onChange={onChange}
            rows={4}
            placeholder="Add any extra details or instructions..."
            className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition-all resize-none"
          />
        </div>
  
        {/* Upload Resume */}
        <div>
          <label htmlFor="resumeFile" className="block text-teal-700 font-medium mb-2">
            Upload Resume
          </label>
          <input
            type="file"
            id="resumeFile"
            name="resumeFile"
            onChange={onChange}
            accept=".pdf,.doc,.docx"
            required
            className="w-full block sm:w-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 transition duration-200 cursor-pointer"
          />
        </div>
  
        {/* Total Price */}
        <div className="flex justify-center items-center gap-3 text-gray-800 font-semibold">
          <p className="text-lg">Total Price:</p>
          <span className="flex items-center text-teal-600 font-bold text-xl space-x-1">
            <FaDollarSign className="text-xl" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-500">
              {amount.toFixed(2)}
            </span>
          </span>
        </div>
  
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 text-white font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400"
        >
          Proceed to Pay
        </button>
      </div>
    </form>
  );
};

export default JobApplicationAssistanceForm;
