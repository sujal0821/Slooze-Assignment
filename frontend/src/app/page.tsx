"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  ShoppingBag,
  Store,
  History,
  Settings,
  LogOut,
  Plus,
  Trash2,
  CreditCard,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useAuth, Role } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { GET_RESTAURANTS, GET_ORDERS } from "../lib/graphql/queries";
import { PLACE_ORDER, CANCEL_ORDER } from "../lib/graphql/mutations";

// Define strict types for our data
interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface Restaurant {
  id: string;
  name: string;
  country: string;
  menuItems: MenuItem[];
}

interface OrderItem {
  id: string;
  quantity: number;
  menuItem: MenuItem;
}

interface Order {
  id: string;
  status: string;
  total: number;
  restaurant: {
    name: string;
  };
  items: OrderItem[];
}

interface GetRestaurantsQuery {
  restaurants: Restaurant[];
}

interface GetOrdersQuery {
  orders: Order[];
}

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const { items, addItem, removeItem, total, clearCart } = useCart();
  const [activeTab, setActiveTab] = useState("restaurants");
  const router = useRouter();

  const formatCurrency = (price: number) => {
    if (user?.country === "INDIA") {
      return `₹${(price * 83).toLocaleString('en-IN')}`;
    }
    return `$${price.toFixed(2)}`;
  };

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const { data: restData, loading: restLoading, error: restError } = useQuery<GetRestaurantsQuery>(GET_RESTAURANTS);
  const { data: orderData, loading: orderLoading, refetch: refetchOrders } = useQuery<GetOrdersQuery>(GET_ORDERS);

  const [placeOrder] = useMutation(PLACE_ORDER, {
    onCompleted: () => {
      clearCart();
      refetchOrders();
      toast.success("Order placed successfully!", {
        description: "Your meal is on the way!"
      });
    },
    onError: (err) => toast.error(`Error: ${err.message}`),
  });

  const [cancelOrder] = useMutation(CANCEL_ORDER, {
    onCompleted: () => {
      refetchOrders();
      toast.info("Order cancelled", {
        description: "We hope to see you again soon."
      });
    },
  });

  const handleCheckout = (paymentMethod: string) => {
    if (items.length === 0) return;
    const orderInput = {
      restaurantId: items[0].restaurantId,
      paymentMethod,
      items: items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
    };
    placeOrder({ variables: { input: orderInput } });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading experience...</p>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 font-sans">
      {/* Sticky Glassmorphism Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center">
          <div className="flex flex-col items-center gap-1">
            <img src="/FFFFFF-1.png" alt="Slooze Logo" className="w-32 h-auto object-contain" />
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-medium leading-none">
              <MapPin className="w-3 h-3 text-indigo-500" />
              <span>Operating in <b className="text-slate-700">{user.role === 'ADMIN' ? 'India & USA' : user.country}</b></span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="font-semibold text-sm text-slate-800">{user.name}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border ${user.role === Role.ADMIN ? "bg-purple-50 text-purple-700 border-purple-100" :
                user.role === Role.MANAGER ? "bg-blue-50 text-blue-700 border-blue-100" :
                  "bg-slate-100 text-slate-600 border-slate-200"
                }`}>
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full transition-all duration-200 focus:ring-2 focus:ring-indigo-100"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Pill Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
        <nav className="inline-flex p-1.5 bg-white border border-slate-200/60 rounded-full shadow-sm">
          {[
            { id: "restaurants", label: "Explore", icon: Store },
            { id: "cart", label: `Cart (${items.length})`, icon: ShoppingBag },
            { id: "orders", label: "History", icon: History },
            { id: "settings", label: "Admin", icon: Settings, adminOnly: true },
          ].map((tab) => {
            if (tab.adminOnly && user.role !== Role.ADMIN) return null;
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-out ${isActive
                  ? "text-indigo-600 bg-indigo-50 shadow-sm ring-1 ring-indigo-100"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-20">

        {/* Restaurants View */}
        {activeTab === "restaurants" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Top Restaurants</h2>
                <p className="text-slate-500 mt-2 text-base">Hand-picked culinary experiences available in <span className="font-semibold text-indigo-600">{user.role === 'ADMIN' ? 'India & USA' : user.country}</span>.</p>
              </div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 text-xs font-medium text-indigo-600/80 hover:bg-indigo-100 transition-colors cursor-default self-start md:self-end mb-2 md:mb-0">
                Made with ❤️ by <a href="mailto:sujal0821@gmail.com" className="font-bold hover:underline">Sujal Singh</a>
              </span>
            </div>

            {restLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : restError ? (
              <div className="p-8 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                Failed to load restaurants: {restError.message}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {restData?.restaurants?.map((rest: Restaurant) => (
                  <div key={rest.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
                    {/* Top Regional Accent Bar */}
                    <div className={`h-1.5 w-full ${user.country === "INDIA" ? "bg-emerald-500" : "bg-indigo-500"}`} />

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{rest.name}</h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{rest.country}</p>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-indigo-50 transition-colors">
                          <Store className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        {rest.menuItems.map((item: MenuItem) => (
                          <div key={item.id} className="group/item flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                              <span className="text-xs text-indigo-600 font-bold mt-0.5">{formatCurrency(item.price)}</span>
                            </div>
                            <button
                              onClick={() => addItem({ menuItemId: item.id, name: item.name, price: item.price, restaurantId: rest.id })}
                              className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-full hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:scale-110 active:scale-95 transition-all shadow-sm"
                              title="Add to Cart"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cart View */}
        {activeTab === "cart" && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden ring-1 ring-slate-900/5">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <ShoppingBag className="w-5 h-5 text-indigo-500" />
                  Your Cart
                </h2>
                <div className="bg-white px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest shadow-sm">
                  {items.length} Items
                </div>
              </div>

              <div className="p-8">
                {items.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <ShoppingBag className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Your cart is empty</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">Looks like you haven&apos;t added any items yet. Explore our restaurants to find something delicious.</p>
                    <button onClick={() => setActiveTab('restaurants')} className="mt-8 px-6 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                      Start Exploring
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {items.map((item) => (
                        <div key={item.menuItemId} className="flex justify-between items-center group p-2 hover:bg-slate-50 rounded-xl transition-colors">
                          <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center font-bold text-indigo-600 border border-indigo-100 shadow-sm">
                              {item.quantity}x
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{item.name}</p>
                              <p className="text-xs text-slate-400 font-medium">{formatCurrency(item.price)} per unit</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <span className="font-bold text-slate-700">{formatCurrency(item.price * item.quantity)}</span>
                            <button
                              onClick={() => removeItem(item.menuItemId)}
                              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 space-y-3 border border-slate-100">
                      <div className="flex justify-between text-sm text-slate-500">
                        <span>Subtotal</span>
                        <span className="font-medium">{formatCurrency(total)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-500">
                        <span>Taxes & Fees (5%)</span>
                        <span className="font-medium">{formatCurrency(total * 0.05)}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-slate-900 pt-4 border-t border-slate-200 mt-2">
                        <span>Grand Total</span>
                        <span className="text-indigo-600">{formatCurrency(total * 1.05)}</span>
                      </div>
                    </div>

                    {user.role === Role.MEMBER ? (
                      <div className="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 items-start shadow-sm">
                        <div className="bg-amber-100 p-2 rounded-lg">
                          <ShieldCheck className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-amber-900">Access Restricted</p>
                          <p className="text-sm text-amber-700 mt-1 leading-relaxed">
                            Your account status (Member) allows you to build carts but does not have payment authorization privileges. Please forward this cart to a Manager.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCheckout("Visa 4242")}
                        className="group w-full mt-8 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                      >
                        <span>Confirm & Pay</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders View */}
        {activeTab === "orders" && (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200">
                <History className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Order History</h2>
                <p className="text-slate-500 text-sm">Track your past dining experiences</p>
              </div>
            </div>

            <div className="grid gap-4">
              {orderLoading && (
                <div className="p-12 text-center text-slate-500">Loading your history...</div>
              )}

              {orderData?.orders?.map((order: Order) => (
                <div key={order.id} className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-5">
                      <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                        <CreditCard className="w-6 h-6 text-slate-400 group-hover:text-indigo-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-slate-800 text-lg">Order #{order.id.slice(0, 8)}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                            order.status === "PAID" ? "bg-emerald-100 text-emerald-700" :
                              "bg-rose-100 text-rose-700"
                            }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                          <span className="font-medium text-indigo-600 flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5" />
                            {order.restaurant.name}
                          </span>
                          <span className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
                            <Clock className="w-3.5 h-3.5" />
                            Just now
                          </span>
                          <span className="border-l border-slate-200 pl-4">
                            {order.items.length} Items
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Total Amount</p>
                        <p className="font-black text-xl text-slate-900">{formatCurrency(order.total)}</p>
                      </div>

                      {order.status === "PENDING" && user.role !== Role.MEMBER && (
                        <button
                          onClick={() => cancelOrder({ variables: { id: order.id } })}
                          className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                          title="Cancel Order"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Settings Tab */}
        {activeTab === "settings" && user.role === Role.ADMIN && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <Settings className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Platform Settings</h2>
              </div>

              <div className="space-y-6">
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Global Payment Gateway</label>
                  <div className="flex gap-4">
                    <select className="flex-1 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm text-sm">
                      <option>Stripe (Default)</option>
                      <option>PayPal</option>
                      <option>Razorpay</option>
                    </select>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                      Update
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Changes will apply to all regions immediately.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
