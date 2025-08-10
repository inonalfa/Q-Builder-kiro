import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle';
import { useQuoteStore } from '../../stores/quoteStore';
import { useClientStore } from '../../stores/clientStore';
import { Button, Card, CardHeader, CardTitle, Input, Modal } from '../../components/ui/AppleComponents';
import ClientFormModal from '../../components/quotes/ClientFormModal';
import { apiService } from '../../services/api';
import type { Quote, QuoteItem, Client, CatalogItem, Profession } from '../../types';

interface QuoteFormData {
  title: string;
  clientId: number | null;
  expiryDate: string;
  terms: string;
  items: QuoteItem[];
}

interface CatalogSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: CatalogItem) => void;
  userProfessions: number[];
}

const CatalogSelector: React.FC<CatalogSelectorProps> = ({ isOpen, onClose, onSelect, userProfessions }) => {
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [selectedProfession, setSelectedProfession] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProfessions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedProfession) {
      fetchCatalogItems(selectedProfession);
    }
  }, [selectedProfession]);

  const fetchProfessions = async () => {
    try {
      const response = await apiService.get<Profession[]>('/professions');
      if (response.success && response.data) {
        const userProfessionsList = response.data.filter(p => userProfessions.includes(p.id));
        setProfessions(userProfessionsList);
        if (userProfessionsList.length > 0) {
          setSelectedProfession(userProfessionsList[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching professions:', error);
    }
  };

  const fetchCatalogItems = async (professionId: number) => {
    setLoading(true);
    try {
      const response = await apiService.get<CatalogItem[]>(`/catalog/profession/${professionId}`);
      if (response.success && response.data) {
        setCatalogItems(response.data);
      }
    } catch (error) {
      console.error('Error fetching catalog items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = catalogItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="בחירת פריט מהקטלוג">
      <div className="space-y-4">
        {/* Profession selector */}
        <div>
          <label className="form-label">מקצוע</label>
          <select
            className="form-input"
            value={selectedProfession || ''}
            onChange={(e) => setSelectedProfession(Number(e.target.value))}
          >
            <option value="">בחר מקצוע</option>
            {professions.map(profession => (
              <option key={profession.id} value={profession.id}>
                {profession.nameHebrew}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <Input
          label="חיפוש"
          placeholder="חפש פריט..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Items list */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="loading-spinner w-8 h-8 mx-auto"></div>
              <p className="text-gray-600 mt-2">טוען פריטים...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">לא נמצאו פריטים</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onSelect(item)}
                >
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    יחידה: {item.unit}
                    {item.defaultPrice && (
                      <span className="mr-4">מחיר מוצע: ₪{item.defaultPrice}</span>
                    )}
                  </div>
                  {item.description && (
                    <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

const QuoteForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  usePageTitle(isEditing ? 'עריכת הצעת מחיר' : 'הצעת מחיר חדשה');

  const { createQuote, updateQuote, selectedQuote, setSelectedQuote } = useQuoteStore();
  const { clients, fetchClients } = useClientStore();

  const [formData, setFormData] = useState<QuoteFormData>({
    title: '',
    clientId: null,
    expiryDate: '',
    terms: '',
    items: []
  });

  const [userProfessions, setUserProfessions] = useState<number[]>([]);
  const [showCatalogSelector, setShowCatalogSelector] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchClients();
    fetchUserProfile();
    
    if (isEditing && id) {
      fetchQuote(Number(id));
    } else {
      // Set default expiry date to 30 days from now for new quotes
      const defaultExpiryDate = new Date();
      defaultExpiryDate.setDate(defaultExpiryDate.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        expiryDate: defaultExpiryDate.toISOString().split('T')[0]
      }));
    }
  }, [id, isEditing]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S to save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (!loading) {
          handleSubmit(e as any);
        }
      }
      
      // Escape to cancel
      if (e.key === 'Escape' && !showCatalogSelector && !showClientForm) {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [loading, showCatalogSelector, showClientForm]);

  const fetchUserProfile = async () => {
    try {
      const response = await apiService.get('/auth/me');
      if (response.success && response.data) {
        setUserProfessions(response.data.professionIds || []);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchQuote = async (quoteId: number) => {
    try {
      const response = await apiService.get<Quote>(`/quotes/${quoteId}`);
      if (response.success && response.data) {
        const quote = response.data;
        setSelectedQuote(quote);
        setFormData({
          title: quote.title,
          clientId: quote.clientId,
          expiryDate: quote.expiryDate.split('T')[0], // Convert to date input format
          terms: quote.terms || '',
          items: quote.items || []
        });
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  const handleInputChange = (field: keyof QuoteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCatalogItemSelect = (catalogItem: CatalogItem) => {
    const newItem: QuoteItem = {
      quoteId: 0,
      catalogItemId: catalogItem.id,
      description: catalogItem.name,
      unit: catalogItem.unit,
      quantity: 1,
      unitPrice: catalogItem.defaultPrice || 0,
      lineTotal: catalogItem.defaultPrice || 0
    };

    if (editingItemIndex !== null) {
      const updatedItems = [...formData.items];
      updatedItems[editingItemIndex] = newItem;
      setFormData(prev => ({ ...prev, items: updatedItems }));
      setEditingItemIndex(null);
    } else {
      setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
    }

    setShowCatalogSelector(false);
  };

  const handleItemChange = (index: number, field: keyof QuoteItem, value: any) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate line total
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].lineTotal = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }
    
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const handleAddCustomItem = () => {
    const newItem: QuoteItem = {
      quoteId: 0,
      catalogItemId: undefined,
      description: '',
      unit: 'יח\'',
      quantity: 1,
      unitPrice: 0,
      lineTotal: 0
    };
    
    setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.lineTotal, 0);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'כותרת הצעת המחיר נדרשת';
    }

    if (!formData.clientId) {
      newErrors.clientId = 'יש לבחור לקוח';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'תאריך תפוגה נדרש';
    } else {
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (expiryDate <= today) {
        newErrors.expiryDate = 'תאריך התפוגה חייב להיות בעתיד';
      }
    }

    if (formData.items.length === 0) {
      newErrors.items = 'יש להוסיף לפחות פריט אחד';
    }

    // Validate each item
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item_${index}_description`] = 'תיאור הפריט נדרש';
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'כמות חייבת להיות גדולה מ-0';
      }
      if (item.unitPrice < 0) {
        newErrors[`item_${index}_unitPrice`] = 'מחיר יחידה לא יכול להיות שלילי';
      }
    });

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
      const quoteData = {
        ...formData,
        totalAmount: calculateTotal(),
        currency: 'ILS',
        issueDate: new Date().toISOString(),
        status: 'draft' as const
      };

      if (isEditing && id) {
        await updateQuote(Number(id), quoteData);
      } else {
        await createQuote(quoteData);
      }

      navigate('/quotes');
    } catch (error: any) {
      console.error('Error saving quote:', error);
      setErrors({ submit: error.message || 'שגיאה בשמירת הצעת המחיר' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/quotes');
  };

  const handleClientCreated = (newClient: Client) => {
    setFormData(prev => ({ ...prev, clientId: newClient.id }));
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'עריכת הצעת מחיר' : 'הצעת מחיר חדשה'}</CardTitle>
          
          {/* Progress indicator */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>התקדמות הטופס</span>
              <span>{Math.round(((formData.title ? 1 : 0) + (formData.clientId ? 1 : 0) + (formData.expiryDate ? 1 : 0) + (formData.items.length > 0 ? 1 : 0)) / 4 * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((formData.title ? 1 : 0) + (formData.clientId ? 1 : 0) + (formData.expiryDate ? 1 : 0) + (formData.items.length > 0 ? 1 : 0)) / 4 * 100}%` 
                }}
              />
            </div>
          </div>
        </CardHeader>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="כותרת הצעת המחיר *"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                error={errors.title}
                placeholder="לדוגמה: שיפוץ דירה ברחוב הרצל"
              />

              <div>
                <label className="form-label">לקוח *</label>
                <div className="flex gap-2">
                  <select
                    className={`form-input flex-1 ${errors.clientId ? 'border-red-500' : ''}`}
                    value={formData.clientId || ''}
                    onChange={(e) => handleInputChange('clientId', Number(e.target.value) || null)}
                  >
                    <option value="">בחר לקוח</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowClientForm(true)}
                  >
                    לקוח חדש
                  </Button>
                </div>
                {errors.clientId && <div className="form-error">{errors.clientId}</div>}
                {formData.clientId && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    {(() => {
                      const selectedClient = clients.find(c => c.id === formData.clientId);
                      return selectedClient ? (
                        <div className="text-sm">
                          <div className="font-semibold">{selectedClient.name}</div>
                          <div className="text-gray-600">
                            {selectedClient.contactPerson && `איש קשר: ${selectedClient.contactPerson} | `}
                            טלפון: {selectedClient.phone} | אימייל: {selectedClient.email}
                          </div>
                          <div className="text-gray-600">כתובת: {selectedClient.address}</div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            </div>

            <Input
              label="תאריך תפוגה *"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              error={errors.expiryDate}
              helperText="תאריך תפוגת הצעת המחיר (ברירת מחדל: 30 יום מהיום)"
            />

            {/* Items Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">פריטים</h3>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingItemIndex(null);
                      setShowCatalogSelector(true);
                    }}
                  >
                    הוסף מהקטלוג
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddCustomItem}
                  >
                    הוסף פריט מותאם
                  </Button>
                </div>
              </div>

              {errors.items && <div className="form-error mb-4">{errors.items}</div>}

              {formData.items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  לא נוספו פריטים עדיין
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <Card key={item.id || `item-${index}`} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                        <div className="md:col-span-2">
                          <Input
                            label="תיאור"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            error={errors[`item_${index}_description`]}
                            placeholder="תיאור הפריט"
                          />
                        </div>
                        
                        <Input
                          label="יחידה"
                          value={item.unit}
                          onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                          placeholder="יח'"
                        />
                        
                        <Input
                          label="כמות"
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          error={errors[`item_${index}_quantity`]}
                        />
                        
                        <Input
                          label="מחיר יחידה"
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          error={errors[`item_${index}_unitPrice`]}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <div className="text-lg font-semibold">
                          סה"כ: ₪{item.lineTotal.toFixed(2)}
                        </div>
                        <div className="flex gap-2">
                          {item.catalogItemId && (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setEditingItemIndex(index);
                                setShowCatalogSelector(true);
                              }}
                            >
                              החלף מהקטלוג
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                          >
                            הסר
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Terms */}
            <div>
              <label className="form-label">תנאים והערות</label>
              <textarea
                className="form-input"
                rows={4}
                value={formData.terms}
                onChange={(e) => handleInputChange('terms', e.target.value)}
                placeholder="תנאי תשלום, הערות נוספות..."
              />
            </div>

            {/* Summary */}
            {formData.items.length > 0 && (
              <Card className="bg-gray-50">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4 text-center">סיכום הצעת המחיר</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>מספר פריטים:</span>
                      <span className="font-semibold">{formData.items.length}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>סה"כ לפני מע"מ:</span>
                      <span className="font-semibold">₪{calculateTotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>מע"מ (18%):</span>
                      <span className="font-semibold">₪{(calculateTotal() * 0.18).toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-300 pt-2">
                      <div className="flex justify-between text-xl font-bold">
                        <span>סה"כ כולל מע"מ:</span>
                        <span className="text-primary">₪{(calculateTotal() * 1.18).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-red-800">{errors.submit}</div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-4 text-center">
                טיפ: Ctrl+S לשמירה | Escape לביטול
              </div>
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  ביטול
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                >
                  {isEditing ? 'עדכן הצעת מחיר' : 'צור הצעת מחיר'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>

      {/* Catalog Selector Modal */}
      <CatalogSelector
        isOpen={showCatalogSelector}
        onClose={() => {
          setShowCatalogSelector(false);
          setEditingItemIndex(null);
        }}
        onSelect={handleCatalogItemSelect}
        userProfessions={userProfessions}
      />

      {/* Client Form Modal */}
      <ClientFormModal
        isOpen={showClientForm}
        onClose={() => setShowClientForm(false)}
        onClientCreated={handleClientCreated}
      />
    </div>
  );
};

export default QuoteForm;