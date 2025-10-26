"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function DeliveryPartnerVerification() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

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
      loadVerificationStatus();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const loadVerificationStatus = async () => {
    try {
      setLoading(true);
      const profileResponse = await api.getDeliveryPartnerProfile();

      // Get phone number and verification status from profile
      if (profileResponse.delivery_partner) {
        const partner = profileResponse.delivery_partner;
        setPhoneNumber(partner.contact_person_phone || "");
        setIsVerified(partner.is_verified || false);

        // If verification_status exists in response, use it
        if (profileResponse.verification_status) {
          setIsVerified(profileResponse.verification_status.is_verified || false);
        }
      }
    } catch (error: any) {
      console.error("Verification status error:", error);
      toast.error(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      setSendingOtp(true);

      // Call API to send OTP
      const response = await api.sendVerificationOtp(phoneNumber);

      // For now, display the OTP on frontend (as per requirement)
      if (response.otp) {
        toast.success(
          `OTP sent to ${phoneNumber}`,
          { duration: 5000 }
        );

        // Show OTP in console and alert for testing
        console.log("🔐 Verification OTP:", response.otp);
        alert(`Testing Mode - Your OTP is: ${response.otp}\n\nIn production, this will be sent via SMS.`);
      }

      setOtpSent(true);
      setResendTimer(60); // 60 seconds cooldown
      toast.success("OTP sent successfully!");
    } catch (error: any) {
      console.error("Send OTP error:", error);
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.trim().length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setVerifying(true);

      const response = await api.verifyDeliveryPartnerOtp(phoneNumber, otp);

      if (response.verified) {
        toast.success("Phone number verified successfully! Your account is now active.");
        setIsVerified(true);

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/delivery-partner/dashboard");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      toast.error(error.message || "Invalid OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) {
      toast.error(`Please wait ${resendTimer} seconds before resending`);
      return;
    }
    setOtp("");
    handleSendOtp();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/delivery-partner/dashboard" className="text-green-600 hover:text-green-700 mb-4 inline-flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Account Verification</h1>
          <p className="text-gray-600 mt-2">Verify your phone number to start accepting orders</p>
        </div>

        {/* Already Verified State */}
        {isVerified ? (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Verified!</h2>
              <p className="text-gray-600 mb-6">Your phone number has been verified. You can now accept delivery orders.</p>
              <Link
                href="/delivery-partner/dashboard"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Go to Dashboard
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Verification Card */}
            <div className="bg-white rounded-lg shadow p-8 mb-6">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900">Phone Verification Required</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    We'll send a 6-digit OTP to verify your phone number
                  </p>
                </div>
              </div>

              {/* Phone Number Input */}
              {!otpSent ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91-9876543210"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Enter your registered phone number
                    </p>
                  </div>

                  <button
                    onClick={handleSendOtp}
                    disabled={sendingOtp || !phoneNumber}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    {sendingOtp ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Send OTP
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                    <div className="flex">
                      <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="ml-3 text-sm text-blue-700">
                        OTP has been sent to <span className="font-semibold">{phoneNumber}</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl tracking-widest font-semibold"
                    />
                    <p className="mt-2 text-sm text-gray-500 text-center">
                      Enter the 6-digit code we sent to your phone
                    </p>
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={verifying || otp.length !== 6}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    {verifying ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verify OTP
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      onClick={handleResendOtp}
                      disabled={resendTimer > 0}
                      className="text-sm text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      {resendTimer > 0 ? (
                        `Resend OTP in ${resendTimer}s`
                      ) : (
                        "Resend OTP"
                      )}
                    </button>
                    <span className="mx-2 text-gray-400">|</span>
                    <button
                      onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                      }}
                      className="text-sm text-gray-600 hover:text-gray-700"
                    >
                      Change Phone Number
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="bg-yellow-50 rounded-lg p-6">
              <div className="flex items-start">
                <svg className="h-6 w-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">Testing Mode</h3>
                  <p className="text-sm text-yellow-700">
                    Currently in testing mode. The OTP will be displayed on screen and in browser console.
                    In production, OTP will be sent via SMS to your phone number.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
