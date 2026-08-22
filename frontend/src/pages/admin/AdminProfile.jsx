import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { employeeService } from '../../services/employeeService';
import EmployeeProfileCard from '../../components/employee/EmployeeProfileCard';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';

const AdminProfile = () => {
  const { employeeId } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      // Default to HR-001 or active admin ID
      const id = employeeId || 'HR-001';
      const data = await employeeService.getEmployeeById(id);
      setAdminData(data);
    } catch (err) {
      setError(err.message || 'Unable to load admin profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [employeeId]);

  if (loading) {
    return <Loading text="Loading administrator profile..." />;
  }

  if (error || !adminData) {
    return (
      <ErrorState
        title="Admin Profile Unavailable"
        description={error || 'Could not find administrative profile information.'}
        onRetry={fetchProfile}
      />
    );
  }

  return (
    <div className="space-y-6">
      <EmployeeProfileCard
        employee={adminData}
        isOwnProfile={true}
        canEdit={true}
        onProfileUpdated={fetchProfile}
      />
    </div>
  );
};

export default AdminProfile;
