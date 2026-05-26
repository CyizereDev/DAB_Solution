import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import LoadingSpinner from '../Common/LoadingSpinner';

const CustomerDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      const [customerRes, historyRes] =
        await Promise.all([
          axios.get(`/api/customers/${id}`),
          axios.get(
            `/api/customers/${id}/history`
          ),
        ]);

      setCustomer(customerRes.data.data);

      setPurchases(historyRes.data.data);
    } catch (error) {
      console.error(
        'Error fetching customer details:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!customer) {
    return (
      <div className="text-center py-12">
        Customer not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/customers')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeftIcon className="h-5 w-5" />

        <span>Back to Customers</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Customer Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">
              Personal Information
            </h3>

            <div className="space-y-2">
              <p>
                <span className="text-gray-500">
                  Name:
                </span>{' '}
                {customer.name}
              </p>

              <p>
                <span className="text-gray-500">
                  Email:
                </span>{' '}
                {customer.email}
              </p>

              <p>
                <span className="text-gray-500">
                  Phone:
                </span>{' '}
                {customer.phone}
              </p>

              <p>
                <span className="text-gray-500">
                  Address:
                </span>{' '}
                {customer.address || 'N/A'}
              </p>

              <p>
                <span className="text-gray-500">
                  City:
                </span>{' '}
                {customer.city || 'N/A'}
              </p>

              <p>
                <span className="text-gray-500">
                  Company:
                </span>{' '}
                {customer.company || 'N/A'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3">
              Purchase Statistics
            </h3>

            <div className="space-y-2">
              <p>
                <span className="text-gray-500">
                  Total Purchases:
                </span>{' '}
                <span className="font-semibold text-green-600">
                  $
                  {customer.totalPurchases?.toFixed(
                    2
                  ) || '0.00'}
                </span>
              </p>

              <p>
                <span className="text-gray-500">
                  Total Orders:
                </span>{' '}
                {customer.totalOrders || 0}
              </p>

              <p>
                <span className="text-gray-500">
                  Customer Since:
                </span>{' '}
                {format(
                  new Date(customer.createdAt),
                  'PPP'
                )}
              </p>

              <p>
                <span className="text-gray-500">
                  Last Purchase:
                </span>{' '}
                {customer.lastPurchaseDate
                  ? format(
                      new Date(
                        customer.lastPurchaseDate
                      ),
                      'PPP'
                    )
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-gray-700 mb-4">
            Purchase History
          </h3>

          {purchases.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No purchase history
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Invoice
                    </th>

                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                      Amount
                    </th>

                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Date
                    </th>

                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {purchases.map((purchase) => (
                    <tr
                      key={purchase._id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-2 text-primary-600">
                        {purchase.invoiceNumber}
                      </td>

                      <td className="px-4 py-2 text-right font-semibold">
                        $
                        {purchase.total?.toFixed(2)}
                      </td>

                      <td className="px-4 py-2 text-gray-500">
                        {format(
                          new Date(
                            purchase.saleDate
                          ),
                          'PPP'
                        )}
                      </td>

                      <td className="px-4 py-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full capitalize">
                          {purchase.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;