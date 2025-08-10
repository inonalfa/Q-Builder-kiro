import React, { useState } from 'react';
import type { ProjectStatus } from '../../types';

interface ProjectStatusModalProps {
  currentStatus: ProjectStatus;
  onClose: () => void;
  onUpdate: (newStatus: ProjectStatus) => void;
}

const ProjectStatusModal: React.FC<ProjectStatusModalProps> = ({
  currentStatus,
  onClose,
  onUpdate
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>(currentStatus);

  const statusOptions = [
    {
      value: 'active' as ProjectStatus,
      label: 'פעיל',
      description: 'הפרויקט בביצוע',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      value: 'completed' as ProjectStatus,
      label: 'הושלם',
      description: 'הפרויקט הושלם בהצלחה',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      value: 'cancelled' as ProjectStatus,
      label: 'בוטל',
      description: 'הפרויקט בוטל',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(selectedStatus);
  };

  const currentOption = statusOptions.find(option => option.value === currentStatus);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">עדכון סטטוס פרויקט</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Current Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סטטוס נוכחי
            </label>
            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${currentOption?.bgColor} ${currentOption?.color}`}>
              {currentOption?.label}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                בחר סטטוס חדש
              </label>
              <div className="space-y-3">
                {statusOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                      selectedStatus === option.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={selectedStatus === option.value}
                      onChange={(e) => setSelectedStatus(e.target.value as ProjectStatus)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <div className="mr-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${option.bgColor} ${option.color}`}>
                          {option.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Warning for status changes */}
            {selectedStatus !== currentStatus && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex">
                  <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="mr-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      שינוי סטטוס פרויקט
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      {selectedStatus === 'completed' && 'שינוי הסטטוס ל"הושלם" יסמן את הפרויקט כמושלם.'}
                      {selectedStatus === 'cancelled' && 'שינוי הסטטוס ל"בוטל" יסמן את הפרויקט כמבוטל.'}
                      {selectedStatus === 'active' && 'שינוי הסטטוס ל"פעיל" יחזיר את הפרויקט למצב פעיל.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                ביטול
              </button>
              <button
                type="submit"
                disabled={selectedStatus === currentStatus}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                עדכן סטטוס
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatusModal;