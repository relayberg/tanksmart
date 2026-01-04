import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BankSettings {
  bank_recipient: string;
  bank_iban: string;
  bank_bic: string;
}

export default function AdminBankSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<BankSettings>({
    bank_recipient: '',
    bank_iban: '',
    bank_bic: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('key, value')
        .in('key', ['bank_recipient', 'bank_iban', 'bank_bic']);

      if (error) throw error;

      const newSettings: BankSettings = {
        bank_recipient: '',
        bank_iban: '',
        bank_bic: '',
      };

      data?.forEach((item) => {
        if (item.key in newSettings) {
          newSettings[item.key as keyof BankSettings] = item.value;
        }
      });

      setSettings(newSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from('app_settings')
          .update({ value })
          .eq('key', key);

        if (error) throw error;
      }

      toast({ title: 'Bankdaten gespeichert' });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Fehler',
        description: 'Bankdaten konnten nicht gespeichert werden',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatIban = (iban: string) => {
    // Remove all spaces and format in groups of 4
    const cleaned = iban.replace(/\s/g, '').toUpperCase();
    return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
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

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Bankdaten</h1>
          <p className="text-muted-foreground">
            Konfigurieren Sie die Bankverbindung für Zahlungsanweisungen
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bankverbindung</CardTitle>
            <CardDescription>
              Diese Daten werden in den Zahlungsanweisungen an Kunden verwendet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Empfängername</Label>
              <Input
                id="recipient"
                placeholder="TankSmart GmbH"
                value={settings.bank_recipient}
                onChange={(e) => setSettings({ ...settings, bank_recipient: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                placeholder="DE00 0000 0000 0000 0000 00"
                value={settings.bank_iban}
                onChange={(e) => setSettings({ ...settings, bank_iban: formatIban(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bic">BIC</Label>
              <Input
                id="bic"
                placeholder="COBADEFFXXX"
                value={settings.bank_bic}
                onChange={(e) => setSettings({ ...settings, bank_bic: e.target.value.toUpperCase() })}
                className="max-w-[200px]"
              />
            </div>

            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Speichern
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vorschau</CardTitle>
            <CardDescription>So erscheinen die Bankdaten in E-Mails</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Empfänger:</span>
                <span className="font-medium">{settings.bank_recipient || '-'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">IBAN:</span>
                <span className="font-medium font-mono">{settings.bank_iban || '-'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">BIC:</span>
                <span className="font-medium font-mono">{settings.bank_bic || '-'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
