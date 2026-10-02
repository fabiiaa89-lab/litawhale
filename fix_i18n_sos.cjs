const fs = require('fs');

let i18n = fs.readFileSync('src/i18n.ts', 'utf8');

// Replace the previous injected sos: {...} blocks with better ones

i18n = i18n.replace(/sos: \{[\s\S]*?close: 'Volver',\s*\},/, `sos: {
        title: 'SOS: INFORMACIÓN MÉDICA',
        alert: 'SOY AUTISTA.\\nNO ME TOQUE.\\nNO ME GRITE.',
        bloodType: 'TIPO DE SANGRE',
        allergies: 'ALERGIAS',
        sensitivity: 'SENSIBILIDAD',
        none: 'NINGUNA',
        avoid: 'Evite: ',
        defaultAvoid: 'Estímulos fuertes',
        urgent: 'Contacto Urgente',
        noContact: 'SIN CONTACTO',
        exit: 'SALIR DEL MODO SOS',
    },`);
    
i18n = i18n.replace(/sos: \{[\s\S]*?close: 'Go Back',\s*\},/, `sos: {
        title: 'SOS: MEDICAL INFO',
        alert: 'I AM AUTISTIC.\\nDO NOT TOUCH.\\nDO NOT SHOUT.',
        bloodType: 'BLOOD TYPE',
        allergies: 'ALLERGIES',
        sensitivity: 'SENSITIVITY',
        none: 'NONE',
        avoid: 'Avoid: ',
        defaultAvoid: 'Strong stimuli',
        urgent: 'Urgent Contact',
        noContact: 'NO CONTACT',
        exit: 'EXIT SOS MODE',
    },`);

fs.writeFileSync('src/i18n.ts', i18n);
console.log('Fixed SOS in i18n.ts');
