import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ServiceForm from './ServiceForm';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';

interface ServiceRequest {
  id: string;
  customer_name: string;
  complaint: string;
  mobile: string;
  technician_name: string;
  service_date: string;
  status: string;
  notes: string;
  created_at: string;
}

export default function Dashboard() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requests:', error);
      return;
    }

    setRequests(data || []);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      await fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      requests.map((request) => ({
        'Customer Name': request.customer_name,
        'Complaint': request.complaint,
        Mobile: request.mobile,
        Technician: request.technician_name,
        'Service Date': format(new Date(request.service_date), 'dd/MM/yyyy'),
        Status: request.status,
        Notes: request.notes,
        'Created At': format(new Date(request.created_at), 'dd/MM/yyyy HH:mm'),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Service Requests');
    XLSX.writeFile(workbook, 'service-requests.xlsx');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {showForm ? 'Hide Form' : 'New Request'}
          </button>
          <button
            onClick={exportToExcel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8 bg-white shadow rounded-lg p-6">
          <ServiceForm
            onSuccess={() => {
              setShowForm(false);
              fetchRequests();
            }}
          />
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Complaint
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Technician
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {request.customer_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {request.complaint}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.mobile}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.technician_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(request.service_date), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${
                      request.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(request.id, 'completed')}
                      disabled={updating === request.id}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {updating === request.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                      )}
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
