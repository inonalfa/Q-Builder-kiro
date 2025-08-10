import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClientStore } from '../../stores/clientStore';
import usePageTitle from '../../hooks/usePageTitle';
import { 
  Button, 
  Card, 
  CardHeader,
  CardTitle,
  Input, 
  Modal
} from '../../components/ui/AppleComponents';
import type { Client } from '../../types';

// Icons
const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

interface ClientFormData {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
}

const ClientForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  
  usePageTitle(isEditing ? 'עריכת לקוח' : 'לקוח חדש');

  const {
    loading,
    error,
    createClient,
    updateClient,
    deleteClient,
    getClientById
  } = useClientStore();

  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load client data for editing
  useEffect(() => {
    if (isEditing && id) {
      const clientId = parseInt(id, 10);
      const client = getClientById(clientId);
      
      if (client) {
        setFormData({
          name: client.name,
          contactPerson: client.contactPerson || '',
          phone: client.phone,
          email: client.email,
          address: client.address,
          notes: client.notes || ''
        });
      }
    }
  }, [isEditing, id, getClientById]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = 'שם הלקוח הוא שדה חובה';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'מספר טלפון הוא שדה חובה';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'מספר טלפון לא תקין';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'כתובת אימייל היא שדה חובה';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'כתובת היא שדה חובה';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const clientData = {
        name: formData.name.trim(),
        contactPerson: formData.contactPerson.trim() || undefined,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim() || undefined
      };

      if (isEditing && id) {
        await updateClient(parseInt(id, 10), clientData);
      } else {
        await createClient(clientData);
      }

      navigate('/clients');
    } catch (error) {
      console.error('Error saving client:', error);
      // Error is handled by the store and displayed via error state
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !id) return;

    setIsSubmitting(true);
    try {
      await deleteClient(parseInt(id, 10));
      navigate('/clients');
    } catch (error) {
      console.error('Error deleting client:', error);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/clients');
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="חזור לרשימת הלקוחות"
        >
          <ArrowRightIcon />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? 'עריכת לקוח' : 'לקוח חדש'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'עדכן את פרטי הלקוח' : 'הוסף לקוח חדש למערכת'}
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">שגיאה</span>
          </div>
          <p className="mt-1 text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserIcon />
            </div>
            <CardTitle>פרטי הלקוח</CardTitle>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Field */}
          <Input
            label="שם הלקוח *"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="הכנס שם הלקוח"
            disabled={loading || isSubmitting}
            dir="rtl"
          />

          {/* Contact Person Field */}
          <Input
            label="איש קשר"
            type="text"
            value={formData.contactPerson}
            onChange={(e) => handleInputChange('contactPerson', e.target.value)}
            placeholder="שם איש הקשר (אופציונלי)"
            disabled={loading || isSubmitting}
            dir="rtl"
          />

          {/* Phone Field */}
          <Input
            label="מספר טלפון *"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={errors.phone}
            placeholder="050-1234567"
            disabled={loading || isSubmitting}
            dir="ltr"
          />

          {/* Email Field */}
          <Input
            label="כתובת אימייל *"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder="example@email.com"
            disabled={loading || isSubmitting}
            dir="ltr"
          />

          {/* Address Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="address">
              כתובת *
            </label>
            <textarea
              id="address"
              className={`form-input resize-none ${errors.address ? 'border-red-500 focus:border-red-500' : ''}`}
              rows={3}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="הכנס כתובת מלאה"
              disabled={loading || isSubmitting}
              dir="rtl"
            />
            {errors.address && <div className="form-error">{errors.address}</div>}
          </div>

          {/* Notes Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="notes">
              הערות
            </label>
            <textarea
              id="notes"
              className="form-input resize-none"
              rows={4}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="הערות נוספות על הלקוח (אופציונלי)"
              disabled={loading || isSubmitting}
              dir="rtl"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div>
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={loading || isSubmitting}
                  className="flex items-center gap-2"
                >
                  <TrashIcon />
                  מחק לקוח
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={loading || isSubmitting}
              >
                ביטול
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <SaveIcon />
                {isEditing ? 'עדכן לקוח' : 'שמור לקוח'}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="מחיקת לקוח"
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={isSubmitting}
            >
              ביטול
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              loading={isSubmitting}
              disabled={loading}
            >
              מחק לקוח
            </Button>
          </>
        }
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <TrashIcon />
          </div>
          <p className="text-gray-900 mb-2">
            האם אתה בטוח שברצונך למחוק את הלקוח?
          </p>
          <p className="text-sm text-gray-600">
            פעולה זו לא ניתנת לביטול. הלקוח יימחק לצמיתות מהמערכת.
          </p>
          <p className="text-sm text-red-600 mt-2 font-semibold">
            שים לב: לא ניתן למחוק לקוח שיש לו הצעות מחיר או פרויקטים קיימים.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ClientForm;