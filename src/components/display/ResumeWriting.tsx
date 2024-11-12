import React from 'react';
import { Order } from "@/utils/orderUtils";

interface ResumeWritingDetailsProps {
  order: Order;
}

const ResumeWritingDetails: React.FC<ResumeWritingDetailsProps> = ({ order }) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md space-x-8">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Resume Writing Details</h3>
      <div className="space-y-4">
        {/* Contact Information */}
        <div>
          <h4 className="text-md font-semibold text-gray-600">Contact Information</h4>
          <p><strong className="text-teal-700">Full Name:</strong> {order.contact.fullName || "Not specified"}</p>
          <p><strong className="text-teal-700">Email:</strong> {order.contact.email || "Not specified"}</p>
          <p><strong className="text-teal-700">Phone:</strong> {order.contact.phone || "Not specified"}</p>
        </div>

        {/* Education Information */}
        <div>
          <h4 className="text-md font-semibold text-gray-600">Education</h4>
          {order.education.length > 0 ? (
            order.education.map((education, index) => (
              <div key={index} className="mb-2">
                <p><strong className="text-teal-700">Institution:</strong> {education.institution || "Not specified"}</p>
                <p><strong className="text-teal-700">Degree:</strong> {education.degree || "Not specified"}</p>
                <p><strong className="text-teal-700">Start Year:</strong> {education.startYear || "Not specified"}</p>
                <p><strong className="text-teal-700">End Year:</strong> {education.endYear || "Not specified"}</p>
              </div>
            ))
          ) : (
            <p>No education information provided</p>
          )}
        </div>

        {/* Experience Information */}
        <div>
          <h4 className="text-md font-semibold text-gray-600">Experience</h4>
          {order.experience.length > 0 ? (
            order.experience.map((experience, index) => (
              <div key={index} className="mb-2">
                <p><strong className="text-teal-700">Company:</strong> {experience.company || "Not specified"}</p>
                <p><strong className="text-teal-700">Title:</strong> {experience.title || "Not specified"}</p>
                <p><strong className="text-teal-700">Start Year:</strong> {experience.startYear || "Not specified"}</p>
                <p><strong className="text-teal-700">End Year:</strong> {experience.endYear || "Not specified"}</p>
                <p><strong className="text-teal-700">Description:</strong> {experience.description || "Not specified"}</p>
              </div>
            ))
          ) : (
            <p>No experience information provided</p>
          )}
        </div>

        {/* Skills Information */}
        <div>
          <h4 className="text-md font-semibold text-gray-600">Skills</h4>
          <p>{order.skills.length > 0 ? order.skills.join(", ") : "No skills provided"}</p>
        </div>

        {/* References Information */}
        <div>
          <h4 className="text-md font-semibold text-gray-600">References</h4>
          {order.references.length > 0 ? (
            order.references.map((references, index) => (
              <div key={index} className="mb-2">
                <p><strong className="text-teal-700">Name:</strong> {references.name || "Not specified"}</p>
                <p><strong className="text-teal-700">Relationship:</strong> {references.relationship || "Not specified"}</p>
                <p><strong className="text-teal-700">Contact:</strong> {references.contact || "Not specified"}</p>
              </div>
            ))
          ) : (
            <p>No references provided</p>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <h4 className="text-md font-semibold text-gray-600">Additional Notes</h4>
          <p>{order.additionalNotes || "No additional notes"}</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeWritingDetails;
