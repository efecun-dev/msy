const fs = require('fs');
let content = fs.readFileSync('src/components/ContactSection.tsx', 'utf-8');

const target1 = "export default function ContactSection({ phone = '+90 500 123 45 67', email = 'info@msyelektronik.com', address = 'Örnek Mah. Elektronik Cad. No:1, İstanbul' }: { phone?: string; email?: string; address?: string }) {";
const replace1 = "export default function ContactSection({ phone = '+90 500 123 45 67', email = 'info@msyelektronik.com', address = 'Örnek Mah. Elektronik Cad. No:1, İstanbul', workingHours = 'Pzt - Cmt: 09:00 - 18:00' }: { phone?: string; email?: string; address?: string; workingHours?: string }) {";
content = content.replace(target1, replace1);

const target2 = 'value: "Pzt - Cmt: 09:00 - 18:00"';
content = content.replace(target2, 'value: workingHours');
// Handle prettier split string or alternative encoding
content = content.replace(/value: ['"]Pzt.*18:00['"]/, 'value: workingHours');

fs.writeFileSync('src/components/ContactSection.tsx', content, 'utf-8');
