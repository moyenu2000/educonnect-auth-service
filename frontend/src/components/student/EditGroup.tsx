import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/useToast';
import { type Group, type UpdateGroupRequest, groupService } from '../../services/groupService';
import { 
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface FormData {
  name: string;
  description: string;
  avatarUrl?: string;
  rules?: string;
}

const EditGroup: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<Group | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>();

  const fetchGroupDetails = useCallback(async () => {
    if (!groupId) return;
    
    try {
      setLoading(true);
      const groupData = await groupService.getGroupById(parseInt(groupId));
      setGroup(groupData);
      
      // Populate form with existing data
      setValue('name', groupData.name);
      setValue('description', groupData.description);
      setValue('avatarUrl', groupData.avatarUrl || '');
      setValue('rules', groupData.rules || '');
    } catch (error: any) {
      console.error('Error fetching group details:', error);
      showToast(error.message || 'Failed to load group details', 'error');
      navigate('/student/groups');
    } finally {
      setLoading(false);
    }
  }, [groupId, setValue, showToast, navigate]);

  useEffect(() => {
    fetchGroupDetails();
  }, [fetchGroupDetails]);

  const onSubmit = async (data: FormData) => {
    if (!group) return;

    try {
      setIsSubmitting(true);
      
      const updateData: UpdateGroupRequest = {
        name: data.name.trim(),
        description: data.description.trim(),
        ...(data.avatarUrl && data.avatarUrl.trim() && { avatarUrl: data.avatarUrl.trim() }),
        ...(data.rules && data.rules.trim() && { rules: data.rules.trim() }),
      };

      await groupService.updateGroup(group.id, updateData);
      
      showToast('Group updated successfully!', 'success');
      navigate(`/student/groups/${group.id}`);
    } catch (error: any) {
      console.error('Error updating group:', error);
      showToast(error.message || 'Failed to update group', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" disabled>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Edit Group</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-300 rounded w-1/3 animate-pulse"></div>
          </CardHeader>
          <CardContent className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2 animate-pulse"></div>
                <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Group not found</h2>
        <p className="text-gray-600 mt-2">The group you're trying to edit doesn't exist.</p>
        <Button onClick={() => navigate('/student/groups')} className="mt-4">
          Back to Groups
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/student/groups/${group.id}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Group</h1>
      </div>

      {/* Info Alert */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Editing Limitations</p>
              <p>You can only edit the name, description, avatar, and rules. Group type and privacy settings cannot be changed after creation.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Group Information</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Current Group Type and Privacy (Read-only) */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Type
                </label>
                <p className="text-sm text-gray-600 capitalize">{group.type.toLowerCase()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Privacy
                </label>
                <p className="text-sm text-gray-600">
                  {group.isPrivate ? 'Private' : 'Public'}
                </p>
              </div>
            </div>

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
                Update the group's avatar image (optional)
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
                onClick={() => navigate(`/student/groups/${group.id}`)}
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
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

export default EditGroup;