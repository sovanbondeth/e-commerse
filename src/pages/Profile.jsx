import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ref, get, update } from 'firebase/database';
import { db } from '../firebase';
import { useToast } from '../components/Toast';

function Profile() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    username: '',
    email: currentUser?.email || '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRef = ref(db, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setProfileData(prevData => ({
            ...prevData,
            ...snapshot.val()
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        showToast('Failed to load profile data', 'danger');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser, showToast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = ref(db, `users/${currentUser.uid}`);
      await update(userRef, profileData);
      showToast('Profile updated successfully', 'success');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile', 'danger');
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow">
            {/* Profile Header */}
            <div className="card-header bg-primary text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="card-title h4 mb-0">
                  <i className="bi bi-person-circle me-2"></i>
                  My Profile
                </h2>
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <i className={`bi bi-${isEditing ? 'x-circle' : 'pencil'} me-2`}></i>
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Personal Information Section */}
                  <div className="mb-4">
                    <h5 className="border-bottom pb-2">
                      <i className="bi bi-person me-2"></i>
                      Personal Information
                    </h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Username</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-at"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            name="username"
                            value={profileData.username}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-envelope"></i>
                          </span>
                          <input
                            type="email"
                            className="form-control"
                            value={profileData.email}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="mb-4">
                    <h5 className="border-bottom pb-2">
                      <i className="bi bi-telephone me-2"></i>
                      Contact Information
                    </h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Phone</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-phone"></i>
                          </span>
                          <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="mb-4">
                    <h5 className="border-bottom pb-2">
                      <i className="bi bi-geo-alt me-2"></i>
                      Address Information
                    </h5>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Street Address</label>
                        <input
                          type="text"
                          className="form-control"
                          name="address"
                          value={profileData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-5">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={profileData.city}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          className="form-control"
                          name="state"
                          value={profileData.state}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Zip Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="zipCode"
                          value={profileData.zipCode}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <div className="d-grid gap-2">
                      <button type="submit" className="btn btn-success">
                        <i className="bi bi-check-circle me-2"></i>
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 