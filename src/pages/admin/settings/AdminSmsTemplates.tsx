import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, Eye, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SmsTemplate {
  id: string;
  template_key: string;
  name: string;
  content: string;
  description: string | null;
  is_active: boolean;
}

export default function AdminSmsTemplates() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<SmsTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SmsTemplate | null>(null);

  const [editName, setEditName] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editActive, setEditActive] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('sms_templates')
        .select('*')
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: 'Fehler',
        description: 'Vorlagen konnten nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (template: SmsTemplate) => {
    setSelectedTemplate(template);
    setEditName(template.name);
    setEditContent(template.content);
    setEditActive(template.is_active);
    setEditDialogOpen(true);
  };

  const handlePreview = (template: SmsTemplate) => {
    setSelectedTemplate(template);
    setPreviewDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('sms_templates')
        .update({
          name: editName,
          content: editContent,
          is_active: editActive,
        })
        .eq('id', selectedTemplate.id);

      if (error) throw error;

      toast({ title: 'Vorlage gespeichert' });
      setEditDialogOpen(false);
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: 'Fehler',
        description: 'Vorlage konnte nicht gespeichert werden',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getPreviewContent = (template: SmsTemplate) => {
    const replacements: Record<string, string> = {
      '{{order_number}}': 'TS-20250104-1234',
      '{{customer_name}}': 'Max Mustermann',
      '{{delivery_date}}': '12.01.2025',
      '{{time_slot}}': 'Vormittag',
      '{{total_price}}': '2.670,00',
      '{{deposit_amount}}': '1.335,00',
      '{{quantity}}': '3.000',
      '{{payment_due_date}}': '10.01.2025',
    };

    let content = template.content;
    for (const [key, value] of Object.entries(replacements)) {
      content = content.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    }
    return content;
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
          <h1 className="text-2xl font-bold">SMS-Vorlagen</h1>
          <p className="text-muted-foreground">Bearbeiten Sie die SMS-Templates für Kundenbenachrichtigungen</p>
        </div>

        {/* Placeholder Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Verfügbare Platzhalter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 text-sm">
              {[
                '{{order_number}}',
                '{{customer_name}}',
                '{{delivery_date}}',
                '{{time_slot}}',
                '{{total_price}}',
                '{{deposit_amount}}',
                '{{quantity}}',
              ].map((placeholder) => (
                <code key={placeholder} className="px-2 py-1 bg-muted rounded text-xs">
                  {placeholder}
                </code>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Empfohlen: Max. 160 Zeichen pro SMS
            </p>
          </CardContent>
        </Card>

        {/* Templates List */}
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        template.is_active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}
                    >
                      {template.is_active ? 'Aktiv' : 'Inaktiv'}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => handlePreview(template)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Vorschau
                    </Button>
                    <Button size="sm" onClick={() => handleEdit(template)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Bearbeiten
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
                  {template.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {template.content.length} Zeichen
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Vorlage bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeiten Sie die SMS-Vorlage für {selectedTemplate?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Inhalt ({editContent.length} Zeichen)</Label>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
                maxLength={320}
              />
              {editContent.length > 160 && (
                <p className="text-xs text-orange-600">
                  Mehr als 160 Zeichen = 2 SMS
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Label>Aktiv</Label>
              <Switch checked={editActive} onCheckedChange={setEditActive} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>SMS-Vorschau</DialogTitle>
            <DialogDescription>{selectedTemplate?.name}</DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-4 rounded-lg">
            <div className="bg-background p-3 rounded-lg shadow-sm">
              <p className="text-sm">
                {selectedTemplate && getPreviewContent(selectedTemplate)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setPreviewDialogOpen(false)}>Schließen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
