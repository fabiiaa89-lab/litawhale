const fs = require('fs');
let content = fs.readFileSync('src/components/screens/Settings.tsx', 'utf8');

// Replace hardcoded words with translations
content = content.replace("Header title=\"CONFIGURACIÓN\"", "Header title={t.title}");
content = content.replace("title=\"SISTEMA\"", "title={t.system}");
content = content.replace("Idioma / Language:", "{t.lang}");
content = content.replace("Modo Sensorial:", "{t.sensoryMode}");

content = content.replace("Optimizado para baja estimulación", "{t.hiper}");
content = content.replace("Balance sensorial estándar", "{t.med}");
content = content.replace("Optimizado para alta respuesta sensorial", "{t.hipo}");

content = content.replace("title=\"IDENTIDAD MAESTRA\"", "title={t.identity}");
content = content.replace("label=\"TU NOMBRE\"", "label={t.name}");
content = content.replace("label=\"URL FOTO DE PERFIL\"", "label={t.userImg}");
content = content.replace("label=\"DIRECCIÓN SEGURA\"", "label={t.address}");

content = content.replace("title=\"PERFIL MÉDICO SOS\"", "title={t.medicalSos}");
content = content.replace("label=\"TIPO DE SANGRE\"", "label={t.bloodType}");
content = content.replace("label=\"ALERGIAS\"", "label={t.allergies}");

content = content.replace("title=\"PERFIL SENSORIAL\"", "title={t.sensoryProfile}");
content = content.replace("label=\"HIPERSENSIBILIDADES\"", "label={t.hyper}");
content = content.replace("label=\"HIPOSENSIBILIDADES\"", "label={t.hypo}");
content = content.replace("label=\"DISPARADORES (TRIGGERS)\"", "label={t.triggers}");
content = content.replace("label=\"INTERESES / CALMANTES\"", "label={t.interests}");
content = content.replace("label=\"OBJETO / SER DE APOYO\"", "label={t.supportEntity}");

content = content.replace("title=\"PERSONA DE APOYO\"", "title={t.support}");
content = content.replace("label=\"NOMBRE DEL CONTACTO\"", "label={t.contactName}");
content = content.replace("label=\"TELÉFONO\"", "label={t.phone}");
content = content.replace("label=\"URL FOTO CONTACTO\"", "label={t.contactImg}");

content = content.replace("title=\"FARMACOLOGÍA\"", "title={t.pharmacology}");
content = content.replace("label=\"MEDICAMENTO CRISIS (S.O.S)\"", "label={t.sosMed}");
content = content.replace("label=\"MEDICAMENTO DIARIO\"", "label={t.dailyMed}");
content = content.replace("title=\"REGULACIÓN\"", "title={t.regulation}");
content = content.replace("label=\"COMIDA SEGURA\"", "label={t.safeFood}");

content = content.replace("GUARDAR Y FINALIZAR", "{t.save}");

// Add imports
if (!content.includes("translations")) {
    content = content.replace("import { User,", "import { translations } from '../../i18n';\nimport { User,");
}

// Add t object
if (!content.includes("const t =")) {
    content = content.replace("const updateContact", "const t = translations[profile.language].settings;\n\n  const updateContact");
}

fs.writeFileSync('src/components/screens/Settings.tsx', content);
