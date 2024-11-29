import { Order, extractFilenameFromUrl } from '@/utils/orderUtils';
import React from 'react';
import { FiDownload, FiBookOpen, FiUpload} from 'react-icons/fi';

interface LinkedInProfileOptimizationProps {
  order: Order;
}

const LinkedInProfileOptimization: React.FC<LinkedInProfileOptimizationProps> = ({ order }) => {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold text-teal-800 mb-2 text-center">Specific Order Details Details</h3>

      <div className="space-y-5 text-sm sm:text-xl">
        
        <div>
          <h4 className="flex items-center gap-2 text-lg lg:text-xl font-semibold text-teal-700">Pricing Category</h4>
          <p className='text-sm sm:text-lg lg:text-xl '>{order.pricingCategories || <span className="italic text-gray-500">No Price Category</span>}</p>
        </div>
        
        <div>
          <h4 className="flex items-center gap-2 text-lg lg:text-xl font-semibold text-teal-700">Campony Applying To</h4>
          <p className='text-sm sm:text-lg lg:text-xl'>{order.companyApplyingTo || <span className="italic text-gray-500">Not Provided</span>}</p>
        </div>
        
        <div>
          <h4 className="flex items-center gap-2 text-lg lg:text-xl font-semibold text-teal-700">Job Applying For</h4>
          <p className='text-sm sm:text-lg lg:text-xl'>{order.jobApplyingFor || <span className="italic text-gray-500">Not Provided</span>}</p>
        </div>

        <div>
          <h4 className="flex items-center gap-2 text-lg lg:text-xl font-semibold text-teal-700">
            <FiUpload className="text-teal-500" /> Uploaded Resume
          </h4>
          {order.resumeFile? (
            <p className="flex items-center text-sm sm:text-lg lg:text-xl">
              <a
                href={order.resumeFile as string}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-100 py-1 rounded-md transition-all duration-200 ease-in-out"
              >
                <p >{extractFilenameFromUrl(order.resumeFile)}</p>
                <FiDownload className="text-lg" />
              </a>
            </p>
          ) : (
            <p className="italic text-gray-500 text-sm sm:text-lg lg:text-xl ">No resume file uploaded</p>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <h4 className="flex items-center gap-2 text-lg lg:text-xl font-semibold text-teal-700">
            <FiBookOpen className="text-teal-500" /> Additional Notes
          </h4>
          <p className='text-sm sm:text-lg lg:text-xl '>{order.additionalNotes || <span className="italic text-gray-500">No additional notes</span>}</p>
        </div>
      </div>
    </div>
  );
};

export default LinkedInProfileOptimization;
