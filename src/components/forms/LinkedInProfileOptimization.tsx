import React from 'react';

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
      className="relative max-w-3xl mx-auto bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg shadow-xl p-8"
      onSubmit={handleSubmit}
    >
      <h2 className="text-3xl text-teal-800 font-semibold mb-6">LinkedIn Profile Optimization</h2>
      <p className="mb-6 text-lg text-gray-600">Enhance your LinkedIn profile to attract recruiters and job opportunities.</p>

      {/* Selected Categories */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium">Selected Categories</label>
        <p className="border-2 border-teal-300 rounded-lg p-3 text-gray-700 bg-teal-50">
          {categories.length > 0 ? categories.join(", ") : "No categories selected"}
        </p>
      </div>

      {/* LinkedIn Username */}
      <div className="mb-6">
        <label htmlFor="linkedInUsername" className="block text-gray-700 font-medium mb-2">LinkedIn Username</label>
        <input
          type="text"
          id="linkedInUsername"
          name="linkedInUsername"
          required
          value={formData.linkedInUsername || ''}
          onChange={onChange}
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
        />
      </div>

      {/* LinkedIn Password */}
      <div className="mb-6">
        <label htmlFor="linkedInPassword" className="block text-gray-700 font-medium mb-2">LinkedIn Password</label>
        <input
          type="password"
          id="linkedInPassword"
          name="linkedInPassword"
          required
          value={formData.linkedInPassword || ''}
          onChange={onChange}
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Job Applying For */}
      <div className="mb-6">
        <label htmlFor="jobApplyingFor" className="block text-gray-700 font-medium mb-2">Job Applying For</label>
        <input
          type="text"
          id="jobApplyingFor"
          name="jobApplyingFor"
          required
          value={formData.jobApplyingFor || ''}
          onChange={onChange}
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Total Price */}
      <div className="mb-6">
        <p className="text-lg font-semibold text-gray-800">Total Price: <span className="text-teal-600">${amount.toFixed(2)}</span></p>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 mb-4 text-sm font-semibold">{error}</p>}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 text-white rounded-lg">
          <span className="text-xl font-semibold">Uploading your details...</span>
        </div>
      )}

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

export default LinkedInProfileOptimizationForm;
