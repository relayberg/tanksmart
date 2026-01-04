import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PROVIDERS } from '@/context/OrderContext';

export default function AdminPriceSettings() {
  const { toast } = useToast();
  const [marketPrice, setMarketPrice] = useState('0.85');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'market_price')
        .single();

      if (error) throw error;
      if (data) {
        setMarketPrice(data.value);
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
      const { error } = await supabase
        .from('app_settings')
        .update({ value: marketPrice })
        .eq('key', 'market_price');

      if (error) throw error;

      toast({ title: 'Preis gespeichert' });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Fehler',
        description: 'Preis konnte nicht gespeichert werden',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const calculateProviderPrice = (multiplier: number) => {
    const basePrice = parseFloat(marketPrice) || 0;
    return (basePrice * multiplier).toFixed(4);
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
          <h1 className="text-2xl font-bold">Preiseinstellungen</h1>
          <p className="text-muted-foreground">Konfigurieren Sie den Basis-Marktpreis für Heizöl</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Marktpreis</CardTitle>
            <CardDescription>
              Der Basis-Marktpreis wird für alle Anbieter-Berechnungen verwendet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="marketPrice">Marktpreis pro Liter (€)</Label>
              <Input
                id="marketPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.85"
                value={marketPrice}
                onChange={(e) => setMarketPrice(e.target.value)}
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
            <CardTitle>Anbieter-Preisvorschau</CardTitle>
            <CardDescription>
              Berechnete Preise basierend auf dem aktuellen Marktpreis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {PROVIDERS.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{provider.name}</p>
                    <p className="text-sm text-muted-foreground">{provider.fullName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{calculateProviderPrice(provider.priceMultiplier)} €/L</p>
                    <p className="text-sm text-muted-foreground">
                      {provider.priceMultiplier === 1
                        ? 'Basispreis'
                        : `+${((provider.priceMultiplier - 1) * 100).toFixed(0)}%`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rabatte</CardTitle>
            <CardDescription>Automatische Mengenrabatte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span>Ab 3.000 Liter</span>
                <span className="font-medium text-green-600">-0,01 €/L</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Ab 5.000 Liter</span>
                <span className="font-medium text-green-600">-0,02 €/L</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
