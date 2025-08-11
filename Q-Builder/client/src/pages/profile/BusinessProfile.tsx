import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useCatalogStore } from '../../stores/catalogStore';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Button, Card, CardHeader, CardTitle, Input, Switch } from '../../components/ui/AppleComponents';
import { apiService } from '../../services/api';
import type { User, Profession, NotificationSettings } from '../../types';

interface BusinessProfileFormData {
  name: string;
  businessName: string;
  phone: string;
  address: string;
  professionIds: number[];
  vatRate: number;
  notificationSettings: NotificationSettings;
}

const BusinessProfile: React.FC = () => {
  usePageTitle('פרופיל עסקי');

  const { user, updateUser } = useAuthStore();
  const { professions, fetchProfessions } = useCatalogStore();
  
  const [formData, setFormData] = useState<BusinessProfileFormData>({
    name: '',
    businessName: '',
    phone: '',
    address: '',
    professionIds: [],
    vatRate: 0.18,
    notificationSettings: {
      emailEnabled: true,
      quoteExpiry: true,
      paymentReminders: true,
      quoteSent: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        businessName: user.businessName || '',
        phone: user.phone || '',
        address: user.address || '',
        professionIds: user.professionIds || [],
        vatRate: user.vatRate || 0.18,
        notificationSettings: user.notificationSettings || {
          emailEnabled: true,
          quoteExpiry: true,
          paymentReminders: true,
          quoteSent: true,
        },
      });

      if (user.logoUrl) {
        setLogoPreview(user.logoUrl);
      }
    }
  }, [user]);

  // Fetch professions on component mount
  useEffect(() => {
    fetchProfessions();
  }, [fetchProfessions]);

  const handleInputChange = (field: keyof BusinessProfileFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleNotificationChange = (setting: keyof NotificationSettings, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [setting]: value,
      },
    }));
  };

  const handleProfessionToggle = (professionId: number) => {
    setFormData(prev => ({
      ...prev,
      professionIds: prev.professionIds.includes(professionId)
        ? prev.professionIds.filter(id => id !== professionId)
        : [...prev.professionIds, professionId],
    }));
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          logo: 'יש לבחור קובץ תמונה בלבד',
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          logo: 'גודל הקובץ חייב להיות קטן מ-5MB',
        }));
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Clear logo error
      if (errors.logo) {
        setErrors(prev => ({
          ...prev,
          logo: '',
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'שם מלא הוא שדה חובה';
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'שם העסק הוא שדה חובה';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'מספר טלפון הוא שדה חובה';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'כתובת היא שדה חובה';
    }

    if (formData.professionIds.length === 0) {
      newErrors.professions = 'יש לבחור לפחות מקצוע אחד';
    }

    if (formData.vatRate < 0 || formData.vatRate > 1) {
      newErrors.vatRate = 'שיעור המע"מ חייב להיות בין 0% ל-100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Update profile data
      const response = await apiService.put('/auth/profile', formData);
      
      if (response.success && response.data?.user) {
        updateUser(response.data.user);
        
        // Handle logo upload if there's a new file
        if (logoFile) {
          await handleLogoUpload();
        }
        
        // Show success message (you might want to add a notification system)
        alert('הפרופיל עודכן בהצלחה');
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      alert(error.message || 'שגיאה בעדכון הפרופיל');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    const formData = new FormData();
    formData.append('logo', logoFile);

    try {
      const response = await apiService.post('/auth/upload-logo', formData);
      if (response.success && response.data?.logoUrl) {
        updateUser({ logoUrl: response.data.logoUrl });
      }
    } catch (error: any) {
      console.error('Logo upload error:', error);
      // Don't throw error here as profile was already updated
      alert('הפרופיל עודכן אך העלאת הלוגו נכשלה');
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (errors.logo) {
      setErrors(prev => ({
        ...prev,
        logo: '',
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-title-1 text-text-primary mb-2">פרופיל עסקי</h1>
        <p className="text-body text-text-secondary">
          עדכן את פרטי העסק שלך והגדרות המערכת
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Business Logo Section */}
        <Card>
          <CardHeader>
            <CardTitle>לוגו העסק</CardTitle>
          </CardHeader>
          
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="לוגו העסק"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-500">אין לוגו</p>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload">
                  <Button type="button" variant="secondary" className="cursor-pointer">
                    בחר לוגו
                  </Button>
                </label>
                
                {logoPreview && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeLogo}
                    className="mr-2"
                  >
                    הסר לוגו
                  </Button>
                )}
                
                <p className="text-caption mt-2">
                  קבצי תמונה בלבד, עד 5MB
                </p>
              </div>
            </div>
            
            {errors.logo && (
              <div className="form-error">{errors.logo}</div>
            )}
          </div>
        </Card>

        {/* Basic Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>פרטים בסיסיים</CardTitle>
          </CardHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="שם מלא"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              placeholder="הכנס את שמך המלא"
            />
            
            <Input
              label="שם העסק"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              error={errors.businessName}
              placeholder="הכנס את שם העסק"
            />
            
            <Input
              label="מספר טלפון"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={errors.phone}
              placeholder="050-1234567"
            />
            
            <Input
              label="שיעור מע״מ (%)"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={(formData.vatRate * 100).toString()}
              onChange={(e) => handleInputChange('vatRate', parseFloat(e.target.value) / 100)}
              error={errors.vatRate}
              placeholder="18"
            />
          </div>
          
          <div className="mt-6">
            <Input
              label="כתובת העסק"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={errors.address}
              placeholder="הכנס את כתובת העסק המלאה"
            />
          </div>
        </Card>

        {/* Professions Section */}
        <Card>
          <CardHeader>
            <CardTitle>מקצועות</CardTitle>
          </CardHeader>
          
          <div className="space-y-4">
            <p className="text-body text-text-secondary">
              בחר את המקצועות הרלוונטיים לעסק שלך
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {professions.map((profession) => (
                <label
                  key={profession.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.professionIds.includes(profession.id)}
                    onChange={() => handleProfessionToggle(profession.id)}
                    className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-body text-text-primary">
                    {profession.nameHebrew}
                  </span>
                </label>
              ))}
            </div>
            
            {errors.professions && (
              <div className="form-error">{errors.professions}</div>
            )}
          </div>
        </Card>

        {/* Notification Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle>הגדרות התראות</CardTitle>
          </CardHeader>
          
          <div className="space-y-4">
            <p className="text-body text-text-secondary">
              בחר אילו התראות תרצה לקבל במייל
            </p>
            
            <div className="space-y-4">
              <Switch
                checked={formData.notificationSettings.emailEnabled}
                onChange={(checked) => handleNotificationChange('emailEnabled', checked)}
                label="קבלת התראות במייל"
              />
              
              <Switch
                checked={formData.notificationSettings.quoteSent}
                onChange={(checked) => handleNotificationChange('quoteSent', checked)}
                label="התראה כאשר הצעת מחיר נשלחת"
                disabled={!formData.notificationSettings.emailEnabled}
              />
              
              <Switch
                checked={formData.notificationSettings.quoteExpiry}
                onChange={(checked) => handleNotificationChange('quoteExpiry', checked)}
                label="התראה על פקיעת הצעות מחיר (3 ימים לפני)"
                disabled={!formData.notificationSettings.emailEnabled}
              />
              
              <Switch
                checked={formData.notificationSettings.paymentReminders}
                onChange={(checked) => handleNotificationChange('paymentReminders', checked)}
                label="תזכורות תשלום עבור פרויקטים שהושלמו"
                disabled={!formData.notificationSettings.emailEnabled}
              />
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            loading={loading}
            className="px-8"
          >
            שמור שינויים
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BusinessProfile;