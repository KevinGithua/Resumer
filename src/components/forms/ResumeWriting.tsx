import React, { useState } from 'react';

interface ResumeWritingFormProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  formData: { [key: string]: any };
  categories: string[];
  amount: number;
  error: string | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ResumeWritingForm: React.FC<ResumeWritingFormProps> = ({
  onChange,
  formData,
  categories,
  amount,
  error,
  loading,
  onSubmit,
}) => {
  const [educationGroups, setEducationGroups] = useState<{ title: string; isOpen: boolean }[]>([]);
  const [workExperienceGroups, setWorkExperienceGroups] = useState<{ title: string; isOpen: boolean }[]>([]);
  const [referenceGroups, setReferenceGroups] = useState<{ title: string; isOpen: boolean }[]>([]);

  const addGroup = (type: string) => {
    const newGroup = {
      title: `${type} ${
        type === 'Achievement' ? educationGroups.length + 1 : type === 'Experience' ? workExperienceGroups.length + 1 : referenceGroups.length + 1
      }`,
      isOpen: true,
    };
    if (type === 'Achievement') setEducationGroups([...educationGroups, newGroup]);
    else if (type === 'Experience') setWorkExperienceGroups([...workExperienceGroups, newGroup]);
    else setReferenceGroups([...referenceGroups, newGroup]);
  };

  const toggleGroup = (type: string, index: number) => {
    const toggleFunction = (groups: any) =>
      groups.map((group: any, i: number) => (i === index ? { ...group, isOpen: !group.isOpen } : group));
    if (type === 'Achievement') setEducationGroups(toggleFunction(educationGroups));
    else if (type === 'Experience') setWorkExperienceGroups(toggleFunction(workExperienceGroups));
    else setReferenceGroups(toggleFunction(referenceGroups));
  };

  const renderGroupFields = (groupType: string, index: number, fields: any[]) => (
    <fieldset className="mt-2 p-4 border border-gray-300 rounded-lg bg-gray-50">
      <legend className="text-lg font-medium text-gray-800 mb-2">{`${groupType} ${index + 1}`}</legend>
      {fields.map(({ id, label, isTextarea }: any) => (
        <div className="mb-4" key={id}>
          <label htmlFor={id} className="block text-gray-700 font-medium mb-1">
            {label}
          </label>
          {isTextarea ? (
            <textarea
              id={id}
              name={id}
              required
              value={formData[id] || ''}
              onChange={onChange}
              className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
              rows={4}
            ></textarea>
          ) : (
            <input
              type="text"
              id={id}
              name={id}
              required
              value={formData[id] || ''}
              onChange={onChange}
              className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            />
          )}
        </div>
      ))}
    </fieldset>
  );

  return (
    <form
      className="relative max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6"
      onSubmit={(e) => {
        e.preventDefault(); // Prevents page refresh
        onSubmit(e); // Passes event to parent handler
      }}
    >
      <h2 className="text-2xl text-teal-800 mb-6">Order Resume Writing</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Selected Categories</label>
        <p className="border border-gray-300 rounded-md p-2">
          {categories.length > 0 ? categories.join(', ') : 'No categories selected'}
        </p>
      </div>

      {/* Contacts Section */}
      <h3 className="text-lg font-medium text-gray-800 mb-2">Contacts</h3>
      {[
        { id: 'fullName', label: 'Full Name', type: 'text' },
        { id: 'phone', label: 'Phone No', type: 'text' },
        { id: 'email', label: 'Email', type: 'email' },
        { id: 'address', label: 'Address', type: 'text' },
      ].map(({ id, label, type }) => (
        <div className="mb-4" key={id}>
          <label htmlFor={id} className="block text-gray-700 font-medium mb-1">
            {label}
          </label>
          <input
            type={type}
            id={id}
            name={id}
            required
            value={formData[id] || ''}
            onChange={onChange}
            className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
          />
        </div>
      ))}

      {/* Group Sections */}
      {[
        {
          title: 'Education Achievements',
          type: 'Achievement',
          groups: educationGroups,
          fields: [
            { id: 'educationInstitution', label: 'Institution' },
            { id: 'yearOfCompletion', label: 'Year of Completion' },
            { id: 'courseCertification', label: 'Course/Certification' },
          ],
        },
        {
          title: 'Work Experience',
          type: 'Experience',
          groups: workExperienceGroups,
          fields: [
            { id: 'experienceInstitution', label: 'Institution' },
            { id: 'startDate', label: 'Start Date' },
            { id: 'endDate', label: 'End Date' },
            { id: 'position', label: 'Position' },
            { id: 'roles', label: 'Responsibilities/Roles', isTextarea: true },
          ],
        },
        {
          title: 'References',
          type: 'Reference',
          groups: referenceGroups,
          fields: [
            { id: 'referenceName', label: 'Name' },
            { id: 'referenceContact', label: 'Contact Info' },
            { id: 'referenceRelationship', label: 'Relationship' },
          ],
        },
      ].map(({ title, type, groups, fields }) => (
        <div className="mb-4" key={type}>
          <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
          {groups.map((group, index) => (
            <div key={index} className="mt-4">
              <button type="button" onClick={() => toggleGroup(type, index)} className="text-teal-600 hover:underline">
                {group.isOpen ? 'Collapse' : 'Expand'} {group.title}
              </button>
              {group.isOpen && renderGroupFields(type, index, fields)}
            </div>
          ))}
          <button type="button" onClick={() => addGroup(type)} className="mt-2 text-teal-600 hover:underline">
            Add {title}
          </button>
        </div>
      ))}

      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-6">
        <h3 className="text-xl font-bold">Total Amount: ${amount}</h3>
      </div>
      <button
        type="submit"
        className={`bg-green-500 text-white font-semibold py-2 px-4 rounded transition duration-200 hover:bg-green-600 focus:outline-none ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default ResumeWritingForm;
