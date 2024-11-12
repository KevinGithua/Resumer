import React, { useState } from 'react';

type ResumeRevampingFormProps = {
  onSubmit: (formData: any) => void;
  loading: boolean;
  error: string | null;
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

const ResumeRevampingForm: React.FC<ResumeRevampingFormProps> = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    skills: ''
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
    <form onSubmit={handleFormSubmit} className="relative max-w-3xl mx-auto bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg shadow-xl p-8">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white">
          <p>Submitting...</p>
        </div>
      )}
      <h2 className="text-2xl text-teal-800 font-semibold">Create Your Resume</h2>

      {/* Contact Information */}
      <div className="mb-4">
        <label htmlFor="fullName" className="block text-gray-700 font-medium">Full Name</label>
        <input
          type="text"
          name="fullName"
          id="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleInputChange}
          required
          className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block text-gray-700 font-medium">Phone Number</label>
        <input
          type="tel"
          name="phone"
          id="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleInputChange}
          required
          className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Skills Section */}
      <div className="mb-4">
        <label htmlFor="skills" className="block text-gray-700 font-medium">Skills</label>
        <input
          type="text"
          name="skills"
          id="skills"
          placeholder="Enter your skills, separated by commas"
          value={formData.skills}
          onChange={handleInputChange}
          required
          className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Education Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Education</h3>
        {education.map((edu, index) => (
          <div key={index} className="space-y-2 mb-4">
            <label htmlFor={`institution-${index}`} className="block text-gray-700">Institution</label>
            <input
              type="text"
              id={`institution-${index}`}
              value={edu.institution}
              onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
              placeholder="Enter your institution"
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`degree-${index}`} className="block text-gray-700">Degree</label>
            <input
              type="text"
              id={`degree-${index}`}
              value={edu.degree}
              onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
              placeholder="Enter your degree"
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`startYear-${index}`} className="block text-gray-700">Start Year</label>
            <input
              type="text"
              id={`startYear-${index}`}
              value={edu.startYear}
              onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)}
              placeholder="Enter start year"
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`endYear-${index}`} className="block text-gray-700">End Year</label>
            <input
              type="text"
              id={`endYear-${index}`}
              value={edu.endYear}
              onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)}
              placeholder="Enter end year"
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex justify-between mt-2">
              {education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducationEntry(index)}
                  className="text-red-600"
                >
                  Remove
                </button>
              )}
              <button
                type="button"
                onClick={addEducationEntry}
                className="text-teal-600"
              >
                Add Another Education
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Experience Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Experience</h3>
        {experience.map((exp, index) => (
          <div key={index} className="space-y-2 mb-4">
            <label htmlFor={`company-${index}`} className="block text-gray-700">Company</label>
            <input
              type="text"
              id={`company-${index}`}
              value={exp.company}
              onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
              placeholder="Enter company name"
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`title-${index}`} className="block text-gray-700">Title</label>
            <input
              type="text"
              id={`title-${index}`}
              value={exp.title}
              onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
              placeholder="Enter your job title"
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`startYearExp-${index}`} className="block text-gray-700">Start Year</label>
            <input
              type="text"
              id={`startYearExp-${index}`}
              value={exp.startYear}
              onChange={(e) => handleExperienceChange(index, 'startYear', e.target.value)}
              placeholder="Enter start year"
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`endYearExp-${index}`} className="block text-gray-700">End Year</label>
            <input
              type="text"
              id={`endYearExp-${index}`}
              value={exp.endYear}
              onChange={(e) => handleExperienceChange(index, 'endYear', e.target.value)}
              placeholder="Enter end year"
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`description-${index}`} className="block text-gray-700">Description</label>
            <textarea
              id={`description-${index}`}
              value={exp.description}
              onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
              placeholder="Describe your responsibilities"
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            ></textarea>
            <div className="flex justify-between mt-2">
              {experience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperienceEntry(index)}
                  className="text-red-600"
                >
                  Remove
                </button>
              )}
              <button
                type="button"
                onClick={addExperienceEntry}
                className="text-teal-600"
              >
                Add Another Experience
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* References Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">References</h3>
        {references.map((ref, index) => (
          <div key={index} className="space-y-2 mb-4">
            <label htmlFor={`name-${index}`} className="block text-gray-700">Name</label>
            <input
              type="text"
              id={`name-${index}`}
              value={ref.name}
              onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
              placeholder="Enter reference name"
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`relationship-${index}`} className="block text-gray-700">Relationship</label>
            <input
              type="text"
              id={`relationship-${index}`}
              value={ref.relationship}
              onChange={(e) => handleReferenceChange(index, 'relationship', e.target.value)}
              placeholder="Enter relationship with reference"
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label htmlFor={`contact-${index}`} className="block text-gray-700">Contact</label>
            <input
              type="text"
              id={`contact-${index}`}
              value={ref.contact}
              onChange={(e) => handleReferenceChange(index, 'contact', e.target.value)}
              placeholder="Enter reference contact"
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex justify-between mt-2">
              {references.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeReferenceEntry(index)}
                  className="text-red-600"
                >
                  Remove
                </button>
              )}
              <button
                type="button"
                onClick={addReferenceEntry}
                className="text-teal-600"
              >
                Add Another Reference
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-teal-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default ResumeRevampingForm;
