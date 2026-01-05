-- Update all email templates to use {{company_name}} placeholder instead of hardcoded company names
UPDATE email_templates 
SET html_content = REPLACE(html_content, 'S-Tank GmbH', '{{company_name}}'),
    updated_at = now()
WHERE html_content LIKE '%S-Tank GmbH%';

UPDATE email_templates 
SET html_content = REPLACE(html_content, 'Ihr TankSmart Team', 'Ihr {{company_name}} Team'),
    updated_at = now()
WHERE html_content LIKE '%Ihr TankSmart Team%';

UPDATE email_templates 
SET html_content = REPLACE(html_content, 'TankSmart gewählt', '{{company_name}} gewählt'),
    updated_at = now()
WHERE html_content LIKE '%TankSmart gewählt%';