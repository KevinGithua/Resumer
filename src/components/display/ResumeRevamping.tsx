import { Order, extractFilenameFromUrl } from '@/utils/orderUtils';
import React from 'react';
import { FiDownload, FiMail, FiPhone, FiUser, FiBriefcase, FiBookOpen, FiStar, FiUpload, FiCheck } from 'react-icons/fi';

interface ResumeRevampingDetailsProps {
  order: Order;
}

const ResumeRevampingDetails: React.FC<ResumeRevampingDetailsProps> = ({ order }) => {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold text-teal-800 mb-2 text-center">Resume Revamping Details</h3>

      <div className="space-y-5 text-sm sm:text-base">
        {/* Contact Information */}
        <div>
          <h4 className="flex items-center gap-2 text-lg font-semibold text-teal-700">
            <FiUser className="text-teal-500" /> Contact Information
          </h4>
          <p><strong className="text-gray-600">Full Name:</strong> {order.contact.fullName || "Not specified"}</p>
          <p><strong className="text-gray-600"> Email:</strong> {order.contact.email || "Not specified"}</p>
          <p><strong className="text-gray-600"> Phone:</strong> {order.contact.phone || "Not specified"}</p>
        </div>

        {/* Education Information */}
        <div>
          <h4 className="flex items-center gap-2 text-lg font-semibold text-teal-700">
            <FiBookOpen className="text-teal-500" /> Education
          </h4>
          {order.education.length > 0 ? (
            order.education.map((education, index) => (
              <div key={index}>
                <p><strong className="text-gray-600">Institution:</strong> {education.institution || "Not specified"}</p>
                <p><strong className="text-gray-600">Degree:</strong> {education.degree || "Not specified"}</p>
                <p><strong className="text-gray-600">Start Year:</strong> {education.startYear || "Not specified"}</p>
                <p><strong className="text-gray-600">End Year:</strong> {education.endYear || "Not specified"}</p>
              </div>
            ))
          ) : (
            <p className="italic text-gray-500">No education information provided</p>
          )}
        </div>

        {/* Experience Information */}
        <div>
          <h4 className="flex items-center gap-2 text-lg font-semibold text-teal-700">
            <FiBriefcase className="text-teal-500" /> Experience
          </h4>
          {order.experience.length > 0 ? (
            order.experience.map((experience, index) => (
              <div key={index}>
                <p><strong className="text-gray-600">Company:</strong> {experience.company || "Not specified"}</p>
                <p><strong className="text-gray-600">Title:</strong> {experience.title || "Not specified"}</p>
                <p><strong className="text-gray-600">Start Year:</strong> {experience.startYear || "Not specified"}</p>
                <p><strong className="text-gray-600">End Year:</strong> {experience.endYear || "Not specified"}</p>
                <p><strong className="text-gray-600">Description:</strong> {experience.description || "Not specified"}</p>
              </div>
            ))
          ) : (
            <p className="italic text-gray-500">No experience information provided</p>
          )}
        </div>

        {/* Skills Information */}
        <div>
          <h4 className="flex items-center gap-2 text-lg font-semibold text-teal-700">
            <FiStar className="text-teal-500" /> Skills
          </h4>
          {order.skills.length > 0 ? (
            order.skills.map((skill, index) => (
              <div key={index} className="mt-2">
                <div className="flex gap-2"><FiCheck /> {skill.skill || "Not specified"}</div>
              </div>
            ))
          ) : (
              <div className="italic text-gray-500">No skills provided</div>
            )}
        </div>

        {/* References Information */}
        <div>
          <h4 className="flex items-center gap-2 text-lg font-semibold text-teal-700">
            <FiUser className="text-teal-500" /> References
          </h4>
          {order.references.length > 0 ? (
            order.references.map((reference, index) => (
              <div key={index} >
                <p><strong className="text-gray-600">Name:</strong> {reference.name || "Not specified"}</p>
                <p><strong className="text-gray-600">Relationship:</strong> {reference.relationship || "Not specified"}</p>
                <p><strong className="text-gray-600">Email:</strong> {reference.email || "Not specified"}</p>
                <p><strong className="text-gray-600">Email:</strong> {reference.phone || "Not specified"}</p>
              </div>
            ))
          ) : (
            <p className="italic text-gray-500">No references provided</p>
          )}
        </div>

        {/* Resume File */}
        <div>
          <h4 className="flex items-center gap-2 text-lg font-semibold text-teal-700">
            <FiUpload className="text-teal-500" /> Uploaded Resume
          </h4>
          {order.resumeFileUrl || order.finishedWork ? (
            <p className="flex items-center text-sm sm:text-lg">
              <a
                href={order.finishedWork || order.resumeFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-100 py-1 rounded-md transition-all duration-200 ease-in-out"
              >
                <p >{extractFilenameFromUrl(order.resumeFileUrl || order.finishedWork)}</p>
                <FiDownload className="text-lg" />
              </a>
            </p>
          ) : (
            <p className="italic text-gray-500 text-sm sm:text-lg ">No resume file uploaded</p>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <h4 className="flex items-center gap-2 text-lg font-semibold text-teal-700">
            <FiBookOpen className="text-teal-500" /> Additional Notes
          </h4>
          <p className='text-sm sm:text-lg '>{order.additionalNotes || <span className="italic text-gray-500">No additional notes</span>}</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeRevampingDetails;
