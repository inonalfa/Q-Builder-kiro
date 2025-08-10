import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClientStore } from '../../stores/clientStore';
import usePageTitle from '../../hooks/usePageTitle';
import { 
  Button, 
  Card, 
  Input, 
  EmptyState, 
  Skeleton,
  SegmentedControl,
  Badge
} from '../../components/ui/AppleComponents';

// Icons (using simple SVG icons)
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SortIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
  </svg>
);

interface ClientCardProps {
  client: any;
  onClick: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg" hover>
      <div onClick={onClick} className="p-6">
        {/* Header with name and contact person */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {client.name}
            </h3>
            {client.contactPerson && (
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <UserIcon />
                {client.contactPerson}
              </p>
            )}
          </div>
          <Badge variant="primary" className="text-xs">
            {formatDate(client.createdAt)}
          </Badge>
        </div>

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <PhoneIcon />
            <span dir="ltr">{client.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <EmailIcon />
            <span dir="ltr">{client.email}</span>
          </div>
          {client.address && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <LocationIcon />
              <span className="flex-1">{client.address}</span>
            </div>
          )}
        </div>

        {/* Notes preview */}
        {client.notes && (
          <div className="border-t pt-3">
            <p className="text-sm text-gray-500 line-clamp-2">
              {client.notes}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

const ClientListSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <Card key={index}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Skeleton height="1.5rem" width="60%" className="mb-2" />
              <Skeleton height="1rem" width="40%" />
            </div>
            <Skeleton height="1.5rem" width="4rem" />
          </div>
          <div className="space-y-2 mb-4">
            <Skeleton height="1rem" width="50%" />
            <Skeleton height="1rem" width="70%" />
            <Skeleton height="1rem" width="80%" />
          </div>
        </div>
      </Card>
    ))}
  </div>
);

const ClientList: React.FC = () => {
  usePageTitle('לקוחות');
  const navigate = useNavigate();
  
  const {
    clients,
    loading,
    error,
    searchQuery,
    sortBy,
    sortOrder,
    fetchClients,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    getFilteredClients
  } = useClientStore();

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(debouncedSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearchQuery, setSearchQuery]);

  const filteredClients = getFilteredClients();

  const handleClientClick = (client: any) => {
    navigate(`/clients/${client.id}`);
  };

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split('-') as ['name' | 'createdAt', 'asc' | 'desc'];
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const currentSortValue = `${sortBy}-${sortOrder}`;

  const sortOptions = [
    { value: 'name-asc', label: 'שם א-ת' },
    { value: 'name-desc', label: 'שם ת-א' },
    { value: 'createdAt-desc', label: 'חדש ביותר' },
    { value: 'createdAt-asc', label: 'ישן ביותר' }
  ];

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">שגיאה בטעינת הלקוחות</div>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchClients}>נסה שוב</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">לקוחות</h1>
          <p className="text-gray-600">
            ניהול פרטי הלקוחות שלך
            {filteredClients.length > 0 && (
              <span className="mr-2">
                ({filteredClients.length} {filteredClients.length === 1 ? 'לקוח' : 'לקוחות'})
              </span>
            )}
          </p>
        </div>
        <Link to="/clients/new">
          <Button className="flex items-center gap-2">
            <PlusIcon />
            לקוח חדש
          </Button>
        </Link>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <Input
                type="text"
                placeholder="חיפוש לקוחות (שם, אימייל, טלפון, כתובת...)"
                value={debouncedSearchQuery}
                onChange={(e) => setDebouncedSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <SortIcon />
              <span>מיון:</span>
            </div>
            <SegmentedControl
              options={sortOptions}
              value={currentSortValue}
              onChange={handleSortChange}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <ClientListSkeleton />
      ) : filteredClients.length === 0 ? (
        <EmptyState
          icon={<UserIcon />}
          title={searchQuery ? 'לא נמצאו לקוחות' : 'אין לקוחות עדיין'}
          description={
            searchQuery 
              ? `לא נמצאו לקוחות התואמים לחיפוש "${searchQuery}"`
              : 'התחל בהוספת הלקוח הראשון שלך'
          }
          action={
            !searchQuery && (
              <Link to="/clients/new">
                <Button className="flex items-center gap-2">
                  <PlusIcon />
                  הוסף לקוח ראשון
                </Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onClick={() => handleClientClick(client)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientList;