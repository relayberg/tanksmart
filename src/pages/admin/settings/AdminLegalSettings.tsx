import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LegalSettings {
  company_name: string;
  company_address: string;
  company_postal_code: string;
  company_city: string;
  company_phone: string;
  company_email: string;
  company_website: string;
  company_ceo: string;
  company_registry: string;
  company_registry_number: string;
  company_vat_id: string;
}

const defaultSettings: LegalSettings = {
  company_name: '',
  company_address: '',
  company_postal_code: '',
  company_city: '',
  company_phone: '',
  company_email: '',
  company_website: '',
  company_ceo: '',
  company_registry: '',
  company_registry_number: '',
  company_vat_id: '',
};

const settingKeys = Object.keys(defaultSettings) as (keyof LegalSettings)[];

export default function AdminLegalSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<LegalSettings>(defaultSettings);
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
        .in('key', settingKeys);

      if (error) throw error;

      const newSettings = { ...defaultSettings };
      data?.forEach((item) => {
        if (item.key in newSettings) {
          newSettings[item.key as keyof LegalSettings] = item.value;
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
        // Check if setting exists
        const { data: existing } = await supabase
          .from('app_settings')
          .select('id')
          .eq('key', key)
          .single();

        if (existing) {
          await supabase
            .from('app_settings')
            .update({ value })
            .eq('key', key);
        } else {
          await supabase
            .from('app_settings')
            .insert({ key, value });
        }
      }

      toast({ title: 'Einstellungen gespeichert' });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Fehler',
        description: 'Einstellungen konnten nicht gespeichert werden',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof LegalSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
          <h1 className="text-2xl font-bold">Rechtliche Einstellungen</h1>
          <p className="text-muted-foreground">
            Unternehmensdaten für Impressum, Datenschutz und AGB
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Unternehmensdaten</CardTitle>
            <CardDescription>
              Diese Daten werden im Impressum und anderen rechtlichen Seiten angezeigt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Firmenname</Label>
              <Input
                id="company_name"
                placeholder="TankSmart GmbH"
                value={settings.company_name}
                onChange={(e) => updateSetting('company_name', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_address">Straße & Hausnummer</Label>
                <Input
                  id="company_address"
                  placeholder="Musterstraße 123"
                  value={settings.company_address}
                  onChange={(e) => updateSetting('company_address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="company_postal_code">PLZ</Label>
                  <Input
                    id="company_postal_code"
                    placeholder="12345"
                    maxLength={5}
                    value={settings.company_postal_code}
                    onChange={(e) => updateSetting('company_postal_code', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_city">Stadt</Label>
                  <Input
                    id="company_city"
                    placeholder="Berlin"
                    value={settings.company_city}
                    onChange={(e) => updateSetting('company_city', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_phone">Telefon</Label>
                <Input
                  id="company_phone"
                  placeholder="+49 30 123456789"
                  value={settings.company_phone}
                  onChange={(e) => updateSetting('company_phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_email">E-Mail</Label>
                <Input
                  id="company_email"
                  type="email"
                  placeholder="info@tanksmart.de"
                  value={settings.company_email}
                  onChange={(e) => updateSetting('company_email', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_website">Website</Label>
              <Input
                id="company_website"
                placeholder="https://tanksmart.de"
                value={settings.company_website}
                onChange={(e) => updateSetting('company_website', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geschäftsführung & Registrierung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_ceo">Geschäftsführer</Label>
              <Input
                id="company_ceo"
                placeholder="Max Mustermann"
                value={settings.company_ceo}
                onChange={(e) => updateSetting('company_ceo', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_registry">Registergericht</Label>
                <Input
                  id="company_registry"
                  placeholder="Amtsgericht Berlin Charlottenburg"
                  value={settings.company_registry}
                  onChange={(e) => updateSetting('company_registry', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_registry_number">Registernummer</Label>
                <Input
                  id="company_registry_number"
                  placeholder="HRB 123456"
                  value={settings.company_registry_number}
                  onChange={(e) => updateSetting('company_registry_number', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_vat_id">USt-IdNr.</Label>
              <Input
                id="company_vat_id"
                placeholder="DE123456789"
                value={settings.company_vat_id}
                onChange={(e) => updateSetting('company_vat_id', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Speichern
        </Button>
      </div>
    </AdminLayout>
  );
}
