import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SmtpSettings {
  id?: string;
  host: string;
  port: number;
  username: string;
  password_encrypted: string;
  from_email: string;
  from_name: string;
  encryption: string;
  is_active: boolean;
}

export default function AdminEmailSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [autoConfirmation, setAutoConfirmation] = useState(false);

  const [settings, setSettings] = useState<SmtpSettings>({
    host: '',
    port: 587,
    username: '',
    password_encrypted: '',
    from_email: '',
    from_name: 'TankSmart',
    encryption: 'tls',
    is_active: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Fetch SMTP settings
      const { data: smtpData } = await supabase
        .from('smtp_settings')
        .select('*')
        .limit(1)
        .single();

      if (smtpData) {
        setSettings(smtpData);
      }

      // Fetch auto confirmation setting
      const { data: autoData } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'auto_order_confirmation')
        .single();

      if (autoData) {
        setAutoConfirmation(autoData.value === 'true');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (settings.id) {
        // Update existing
        const { error } = await supabase
          .from('smtp_settings')
          .update({
            host: settings.host,
            port: settings.port,
            username: settings.username,
            password_encrypted: settings.password_encrypted,
            from_email: settings.from_email,
            from_name: settings.from_name,
            encryption: settings.encryption,
            is_active: settings.is_active,
          })
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('smtp_settings')
          .insert({
            host: settings.host,
            port: settings.port,
            username: settings.username,
            password_encrypted: settings.password_encrypted,
            from_email: settings.from_email,
            from_name: settings.from_name,
            encryption: settings.encryption,
            is_active: settings.is_active,
          })
          .select()
          .single();

        if (error) throw error;
        setSettings(data);
      }

      // Save auto confirmation setting
      await supabase
        .from('app_settings')
        .update({ value: autoConfirmation ? 'true' : 'false' })
        .eq('key', 'auto_order_confirmation');

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

  const handleTestEmail = async () => {
    setIsTesting(true);
    try {
      // Create a test order communication entry
      toast({
        title: 'Test-E-Mail',
        description: 'Die Test-Funktion erfordert eine gültige Bestellung. Bitte senden Sie eine E-Mail über die Bestelldetails.',
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: 'Fehler',
        description: 'Test-E-Mail konnte nicht gesendet werden',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
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
          <h1 className="text-2xl font-bold">E-Mail-Einstellungen</h1>
          <p className="text-muted-foreground">Konfigurieren Sie den SMTP-Server für E-Mail-Versand</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>SMTP-Konfiguration</CardTitle>
            <CardDescription>
              Geben Sie die Zugangsdaten für Ihren SMTP-Server ein
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host">SMTP-Server</Label>
                <Input
                  id="host"
                  placeholder="smtp.gmail.com"
                  value={settings.host}
                  onChange={(e) => setSettings({ ...settings, host: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  type="number"
                  placeholder="587"
                  value={settings.port}
                  onChange={(e) => setSettings({ ...settings, port: parseInt(e.target.value) || 587 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Benutzername</Label>
                <Input
                  id="username"
                  placeholder="user@example.com"
                  value={settings.username}
                  onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={settings.password_encrypted}
                  onChange={(e) => setSettings({ ...settings, password_encrypted: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="encryption">Verschlüsselung</Label>
              <Select
                value={settings.encryption}
                onValueChange={(value) => setSettings({ ...settings, encryption: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tls">TLS (Port 587)</SelectItem>
                  <SelectItem value="ssl">SSL (Port 465)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from_name">Absender-Name</Label>
                <Input
                  id="from_name"
                  placeholder="TankSmart"
                  value={settings.from_name}
                  onChange={(e) => setSettings({ ...settings, from_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from_email">Absender-E-Mail</Label>
                <Input
                  id="from_email"
                  placeholder="noreply@tanksmart.de"
                  value={settings.from_email}
                  onChange={(e) => setSettings({ ...settings, from_email: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <Label>E-Mail-Versand aktiviert</Label>
                <p className="text-sm text-muted-foreground">
                  Schalten Sie den E-Mail-Versand ein oder aus
                </p>
              </div>
              <Switch
                checked={settings.is_active}
                onCheckedChange={(checked) => setSettings({ ...settings, is_active: checked })}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <Label>Automatische Bestellbestätigung</Label>
                <p className="text-sm text-muted-foreground">
                  Sendet automatisch eine Bestätigung nach jeder Bestellung
                </p>
              </div>
              <Switch
                checked={autoConfirmation}
                onCheckedChange={setAutoConfirmation}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Speichern
          </Button>
          <Button variant="outline" onClick={handleTestEmail} disabled={isTesting}>
            {isTesting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Test-E-Mail senden
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
