import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, Eye, Edit2, Upload, FileText, Calendar, AlertCircle, CheckCircle, Clock, Archive, X, History } from 'lucide-react';

// Audit log utility function - reusable for various audit types
const createAuditEntry = (action, user, details, oldValue = null, newValue = null) => {
  return {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    action,
    user,
    details,
    oldValue,
    newValue
  };
};

// Sample contract data with audit logs
const initialContracts = [
  {
    orgnisationId: 'ORG-001',
    subOrganisationId: '',
    id: '1',
    contractRef: 'CTR-2024-001',
    contractName: 'Software License Agreement - Enterprise Suite',
    partiesInvolved: ['ABC Corporation', 'Tech Solutions Ltd'],
    startDate: '2024-01-15',
    endDate: '2025-01-14',
    originalEndDate: null,
    status: 'Active',
    value: 250000,
    contractManager: 'Sarah Johnson',
    documents: [
      { id: 'd1', name: 'Main Contract.pdf', uploadDate: '2024-01-10', size: '2.4 MB' },
      { id: 'd2', name: 'Amendment 1.pdf', uploadDate: '2024-06-15', size: '1.1 MB' }
    ],
    description: 'Annual software licensing agreement for enterprise resource planning system',
    renewalDate: '2024-11-15',
    auditLog: [
      {
        id: 'audit_1',
        timestamp: '2024-01-10T10:30:00Z',
        action: 'CONTRACT_CREATED',
        user: 'Sarah Johnson',
        details: 'Contract created and initialized',
        oldValue: null,
        newValue: null
      },
      {
        id: 'audit_2',
        timestamp: '2024-01-15T14:20:00Z',
        action: 'STATUS_CHANGED',
        user: 'Sarah Johnson',
        details: 'Contract activated',
        oldValue: 'Draft',
        newValue: 'Active'
      }
    ]
  },
  {
    orgnisationId: 'ORG-001',
    subOrganisationId: '',
    id: '2',
    contractRef: 'CTR-2024-002',
    contractName: 'Office Lease Agreement',
    partiesInvolved: ['ABC Corporation', 'Property Management Inc'],
    startDate: '2023-03-01',
    endDate: '2026-02-28',
    originalEndDate: '2025-02-28',
    status: 'Active Extended',
    value: 500000,
    contractManager: 'Michael Chen',
    documents: [
      { id: 'd3', name: 'Lease Agreement.pdf', uploadDate: '2023-02-20', size: '3.2 MB' }
    ],
    description: 'Commercial office space lease for headquarters',
    renewalDate: '2025-11-01',
    auditLog: [
      {
        id: 'audit_3',
        timestamp: '2023-02-20T09:00:00Z',
        action: 'CONTRACT_CREATED',
        user: 'Michael Chen',
        details: 'Contract created',
        oldValue: null,
        newValue: null
      },
      {
        id: 'audit_4',
        timestamp: '2024-11-15T16:45:00Z',
        action: 'CONTRACT_EXTENDED',
        user: 'Michael Chen',
        details: 'Contract extended by 1 year due to continued occupancy requirements',
        oldValue: '2025-02-28',
        newValue: '2026-02-28'
      }
    ]
  },
  {
    orgnisationId: 'ORG-001',
    subOrganisationId: '',
    id: '3',
    contractRef: 'CTR-2024-003',
    contractName: 'Consulting Services Agreement',
    partiesInvolved: ['ABC Corporation', 'Strategic Advisors LLC'],
    startDate: '2024-09-01',
    endDate: '2024-12-31',
    originalEndDate: null,
    status: 'Review',
    value: 75000,
    contractManager: 'Emily Rodriguez',
    documents: [
      { id: 'd4', name: 'Draft Contract.pdf', uploadDate: '2024-08-15', size: '1.8 MB' }
    ],
    description: 'Management consulting services for Q4 2024',
    renewalDate: '2024-11-30',
    auditLog: [
      {
        id: 'audit_5',
        timestamp: '2024-08-15T11:20:00Z',
        action: 'CONTRACT_CREATED',
        user: 'Emily Rodriguez',
        details: 'Draft contract created',
        oldValue: null,
        newValue: null
      },
      {
        id: 'audit_6',
        timestamp: '2024-08-20T15:30:00Z',
        action: 'SUBMITTED_FOR_REVIEW',
        user: 'Emily Rodriguez',
        details: 'Contract submitted for legal review',
        oldValue: 'Draft',
        newValue: 'Review'
      }
    ]
  },
  {
    orgnisationId: 'ORG-001',
    subOrganisationId: '',
    id: '4',
    contractRef: 'CTR-2023-015',
    contractName: 'Equipment Maintenance Agreement',
    partiesInvolved: ['ABC Corporation', 'Industrial Services Co'],
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    originalEndDate: null,
    status: 'Expired',
    value: 45000,
    contractManager: 'David Park',
    documents: [
      { id: 'd5', name: 'Maintenance Contract.pdf', uploadDate: '2022-12-10', size: '1.5 MB' }
    ],
    description: 'Annual maintenance for manufacturing equipment',
    renewalDate: null,
    auditLog: [
      {
        id: 'audit_7',
        timestamp: '2022-12-10T10:00:00Z',
        action: 'CONTRACT_CREATED',
        user: 'David Park',
        details: 'Maintenance contract created',
        oldValue: null,
        newValue: null
      },
      {
        id: 'audit_8',
        timestamp: '2024-01-02T08:00:00Z',
        action: 'CONTRACT_EXPIRED',
        user: 'System',
        details: 'Contract expired - no renewal initiated',
        oldValue: 'Active',
        newValue: 'Expired'
      }
    ]
  },
  {
    orgnisationId: 'ORG-001',
    subOrganisationId: '',
    id: '5',
    contractRef: 'CTR-2024-004',
    contractName: 'Cloud Services Agreement',
    partiesInvolved: ['ABC Corporation', 'CloudTech Solutions'],
    startDate: '2024-07-01',
    endDate: '2025-06-30',
    originalEndDate: null,
    status: 'Draft',
    value: 120000,
    contractManager: 'Sarah Johnson',
    documents: [],
    description: 'Cloud infrastructure and hosting services',
    renewalDate: '2025-04-01',
    auditLog: [
      {
        id: 'audit_9',
        timestamp: '2024-06-25T13:15:00Z',
        action: 'CONTRACT_CREATED',
        user: 'Sarah Johnson',
        details: 'Cloud services contract initiated',
        oldValue: null,
        newValue: null
      }
    ]
  }
];

const statusConfig = {
  Draft: { color: 'bg-gray-100 text-gray-800', icon: FileText },
  Review: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  Active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'Active Extended': { color: 'bg-blue-100 text-blue-800', icon: Calendar },
  Termination: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
  Expired: { color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
  Archived: { color: 'bg-gray-100 text-gray-600', icon: Archive }
};

// Extension Modal Component
const ExtensionModal = ({ contract, onClose, onSave }) => {
  const [newEndDate, setNewEndDate] = useState(() => {
    const date = new Date(contract.endDate);
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split('T')[0];
  });
  const [auditComment, setAuditComment] = useState('');

  const handleSave = () => {
    if (!auditComment.trim()) {
      alert('Please provide an audit comment for this extension');
      return;
    }
    onSave(newEndDate, auditComment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Contract Extension</h2>
            <p className="text-sm text-gray-600 mt-1">{contract.contractRef} - {contract.contractName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-blue-900">Extension Information</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Current End Date: <strong>{contract.endDate}</strong>
                  {contract.originalEndDate && (
                    <span className="block mt-1">
                      Original End Date: <strong>{contract.originalEndDate}</strong>
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New End Date *
            </label>
            <input
              type="date"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Audit Comment *
            </label>
            <textarea
              value={auditComment}
              onChange={(e) => setAuditComment(e.target.value)}
              placeholder="Please provide a reason for this extension (e.g., 'Extended due to ongoing project requirements')"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              This comment will be added to the contract's audit log
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Save Extension
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Audit Log Component
const AuditLogPanel = ({ auditLog }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionLabel = (action) => {
    const labels = {
      CONTRACT_CREATED: 'Contract Created',
      CONTRACT_EXTENDED: 'Contract Extended',
      STATUS_CHANGED: 'Status Changed',
      SUBMITTED_FOR_REVIEW: 'Submitted for Review',
      CONTRACT_EXPIRED: 'Contract Expired',
      CONTRACT_MODIFIED: 'Contract Modified',
      DOCUMENT_UPLOADED: 'Document Uploaded'
    };
    return labels[action] || action;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <History size={20} className="text-gray-600" />
        <h2 className="text-xl font-semibold">Audit Log</h2>
      </div>
      
      {auditLog && auditLog.length > 0 ? (
        <div className="space-y-4">
          {[...auditLog].reverse().map((entry, index) => (
            <div key={entry.id} className="relative pl-8 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0">
              <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{getActionLabel(entry.action)}</h3>
                    <p className="text-xs text-gray-500 mt-1">{formatTimestamp(entry.timestamp)}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {entry.user}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-2">{entry.details}</p>
                {(entry.oldValue || entry.newValue) && (
                  <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
                    {entry.oldValue && (
                      <p className="text-gray-600">
                        <span className="font-medium">Previous:</span> {entry.oldValue}
                      </p>
                    )}
                    {entry.newValue && (
                      <p className="text-gray-600">
                        <span className="font-medium">New:</span> {entry.newValue}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No audit entries yet</p>
      )}
    </div>
  );
};

const ContractManagementSystem = () => {
  const [contracts, setContracts] = useState(initialContracts);
  const [currentView, setCurrentView] = useState('register');
  const [selectedContract, setSelectedContract] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [extensionContract, setExtensionContract] = useState(null);

  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const matchesSearch = 
        contract.contractName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contractRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contractManager.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || contract.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchTerm, statusFilter]);

  const handleCreateNew = () => {
    const newContract = {
      contractRef: `CTR-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(3, '0')}`,
      contractName: '',
      partiesInvolved: ['', ''],
      startDate: '',
      endDate: '',
      originalEndDate: null,
      status: 'Draft',
      value: '',
      contractManager: '',
      documents: [],
      description: '',
      renewalDate: '',
      auditLog: []
    };
    setFormData(newContract);
    setEditMode(true);
    setCurrentView('form');
  };

  const handleEdit = (contract) => {
    setFormData(contract);
    setEditMode(true);
    setCurrentView('form');
  };

  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
    setCurrentView('details');
  };

  const handleSaveContract = () => {
    if (formData.id) {
      // Editing existing contract
      const auditEntry = createAuditEntry(
        'CONTRACT_MODIFIED',
        formData.contractManager,
        'Contract details updated',
        null,
        null
      );
      
      const updatedContract = {
        ...formData,
        auditLog: [...(formData.auditLog || []), auditEntry]
      };
      
      setContracts(contracts.map(c => c.id === formData.id ? updatedContract : c));
    } else {
      // Creating new contract
      const auditEntry = createAuditEntry(
        'CONTRACT_CREATED',
        formData.contractManager,
        'Contract created and initialized',
        null,
        null
      );
      
      const newContract = {
        ...formData,
        id: String(contracts.length + 1),
        auditLog: [auditEntry]
      };
      
      setContracts([...contracts, newContract]);
    }
    setCurrentView('register');
    setEditMode(false);
  };

  const handleSubmitForApproval = (contractId) => {
    const contract = contracts.find(c => c.id === contractId);
    const auditEntry = createAuditEntry(
      'SUBMITTED_FOR_REVIEW',
      contract.contractManager,
      'Contract submitted for approval',
      contract.status,
      'Review'
    );
    
    setContracts(contracts.map(c => 
      c.id === contractId 
        ? { ...c, status: 'Review', auditLog: [...c.auditLog, auditEntry] }
        : c
    ));
    
    if (selectedContract?.id === contractId) {
      setSelectedContract({
        ...selectedContract,
        status: 'Review',
        auditLog: [...selectedContract.auditLog, auditEntry]
      });
    }
    
    alert('Contract submitted for approval');
  };

  const handleExtensionClick = (contract) => {
    setExtensionContract(contract);
    setShowExtensionModal(true);
  };

  const handleSaveExtension = (newEndDate, auditComment) => {
    const contract = extensionContract;
    
    // Create audit entry for the extension
    const auditEntry = createAuditEntry(
      'CONTRACT_EXTENDED',
      contract.contractManager,
      auditComment,
      contract.endDate,
      newEndDate
    );
    
    // Update contract with new end date and audit log
    const updatedContract = {
      ...contract,
      endDate: newEndDate,
      originalEndDate: contract.originalEndDate || contract.endDate,
      status: 'Active Extended',
      auditLog: [...contract.auditLog, auditEntry]
    };
    
    setContracts(contracts.map(c => 
      c.id === contract.id ? updatedContract : c
    ));
    
    // Update selected contract if viewing details
    if (selectedContract?.id === contract.id) {
      setSelectedContract(updatedContract);
    }
    
    setShowExtensionModal(false);
    setExtensionContract(null);
    alert('Contract extension saved successfully');
  };

  const handleDocumentUpload = (contractId, fileName) => {
    const newDoc = {
      id: `d${Date.now()}`,
      name: fileName,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`
    };
    
    const contract = contracts.find(c => c.id === contractId);
    const auditEntry = createAuditEntry(
      'DOCUMENT_UPLOADED',
      contract.contractManager,
      `Document uploaded: ${fileName}`,
      null,
      null
    );
    
    setContracts(contracts.map(c => 
      c.id === contractId 
        ? { 
            ...c, 
            documents: [...c.documents, newDoc],
            auditLog: [...c.auditLog, auditEntry]
          }
        : c
    ));
  };

  const renderRegister = () => (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contract Register</h1>
        <p className="text-gray-600">Manage and track all contracts</p>
      </div>

      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Status</option>
          {Object.keys(statusConfig).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          New Contract
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Ref</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredContracts.map((contract) => {
              const StatusIcon = statusConfig[contract.status].icon;
              return (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {contract.contractRef}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.contractName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {contract.contractManager}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {contract.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[contract.status].color}`}>
                      <StatusIcon size={14} />
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${contract.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(contract)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(contract)}
                        className="text-green-600 hover:text-green-900"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const [activeTab, setActiveTab] = useState('actions');

  const renderDetails = () => {
    if (!selectedContract) return null;
    const StatusIcon = statusConfig[selectedContract.status].icon;

    return (
      <div className="p-6">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedContract.contractName}</h1>
            <p className="text-gray-600">{selectedContract.contractRef}</p>
          </div>
          <button
            onClick={() => setCurrentView('register')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Register
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Contract Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Contract Reference</label>
                  <p className="mt-1 text-gray-900">{selectedContract.contractRef}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedContract.status].color}`}>
                      <StatusIcon size={14} />
                      {selectedContract.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Start Date</label>
                  <p className="mt-1 text-gray-900">{selectedContract.startDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">End Date</label>
                  <p className="mt-1 text-gray-900">{selectedContract.endDate}</p>
                </div>
                {selectedContract.originalEndDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Original End Date</label>
                    <p className="mt-1 text-gray-900">{selectedContract.originalEndDate}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Contract Value</label>
                  <p className="mt-1 text-gray-900 font-semibold">${selectedContract.value.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Contract Manager</label>
                  <p className="mt-1 text-gray-900">{selectedContract.contractManager}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Parties Involved</label>
                  <p className="mt-1 text-gray-900">{selectedContract.partiesInvolved.join(', ')}</p>
                </div>
                {selectedContract.renewalDate && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Renewal Date</label>
                    <p className="mt-1 text-gray-900">{selectedContract.renewalDate}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="mt-1 text-gray-900">{selectedContract.description}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Documents & Attachments</h2>
                <button
                  onClick={() => {
                    const fileName = prompt('Enter document name:');
                    if (fileName) {
                      handleDocumentUpload(selectedContract.id, fileName);
                      setSelectedContract({
                        ...selectedContract,
                        documents: [...selectedContract.documents, {
                          id: `d${Date.now()}`,
                          name: fileName,
                          uploadDate: new Date().toISOString().split('T')[0],
                          size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`
                        }]
                      });
                    }
                  }}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                >
                  <Upload size={16} />
                  Upload Document
                </button>
              </div>
              {selectedContract.documents.length > 0 ? (
                <div className="space-y-2">
                  {selectedContract.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">Uploaded: {doc.uploadDate} • {doc.size}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No documents uploaded yet</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Tab Headers */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('actions')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'actions'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Actions
                </button>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'audit'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Audit Trail
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'actions' && (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleEdit(selectedContract)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Edit2 size={18} />
                      Edit Contract
                    </button>
                    {selectedContract.status === 'Draft' && (
                      <button
                        onClick={() => handleSubmitForApproval(selectedContract.id)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} />
                        Submit for Approval
                      </button>
                    )}
                    {(selectedContract.status === 'Active' || selectedContract.status === 'Active Extended') && (
                      <button
                        onClick={() => handleExtensionClick(selectedContract)}
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                      >
                        <Calendar size={18} />
                        Manage Extension
                      </button>
                    )}
                  </div>
                )}

                {activeTab === 'audit' && (
                  <div className="max-h-96 overflow-y-auto">
                    {selectedContract.auditLog && selectedContract.auditLog.length > 0 ? (
                      <div className="space-y-4">
                        {[...selectedContract.auditLog].reverse().map((entry, index) => (
                          <div key={entry.id} className="relative pl-8 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0">
                            <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-sm text-gray-900">
                                    {entry.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </h3>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(entry.timestamp).toLocaleString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap">
                                  {entry.user}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mt-2">{entry.details}</p>
                              {(entry.oldValue || entry.newValue) && (
                                <div className="mt-3 pt-3 border-t border-gray-200 text-xs">
                                  {entry.oldValue && (
                                    <p className="text-gray-600">
                                      <span className="font-medium">Previous:</span> {entry.oldValue}
                                    </p>
                                  )}
                                  {entry.newValue && (
                                    <p className="text-gray-600">
                                      <span className="font-medium">New:</span> {entry.newValue}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-8">No audit entries yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {selectedContract.renewalDate && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-900">Renewal Notice</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Contract renewal date: {selectedContract.renewalDate}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showExtensionModal && extensionContract && (
          <ExtensionModal
            contract={extensionContract}
            onClose={() => {
              setShowExtensionModal(false);
              setExtensionContract(null);
            }}
            onSave={handleSaveExtension}
          />
        )}
      </div>
    );
  };

  const renderForm = () => (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {formData.id ? 'Edit Contract' : 'Create New Contract'}
        </h1>
        <p className="text-gray-600">Enter contract details below</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-4xl">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Reference *
              </label>
              <input
                type="text"
                value={formData.contractRef || ''}
                onChange={(e) => setFormData({ ...formData, contractRef: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                readOnly={!!formData.id}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status || 'Draft'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(statusConfig).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contract Name *
            </label>
            <input
              type="text"
              value={formData.contractName || ''}
              onChange={(e) => setFormData({ ...formData, contractName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parties Involved *
            </label>
            <input
              type="text"
              value={formData.partiesInvolved?.join(', ') || ''}
              onChange={(e) => setFormData({ ...formData, partiesInvolved: e.target.value.split(',').map(s => s.trim()) })}
              placeholder="Comma-separated list of parties"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Renewal Date
              </label>
              <input
                type="date"
                value={formData.renewalDate || ''}
                onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Value *
              </label>
              <input
                type="number"
                value={formData.value || ''}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Manager *
              </label>
              <input
                type="text"
                value={formData.contractManager || ''}
                onChange={(e) => setFormData({ ...formData, contractManager: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSaveContract}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Contract
            </button>
            <button
              onClick={() => setCurrentView('register')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Contract Management System</h1>
        </div>
      </header>
      
      {currentView === 'register' && renderRegister()}
      {currentView === 'details' && renderDetails()}
      {currentView === 'form' && renderForm()}
      
      {showExtensionModal && extensionContract && (
        <ExtensionModal
          contract={extensionContract}
          onClose={() => {
            setShowExtensionModal(false);
            setExtensionContract(null);
          }}
          onSave={handleSaveExtension}
        />
      )}
    </div>
  );
};

export default ContractManagementSystem;