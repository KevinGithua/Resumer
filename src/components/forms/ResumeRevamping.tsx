import React, { useState } from 'react';
import { storage } from "@/lib/firebase"; // Ensure Firebase is imported here
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
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

type SkillsEntry = {
  skill: string;
}

type ReferenceEntry = {
  name: string;
  relationship: string;
  email: string;
  phone:string;
};

const ResumeRevampingForm: React.FC<ResumeRevampingFormProps> = ({ onSubmit, loading, error, amount }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    resumeFileUrl: '',
    additionalNotes: '',
  });

  const [education, setEducation] = useState<EducationEntry[]>([{ institution: '', degree: '', startYear: '', endYear: '' }]);
  const [experience, setExperience] = useState<ExperienceEntry[]>([{ company: '', title: '', startYear: '', endYear: '', description: '' }]);
  const [skills, setSkills] = useState<SkillsEntry[]>([{ skill: ''}]);
  const [references, setReferences] = useState<ReferenceEntry[]>([{ name: '', relationship: '', email: '' , phone:''}]);

  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileUploadLoading(true);
    setFileUploadError(null);

    try {
      const fileRef = storageRef(storage, `${file.name}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
      setFormData((prevData) => ({ ...prevData, resumeFileUrl: fileUrl }));
    } catch (error) {
      setFileUploadError("Failed to upload resume. Please try again.");
    } finally {
      setFileUploadLoading(false);
    }
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

  const handleSkillsChange = (index: number, field: keyof SkillsEntry, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index][field] = value;
    setSkills(updatedSkills);
  };

  const addSkillsEntry = () => setSkills([...skills, { skill: ''}]);
  const removeSkillsEntry = (index: number) => setSkills(skills.filter((_, i) => i !== index));

  const handleReferenceChange = (index: number, field: keyof ReferenceEntry, value: string) => {
    const updatedReferences = [...references];
    updatedReferences[index][field] = value;
    setReferences(updatedReferences);
  };

  const addReferenceEntry = () => setReferences([...references, { name: '', relationship: '', email: '', phone:'' }]);
  const removeReferenceEntry = (index: number) => setReferences(references.filter((_, i) => i !== index));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const structuredData = {
      contact: { fullName: formData.fullName, email: formData.email, phone: formData.phone },
      resumeFileUrl: formData.resumeFileUrl,
      skills,
      education,
      experience,
      references,
      additionalNotes: formData.additionalNotes,
    };

    onSubmit(structuredData);
  };

  return (
    <form 
      onSubmit={handleFormSubmit} 
      className="relative bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg shadow-xl p-8 space-y-6"
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white">
          <p className="text-lg font-semibold">Submitting...</p>
        </div>
      )}
      <h2 className="text-2xl text-fuchsia-800 font-semibold text-center mb-4">Resume Revamping</h2>
      <p className="mb-6 text-lg text-gray-600 text-center">
        Create a compelling resume that complements your career and boosts your chances of success.
      </p>
  
      <div className="flex flex-col gap-6 text-lg">
        {/* Resume Upload */}
        <div className="flex flex-col gap-2">
          <label htmlFor="resumeFile" className="block text-teal-700 font-medium mb-2 text-sm">Upload Existing Resume</label>
          <input
            type="file"
            name="resumeFile"
            id="resumeFile"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            required
            className="w-full block sm:w-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-700 transition duration-200 cursor-pointer"
          />
          {fileUploadLoading && <p className="mt-2 text-teal-600 text-sm">Uploading...</p>}
          {fileUploadError && <p className="text-red-600 text-sm">{fileUploadError}</p>}
        </div>
    
        {/* Contact Information */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-teal-800">Contacts Information</h3>
            <label htmlFor="fullName" className="block text-teal-700 text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          
      
          <div className='flex flex-col sm:flex-row  gap-2'>
            <div className='sm:w-1/2'>
              <label htmlFor="email" className="block text-teal-700 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
        
            <div className='sm:w-1/2'>
              <label htmlFor="phone" className="block text-teal-700 text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
    
        {/* Education Section */}
        <div className='flex flex-col gap-2'>
          <h3 className="text-lg font-semibold text-teal-800">Academic Details</h3>
          {education.map((edu, index) => (
            <div key={index} className="space-y-3 mb-4">
              <div>
                <label htmlFor={`institution-${index}`} className="block text-teal-700 text-sm">Institution</label>
                <input
                  type="text"
                  id={`institution-${index}`}
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  placeholder="Enter your institution"
                  className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <label htmlFor={`degree-${index}`} className="block text-teal-700 text-sm">Degree Acquired</label>
              <input
                type="text"
                id={`degree-${index}`}
                value={edu.degree}
                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                placeholder="Enter your degree"
                className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              
              <div className='w-full flex gap-4 justify-between'>
                <div className='sm:w-1/2'>
                  <label htmlFor={`startYear-${index}`} className="block text-teal-700 text-sm">Start Year</label>
                  <input
                    type="date"
                    id={`startYear-${index}`}
                    value={edu.startYear}
                    onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)}
                    placeholder="Enter start year"
                    className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className='sm:w-1/2'>
                  <label htmlFor={`endYear-${index}`} className="block text-teal-700 text-sm">End Year</label>
                  <input
                    type="date"
                    id={`endYear-${index}`}
                    value={edu.endYear}
                    onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)}
                    placeholder="Enter end year"
                    className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
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
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-teal-800">Experience</h3>
          {experience.map((exp, index) => (
            <div key={index} className="flex flex-col gap-2">
              <label htmlFor={`company-${index}`} className="block text-teal-700 text-sm">Company/Orgnaization</label>
              <input
                type="text"
                id={`company-${index}`}
                value={exp.company}
                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                placeholder="Enter company name"
                className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <label htmlFor={`title-${index}`} className="block text-teal-700 text-sm">Title/Position</label>
              <input
                type="text"
                id={`title-${index}`}
                value={exp.title}
                onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                placeholder="Enter your job title"
                className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className='flex gap-2'>
                <div className='w-1/2 flex flex-col gap-2'>
                  <label htmlFor={`startYearExp-${index}`} className="block text-teal-700 text-sm">Start Year</label>
                  <input
                    type="date"
                    id={`startYearExp-${index}`}
                    value={exp.startYear}
                    onChange={(e) => handleExperienceChange(index, 'startYear', e.target.value)}
                    placeholder="Enter start year"
                    className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className='w-1/2 flex flex-col gap-2'>
                  <label htmlFor={`endYearExp-${index}`} className="block text-teal-700 text-sm">End Year</label>
                  <input
                    type="date"
                    id={`endYearExp-${index}`}
                    value={exp.endYear}
                    onChange={(e) => handleExperienceChange(index, 'endYear', e.target.value)}
                    placeholder="Enter end year"
                    className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <label htmlFor={`description-${index}`} className="block text-teal-700 text-sm">Description</label>
              <textarea
                id={`description-${index}`}
                value={exp.description}
                onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                placeholder="Describe your responsibilities"
                className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              ></textarea>
              <div className="flex justify-between">
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
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-teal-800">Highlight Your Skills</h3>
          {skills.map((skill, index) => (
            <div key={index} className='flex flex-col gap-2'>
              <label htmlFor={`skill-${index}`} className="block text-teal-700 text-sm">Skill {index+1}</label>
              <input
                type='text'
                name='skill'
                id={`skill-${index}`}
                value={skill.skill}
                onChange={(e) => handleSkillsChange(index, 'skill', e.target.value)}
                placeholder={`Enter your skill ${index+1}`}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={addSkillsEntry}
                  className="font-mono font-semibold text-sm"
                >
                  Add Another Skill
                </button>
                {skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSkillsEntry(index)}
                    className="text-red-600 text-sm font-mono font-semibold"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
    
        {/* References Section */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-teal-800">References</h3>
          {references.map((ref, index) => (
            <div key={index} className="flex flex-col gap-2">
              <label htmlFor={`name-${index}`} className="block text-teal-700 text-sm">Name</label>
              <input
                type="text"
                id={`name-${index}`}
                value={ref.name}
                onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                placeholder="Enter reference name"
                className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <label htmlFor={`relationship-${index}`} className="block text-teal-700 text-sm">Relationship</label>
              <input
                type="text"
                id={`relationship-${index}`}
                value={ref.relationship}
                onChange={(e) => handleReferenceChange(index, 'relationship', e.target.value)}
                placeholder="Enter relationship with reference"
                className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className='flex flex-col sm:flex-row gap-2 sm:items-center'>
                <div className='sm:w-1/2'>
                  <label htmlFor={`email-${index}`} className="block text-teal-700 text-sm">Email</label>
                      <input
                        type="text"
                        id={`email-${index}`}
                        value={ref.email}
                        onChange={(e) => handleReferenceChange(index, 'email', e.target.value)}
                        placeholder="Enter referee's email"
                        className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                </div>
                <div className='sm:w-1/2'>
                  <label htmlFor={`phone-${index}`} className="block text-teal-700 text-sm">Phone</label>
                  <input
                    type="text"
                    id={`email-${index}`}
                    value={ref.phone}
                    onChange={(e) => handleReferenceChange(index, 'phone', e.target.value)}
                    placeholder="Enter referee's phone number"
                    className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="flex justify-between font-mono font-semibold">
                {references.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeReferenceEntry(index)}
                    className="text-red-600  text-xs"
                  >
                    Remove
                  </button>
                )}
                <button
                  type="button"
                  onClick={addReferenceEntry}
                  className=" text-xs"
                >
                  Add Another Reference
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Notes Section */}
        <div className="flex flex-col gap-2">
          <label htmlFor="additionalNotes" className="block text-teal-700 font-medium text-sm">Additional Notes</label>
          <textarea
            name='additionalNotes'
            id="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            placeholder="Enter any additional notes"
            className="w-full p-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
      </div>
      </form>
    );  
};

export default ResumeRevampingForm;
