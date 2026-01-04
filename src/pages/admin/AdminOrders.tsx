import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { Search, Loader2, Trash2, Euro, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  order_number: string;
  status: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  city: string;
  quantity: number;
  total_price: number;
  created_at: string;
}

interface FinanceStats {
  todayRevenue: number;
  todayCount: number;
  expectedDeposits: number;
  receivedPayments: number;
  openClaims: number;
}

export default function AdminOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [financeStats, setFinanceStats] = useState<FinanceStats>({
    todayRevenue: 0,
    todayCount: 0,
    expectedDeposits: 0,
    receivedPayments: 0,
    openClaims: 0,
  });

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Client-side search filtering
      let filteredOrders = data || [];
      if (searchQuery) {
        const search = searchQuery.toLowerCase();
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.order_number.toLowerCase().includes(search) ||
            order.customer_first_name.toLowerCase().includes(search) ||
            order.customer_last_name.toLowerCase().includes(search) ||
            order.customer_email.toLowerCase().includes(search) ||
            order.city.toLowerCase().includes(search)
        );
      }

      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Fehler',
        description: 'Bestellungen konnten nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFinanceStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayIso = today.toISOString();

      // Today's orders
      const { data: todayOrders } = await supabase
        .from('orders')
        .select('total_price')
        .gte('created_at', todayIso)
        .neq('status', 'cancelled');

      const todayRevenue = todayOrders?.reduce((sum, o) => sum + Number(o.total_price), 0) || 0;
      const todayCount = todayOrders?.length || 0;

      // Expected deposits (confirmed orders without payment)
      const { data: confirmedOrders } = await supabase
        .from('orders')
        .select('total_price')
        .in('status', ['confirmed', 'scheduled'])
        .is('payment_received_at', null);

      const expectedDeposits =
        (confirmedOrders?.reduce((sum, o) => sum + Number(o.total_price), 0) || 0) * 0.5;

      // Received payments
      const { data: paidOrders } = await supabase
        .from('orders')
        .select('total_price')
        .not('payment_received_at', 'is', null);

      const receivedPayments =
        (paidOrders?.reduce((sum, o) => sum + Number(o.total_price), 0) || 0) * 0.5;

      // Open claims
      const { data: openOrders } = await supabase
        .from('orders')
        .select('total_price')
        .in('status', ['confirmed', 'scheduled'])
        .is('payment_received_at', null);

      const openClaims = openOrders?.reduce((sum, o) => sum + Number(o.total_price), 0) || 0;

      setFinanceStats({
        todayRevenue,
        todayCount,
        expectedDeposits,
        receivedPayments,
        openClaims,
      });
    } catch (error) {
      console.error('Error fetching finance stats:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchFinanceStats();
  }, [statusFilter]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const updateData: Record<string, unknown> = { status: newStatus };
      
      // If delivered and no payment received, set payment_received_at
      if (newStatus === 'delivered') {
        const order = orders.find((o) => o.id === orderId);
        if (order) {
          // Check if payment was already received
          const { data } = await supabase
            .from('orders')
            .select('payment_received_at')
            .eq('id', orderId)
            .single();
          
          if (!data?.payment_received_at) {
            updateData.payment_received_at = new Date().toISOString();
          }
        }
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Status aktualisiert',
        description: `Bestellung wurde auf "${newStatus}" gesetzt`,
      });

      fetchOrders();
      fetchFinanceStats();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Fehler',
        description: 'Status konnte nicht aktualisiert werden',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedOrders.length === 0) return;

    if (!confirm(`Möchten Sie ${selectedOrders.length} Bestellung(en) wirklich löschen?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .in('id', selectedOrders);

      if (error) throw error;

      toast({
        title: 'Gelöscht',
        description: `${selectedOrders.length} Bestellung(en) wurden gelöscht`,
      });

      setSelectedOrders([]);
      fetchOrders();
      fetchFinanceStats();
    } catch (error) {
      console.error('Error deleting orders:', error);
      toast({
        title: 'Fehler',
        description: 'Bestellungen konnten nicht gelöscht werden',
        variant: 'destructive',
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o.id));
    }
  };

  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      scheduled: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };

    const statusLabels: Record<string, string> = {
      pending: 'Ausstehend',
      confirmed: 'Bestätigt',
      scheduled: 'Geplant',
      delivered: 'Geliefert',
      cancelled: 'Storniert',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || ''}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Bestellungen</h1>
          <p className="text-muted-foreground">Verwalten Sie alle Heizöl-Bestellungen</p>
        </div>

        {/* Finance Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heute</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(financeStats.todayRevenue)}</div>
              <p className="text-xs text-muted-foreground">{financeStats.todayCount} Bestellung(en)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Erwartete Anzahlungen</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(financeStats.expectedDeposits)}</div>
              <p className="text-xs text-muted-foreground">50% von bestätigten Bestellungen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eingegangene Zahlungen</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(financeStats.receivedPayments)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offene Forderungen</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(financeStats.openClaims)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Suche nach Bestellnummer, Name, E-Mail, Stadt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="pending">Ausstehend</SelectItem>
                  <SelectItem value="confirmed">Bestätigt</SelectItem>
                  <SelectItem value="scheduled">Geplant</SelectItem>
                  <SelectItem value="delivered">Geliefert</SelectItem>
                  <SelectItem value="cancelled">Storniert</SelectItem>
                </SelectContent>
              </Select>
              {selectedOrders.length > 0 && (
                <Button variant="destructive" onClick={handleDeleteSelected}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {selectedOrders.length} löschen
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Keine Bestellungen gefunden
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="p-4 text-left">
                        <Checkbox
                          checked={selectedOrders.length === orders.length}
                          onCheckedChange={toggleSelectAll}
                        />
                      </th>
                      <th className="p-4 text-left text-sm font-medium">Bestellnummer</th>
                      <th className="p-4 text-left text-sm font-medium">Kunde</th>
                      <th className="p-4 text-left text-sm font-medium">Ort</th>
                      <th className="p-4 text-left text-sm font-medium">Menge</th>
                      <th className="p-4 text-left text-sm font-medium">Betrag</th>
                      <th className="p-4 text-left text-sm font-medium">Status</th>
                      <th className="p-4 text-left text-sm font-medium">Datum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b hover:bg-muted/30 cursor-pointer"
                        onClick={() => window.location.href = `/admin/orders/${order.id}`}
                      >
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={() => toggleSelectOrder(order.id)}
                          />
                        </td>
                        <td className="p-4">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="font-medium text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {order.order_number}
                          </Link>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">
                              {order.customer_first_name} {order.customer_last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                          </div>
                        </td>
                        <td className="p-4">{order.city}</td>
                        <td className="p-4">{order.quantity.toLocaleString('de-DE')} L</td>
                        <td className="p-4 font-medium">{formatCurrency(order.total_price)}</td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusChange(order.id, value)}
                          >
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Ausstehend</SelectItem>
                              <SelectItem value="confirmed">Bestätigt</SelectItem>
                              <SelectItem value="scheduled">Geplant</SelectItem>
                              <SelectItem value="delivered">Geliefert</SelectItem>
                              <SelectItem value="cancelled">Storniert</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4 text-muted-foreground">{formatDate(order.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
