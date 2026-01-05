import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import {
  ArrowLeft,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Pencil,
  Check,
  X,
  CalendarIcon,
  Send,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  order_number: string;
  status: string;
  oil_type: string;
  quantity: number;
  additive: string;
  price_per_liter: number;
  total_price: number;
  provider_name: string;
  provider_id: string;
  delivery_date: string | null;
  time_slot: string | null;
  customer_salutation: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string | null;
  street: string;
  house_number: string;
  postal_code: string;
  city: string;
  delivery_notes: string | null;
  hose_length: string;
  truck_accessible: boolean;
  payment_received_at: string | null;
  hlr_status: Record<string, unknown> | null;
  cnam_status: Record<string, unknown> | null;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface Communication {
  id: string;
  type: string;
  template_key: string | null;
  recipient: string;
  subject: string | null;
  content: string;
  status: string;
  sent_at: string;
  metadata: Record<string, unknown> | null;
}

interface EmailTemplate {
  id: string;
  template_key: string;
  name: string;
}

interface SmsTemplate {
  id: string;
  template_key: string;
  name: string;
}

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Phone editing
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editedPhone, setEditedPhone] = useState('');

  // Email dialog
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState('');
  const [deliveryDateOverride, setDeliveryDateOverride] = useState<Date | undefined>();
  const [paymentDueDateOverride, setPaymentDueDateOverride] = useState<Date | undefined>();
  const [paymentDueDateManuallySet, setPaymentDueDateManuallySet] = useState(false);

  // SMS dialog
  const [smsDialogOpen, setSmsDialogOpen] = useState(false);
  const [selectedSmsTemplate, setSelectedSmsTemplate] = useState('');
  const [refreshingSmsId, setRefreshingSmsId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchOrder();
      fetchCommunications();
      fetchTemplates();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setOrder(data as Order);
      setEditedPhone(data.customer_phone || '');
      if (data.delivery_date) {
        setDeliveryDateOverride(new Date(data.delivery_date));
        // Set payment due date to 2 days before delivery
        const dueDate = new Date(data.delivery_date);
        dueDate.setDate(dueDate.getDate() - 2);
        setPaymentDueDateOverride(dueDate);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast({
        title: 'Fehler',
        description: 'Bestellung konnte nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommunications = async () => {
    try {
      const { data, error } = await supabase
        .from('order_communications')
        .select('*')
        .eq('order_id', id)
        .order('sent_at', { ascending: false });

      if (error) throw error;
      setCommunications((data || []) as Communication[]);
    } catch (error) {
      console.error('Error fetching communications:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const [emailRes, smsRes] = await Promise.all([
        supabase.from('email_templates').select('id, template_key, name').eq('is_active', true),
        supabase.from('sms_templates').select('id, template_key, name').eq('is_active', true),
      ]);

      setEmailTemplates(emailRes.data || []);
      setSmsTemplates(smsRes.data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;

    try {
      const updateData: Record<string, unknown> = { status: newStatus };
      
      if (newStatus === 'delivered' && !order.payment_received_at) {
        updateData.payment_received_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', order.id);

      if (error) throw error;

      toast({ title: 'Status aktualisiert' });
      fetchOrder();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Fehler',
        description: 'Status konnte nicht aktualisiert werden',
        variant: 'destructive',
      });
    }
  };

  const handlePhoneSave = async () => {
    if (!order) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ customer_phone: editedPhone })
        .eq('id', order.id);

      if (error) throw error;

      toast({ title: 'Telefonnummer aktualisiert' });
      setIsEditingPhone(false);
      fetchOrder();
    } catch (error) {
      console.error('Error updating phone:', error);
      toast({
        title: 'Fehler',
        description: 'Telefonnummer konnte nicht aktualisiert werden',
        variant: 'destructive',
      });
    }
  };

  const handleSendEmail = async () => {
    if (!order || !selectedEmailTemplate) return;

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          orderId: order.id,
          templateKey: selectedEmailTemplate,
          deliveryDateOverride: deliveryDateOverride?.toISOString().split('T')[0],
          paymentDueDateOverride: paymentDueDateOverride?.toISOString().split('T')[0],
        },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      toast({ title: 'E-Mail gesendet' });
      setEmailDialogOpen(false);
      fetchCommunications();
    } catch (error: unknown) {
      console.error('Error sending email:', error);
      const errorMessage = error instanceof Error ? error.message : 'E-Mail konnte nicht gesendet werden';
      toast({
        title: 'Fehler',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendSms = async () => {
    if (!order || !selectedSmsTemplate) return;

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('seven-api', {
        body: {
          action: 'sms',
          orderId: order.id,
          templateKey: selectedSmsTemplate,
        },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      toast({ title: 'SMS gesendet' });
      setSmsDialogOpen(false);
      fetchCommunications();
    } catch (error: unknown) {
      console.error('Error sending SMS:', error);
      const errorMessage = error instanceof Error ? error.message : 'SMS konnte nicht gesendet werden';
      toast({
        title: 'Fehler',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleHlrCheck = async () => {
    if (!order?.customer_phone) return;

    try {
      const { data, error } = await supabase.functions.invoke('seven-api', {
        body: {
          action: 'hlr',
          orderId: order.id,
          phone: order.customer_phone,
        },
      });

      if (error) throw error;

      toast({ title: 'HLR-Check durchgeführt' });
      fetchOrder();
    } catch (error) {
      console.error('Error performing HLR check:', error);
      toast({
        title: 'Fehler',
        description: 'HLR-Check fehlgeschlagen',
        variant: 'destructive',
      });
    }
  };

  const handleCnamCheck = async () => {
    if (!order?.customer_phone) return;

    try {
      const { data, error } = await supabase.functions.invoke('seven-api', {
        body: {
          action: 'cnam',
          orderId: order.id,
          phone: order.customer_phone,
        },
      });

      if (error) throw error;

      toast({ title: 'CNAM-Check durchgeführt' });
      fetchOrder();
    } catch (error) {
      console.error('Error performing CNAM check:', error);
      toast({
        title: 'Fehler',
        description: 'CNAM-Check fehlgeschlagen',
        variant: 'destructive',
      });
    }
  };

  const handleRefreshSmsStatus = async (comm: Communication) => {
    const metadata = comm.metadata as { seven_message_id?: string } | null;
    const messageId = metadata?.seven_message_id;
    
    if (!messageId) {
      toast({
        title: 'Fehler',
        description: 'Keine Message-ID vorhanden',
        variant: 'destructive',
      });
      return;
    }

    setRefreshingSmsId(comm.id);

    try {
      const { data, error } = await supabase.functions.invoke('seven-api', {
        body: {
          action: 'sms_status',
          orderId: order?.id,
          messageId: messageId,
        },
      });

      if (error) throw error;

      toast({ title: 'SMS-Status aktualisiert', description: `Status: ${data.status}` });
      fetchCommunications();
    } catch (error) {
      console.error('Error refreshing SMS status:', error);
      toast({
        title: 'Fehler',
        description: 'Status konnte nicht aktualisiert werden',
        variant: 'destructive',
      });
    } finally {
      setRefreshingSmsId(null);
    }
  };

  const getSmsStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3" />
            Zugestellt
          </span>
        );
      case 'transmitted':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            <Clock className="h-3 w-3" />
            Übertragen
          </span>
        );
      case 'notdelivered':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
            <AlertCircle className="h-3 w-3" />
            Nicht zugestellt
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            <Clock className="h-3 w-3" />
            {status || 'Gesendet'}
          </span>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOilTypeName = (type: string) => {
    const types: Record<string, string> = {
      standard: 'Heizöl EL Standard',
      premium: 'Heizöl EL Premium',
      bio: 'Bio-Heizöl',
    };
    return types[type] || type;
  };

  const getTimeSlotName = (slot: string | null) => {
    const slots: Record<string, string> = {
      morning: 'Vormittag (8-12 Uhr)',
      afternoon: 'Nachmittag (12-17 Uhr)',
      flexible: 'Flexibel',
    };
    return slots[slot || ''] || slot || '-';
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
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusStyles[status] || ''}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Bestellung nicht gefunden</p>
          <Button onClick={() => navigate('/admin/orders')} className="mt-4">
            Zurück zur Übersicht
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/orders')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{order.order_number}</h1>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-muted-foreground">Erstellt am {formatDateTime(order.created_at)}</p>
            </div>
          </div>
          <Select value={order.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
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
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="communication">Kommunikation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Order Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Bestelldaten</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Produkt</Label>
                      <p className="font-medium">{getOilTypeName(order.oil_type)}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Menge</Label>
                      <p className="font-medium">{order.quantity.toLocaleString('de-DE')} Liter</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Literpreis</Label>
                      <p className="font-medium">{formatCurrency(order.price_per_liter)}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Gesamtpreis</Label>
                      <p className="font-medium text-lg">{formatCurrency(order.total_price)}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Anbieter</Label>
                      <p className="font-medium">{order.provider_name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Additiv</Label>
                      <p className="font-medium">{order.additive || 'Keine'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Kundendaten</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-medium">
                      {order.customer_salutation} {order.customer_first_name} {order.customer_last_name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Adresse</Label>
                    <p className="font-medium">
                      {order.street} {order.house_number}
                      <br />
                      {order.postal_code} {order.city}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">E-Mail</Label>
                    <p className="font-medium">{order.customer_email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Telefon</Label>
                    <div className="flex items-center gap-2">
                      {isEditingPhone ? (
                        <>
                          <Input
                            value={editedPhone}
                            onChange={(e) => setEditedPhone(e.target.value)}
                            className="max-w-[200px]"
                          />
                          <Button size="icon" variant="ghost" onClick={handlePhoneSave}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setIsEditingPhone(false);
                              setEditedPhone(order.customer_phone || '');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="font-medium">{order.customer_phone || '-'}</p>
                          <Button size="icon" variant="ghost" onClick={() => setIsEditingPhone(true)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                    {/* Phone validation buttons */}
                    {order.customer_phone && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={handleHlrCheck}>
                          HLR-Check
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCnamCheck}>
                          CNAM-Check
                        </Button>
                      </div>
                    )}
                    {/* HLR Result */}
                    {order.hlr_status && (
                      <div className="mt-2 p-2 bg-muted rounded text-sm">
                        <span className="font-medium">HLR: </span>
                        <span className={(order.hlr_status as Record<string, unknown>).valid ? 'text-green-600' : 'text-red-600'}>
                          {(order.hlr_status as Record<string, unknown>).valid ? '✓ Gültig' : '✗ Ungültig'}
                        </span>
                        {(order.hlr_status as Record<string, unknown>).carrier && (
                          <span className="text-muted-foreground ml-2">
                            ({String((order.hlr_status as Record<string, unknown>).carrier)})
                          </span>
                        )}
                      </div>
                    )}
                    {/* CNAM Result */}
                    {order.cnam_status && (
                      <div className="mt-1 p-2 bg-muted rounded text-sm">
                        <span className="font-medium">CNAM: </span>
                        <span>{String((order.cnam_status as Record<string, unknown>).name || 'Nicht verfügbar')}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Lieferdaten</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Liefertermin</Label>
                      <p className="font-medium">{formatDate(order.delivery_date)}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Zeitfenster</Label>
                      <p className="font-medium">{getTimeSlotName(order.time_slot)}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Schlauchlänge</Label>
                      <p className="font-medium">
                        {order.hose_length === 'standard' ? 'Standard (40m)' : 'Überlänge (80m)'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">LKW-Zufahrt</Label>
                      <p className="font-medium">{order.truck_accessible ? 'Ja' : 'Nein'}</p>
                    </div>
                  </div>
                  {order.delivery_notes && (
                    <div>
                      <Label className="text-muted-foreground">Lieferhinweise</Label>
                      <p className="font-medium">{order.delivery_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Zahlung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Anzahlung (50%)</Label>
                      <p className="font-medium">{formatCurrency(order.total_price * 0.5)}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Restbetrag (50%)</Label>
                      <p className="font-medium">{formatCurrency(order.total_price * 0.5)}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Zahlungseingang</Label>
                    <p className="font-medium">
                      {order.payment_received_at
                        ? formatDateTime(order.payment_received_at)
                        : 'Noch nicht erhalten'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6 mt-6">
            <div className="flex gap-4">
              <Button onClick={() => setEmailDialogOpen(true)}>
                <Mail className="mr-2 h-4 w-4" />
                E-Mail senden
              </Button>
              <Button variant="outline" onClick={() => setSmsDialogOpen(true)}>
                <MessageSquare className="mr-2 h-4 w-4" />
                SMS senden
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Kommunikationsverlauf</CardTitle>
                <CardDescription>Alle gesendeten E-Mails und SMS</CardDescription>
              </CardHeader>
              <CardContent>
                {communications.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Noch keine Kommunikation vorhanden
                  </p>
                ) : (
                  <div className="space-y-4">
                    {communications.map((comm) => (
                      <div key={comm.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {comm.type === 'email' ? (
                              <Mail className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="font-medium">
                              {comm.type === 'email' ? 'E-Mail' : 'SMS'}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              an {comm.recipient}
                            </span>
                            {comm.type === 'sms' && getSmsStatusBadge(comm.status)}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {formatDateTime(comm.sent_at)}
                            </span>
                            {comm.type === 'sms' && (comm.metadata as { seven_message_id?: string } | null)?.seven_message_id && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleRefreshSmsStatus(comm)}
                                disabled={refreshingSmsId === comm.id}
                              >
                                <RefreshCw className={`h-3 w-3 ${refreshingSmsId === comm.id ? 'animate-spin' : ''}`} />
                              </Button>
                            )}
                          </div>
                        </div>
                        {comm.subject && (
                          <p className="text-sm font-medium mb-1">Betreff: {comm.subject}</p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {comm.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>E-Mail senden</DialogTitle>
            <DialogDescription>Wählen Sie eine Vorlage und passen Sie die Details an</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Vorlage</Label>
              <Select value={selectedEmailTemplate} onValueChange={setSelectedEmailTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Vorlage auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {emailTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.template_key}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEmailTemplate === 'appointment_payment' && (
              <>
                <div className="space-y-2">
                  <Label>Liefertermin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !deliveryDateOverride && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deliveryDateOverride
                          ? format(deliveryDateOverride, 'PPP', { locale: de })
                          : 'Datum wählen'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deliveryDateOverride}
                        onSelect={(date) => {
                          setDeliveryDateOverride(date);
                          if (date && !paymentDueDateManuallySet) {
                            const dueDate = new Date(date);
                            dueDate.setDate(dueDate.getDate() - 2);
                            setPaymentDueDateOverride(dueDate);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Zahlungsziel</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !paymentDueDateOverride && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {paymentDueDateOverride
                          ? format(paymentDueDateOverride, 'PPP', { locale: de })
                          : 'Datum wählen'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={paymentDueDateOverride}
                        onSelect={(date) => {
                          setPaymentDueDateOverride(date);
                          setPaymentDueDateManuallySet(true);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSendEmail} disabled={!selectedEmailTemplate || isSending}>
              {isSending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Senden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SMS Dialog */}
      <Dialog open={smsDialogOpen} onOpenChange={setSmsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>SMS senden</DialogTitle>
            <DialogDescription>Wählen Sie eine SMS-Vorlage</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Vorlage</Label>
              <Select value={selectedSmsTemplate} onValueChange={setSelectedSmsTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Vorlage auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {smsTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.template_key}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Empfänger: {order.customer_phone || 'Keine Nummer'}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSmsDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={handleSendSms}
              disabled={!selectedSmsTemplate || !order.customer_phone || isSending}
            >
              {isSending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Senden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
