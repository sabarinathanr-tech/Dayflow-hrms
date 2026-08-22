import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import EmployeeProfileCard from '../../components/employee/EmployeeProfileCard';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import { employeeService } from '../../services/employeeService';

const MyProfile = () => {
  const { employeeId } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getCurrentEmployee();
      setEmployee(data);
    } catch (err) {
      setError(err.message || 'Unable to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [employeeId]);

  if (loading) {
    return <Loading text="Loading employee profile..." />;
  }

  if (error || !employee) {
    return (
      <ErrorState
        title="Unable to load profile"
        description={error || 'Employee record could not be retrieved.'}
        onRetry={fetchProfile}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            My Employee Profile
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal contact info and review your job details.
          </p>
        </div>
      </div>

      <EmployeeProfileCard
        employee={employee}
        isSelf={true}
        onProfileUpdated={fetchProfile}
      />
    </div>
  );
};

export default MyProfile;
