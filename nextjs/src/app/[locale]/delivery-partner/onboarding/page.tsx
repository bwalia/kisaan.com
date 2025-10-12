"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

interface ServiceArea {
  country: string;
  state: string;
  city: string;
  postal_codes: string[];
}

export default function DeliveryPartnerOnboarding() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login first");
      router.push("/login");
    }
  }, [authLoading, user, router]);

  const [formData, setFormData] = useState({
    // Company Information
    company_name: "",
    company_registration_number: "",
    business_address: "",

    // Contact Information
    contact_person_name: user?.name || "",
    contact_person_phone: "",
    contact_person_email: user?.email || "",

    // Service Details
    service_type: "standard",
    vehicle_types: [] as string[],
    max_daily_capacity: 10,
    service_radius_km: 10,

    // Pricing Model
    pricing_model: "flat",
    base_charge: 0,
    per_km_charge: 0,
    percentage_charge: 0,

    // Banking Details
    bank_account_number: "",
    bank_name: "",
    bank_ifsc_code: "",

    // Service Areas
    service_areas: [
      { country: "India", state: "", city: "", postal_codes: [] }
    ] as ServiceArea[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVehicleTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      vehicle_types: prev.vehicle_types.includes(type)
        ? prev.vehicle_types.filter(t => t !== type)
        : [...prev.vehicle_types, type]
    }));
  };

  const handleAreaChange = (index: number, field: keyof ServiceArea, value: any) => {
    const newAreas = [...formData.service_areas];
    newAreas[index] = { ...newAreas[index], [field]: value };
    setFormData(prev => ({ ...prev, service_areas: newAreas }));
  };

  const addServiceArea = () => {
    setFormData(prev => ({
      ...prev,
      service_areas: [...prev.service_areas, { country: "India", state: "", city: "", postal_codes: [] }]
    }));
  };

  const removeServiceArea = (index: number) => {
    setFormData(prev => ({
      ...prev,
      service_areas: prev.service_areas.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Debug: Check if token exists
      const token = localStorage.getItem('token');
      console.log('=== ONBOARDING SUBMIT DEBUG ===');
      console.log('Token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'null');
      console.log('User:', user);
      console.log('Form data:', formData);

      await api.registerDeliveryPartner(formData);

      toast.success("Delivery partner profile created successfully!");
      router.push("/delivery-partner/dashboard");
    } catch (error: any) {
      console.error('Delivery partner registration error:', error);
      toast.error(error.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= num ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > num ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>Company Info</span>
            <span>Service Details</span>
            <span>Pricing</span>
            <span>Banking</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Delivery Partner Onboarding
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Company Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Company Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    required
                    value={formData.company_name}
                    onChange={handleChange}
                    className="input"
                    placeholder="Your company or business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Registration Number
                  </label>
                  <input
                    type="text"
                    name="company_registration_number"
                    value={formData.company_registration_number}
                    onChange={handleChange}
                    className="input"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address *
                  </label>
                  <textarea
                    name="business_address"
                    required
                    rows={3}
                    value={formData.business_address}
                    onChange={handleChange}
                    className="input"
                    placeholder="Complete business address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      name="contact_person_name"
                      required
                      value={formData.contact_person_name}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="contact_person_phone"
                      required
                      value={formData.contact_person_phone}
                      onChange={handleChange}
                      className="input"
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contact_person_email"
                    required
                    value={formData.contact_person_email}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Service Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Service Details</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type *
                  </label>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="standard">Standard (2-3 days)</option>
                    <option value="express">Express (1 day)</option>
                    <option value="same_day">Same Day</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Vehicle Types * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["bike", "car", "van", "truck"].map((type) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.vehicle_types.includes(type)}
                          onChange={() => handleVehicleTypeToggle(type)}
                          className="w-4 h-4 text-green-600 rounded"
                        />
                        <span className="capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Daily Capacity (orders) *
                    </label>
                    <input
                      type="number"
                      name="max_daily_capacity"
                      required
                      min="1"
                      value={formData.max_daily_capacity}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Radius (km) *
                    </label>
                    <input
                      type="number"
                      name="service_radius_km"
                      required
                      min="1"
                      value={formData.service_radius_km}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>

                {/* Service Areas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Service Areas *
                  </label>
                  {formData.service_areas.map((area, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <input
                            type="text"
                            placeholder="State"
                            value={area.state}
                            onChange={(e) => handleAreaChange(index, "state", e.target.value)}
                            className="input"
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="City"
                            value={area.city}
                            onChange={(e) => handleAreaChange(index, "city", e.target.value)}
                            className="input"
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Postal codes (comma-separated)"
                            value={area.postal_codes.join(", ")}
                            onChange={(e) =>
                              handleAreaChange(
                                index,
                                "postal_codes",
                                e.target.value.split(",").map(s => s.trim()).filter(s => s)
                              )
                            }
                            className="input flex-1"
                          />
                          {formData.service_areas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeServiceArea(index)}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addServiceArea}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    + Add Another Area
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Pricing Model */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Pricing Model</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pricing Model *
                  </label>
                  <select
                    name="pricing_model"
                    value={formData.pricing_model}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="flat">Flat Rate</option>
                    <option value="per_km">Per Kilometer</option>
                    <option value="percentage">Percentage of Order</option>
                    <option value="hybrid">Hybrid (Base + Per KM + %)</option>
                  </select>
                </div>

                {(formData.pricing_model === "flat" || formData.pricing_model === "hybrid") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Charge (₹) *
                    </label>
                    <input
                      type="number"
                      name="base_charge"
                      required
                      min="0"
                      step="0.01"
                      value={formData.base_charge}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                )}

                {(formData.pricing_model === "per_km" || formData.pricing_model === "hybrid") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Per Kilometer Charge (₹) *
                    </label>
                    <input
                      type="number"
                      name="per_km_charge"
                      required
                      min="0"
                      step="0.01"
                      value={formData.per_km_charge}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                )}

                {(formData.pricing_model === "percentage" || formData.pricing_model === "hybrid") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Percentage of Order Value (%) *
                    </label>
                    <input
                      type="number"
                      name="percentage_charge"
                      required
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.percentage_charge}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Pricing Example:</h4>
                  <p className="text-sm text-blue-700">
                    {formData.pricing_model === "flat" && `Flat rate: ₹${formData.base_charge} per delivery`}
                    {formData.pricing_model === "per_km" && `₹${formData.base_charge} + ₹${formData.per_km_charge} per km`}
                    {formData.pricing_model === "percentage" && `${formData.percentage_charge}% of order value`}
                    {formData.pricing_model === "hybrid" && `₹${formData.base_charge} + ₹${formData.per_km_charge}/km + ${formData.percentage_charge}% of order`}
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Banking Details */}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Banking Details</h3>
                <p className="text-sm text-gray-600">
                  Your earnings will be transferred to this account
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Account Number *
                  </label>
                  <input
                    type="text"
                    name="bank_account_number"
                    required
                    value={formData.bank_account_number}
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    name="bank_name"
                    required
                    value={formData.bank_name}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., State Bank of India"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    name="bank_ifsc_code"
                    required
                    value={formData.bank_ifsc_code}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., SBIN0001234"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Please ensure your banking details are correct. Incorrect details may cause payment delays.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? "Creating Profile..." : "Complete Registration"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
