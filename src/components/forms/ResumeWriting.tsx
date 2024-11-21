import React, { useState } from 'react';
import { FaDollarSign } from 'react-icons/fa';

type ResumeRevampingFormProps = {
  onSubmit: (formData: any) => void;
  loading: boolean;
  error: string | null;
  amount: number;
};

type EducationEntry = {
  institution: string;
  degree: string;
  startYear: string;
  endYear: string;
};

type ExperienceEntry = {
  company: string;
  title: string;
  startYear: string;
  endYear: string;
  description: string;
};

type ReferenceEntry = {
  name: string;
  relationship: string;
  contact: string;
};

const ResumeRevampingForm: React.FC<ResumeRevampingFormProps> = ({ onSubmit, loading, error, amount }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    skills: '',
    additionalNotes: ''
  });

  const [education, setEducation] = useState<EducationEntry[]>([{ institution: '', degree: '', startYear: '', endYear: '' }]);
  const [experience, setExperience] = useState<ExperienceEntry[]>([{ company: '', title: '', startYear: '', endYear: '', description: '' }]);
  const [references, setReferences] = useState<ReferenceEntry[]>([{ name: '', relationship: '', contact: '' }]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEducationChange = (index: number, field: keyof EducationEntry, value: string) => {
    const updatedEducation = [...education];
    updatedEducation[index][field] = value;
    setEducation(updatedEducation);
  };

  const addEducationEntry = () => setEducation([...education, { institution: '', degree: '', startYear: '', endYear: '' }]);
  const removeEducationEntry = (index: number) => setEducation(education.filter((_, i) => i !== index));

  const handleExperienceChange = (index: number, field: keyof ExperienceEntry, value: string) => {
    const updatedExperience = [...experience];
    updatedExperience[index][field] = value;
    setExperience(updatedExperience);
  };

  const addExperienceEntry = () => setExperience([...experience, { company: '', title: '', startYear: '', endYear: '', description: '' }]);
  const removeExperienceEntry = (index: number) => setExperience(experience.filter((_, i) => i !== index));

  const handleReferenceChange = (index: number, field: keyof ReferenceEntry, value: string) => {
    const updatedReferences = [...references];
    updatedReferences[index][field] = value;
    setReferences(updatedReferences);
  };

  const addReferenceEntry = () => setReferences([...references, { name: '', relationship: '', contact: '' }]);
  const removeReferenceEntry = (index: number) => setReferences(references.filter((_, i) => i !== index));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const structuredData = {
      contact: { fullName: formData.fullName, email: formData.email, phone: formData.phone },
      skills: formData.skills.split(',').map((skill) => skill.trim()),
      education,
      experience,
      references
    };

    onSubmit(structuredData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="relative max-w-2xl bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg shadow-xl p-8">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white">
          <p>Submitting...</p>
        </div>
      )}
      <h2 className="text-xl text-teal-800 font-semibold mb-4">Create Your Resume</h2>
  
      {/* Contact Information */}
      <div className="mb-2">
      <h3 className="text-lg font-semibold text-teal-800 mb-4">Contacts</h3>
        <label htmlFor="fullName" className="block text-teal-700 text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          name="fullName"
          id="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleInputChange}
          required
          className="w-full p-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
  
      <div className="mb-2">
        <label htmlFor="email" className="block text-teal-700 text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full p-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
  
      <div className="mb-2">
        <label htmlFor="phone" className="block text-teal-700 text-sm font-medium mb-1">Phone Number</label>
        <input
          type="tel"
          name="phone"
          id="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleInputChange}
          required
          className="w-full p-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
  
      {/* Education Section */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-teal-800 mb-4">Education</h3>
        {education.map((edu, index) => (
          <div key={index} className="space-y-3 mb-4">
            <label htmlFor={`institution-${index}`} className="block text-teal-700 text-sm">Institution</label>
            <input
              type="text"
              id={`institution-${index}`}
              value={edu.institution}
              onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
              placeholder="Enter your institution"
              className="w-full p-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`degree-${index}`} className="block text-teal-700 text-sm">Degree</label>
            <input
              type="text"
              id={`degree-${index}`}
              value={edu.degree}
              onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
              placeholder="Enter your degree"
              className="w-full p-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`startYear-${index}`} className="block text-teal-700 text-sm">Start Year</label>
            <input
              type="text"
              id={`startYear-${index}`}
              value={edu.startYear}
              onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)}
              placeholder="Enter start year"
              className="w-full p-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`endYear-${index}`} className="block text-teal-700 text-sm">End Year</label>
            <input
              type="text"
              id={`endYear-${index}`}
              value={edu.endYear}
              onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)}
              placeholder="Enter end year"
              className="w-full p-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex justify-between mt-2">
              {education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducationEntry(index)}
                  className="text-red-600 text-xs"
                >
                  Remove
                </button>
              )}
              <button
                type="button"
                onClick={addEducationEntry}
                className="text-teal-600 text-xs"
              >
                Add Another Education
              </button>
            </div>
          </div>
        ))}
      </div>
  
      {/* Experience Section */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-teal-800 mb-4">Experience</h3>
        {experience.map((exp, index) => (
          <div key={index} className="space-y-3 mb-4">
            <label htmlFor={`company-${index}`} className="block text-teal-700 text-sm">Company</label>
            <input
              type="text"
              id={`company-${index}`}
              value={exp.company}
              onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
              placeholder="Enter company name"
              className="w-full p-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`title-${index}`} className="block text-teal-700 text-sm">Title</label>
            <input
              type="text"
              id={`title-${index}`}
              value={exp.title}
              onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
              placeholder="Enter your job title"
              className="w-full p-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`startYearExp-${index}`} className="block text-teal-700 text-sm">Start Year</label>
            <input
              type="text"
              id={`startYearExp-${index}`}
              value={exp.startYear}
              onChange={(e) => handleExperienceChange(index, 'startYear', e.target.value)}
              placeholder="Enter start year"
              className="w-full p-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`endYearExp-${index}`} className="block text-teal-700 text-sm">End Year</label>
            <input
              type="text"
              id={`endYearExp-${index}`}
              value={exp.endYear}
              onChange={(e) => handleExperienceChange(index, 'endYear', e.target.value)}
              placeholder="Enter end year"
              className="w-full p-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`description-${index}`} className="block text-teal-700 text-sm">Description</label>
            <textarea
              id={`description-${index}`}
              value={exp.description}
              onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
              placeholder="Describe your responsibilities"
              className="w-full p-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            ></textarea>
            <div className="flex justify-between mt-2">
              {experience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperienceEntry(index)}
                  className="text-red-600 text-xs"
                >
                  Remove
                </button>
              )}
              <button
                type="button"
                onClick={addExperienceEntry}
                className="text-teal-600 text-xs"
              >
                Add Another Experience
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Skills Section */}
      <div>
        <label htmlFor="skills" className="block text-lg font-semibold text-teal-800 mb-2">Skills</label>
        <textarea
          id="skills"
          value={formData.skills}
          onChange={handleInputChange}
          placeholder="Enter skills"
          className="w-full p-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3"
        />
      </div>
  
      {/* References Section */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-teal-800 mb-4">References</h3>
        {references.map((ref, index) => (
          <div key={index} className="space-y-3 mb-4">
            <label htmlFor={`name-${index}`} className="block text-teal-700 text-sm">Name</label>
            <input
              type="text"
              id={`name-${index}`}
              value={ref.name}
              onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
              placeholder="Enter reference name"
              className="w-full p-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`relationship-${index}`} className="block text-teal-700 text-sm">Relationship</label>
            <input
              type="text"
              id={`relationship-${index}`}
              value={ref.relationship}
              onChange={(e) => handleReferenceChange(index, 'relationship', e.target.value)}
              placeholder="Enter relationship with reference"
              className="w-full p-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`contact-${index}`} className="block text-teal-700 text-sm">Contact</label>
            <input
              type="text"
              id={`contact-${index}`}
              value={ref.contact}
              onChange={(e) => handleReferenceChange(index, 'contact', e.target.value)}
              placeholder="Enter reference contact"
              className="w-full p-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex justify-between mt-2">
              {references.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeReferenceEntry(index)}
                  className="text-red-600 text-xs"
                >
                  Remove
                </button>
              )}
              <button
                type="button"
                onClick={addReferenceEntry}
                className="text-teal-600 text-xs"
              >
                Add Another Reference
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Notes Section */}
      <div>
        <label htmlFor="additionalNotes" className="block text-teal-700 font-medium text-sm mb-2">Additional Notes</label>
        <textarea
          id="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleInputChange}
          placeholder="Enter any additional notes"
          className="w-full p-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3"
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
  
      <button
        type="submit"
        className="w-full py-2 mt-4 text-white font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );  
};

export default ResumeRevampingForm;
