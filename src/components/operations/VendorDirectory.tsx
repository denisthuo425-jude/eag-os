"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Search, Plus, Phone, Mail, Building2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function VendorDirectory() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setVendors(data);
    setIsLoading(false);
  };

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCategory || !newPhone) return;

    setIsSubmitting(true);

    try {
      const payload = {
        name: newName,
        category: newCategory,
        phone: newPhone,
        email: newEmail || null, // Allows optional emails!
        status: 'Active'
      };

      const { data, error } = await supabase
        .from('vendors')
        .insert([payload])
        .select();

      if (error) throw error;

      if (data) {
        setVendors([data[0], ...vendors]);
      }

      setNewName("");
      setNewCategory("");
      setNewPhone("");
      setNewEmail("");
      setIsAdding(false);
    } catch (error: any) {
      alert("DATABASE REJECTED VENDOR: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span>Vendor Directory</span>
          </CardTitle>
          <CardDescription>Emergency contacts and supplier info.</CardDescription>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-blue-50 text-primary rounded hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">

        {isAdding && (
          <form onSubmit={handleAddVendor} className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <h4 className="text-sm font-semibold text-slate-800">Add New Vendor</h4>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Vendor Name" value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-2 border rounded text-xs focus:ring-primary focus:border-primary" required />
              <input type="text" placeholder="Category (e.g., Plumber)" value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full p-2 border rounded text-xs focus:ring-primary focus:border-primary" required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Phone Number" value={newPhone} onChange={e => setNewPhone(e.target.value)} className="w-full p-2 border rounded text-xs focus:ring-primary focus:border-primary" required />
              <input type="email" placeholder="Email (Optional)" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full p-2 border rounded text-xs focus:ring-primary focus:border-primary" />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex items-center px-3 py-1 text-xs font-medium bg-primary text-white hover:bg-blue-800 rounded disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null} Save Vendor
              </button>
            </div>
          </form>
        )}

        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white transition-colors focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="space-y-3 overflow-y-auto flex-1 pr-1" style={{ maxHeight: '300px' }}>
          {isLoading ? (
            <p className="text-center py-6 text-sm text-slate-500 animate-pulse">Loading vendors...</p>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-6 text-sm text-slate-500">
              No vendors found.
            </div>
          ) : (
            filteredVendors.map((vendor) => (
              <div key={vendor.id} className="p-3 border border-slate-100 rounded-lg hover:border-blue-200 hover:shadow-sm transition-all group bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm group-hover:text-primary transition-colors">{vendor.name}</h4>
                    <p className="text-xs text-blue-600 font-medium mb-2">{vendor.category}</p>

                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-slate-600">
                        <Phone className="w-3 h-3 mr-2 text-slate-400" />
                        {vendor.phone}
                      </div>
                      {vendor.email && (
                        <div className="flex items-center text-xs text-slate-600">
                          <Mail className="w-3 h-3 mr-2 text-slate-400" />
                          {vendor.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}