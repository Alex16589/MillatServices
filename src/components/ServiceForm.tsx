import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ServiceForm({ onSuccess }: { onSuccess: () => void }) {
  const [customerName, setCustomerName] = useState('');
  const [complaint, setComplaint] = useState('');
  const [mobile, setMobile] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submitted with values:', {
      customerName,
      complaint,
      mobile,
      technicianName,
      serviceDate,
    });

    setLoading(true);

    const { error } = await supabase.from('service_requests').insert([
      {
        customer_name: customerName,
        complaint,
        mobile,
        technician_name: technicianName,
        service_date: serviceDate,
      },
    ]);

    if (error) {
      console.error('Error submitting request:', error);
    } else {
      console.log('Request submitted successfully');
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Customer Name
        </label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Complaint
        </label>
        <textarea
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Mobile
        </label>
        <input
          type="text"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Technician Name
        </label>
        <input
          type="text"
          value={technicianName}
          onChange={(e) => setTechnicianName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Service Date
        </label>
        <input
          type="date"
          value={serviceDate}
          onChange={(e) => setServiceDate(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
