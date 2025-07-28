import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/useToast';
import { type CreateGroupRequest, groupService } from '../../services/groupService';
import { 
  ArrowLeft,
  BookOpen,
  FolderOpen,
  Lock,
  Globe,
  Save,
  Loader2
} from 'lucide-react';

interface FormData {
  name: string;
  description: string;
  type: 'STUDY' | 'PROJECT';
  subjectId?: number;
  classLevel?: string;
  isPrivate: boolean;
  avatarUrl?: string;
  rules?: string;
}

const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      type: 'STUDY',
      isPrivate: false
    }
  });

  const watchType = watch('type');
  const watchIsPrivate = watch('isPrivate');

  const classLevels = [
    { value: 'CLASS_6', label: 'Class 6' },
    { value: 'CLASS_7', label: 'Class 7' },
    { value: 'CLASS_8', label: 'Class 8' },
    { value: 'CLASS_9', label: 'Class 9' },
    { value: 'CLASS_10', label: 'Class 10' },
    { value: 'CLASS_11', label: 'Class 11' },
    { value: 'CLASS_12', label: 'Class 12' },
    { value: 'UNDERGRADUATE', label: 'Undergraduate' },
    { value: 'GRADUATE', label: 'Graduate' },
  ];

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      const groupData: CreateGroupRequest = {
        name: data.name.trim(),
        description: data.description.trim(),
        type: data.type,
        isPrivate: data.isPrivate,
        ...(data.subjectId && { subjectId: data.subjectId }),
        ...(data.classLevel && { classLevel: data.classLevel }),
        ...(data.avatarUrl && data.avatarUrl.trim() && { avatarUrl: data.avatarUrl.trim() }),
        ...(data.rules && data.rules.trim() && { rules: data.rules.trim() }),
      };

      const createdGroup = await groupService.createGroup(groupData);
      
      showToast('Group created successfully!', 'success');
      navigate(`/student/groups/${createdGroup.id}`);
    } catch (error: any) {
      console.error('Error creating group:', error);
      showToast(error.message || 'Failed to create group', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/student/groups')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Create New Group</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Group Information</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Group Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name *
              </label>
              <Input
                {...register('name', { 
                  required: 'Group name is required',
                  minLength: { value: 3, message: 'Group name must be at least 3 characters' },
                  maxLength: { value: 100, message: 'Group name cannot exceed 100 characters' }
                })}
                placeholder="Enter group name"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description', { 
                  required: 'Description is required',
                  minLength: { value: 10, message: 'Description must be at least 10 characters' },
                  maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
                })}
                placeholder="Describe your group's purpose and goals"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[100px]"
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Group Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('type', 'STUDY')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    watchType === 'STUDY'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={isSubmitting}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5" />
                    <span className="font-medium">Study Group</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    For academic discussions and study sessions
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setValue('type', 'PROJECT')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    watchType === 'PROJECT'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={isSubmitting}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FolderOpen className="w-5 h-5" />
                    <span className="font-medium">Project Group</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    For collaborative projects and assignments
                  </p>
                </button>
              </div>
            </div>

            {/* Class Level (for Study groups) */}
            {watchType === 'STUDY' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Level
                </label>
                <select
                  {...register('classLevel')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                >
                  <option value="">Select class level (optional)</option>
                  {classLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Subject ID (placeholder for now) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject ID
              </label>
              <Input
                {...register('subjectId', { 
                  valueAsNumber: true,
                  validate: (value) => !value || value > 0 || 'Subject ID must be a positive number'
                })}
                type="number"
                placeholder="Enter subject ID (optional)"
                disabled={isSubmitting}
              />
              {errors.subjectId && (
                <p className="text-red-500 text-sm mt-1">{errors.subjectId.message}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Link this group to a specific subject (optional)
              </p>
            </div>

            {/* Privacy Setting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Privacy Setting *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('isPrivate', false)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    !watchIsPrivate
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={isSubmitting}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-5 h-5" />
                    <span className="font-medium">Public</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Anyone can find and join this group
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setValue('isPrivate', true)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    watchIsPrivate
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={isSubmitting}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-5 h-5" />
                    <span className="font-medium">Private</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Only members can see group content
                  </p>
                </button>
              </div>
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Avatar URL
              </label>
              <Input
                {...register('avatarUrl', {
                  pattern: {
                    value: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
                    message: 'Please enter a valid image URL'
                  }
                })}
                type="url"
                placeholder="https://example.com/avatar.jpg (optional)"
                disabled={isSubmitting}
              />
              {errors.avatarUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.avatarUrl.message}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Add a custom avatar for your group (optional)
              </p>
            </div>

            {/* Group Rules */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Rules
              </label>
              <textarea
                {...register('rules', {
                  maxLength: { value: 1000, message: 'Rules cannot exceed 1000 characters' }
                })}
                placeholder="Set some ground rules for your group (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[80px]"
                disabled={isSubmitting}
              />
              {errors.rules && (
                <p className="text-red-500 text-sm mt-1">{errors.rules.message}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Help members understand the group's expectations
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/student/groups')}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Group
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateGroup;