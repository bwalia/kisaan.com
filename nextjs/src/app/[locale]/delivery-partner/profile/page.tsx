"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface ServiceArea {
  id: number;
  country: string;
  state: string;
  city: string;
  postal_codes: string[];
  is_active: boolean;
}

interface DeliveryPartnerProfile {
  id: number;
  uuid: string;
  company_name: string;
  company_registration_number?: string;
  contact_person_name: string;
  contact_person_phone: string;
  contact_person_email: string;
  business_address: string;
  service_type: string;
  vehicle_types: string[];
  max_daily_capacity: number;
  service_radius_km: number;
  base_charge: number;
  per_km_charge: number;
  percentage_charge: number;
  pricing_model: string;
  bank_account_number?: string;
  bank_name?: string;
  bank_ifsc_code?: string;
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  total_deliveries: number;
  service_areas?: ServiceArea[];
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<DeliveryPartnerProfile | null>(null);
  const [formData, setFormData] = useState<Partial<DeliveryPartnerProfile>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && !user.role?.includes("delivery_partner")) {
      toast.error("Access denied. Delivery partner account required.");
      router.push("/");
      return;
    }

    if (user) {
      loadProfile();
    }
  }, [user, authLoading, router]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.getDeliveryPartnerProfile();
      // Safely set profile with validation
      const profileData = response?.delivery_partner;
      if (profileData && typeof profileData === 'object') {
        setProfile(profileData);
        setFormData(profileData);
      } else {
        throw new Error("Invalid profile data received");
      }
    } catch (error: any) {
      console.error("Failed to load profile:", error);
      toast.error(error.message || "Failed to load profile");
      // Set null on error so the UI shows "Profile not found"
      setProfile(null);
      setFormData({});
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVehicleTypeChange = (type: string) => {
    const currentVehicles = formData.vehicle_types || [];
    // Ensure currentVehicles is an array before operating on it
    const vehicleArray = Array.isArray(currentVehicles) ? currentVehicles : [];
    if (vehicleArray.includes(type)) {
      setFormData(prev => ({
        ...prev,
        vehicle_types: vehicleArray.filter(t => t !== type)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        vehicle_types: [...vehicleArray, type]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateDeliveryPartnerProfile(formData);
      toast.success("Profile updated successfully!");
      loadProfile();
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your delivery partner information</p>
            </div>
            <Link
              href="/delivery-partner/dashboard"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        <div className={`mb-6 rounded-lg p-4 ${profile.is_verified ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-center">
            {profile.is_verified ? (
              <>
                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-green-900">Verified Account</p>
                  <p className="text-sm text-green-700">Your account is verified and active</p>
                </div>
              </>
            ) : (
              <>
                <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-medium text-yellow-900">Pending Verification</p>
                  <p className="text-sm text-yellow-700">Your account is awaiting admin verification</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600">Rating</p>
            <p className="text-2xl font-bold text-yellow-500 mt-1">⭐ {profile.rating.toFixed(1)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600">Total Deliveries</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{profile.total_deliveries}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-sm text-gray-600">Capacity</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{profile.max_daily_capacity}/day</p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Company Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name || ''}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="company_registration_number"
                  value={formData.company_registration_number || ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Address *
              </label>
              <textarea
                name="business_address"
                value={formData.business_address || ''}
                onChange={handleChange}
                required
                rows={3}
                className="input"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  name="contact_person_name"
                  value={formData.contact_person_name || ''}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="contact_person_phone"
                  value={formData.contact_person_phone || ''}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="contact_person_email"
                  value={formData.contact_person_email || ''}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  name="service_type"
                  value={formData.service_type || 'standard'}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="standard">Standard</option>
                  <option value="express">Express</option>
                  <option value="same_day">Same Day</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Daily Capacity
                </label>
                <input
                  type="number"
                  name="max_daily_capacity"
                  value={formData.max_daily_capacity || 10}
                  onChange={handleChange}
                  min="1"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Types
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["bike", "scooter", "car", "van", "truck"].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={Array.isArray(formData.vehicle_types) && formData.vehicle_types.includes(type) || false}
                      onChange={() => handleVehicleTypeChange(type)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pricing Model
                </label>
                <select
                  name="pricing_model"
                  value={formData.pricing_model || 'flat'}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="flat">Flat Rate</option>
                  <option value="per_km">Per Kilometer</option>
                  <option value="percentage">Percentage of Order</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Charge (₹)
                </label>
                <input
                  type="number"
                  name="base_charge"
                  value={formData.base_charge || 0}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Per KM Charge (₹)
                </label>
                <input
                  type="number"
                  name="per_km_charge"
                  value={formData.per_km_charge || 0}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Percentage Charge (%)
                </label>
                <input
                  type="number"
                  name="percentage_charge"
                  value={formData.percentage_charge || 0}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Banking (Optional) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Banking Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="bank_account_number"
                  value={formData.bank_account_number || ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bank_name"
                  value={formData.bank_name || ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="bank_ifsc_code"
                  value={formData.bank_ifsc_code || ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setFormData(profile)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
