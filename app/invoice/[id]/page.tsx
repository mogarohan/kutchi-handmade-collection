"use client";

import { useEffect, useState, use } from "react";
import { getOrderWithItems } from "@/app/actions/admin";
import { Loader2, Printer } from "lucide-react";

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  total_amount: number;
  created_at: string;
  invoice_number?: number;
}

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price_at_time: number;
  original_price: number | null;
  size?: string;
  product_image?: string;
}

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderWithItems(resolvedParams.id);
        if (data) {
          setOrder(data.order);
          setItems(data.items);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [resolvedParams.id]);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
  if (!order) return <div className="p-12 text-center text-red-500">Order not found</div>;

  const totalOriginalPrice = items.reduce((acc, item) => acc + ((item.original_price || item.price_at_time) * item.quantity), 0);
  const hasDiscount = totalOriginalPrice > order.total_amount;

  return (
    <div className="bg-white min-h-screen text-black">
      {/* Hide this print button when printing */}
      <div className="print:hidden fixed bottom-4 right-4 sm:top-4 sm:bottom-auto flex gap-4 z-50">
        <button
          onClick={() => window.print()}
          className="bg-black text-white px-6 py-3 sm:py-2 rounded-full sm:rounded-md font-semibold flex items-center gap-2 hover:bg-gray-800 shadow-xl"
        >
          <Printer size={18} /> Print Invoice
        </button>
      </div>

      <div className="max-w-3xl mx-auto p-4 sm:p-12 print:p-6 border border-gray-300 print:border-none shadow-sm mt-16 sm:mt-8 print:mt-0 relative bg-white">
        {/* Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.08] select-none">
          <img src="/logo.png" alt="" className="w-[500px] h-[500px] object-cover rounded-full blur-[2px]" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-black pb-6 sm:pb-8 mb-6 sm:mb-8 print:pb-4 print:mb-4">
          <div>
            <div className="flex flex-col gap-2 mb-4">
              <img src="/logo.png" alt="Kutchi Handmade Logo" className="h-24 w-24 object-cover rounded-full shadow-sm" />
              <h1 className="text-2xl font-bold font-serif text-[#7C2D12]">Kutchi Handmade Collection</h1>
            </div>
            <p className="text-gray-600 font-medium">Preserving the authentic heritage of Kutch</p>
            <div className="mt-4 text-sm text-gray-600 space-y-2">
              <p className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">📍</span>
                Mandvi - Kutch, Gujarat, India 370465
              </p>
              <p className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#25D366]">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span className="font-medium">+91 93132 25740</span>
              </p>
              <div className="flex items-start gap-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E1306C] mt-0.5">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                <div className="flex flex-col">
                  <span className="font-medium text-black">@kutchi_handmade_collection</span>
                  <span className="text-xs text-gray-500">Managed by <span className="font-semibold text-gray-800">@_._kano21</span></span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto bg-gray-50/70 sm:bg-transparent p-4 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-gray-300">
            <h2 className="text-3xl font-bold mb-4 text-black">INVOICE</h2>
            <div className="text-sm">
              <p><span className="font-semibold w-24 inline-block">Invoice No:</span> #{order.invoice_number ? order.invoice_number : order.id.split('-')[0].toUpperCase()}</p>
              <p><span className="font-semibold w-24 inline-block">Date:</span> {new Date(order.created_at).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="relative z-10 mb-6 sm:mb-8 print:mb-4 p-4 sm:p-6 print:p-4 bg-gray-50/70 backdrop-blur-sm rounded-xl border border-gray-400 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          <div>
            <h3 className="font-semibold text-gray-500 mb-3 uppercase text-xs tracking-wider">Bill To</h3>
            <p className="mt-1"><span className="text-gray-500 text-sm mr-2 inline-block w-16">Name:</span><span className="font-bold text-lg text-black">{order.customer_name}</span></p>
            <p className="mt-1"><span className="text-gray-500 text-sm mr-2 inline-block w-16">Contact:</span><span className="text-gray-700 font-medium">{order.customer_phone}</span></p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500 mb-3 uppercase text-xs tracking-wider">Delivery Address</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{order.address}</p>
          </div>
        </div>

        {/* Items Table - Desktop */}
        <div className="relative z-10 bg-white/70 backdrop-blur-sm rounded-xl overflow-x-auto border border-gray-400 mb-6 sm:mb-8 print:mb-4 hidden sm:block print:block">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-400 bg-gray-50/70 backdrop-blur-sm">
                <th className="py-4 print:py-2 px-6 print:px-4 text-left font-semibold text-gray-900">Description</th>
                <th className="py-4 print:py-2 px-6 print:px-4 text-center font-semibold text-gray-900 w-24">Qty</th>
                <th className="py-4 print:py-2 px-6 print:px-4 text-right font-semibold text-gray-900 w-32">Unit Price</th>
                <th className="py-4 print:py-2 px-6 print:px-4 text-right font-semibold text-gray-900 w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-300 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 print:py-1.5 px-6 print:px-4 print:text-sm font-medium text-black flex items-center gap-4">
                    <div className="w-12 h-12 print:w-8 print:h-8 bg-gray-100 rounded-md overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                      {item.product_image ? (
                        <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-gray-400">No img</span>
                      )}
                    </div>
                    <div>
                      {item.product_name}
                      {item.size && (
                        <p className="text-xs text-gray-500 font-normal mt-0.5">Size: {item.size}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-5 print:py-1.5 px-6 print:px-4 print:text-sm text-center text-gray-700">{item.quantity}</td>
                  <td className="py-5 print:py-1.5 px-6 print:px-4 print:text-sm text-right text-gray-700">
                    <div className="flex flex-col items-end">
                      <span>₹{item.price_at_time}</span>
                      {item.original_price && item.original_price > item.price_at_time && (
                        <span className="text-xs text-gray-400 line-through">₹{item.original_price}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-5 print:py-1.5 px-6 print:px-4 print:text-sm text-right font-bold text-black">₹{item.price_at_time * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Items List - Mobile */}
        <div className="relative z-10 flex flex-col gap-4 mb-6 sm:hidden print:hidden">
          <h3 className="font-semibold text-gray-500 uppercase text-xs tracking-wider mb-2">Order Items</h3>
          {items.map((item, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-300 flex flex-col gap-3">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                  {item.product_image ? (
                    <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-gray-400">No img</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="font-medium text-black line-clamp-2 leading-tight">{item.product_name}</h4>
                  {item.size && <p className="text-xs text-gray-500 font-normal mt-1">Size: {item.size}</p>}
                </div>
              </div>
              <div className="flex justify-between items-end border-t border-gray-100 pt-3">
                <div className="text-sm text-gray-600">
                  {item.quantity} x ₹{item.price_at_time}
                </div>
                <div className="text-right">
                  <div className="font-bold text-black text-lg">₹{item.price_at_time * item.quantity}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="relative z-10 flex justify-end mb-16 print:mb-4">
          <div className="w-full sm:w-72 bg-gray-50/70 backdrop-blur-sm p-6 rounded-xl border border-gray-400">
            {hasDiscount && (
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-500">Total MRP</span>
                <span className="font-semibold text-gray-500 line-through">₹{totalOriginalPrice}</span>
              </div>
            )}
            {hasDiscount && (
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-green-600">Discount</span>
                <span className="font-semibold text-green-600">- ₹{totalOriginalPrice - order.total_amount}</span>
              </div>
            )}
            <div className="flex justify-between items-center border-t-2 border-gray-400 pt-4 mt-2">
              <span className="font-bold text-lg text-black">Total</span>
              <span className="font-bold text-3xl text-black">₹{order.total_amount}</span>
            </div>
            <p className="text-xs text-gray-400 text-right mt-3 font-medium">* Non-GST Invoice. All sales final.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-center text-gray-500 text-sm border-t border-gray-200 pt-8 mt-auto flex flex-col items-center gap-1">
          <p className="font-medium">Thank you for supporting authentic Kutchi artisans!</p>
        </div>
      </div>
    </div>
  );
}
