import React from 'react';
import { FaDollarSign } from 'react-icons/fa';

interface LinkedInProfileOptimizationFormProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  formData: { [key: string]: any };
  categories: string[];
  amount: number;
  error: string | null;
  loading: boolean;
  onSubmit: (formData: any) => void;
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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      className="relative max-w-2xl mx-auto bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg shadow-xl p-8 space-y-6"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl text-center text-teal-800 font-semibold mb-4">
        LinkedIn Profile Optimization
      </h2>
      <p className="mb-6 text-lg text-gray-600 text-center">
        Enhance your LinkedIn profile to attract recruiters and job opportunities.
      </p>
  
      <div className="flex flex-col gap-6 text-lg">
        {/* Selected Categories */}
        <div>
          <label className="block text-teal-700 font-medium mb-2">Selected Categories</label>
          <p className="border-2 border-teal-300 rounded-lg p-2 text-gray-700 bg-teal-50">
            {categories.length > 0 ? categories.join(", ") : "No categories selected"}
          </p>
        </div>
  
        {/* LinkedIn Username */}
        <div>
          <label htmlFor="linkedInUsername" className="block text-teal-700 font-medium mb-2">
            LinkedIn Username
          </label>
          <input
            type="text"
            id="linkedInUsername"
            name="linkedInUsername"
            required
            value={formData.linkedInUsername || ''}
            onChange={onChange}
            className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>
  
        {/* LinkedIn Password */}
        <div>
          <label htmlFor="linkedInPassword" className="block text-teal-700 font-medium mb-2">
            LinkedIn Password
          </label>
          <input
            type="password"
            id="linkedInPassword"
            name="linkedInPassword"
            required
            value={formData.linkedInPassword || ''}
            onChange={onChange}
            className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>
  
        {/* Job Applying For */}
        <div>
          <label htmlFor="jobApplyingFor" className="block text-teal-700 font-medium mb-2">
            Job Applying For
          </label>
          <input
            type="text"
            id="jobApplyingFor"
            name="jobApplyingFor"
            required
            value={formData.jobApplyingFor || ''}
            onChange={onChange}
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
  
        {/* Error Message */}
        {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
  
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 text-white rounded-lg z-10">
            <span className="text-lg font-semibold animate-pulse">Uploading your details...</span>
          </div>
        )}
  
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 text-white font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400"
        >
          Proceed to Pay
        </button>
      </div>
    </form>
  );
};

export default LinkedInProfileOptimizationForm;
