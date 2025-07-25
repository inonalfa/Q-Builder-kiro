import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  Input,
  Modal,
  StatusBadge,
  Switch,
  SegmentedControl,
  EmptyState,
  ListItem,
  Avatar,
  Badge,
  Tabs,
  Divider,
} from '../ui/AppleComponents';

// דוגמה מקיפה של מערכת העיצוב בסגנון Apple
const AppleDesignExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [switchValue, setSwitchValue] = useState(true);
  const [segmentValue, setSegmentValue] = useState('quotes');
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    {
      id: 'dashboard',
      label: 'לוח בקרה',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>הצעות מחיר</CardTitle>
                <CardSubtitle>12 הצעות פעילות</CardSubtitle>
              </CardHeader>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-primary-500">₪125,000</div>
                <Badge variant="success">+12%</Badge>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>פרויקטים</CardTitle>
                <CardSubtitle>8 פרויקטים פעילים</CardSubtitle>
              </CardHeader>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-success-500">₪89,500</div>
                <Badge variant="primary">+5%</Badge>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>לקוחות</CardTitle>
                <CardSubtitle>24 לקוחות רשומים</CardSubtitle>
              </CardHeader>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-warning-500">24</div>
                <Badge variant="warning">+3</Badge>
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>הצעות מחיר אחרונות</CardTitle>
              <CardSubtitle>עדכונים מהשבוע האחרון</CardSubtitle>
            </CardHeader>
            <div className="space-y-0">
              <ListItem
                title="הצעת מחיר Q-2025-0001"
                subtitle="לקוח: יוסי כהן • ₪15,000"
                action={<StatusBadge status="sent">נשלחה</StatusBadge>}
              />
              <ListItem
                title="הצעת מחיר Q-2025-0002"
                subtitle="לקוח: מרים לוי • ₪8,500"
                action={<StatusBadge status="accepted">אושרה</StatusBadge>}
              />
              <ListItem
                title="הצעת מחיר Q-2025-0003"
                subtitle="לקוח: דוד אברהם • ₪22,000"
                action={<StatusBadge status="draft">טיוטה</StatusBadge>}
              />
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'quotes',
      label: 'הצעות מחיר',
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-title-2">הצעות מחיר</h2>
            <Button variant="primary">הצעה חדשה</Button>
          </div>

          <SegmentedControl
            options={[
              { value: 'all', label: 'הכל' },
              { value: 'draft', label: 'טיוטות' },
              { value: 'sent', label: 'נשלחו' },
              { value: 'accepted', label: 'אושרו' },
            ]}
            value={segmentValue}
            onChange={setSegmentValue}
          />

          <Card>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>מספר הצעה</th>
                    <th>לקוח</th>
                    <th>סכום</th>
                    <th>תאריך</th>
                    <th>סטטוס</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Q-2025-0001</td>
                    <td>יוסי כהן</td>
                    <td>₪15,000</td>
                    <td>20/07/2025</td>
                    <td><StatusBadge status="sent">נשלחה</StatusBadge></td>
                    <td>
                      <Button variant="secondary" size="sm">עריכה</Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Q-2025-0002</td>
                    <td>מרים לוי</td>
                    <td>₪8,500</td>
                    <td>19/07/2025</td>
                    <td><StatusBadge status="accepted">אושרה</StatusBadge></td>
                    <td>
                      <Button variant="secondary" size="sm">צפייה</Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Q-2025-0003</td>
                    <td>דוד אברהם</td>
                    <td>₪22,000</td>
                    <td>18/07/2025</td>
                    <td><StatusBadge status="draft">טיוטה</StatusBadge></td>
                    <td>
                      <Button variant="secondary" size="sm">עריכה</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'הגדרות',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>פרופיל עסקי</CardTitle>
              <CardSubtitle>עדכן את פרטי העסק שלך</CardSubtitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar name="אלכס בילדר" size="lg" />
                <div>
                  <h3 className="text-title-3">אלכס בילדר</h3>
                  <p className="text-caption">alex@builder.co.il</p>
                </div>
              </div>
              <Divider />
              <Input label="שם העסק" defaultValue="אלכס בילדר - קבלן בניין" />
              <Input label="טלפון" defaultValue="050-1234567" />
              <Input label="כתובת" defaultValue="רחוב הבנאים 123, תל אביב" />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>הגדרות התראות</CardTitle>
              <CardSubtitle>בחר איך תרצה לקבל עדכונים</CardSubtitle>
            </CardHeader>
            <div className="space-y-4">
              <Switch
                checked={switchValue}
                onChange={setSwitchValue}
                label="התראות דוא״ל"
              />
              <Switch
                checked={true}
                onChange={() => {}}
                label="התראות על הצעות שפגו"
              />
              <Switch
                checked={false}
                onChange={() => {}}
                label="תזכורות תשלום"
              />
            </div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background-secondary" dir="rtl">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Avatar name="Q-Builder" />
              <h1 className="text-title-3">Q-Builder</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="secondary" size="sm">
                עזרה
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                הצעה חדשה
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-display mb-2">שלום אלכס! 👋</h1>
          <p className="text-body text-text-secondary">
            ברוך הבא למערכת ניהול הצעות מחיר - Q-Builder Admin
          </p>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </main>

      {/* Modal Example */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="הצעת מחיר חדשה"
        actions={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              ביטול
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              צור הצעה
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="שם הלקוח" placeholder="הכנס שם לקוח" />
          <Input label="כותרת ההצעה" placeholder="תיאור קצר של העבודה" />
          <Input
            label="תאריך תפוגה"
            type="date"
            defaultValue="2025-08-20"
          />
        </div>
      </Modal>

      {/* Empty State Example (hidden by default) */}
      <div className="hidden">
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          title="אין הצעות מחיר עדיין"
          description="צור את ההצעה הראשונה שלך כדי להתחיל לנהל את העסק שלך"
          action={<Button variant="primary">צור הצעה ראשונה</Button>}
        />
      </div>
    </div>
  );
};

export default AppleDesignExample;