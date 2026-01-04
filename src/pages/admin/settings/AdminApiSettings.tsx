import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiIntegration {
  id: string;
  provider: string;
  config: Record<string, string>;
  is_active: boolean;
}

export default function AdminApiSettings() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<ApiIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [sevenBalance, setSevenBalance] = useState<number | null>(null);

  // Seven API settings
  const [sevenApiKey, setSevenApiKey] = useState('');
  const [sevenSenderId, setSevenSenderId] = useState('TankSmart');
  const [sevenActive, setSevenActive] = useState(false);

  // Google Ads settings
  const [gadsConversionId, setGadsConversionId] = useState('');
  const [gadsConversionLabel, setGadsConversionLabel] = useState('');
  const [gadsActive, setGadsActive] = useState(false);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('api_integrations')
        .select('*');

      if (error) throw error;

      const integrationData = (data || []) as ApiIntegration[];
      setIntegrations(integrationData);

      // Parse Seven settings
      const seven = integrationData.find((i) => i.provider === 'seven');
      if (seven) {
        setSevenApiKey(seven.config.api_key || '');
        setSevenSenderId(seven.config.sender_id || 'TankSmart');
        setSevenActive(seven.is_active);
      }

      // Parse Google Ads settings
      const gads = integrationData.find((i) => i.provider === 'google_ads');
      if (gads) {
        setGadsConversionId(gads.config.conversion_id || '');
        setGadsConversionLabel(gads.config.conversion_label || '');
        setGadsActive(gads.is_active);
      }
    } catch (error) {
      console.error('Error fetching integrations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSeven = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('api_integrations')
        .update({
          config: { api_key: sevenApiKey, sender_id: sevenSenderId },
          is_active: sevenActive,
        })
        .eq('provider', 'seven');

      if (error) throw error;

      toast({ title: 'Seven API Einstellungen gespeichert' });
    } catch (error) {
      console.error('Error saving Seven settings:', error);
      toast({
        title: 'Fehler',
        description: 'Einstellungen konnten nicht gespeichert werden',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveGads = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('api_integrations')
        .update({
          config: { conversion_id: gadsConversionId, conversion_label: gadsConversionLabel },
          is_active: gadsActive,
        })
        .eq('provider', 'google_ads');

      if (error) throw error;

      toast({ title: 'Google Ads Einstellungen gespeichert' });
    } catch (error) {
      console.error('Error saving Google Ads settings:', error);
      toast({
        title: 'Fehler',
        description: 'Einstellungen konnten nicht gespeichert werden',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestSeven = async () => {
    setIsTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('seven-api', {
        body: { action: 'balance' },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setSevenBalance(data.balance);
      toast({
        title: 'Verbindung erfolgreich',
        description: `Kontostand: ${data.balance.toFixed(2)} €`,
      });
    } catch (error: unknown) {
      console.error('Error testing Seven API:', error);
      const errorMessage = error instanceof Error ? error.message : 'API-Test fehlgeschlagen';
      toast({
        title: 'Fehler',
        description: errorMessage,
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">API-Integrationen</h1>
          <p className="text-muted-foreground">Konfigurieren Sie externe API-Dienste</p>
        </div>

        <Tabs defaultValue="seven">
          <TabsList>
            <TabsTrigger value="seven">Seven API (SMS)</TabsTrigger>
            <TabsTrigger value="google_ads">Google Ads</TabsTrigger>
          </TabsList>

          <TabsContent value="seven" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Seven.io API</CardTitle>
                <CardDescription>
                  SMS-Versand und Telefon-Validierung über Seven.io
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sevenApiKey">API-Key</Label>
                  <Input
                    id="sevenApiKey"
                    type="password"
                    placeholder="Ihr Seven.io API-Key"
                    value={sevenApiKey}
                    onChange={(e) => setSevenApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Erhalten Sie Ihren API-Key unter{' '}
                    <a
                      href="https://app.seven.io/developer/api-key"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      seven.io
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sevenSenderId">Absender-ID</Label>
                  <Input
                    id="sevenSenderId"
                    placeholder="TankSmart"
                    value={sevenSenderId}
                    onChange={(e) => setSevenSenderId(e.target.value.slice(0, 11))}
                    maxLength={11}
                  />
                  <p className="text-xs text-muted-foreground">
                    Max. 11 Zeichen, alphanumerisch
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <Label>Seven API aktiviert</Label>
                    <p className="text-sm text-muted-foreground">
                      SMS-Versand und Telefon-Validierung einschalten
                    </p>
                  </div>
                  <Switch checked={sevenActive} onCheckedChange={setSevenActive} />
                </div>

                {sevenBalance !== null && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Kontostand:</strong> {sevenBalance.toFixed(2)} €
                    </p>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button onClick={handleSaveSeven} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Speichern
                  </Button>
                  <Button variant="outline" onClick={handleTestSeven} disabled={isTesting || !sevenApiKey}>
                    {isTesting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Verbindung testen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="google_ads" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Google Ads Conversion Tracking</CardTitle>
                <CardDescription>
                  Conversion-Tracking für Google Ads Kampagnen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gadsConversionId">Conversion-ID</Label>
                  <Input
                    id="gadsConversionId"
                    placeholder="AW-123456789"
                    value={gadsConversionId}
                    onChange={(e) => setGadsConversionId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gadsConversionLabel">Conversion-Label (optional)</Label>
                  <Input
                    id="gadsConversionLabel"
                    placeholder="abcDEF123"
                    value={gadsConversionLabel}
                    onChange={(e) => setGadsConversionLabel(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <Label>Google Ads Tracking aktiviert</Label>
                    <p className="text-sm text-muted-foreground">
                      Conversion-Events an Google Ads senden
                    </p>
                  </div>
                  <Switch checked={gadsActive} onCheckedChange={setGadsActive} />
                </div>

                <Button onClick={handleSaveGads} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Speichern
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
