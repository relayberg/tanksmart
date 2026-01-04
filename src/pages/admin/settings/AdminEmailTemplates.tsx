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

interface EmailTemplate {
  id: string;
  template_key: string;
  name: string;
  subject: string;
  html_content: string;
  description: string | null;
  is_active: boolean;
}

export default function AdminEmailTemplates() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  const [editName, setEditName] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editActive, setEditActive] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
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

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditName(template.name);
    setEditSubject(template.subject);
    setEditContent(template.html_content);
    setEditActive(template.is_active);
    setEditDialogOpen(true);
  };

  const handlePreview = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setPreviewDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('email_templates')
        .update({
          name: editName,
          subject: editSubject,
          html_content: editContent,
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

  const getPreviewHtml = (template: EmailTemplate) => {
    // Replace placeholders with example data
    const replacements: Record<string, string> = {
      '{{order_number}}': 'TS-20250104-1234',
      '{{order_date}}': '04.01.2025',
      '{{customer_name}}': 'Herr Max Mustermann',
      '{{customer_first_name}}': 'Max',
      '{{customer_last_name}}': 'Mustermann',
      '{{customer_email}}': 'max@example.de',
      '{{customer_phone}}': '+49 152 12345678',
      '{{oil_type}}': 'Heizöl EL Premium',
      '{{product}}': 'Heizöl EL Premium',
      '{{quantity}}': '3.000',
      '{{price_per_liter}}': '0,89',
      '{{total_price}}': '2.670,00',
      '{{deposit_amount}}': '1.335,00',
      '{{remaining_amount}}': '1.335,00',
      '{{payment_due_date}}': '10.01.2025',
      '{{address}}': 'Musterstraße 123, 12345 Berlin',
      '{{street}}': 'Musterstraße',
      '{{house_number}}': '123',
      '{{postal_code}}': '12345',
      '{{city}}': 'Berlin',
      '{{delivery_date}}': '12.01.2025',
      '{{time_slot}}': 'Vormittag (8-12 Uhr)',
      '{{provider_name}}': 'Hoyer',
      '{{bank_recipient}}': 'TankSmart GmbH',
      '{{bank_iban}}': 'DE00 0000 0000 0000 0000 00',
      '{{bank_bic}}': 'COBADEFFXXX',
    };

    let html = template.html_content;
    for (const [key, value] of Object.entries(replacements)) {
      html = html.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    }
    return html;
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
          <h1 className="text-2xl font-bold">E-Mail-Vorlagen</h1>
          <p className="text-muted-foreground">Bearbeiten Sie die E-Mail-Templates für Kundenbenachrichtigungen</p>
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
                '{{quantity}}',
                '{{total_price}}',
                '{{delivery_date}}',
                '{{deposit_amount}}',
                '{{remaining_amount}}',
                '{{payment_due_date}}',
                '{{bank_iban}}',
                '{{bank_bic}}',
                '{{bank_recipient}}',
              ].map((placeholder) => (
                <code key={placeholder} className="px-2 py-1 bg-muted rounded text-xs">
                  {placeholder}
                </code>
              ))}
            </div>
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
                <div className="text-sm text-muted-foreground">
                  <strong>Betreff:</strong> {template.subject}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vorlage bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeiten Sie die E-Mail-Vorlage für {selectedTemplate?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Betreff</Label>
              <Input value={editSubject} onChange={(e) => setEditSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>HTML-Inhalt</Label>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
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
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>E-Mail-Vorschau</DialogTitle>
            <DialogDescription>{selectedTemplate?.name}</DialogDescription>
          </DialogHeader>
          <div className="border rounded-lg p-4 bg-white overflow-auto max-h-[60vh]">
            {selectedTemplate && (
              <div dangerouslySetInnerHTML={{ __html: getPreviewHtml(selectedTemplate) }} />
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setPreviewDialogOpen(false)}>Schließen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
