import React, { useState } from 'react';
import { Button, Input, Modal } from '../ui/AppleComponents';
import { useClientStore } from '../../stores/clientStore';
import type { Client } from '../../types';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (client: Client) => void;
}

interface ClientFormData {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  onClientCreated
}) => {
  const { createClient } = useClientStore();
  
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'שם הלקוח נדרש';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'מספר טלפון נדרש';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'כתובת אימייל נדרשת';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'כתובת נדרשת';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const clientData = {
        ...formData,
        contactPerson: formData.contactPerson || undefined,
        notes: formData.notes || undefined
      };

      const newClient = await createClient(clientData);
      onClientCreated(newClient);
      handleClose();
    } catch (error: any) {
      console.error('Error creating client:', error);
      setErrors({ submit: error.message || 'שגיאה ביצירת הלקוח' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="לקוח חדש">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="שם הלקוח *"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          placeholder="שם החברה או הלקוח הפרטי"
        />

        <Input
          label="איש קשר"
          value={formData.contactPerson}
          onChange={(e) => handleInputChange('contactPerson', e.target.value)}
          error={errors.contactPerson}
          placeholder="שם איש הקשר (אופציונלי)"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="טלפון *"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={errors.phone}
            placeholder="050-1234567"
          />

          <Input
            label="אימייל *"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder="client@example.com"
          />
        </div>

        <Input
          label="כתובת *"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          error={errors.address}
          placeholder="רחוב, מספר, עיר"
        />

        <div>
          <label className="form-label">הערות</label>
          <textarea
            className="form-input"
            rows={3}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="הערות נוספות על הלקוח..."
          />
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800">{errors.submit}</div>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            ביטול
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            צור לקוח
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientFormModal;