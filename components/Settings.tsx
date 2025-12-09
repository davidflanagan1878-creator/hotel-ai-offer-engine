import React from 'react';
import { Shield, Database, Plug, Globe } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">System Configuration</h2>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                    <Plug className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-bold">Integrations</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Manage connections with Property Management Systems (PMS) and CRMs.</p>
            <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                    <span className="font-medium text-gray-700">Oracle Opera PMS</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Connected</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                    <span className="font-medium text-gray-700">Salesforce CRM</span>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-bold">Disconnected</span>
                </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                    <Shield className="text-purple-600" size={24} />
                </div>
                <h3 className="text-lg font-bold">Data Privacy</h3>
            </div>
             <p className="text-sm text-gray-500 mb-4">Configure GDPR and CCPA compliance settings for guest data.</p>
             <div className="space-y-2">
                 <label className="flex items-center space-x-3">
                     <input type="checkbox" checked readOnly className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"/>
                     <span className="text-sm text-gray-700">Anonymize data after 2 years</span>
                 </label>
                 <label className="flex items-center space-x-3">
                     <input type="checkbox" checked readOnly className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"/>
                     <span className="text-sm text-gray-700">Require consent for AI processing</span>
                 </label>
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 p-2 rounded-lg">
                    <Database className="text-orange-600" size={24} />
                </div>
                <h3 className="text-lg font-bold">Pricing Tiers</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Set dynamic pricing rules for AI generated packages.</p>
            <button className="text-sm text-hotel-gold font-bold hover:underline">Manage Pricing Rules</button>
          </div>
       </div>
    </div>
  );
};