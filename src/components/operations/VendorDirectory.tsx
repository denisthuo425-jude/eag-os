"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Loader2, Contact, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function VendorDirectory() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // 1. Fetch live data when the widget loads
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

  // 2. Handle Form Submission
  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault(); // <--- THIS STOPS THE PAGE FROM RELOADING!
    if (!name || !category) return;

    setIsSubmitting(true);

    try {
      const payload = {
        name: name,
        category: category,
        phone: phone,
        email: email,
        status: 'Active'
      };

      const { data, error } = await supabase
        .from('vendors')
        .insert([payload])
        .select();

      if (error) throw error;

      // Success! Add the new vendor to the top of the UI list instantly
      if (data && data.length > 0) {
        setVendors([data[0], ...vendors]);
      }

      // Clear the form
      setName("");
      setCategory("");
      setPhone("");
      setEmail("");

    } catch (error: any) {
      alert("DATABASE REJECTED VENDOR: " + error.message);
      console.error("Full error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="flex items-center text-lg text-slate-800">
          <Contact className="w-5 h-5 mr-2 text-primary" />
          Vendor Directory
        </CardTitle>
        <CardDescription>Emergency contacts and supply chain.</CardDescription>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex flex-col">
        {/* The Live List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px]">
          {isLoading ? (
            <p className="text-sm text-slate-500 animate-pulse">Loading vendors...</p>
          ) : vendors.length === 0 ? (
            <p className="text-sm text-slate-500">No vendors added yet.</p>
          ) : (
            vendors.map((vendor) => (
              <div key={vendor.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="font-semibold text-sm text-slate-800">{vendor.name}</p>
                  <p className="text-xs text-slate-500">
                    {vendor.phone && <span>{vendor.phone}</span>}
                    {vendor.phone && vendor.email && <span> • </span>}
                    {vendor.email && <span>{vendor.email}</span>}
                  </p>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-slate-200 text-slate-700 rounded-full">
                  {vendor.category}
                </span>
              </div>
            ))
          )}
        </div>

        {/* The Input Form */}
        <form onSubmit={handleAddVendor} className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input
              type="text"
              placeholder="Vendor Name"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="md:col-span-1 text-sm p-2 border border-slate-300 rounded focus:ring-primary focus:border-primary"
            />
            <input
              type="text"
              placeholder="Category"
              required
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="md:col-span-1 text-sm p-2 border border-slate-300 rounded focus:ring-primary focus:border-primary"
            />
            <input
              type="text"
              placeholder="Phone"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="md:col-span-1 text-sm p-2 border border-slate-300 rounded focus:ring-primary focus:border-primary"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="md:col-span-1 text-sm p-2 border border-slate-300 rounded focus:ring-primary focus:border-primary"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="md:col-span-1 flex items-center justify-center p-2 bg-primary text-white text-sm font-medium rounded hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4 mr-1" /> Add</>}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}