const fs = require('fs');

let i18n = fs.readFileSync('src/i18n.ts', 'utf8');

// ES
i18n = i18n.replace(/title: 'DEUDAS DE ENERGÍA',/, "title: 'DEUDAS DE ENERGÍA',\n        header: 'REGISTRO DE COMPROMISOS',\n        quote: 'Las deudas son dinero traído del futuro. Es un recurso que ya estás usando y que devolverás cuando el tiempo alcance a la cantidad. No es una falla, es un proceso técnico en curso.',\n        history: 'Historial Técnico',\n        who: 'A QUIÉN SE LE DEBE',\n        whoPlaceholder: 'Nombre o entidad',\n        amount: 'MONTO',\n        amountPlaceholder: 'Cantidad',\n        date: 'FECHA LÍMITE',\n        register: 'REGISTRAR COMPROMISO',\n        noDebts: 'No hay compromisos pendientes.',");

// EN
i18n = i18n.replace(/title: 'ENERGY DEBTS',/, "title: 'ENERGY DEBTS',\n        header: 'COMMITMENTS LOG',\n        quote: 'Debts are money brought from the future. It is a resource you are already using and will return when time catches up to the amount. It is not a failure, it is an ongoing technical process.',\n        history: 'Technical History',\n        who: 'WHO IS OWED',\n        whoPlaceholder: 'Name or entity',\n        amount: 'AMOUNT',\n        amountPlaceholder: 'Quantity',\n        date: 'DUE DATE',\n        register: 'REGISTER COMMITMENT',\n        noDebts: 'No pending commitments.',");

fs.writeFileSync('src/i18n.ts', i18n);

let debts = fs.readFileSync('src/components/screens/Debts.tsx', 'utf8');

debts = debts.replace(/title="REGISTRO DE COMPROMISOS"/, 'title={t.header}');
debts = debts.replace(/"Las deudas son dinero traído del futuro. Es un recurso que ya estás usando y que devolverás cuando el tiempo alcance a la cantidad. No es una falla, es un proceso técnico en curso."/, '{t.quote}');
debts = debts.replace(/>Historial Técnico</, '>{t.history}<');
debts = debts.replace(/label="A QUIÉN SE LE DEBE"/, 'label={t.who}');
debts = debts.replace(/placeholder="Nombre o entidad"/, 'placeholder={t.whoPlaceholder}');
debts = debts.replace(/label="MONTO"/, 'label={t.amount}');
debts = debts.replace(/placeholder="Cantidad"/, 'placeholder={t.amountPlaceholder}');
debts = debts.replace(/label="FECHA LÍMITE"/, 'label={t.date}');
debts = debts.replace(/>\s*REGISTRAR COMPROMISO\s*<\/button>/, '>{t.register}</button>');
debts = debts.replace(/<p className="text-sm">No hay compromisos pendientes\.<\/p>/, '<p className="text-sm">{t.noDebts}</p>');

fs.writeFileSync('src/components/screens/Debts.tsx', debts);
console.log("Debts translations fixed");
