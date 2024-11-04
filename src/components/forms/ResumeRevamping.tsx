import React, { useState } from 'react';

interface ResumeRevampingFormProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  formData: { [key: string]: any };
  categories: string[];
  amount: number;
  error: string | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ResumeRevampingForm: React.FC<ResumeRevampingFormProps> = ({
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

  const addGroup = (setGroups: React.Dispatch<React.SetStateAction<{ title: string; isOpen: boolean }[]>>, titlePrefix: string) => {
    setGroups(prevGroups => [...prevGroups, { title: `${titlePrefix} ${prevGroups.length + 1}`, isOpen: true }]);
  };

  const toggleGroup = (setGroups: React.Dispatch<React.SetStateAction<{ title: string; isOpen: boolean }[]>>, index: number) => {
    setGroups(prevGroups =>
      prevGroups.map((group, i) => (i === index ? { ...group, isOpen: !group.isOpen } : group))
    );
  };

  const renderInputField = (id: string, label: string, isTextarea?: boolean) => (
    <div className="mb-4" key={id}>
      <label htmlFor={id} className="block text-gray-700 font-medium mb-1">{label}</label>
      {isTextarea ? (
        <textarea
          id={id}
          name={id}
          required
          value={formData[id] || ''}
          onChange={onChange}
          className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
          rows={4}
        />
      ) : (
        <input
          type="text"
          id={id}
          name={id}
          required
          value={formData[id] || ''}
          onChange={onChange}
          className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
        />
      )}
    </div>
  );

  return (
    <form
      className="relative max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6"
      onSubmit={onSubmit}
    >
      <h2 className="text-2xl text-teal-800 mb-6">Order Resume Revamping</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Selected Categories</label>
        <p className="border border-gray-300 rounded-md p-2">
          {categories.length > 0 ? categories.join(", ") : "No categories selected"}
        </p>
      </div>

      {['fullName', 'phone', 'email', 'address'].map(id =>
        renderInputField(id, id.replace(/^\w/, c => c.toUpperCase()))
      )}

      {/** Education Achievements Section **/}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Education Achievements</h3>
        {educationGroups.map((group, index) => (
          <GroupSection
            key={index}
            title={group.title}
            isOpen={group.isOpen}
            onToggle={() => toggleGroup(setEducationGroups, index)}
            fields={[
              { id: `educationInstitution${index}`, label: 'Institution' },
              { id: `yearOfCompletion${index}`, label: 'Year of Completion' },
              { id: `courseCertification${index}`, label: 'Course/Certification' },
            ]}
            onChange={onChange}
            formData={formData}
          />
        ))}
        <button type="button" onClick={() => addGroup(setEducationGroups, 'Achievement')} className="mt-2 text-teal-600 hover:underline">
          Add Education Achievement
        </button>
      </div>

      {/** Work Experience Section **/}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Work Experience</h3>
        {workExperienceGroups.map((group, index) => (
          <GroupSection
            key={index}
            title={group.title}
            isOpen={group.isOpen}
            onToggle={() => toggleGroup(setWorkExperienceGroups, index)}
            fields={[
              { id: `experienceInstitution${index}`, label: 'Institution' },
              { id: `startDate${index}`, label: 'Start Date' },
              { id: `endDate${index}`, label: 'End Date' },
              { id: `position${index}`, label: 'Position' },
              { id: `roles${index}`, label: 'Responsibilities/Roles', isTextarea: true },
            ]}
            onChange={onChange}
            formData={formData}
          />
        ))}
        <button type="button" onClick={() => addGroup(setWorkExperienceGroups, 'Experience')} className="mt-2 text-teal-600 hover:underline">
          Add Work Experience
        </button>
      </div>

      {/** References Section **/}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">References</h3>
        {referenceGroups.map((group, index) => (
          <GroupSection
            key={index}
            title={group.title}
            isOpen={group.isOpen}
            onToggle={() => toggleGroup(setReferenceGroups, index)}
            fields={[
              { id: `referenceName${index}`, label: 'Name' },
              { id: `referenceContact${index}`, label: 'Contact' },
            ]}
            onChange={onChange}
            formData={formData}
          />
        ))}
        <button type="button" onClick={() => addGroup(setReferenceGroups, 'Reference')} className="mt-2 text-teal-600 hover:underline">
          Add Reference
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <h4 className="text-lg font-medium text-gray-800">Total Price: ${amount.toFixed(2)}</h4>
      </div>

      <button
        type="submit"
        className={`mt-4 w-full p-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

const GroupSection = ({
  title,
  isOpen,
  onToggle,
  fields,
  onChange,
  formData,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  fields: { id: string; label: string; isTextarea?: boolean }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  formData: { [key: string]: any };
}) => (
  <div className="mt-4">
    <button type="button" onClick={onToggle} className="text-teal-600 hover:underline">
      {isOpen ? 'Collapse' : 'Expand'} {title}
    </button>
    {isOpen && (
      <fieldset className="mt-2 p-4 border border-gray-300 rounded-lg bg-gray-50">
        <legend className="text-lg font-medium text-gray-800 mb-2">{title}</legend>
        {fields.map(({ id, label, isTextarea }) => (
          <div className="mb-4" key={id}>
            <label htmlFor={id} className="block text-gray-700 font-medium mb-1">{label}</label>
            {isTextarea ? (
              <textarea
                id={id}
                name={id}
                required
                value={formData[id] || ''}
                onChange={onChange}
                className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                rows={4}
              />
            ) : (
              <input
                type="text"
                id={id}
                name={id}
                required
                value={formData[id] || ''}
                onChange={onChange}
                className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              />
            )}
          </div>
        ))}
      </fieldset>
    )}
  </div>
);

export default ResumeRevampingForm;
