import React from 'react';
import { Order } from "@/utils/orderUtils";
import { FiMail, FiPhone, FiUser, FiBriefcase, FiBookOpen, FiStar } from 'react-icons/fi';

interface ResumeWritingDetailsProps {
  order: Order;
}

const ResumeWritingDetails: React.FC<ResumeWritingDetailsProps> = ({ order }) => {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold text-teal-800 mb-4 text-center">Resume Writing Details</h3>

      <div className="flex flex-col gap-4 text-base">
        {/* Contact Information */}
        <div>
          <h4 className="flex items-center gap-2 text-lg font-semibold text-teal-700">
            <FiUser className="text-teal-500" /> Contact Information
          </h4>
          <div><strong className="text-gray-600">Full Name:</strong> {order.contact.fullName || "Not specified"}</div>
          <div><strong className="text-gray-600">Email:</strong> {order.contact.email || "Not specified"}</div>
          <div><strong className="text-gray-600">Phone:</strong> {order.contact.phone || "Not specified"}</div>
        </div>

        {/* Education Information */}
        <div>
          <h4 className="flex items-center gap-2 text-lg font-semibold text-teal-700">
            <FiBookOpen className="text-teal-500" /> Education
          </h4>
          {order.education.length > 0 ? (
            order.education.map((education, index) => (
              <div key={index} className="mt-2">
                <div><strong className="text-gray-600">Institution:</strong> {education.institution || "Not specified"}</div>
                <div><strong className="text-gray-600">Degree:</strong> {education.degree || "Not specified"}</div>
                <div><strong className="text-gray-600">Start Year:</strong> {education.startYear || "Not specified"}</div>
                <div><strong className="text-gray-600">End Year:</strong> {education.endYear || "Not specified"}</div>
              </div>
            ))
          ) : (
            <div className="italic text-gray-500">No education information provided</div>
          )}
        </div>

        {/* Experience Information */}
        <div>
          <h4 className="flex items-center gap-2 text-lg font-semibold text-teal-700">
            <FiBriefcase className="text-teal-500" /> Experience
          </h4>
          {order.experience.length > 0 ? (
            order.experience.map((experience, index) => (
              <div key={index} className="mt-2">
                <div><strong className="text-gray-600">Company:</strong> {experience.company || "Not specified"}</div>
                <div><strong className="text-gray-600">Title:</strong> {experience.title || "Not specified"}</div>
                <div><strong className="text-gray-600">Start Year:</strong> {experience.startYear || "Not specified"}</div>
                <div><strong className="text-gray-600">End Year:</strong> {experience.endYear || "Not specified"}</div>
                <div><strong className="text-gray-600">Description:</strong> {experience.description || "Not specified"}</div>
              </div>
            ))
          ) : (
            <div className="italic text-gray-500">No experience information provided</div>
          )}
        </div>

        {/* Skills Information */}
        <div>
          <h4 className="flex items-center gap-2 text-lg font-semibold text-teal-700">
            <FiStar className="text-teal-500" /> Skills
          </h4>
          <div>{order.skills.length > 0 ? order.skills.join(", ") : <span className="italic text-gray-500">No skills provided</span>}</div>
        </div>

        {/* References Information */}
        <div>
          <h4 className="flex items-center gap-2 text-lg font-semibold text-teal-700">
            <FiUser className="text-teal-500" /> References
          </h4>
          {order.references.length > 0 ? (
            order.references.map((reference, index) => (
              <div key={index} className="mt-2">
                <div><strong className="text-gray-600">Name:</strong> {reference.name || "Not specified"}</div>
                <div><strong className="text-gray-600">Relationship:</strong> {reference.relationship || "Not specified"}</div>
                <div><strong className="text-gray-600">Contact:</strong> {reference.contact || "Not specified"}</div>
              </div>
            ))
          ) : (
            <div className="italic text-gray-500">No references provided</div>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <h4 className="flex items-center gap-2 text-lg font-semibold text-teal-700">
            <FiBookOpen className="text-teal-500" /> Additional Notes
          </h4>
          <div>{order.additionalNotes || <span className="italic text-gray-500">No additional notes</span>}</div>
        </div>
      </div>
    </div>
  );
};

export default ResumeWritingDetails;
