class PDFGenerator {
    constructor() {
        this.initializeConstants();
    }
    
    initializeConstants() {
        this.PDF_CONFIG = {
            PAGE_SIZE: 'letter',
            MARGIN: '0.3in',
            SHEET_WIDTH: '7.5in',
            FONT_FAMILY: "'Times New Roman', Times, serif",
            BASE_FONT_SIZE: '11px'
        };
        
        this.LAYOUT = {
            MAX_EQUIPMENT_LINES: 18,
            MAX_TALENT_LINES: 5,
            MAX_WEAPON_LINES: 6,
            MAX_SPELL_LINES: 7,
            ATTRIBUTES_PER_GROUP: 4
        };
        
        this.LABELS = {
            TITLE: 'TUNNELS & TROLLS',
            SUBTITLE: 'CHARACTER SHEET',
            SECTIONS: {
                ATTRIBUTES: 'PRIME ATTRIBUTES:',
                EQUIPMENT: 'EQUIPMENT:',
                TALENTS: 'TALENTS:',
                WEAPONS: 'WEAPONS:',
                SPELLS: 'SPELLS/MAGIC ITEMS:',
                ADVENTURE_POINTS: 'ADVENTURE POINTS:',
                COMBAT_ADDS: 'PERSONAL / COMBAT ADDS:'
            },
            ATTRIBUTES: {
                STR: { short: 'STR', full: 'Strength', hasCombatAdd: true },
                CON: { short: 'CON', full: 'Constitution', hasCombatAdd: false },
                DEX: { short: 'DEX', full: 'Dexterity', hasCombatAdd: true },
                SPD: { short: 'SPD', full: 'Speed', hasCombatAdd: true },
                LK: { short: 'LK', full: 'Luck', hasCombatAdd: true },
                IQ: { short: 'IQ', full: 'Intelligence', hasCombatAdd: false },
                WIZ: { short: 'WIZ', full: 'Wizardry', hasCombatAdd: false },
                CHA: { short: 'CHA', full: 'Charisma', hasCombatAdd: false }
            }
        };
    }
    
    generatePDF(character) {
        try {
            const printWindow = window.open('', '', 'width=800,height=600');
            if (!printWindow) {
                throw new Error('Could not open print window. Please check your popup blocker settings.');
            }
            
            const html = this.buildHTMLDocument(character);
            printWindow.document.write(html);
            printWindow.document.close();
            
            return true;
        } catch (error) {
            console.error('PDF generation error:', error);
            throw error;
        }
    }
    
    buildHTMLDocument(character) {
        const data = this.prepareCharacterData(character);
        
        return `<!DOCTYPE html>
<html>
<head>
    <title>${data.name} - T&T Character Sheet</title>
    ${this.generateStyles()}
</head>
<body>
    <div class="sheet">
        <div class="decorative-border"></div>
        <div class="logo">🐉</div>
        
        ${this.generateHeader()}
        ${this.generateBasicInfo(data)}
        
        <div class="main-columns">
            <div class="left-column">
                ${this.generateAttributes(data)}
                ${this.generateCombatAdds(data)}
                ${this.generateWeightSection(data)}
                ${this.generateEquipmentSection(data)}
            </div>
            
            <div class="right-column">
                ${this.generatePortraitBox()}
                ${this.generateAdventurePoints()}
                ${this.generateTalentsSection(data)}
                ${this.generateWeaponsSection(data)}
                ${this.generateSpellsSection()}
                <div class="note-text">List additional items & spells on the back.</div>
            </div>
        </div>
        
        ${this.generateFooter()}
    </div>
    
    <script>
        window.print();
        setTimeout(() => window.close(), 1000);
    </script>
</body>
</html>`;
    }
    
    prepareCharacterData(character) {
        // Prepare kindred and class names
        const kindredName = this.formatName(character.kindred);
        const className = this.formatName(character.characterClass);
        
        // Prepare equipment data
        const weapons = this.prepareWeapons(character.equipment.weapons);
        const armor = this.prepareArmor(character.equipment.armor);
        // Handle items which can be strings or objects
        const items = character.equipment.items.map(item => {
            if (typeof item === 'string') {
                return item;
            } else if (typeof item === 'object' && item.name) {
                // If it's an object with data, show the name and key properties
                const itemData = item.data;
                if (itemData) {
                    let itemStr = item.name;
                    if (itemData.weight) {
                        itemStr += ` (${itemData.weight} units)`;
                    }
                    return itemStr;
                }
                return item.name;
            }
            return ''; // Fallback for malformed items
        }).filter(item => item); // Remove empty strings
        const equipment = [...armor, ...items];
        
        // Calculate weights
        const weightPossible = Math.floor(character.attributes.str.current * 100);
        const weightCarried = this.calculateCarriedWeight(character.equipment);
        
        // Get combat adds
        const combatAdds = character.calculateTotalAdds();
        
        return {
            name: character.name || 'Unnamed Character',
            kindred: kindredName,
            characterClass: className,
            level: character.level,
            gender: this.formatName(character.gender),
            height: character.height || '',
            weight: character.weight || '',
            age: character.age || '',
            hair: character.hair || '',
            gold: character.gold,
            attributes: character.attributes,
            combatAdds,
            talents: character.talents || [],
            weapons,
            equipment,
            weightPossible,
            weightCarried
        };
    }
    
    formatName(value) {
        if (!value) return '';
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    prepareWeapons(weapons) {
        return weapons.map(w => {
            const itemName = typeof w === 'string' ? w : w.name;
            const itemData = typeof w === 'object' ? w.data : null;
            if (itemData && itemData.damage) {
                return `${itemName} (${itemData.damage})`;
            }
            return itemName;
        });
    }
    
    prepareArmor(armor) {
        return armor.map(a => {
            const itemName = typeof a === 'string' ? a : a.name;
            const itemData = typeof a === 'object' ? a.data : null;
            if (itemData && itemData.hits) {
                return `${itemName} (${itemData.hits} hits)`;
            }
            return itemName;
        });
    }
    
    calculateCarriedWeight(equipment) {
        let weight = 0;
        
        [...equipment.weapons, ...equipment.armor].forEach(item => {
            if (typeof item === 'object' && item.data && item.data.weight) {
                weight += parseFloat(item.data.weight) || 0;
            }
        });
        
        return Math.floor(weight);
    }
    
    generateStyles() {
        return `
    <style>
        ${this.getPageStyles()}
        ${this.getLayoutStyles()}
        ${this.getComponentStyles()}
        ${this.getSectionStyles()}
        ${this.getAttributeStyles()}
    </style>`;
    }
    
    getPageStyles() {
        return `
        @page {
            size: ${this.PDF_CONFIG.PAGE_SIZE};
            margin: ${this.PDF_CONFIG.MARGIN};
        }
        @media print {
            body { 
                margin: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
        body {
            font-family: ${this.PDF_CONFIG.FONT_FAMILY};
            font-size: ${this.PDF_CONFIG.BASE_FONT_SIZE};
            line-height: 1.2;
            margin: 0;
            padding: 10px;
            background: white;
        }`;
    }
    
    getLayoutStyles() {
        return `
        .sheet {
            width: ${this.PDF_CONFIG.SHEET_WIDTH};
            margin: 0 auto;
            border: 3px solid black;
            padding: 15px;
            position: relative;
        }
        .decorative-border {
            position: absolute;
            top: 5px;
            right: 5px;
            bottom: 5px;
            left: 5px;
            border: 1px solid black;
            pointer-events: none;
        }
        .main-columns {
            display: flex;
            gap: 15px;
        }
        .left-column {
            flex: 1;
        }
        .right-column {
            flex: 1.1;
        }`;
    }
    
    getComponentStyles() {
        return `
        .header {
            text-align: center;
            margin-bottom: 10px;
        }
        .header h1 {
            font-size: 26px;
            font-weight: bold;
            margin: 0;
            font-family: 'Arial Black', sans-serif;
            letter-spacing: -1px;
        }
        .header h2 {
            font-size: 16px;
            margin: 0;
            font-weight: bold;
            letter-spacing: 2px;
        }
        .logo {
            position: absolute;
            top: 10px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: white;
            border: 2px solid black;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
        .portrait-box {
            border: 2px solid black;
            height: 140px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: #999;
            font-style: italic;
            margin-bottom: 6px;
        }`;
    }
    
    getSectionStyles() {
        return `
        .section-title {
            font-weight: bold;
            text-align: center;
            border: 2px solid black;
            padding: 3px;
            margin-bottom: 8px;
            background: white;
            font-size: 11px;
            letter-spacing: 1px;
        }
        .info-row {
            display: flex;
            gap: 10px;
            margin-bottom: 6px;
        }
        .info-item {
            flex: 1;
            display: flex;
            align-items: baseline;
        }
        .info-label {
            font-weight: bold;
            text-transform: uppercase;
            font-size: 11px;
            margin-right: 5px;
        }
        .info-value {
            border-bottom: 1px solid black;
            flex: 1;
            padding: 0 2px;
            min-height: 16px;
        }
        .section-lines {
            border: 1px solid black;
            padding: 5px;
        }
        .line {
            border-bottom: 1px solid #ccc;
            height: 16px;
            margin-bottom: 2px;
            font-size: 10px;
            padding: 1px 2px;
        }
        .line:last-child {
            border-bottom: none;
        }`;
    }
    
    getAttributeStyles() {
        return `
        .attributes-container {
            display: flex;
            gap: 10px;
            margin-bottom: 8px;
        }
        .physical-attrs, .mental-attrs {
            flex: 1;
        }
        .attr-group-label {
            font-style: italic;
            text-align: center;
            font-size: 10px;
            margin-bottom: 5px;
        }
        .attribute-row {
            display: flex;
            align-items: stretch;
            border: 1px solid black;
            margin-bottom: -1px;
            height: 24px;
        }
        .attr-box {
            width: 32px;
            border-right: 1px solid black;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }
        .attr-label {
            flex: 1;
            padding: 0 5px;
            display: flex;
            align-items: center;
            font-size: 11px;
        }
        .attr-name {
            font-weight: bold;
            font-size: 13px;
        }
        .attr-full {
            font-size: 9px;
            margin-left: 3px;
        }
        .attr-value-box {
            width: 40px;
            border-left: 1px solid black;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
        }
        .combat-adds {
            border: 2px solid black;
            padding: 6px;
            text-align: center;
            margin-bottom: 8px;
        }
        .combat-adds-label {
            font-size: 10px;
            font-weight: bold;
        }
        .combat-adds-value {
            font-size: 18px;
            font-weight: bold;
            margin: 3px 0;
        }
        .combat-adds-note {
            font-size: 8px;
            font-style: italic;
            line-height: 1.1;
        }
        .weight-section {
            display: flex;
            gap: 10px;
            margin-bottom: 8px;
        }
        .weight-box {
            flex: 1;
            text-align: center;
        }
        .weight-label {
            font-size: 10px;
            font-weight: bold;
        }
        .weight-value {
            border-bottom: 1px solid black;
            margin-top: 2px;
            padding: 2px;
            font-size: 12px;
        }
        .ap-box {
            border: 2px solid black;
            padding: 4px 8px;
            margin-bottom: 6px;
        }
        .ap-header {
            font-weight: bold;
            font-size: 10px;
            text-align: left;
            letter-spacing: 1px;
        }
        .footer {
            margin-top: 15px;
            font-size: 9px;
            text-align: center;
            font-style: italic;
        }
        .note-text {
            font-size: 9px;
            font-style: italic;
            text-align: right;
            margin-top: 5px;
        }`;
    }
    
    generateHeader() {
        return `
        <div class="header">
            <h1>${this.LABELS.TITLE}</h1>
            <h2>${this.LABELS.SUBTITLE}</h2>
        </div>`;
    }
    
    generateBasicInfo(data) {
        return `
        <div class="basic-info">
            <div class="info-row">
                <div class="info-item" style="flex: 2;">
                    <span class="info-label">NAME:</span>
                    <span class="info-value">${data.name}</span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-item">
                    <span class="info-label">KINDRED:</span>
                    <span class="info-value">${data.kindred}</span>
                </div>
                <div class="info-item" style="flex: 0.5;">
                    <span class="info-label">LEVEL:</span>
                    <span class="info-value">${data.level}</span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-item" style="flex: 2;">
                    <span class="info-label">CHARACTER TYPE:</span>
                    <span class="info-value">${data.characterClass}</span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-item">
                    <span class="info-label">GENDER:</span>
                    <span class="info-value">${data.gender}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">HEIGHT:</span>
                    <span class="info-value">${data.height}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">WEIGHT:</span>
                    <span class="info-value">${data.weight}</span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-item">
                    <span class="info-label">AGE:</span>
                    <span class="info-value">${data.age}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">HAIR:</span>
                    <span class="info-value">${data.hair}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">MONEY:</span>
                    <span class="info-value">${data.gold} gp</span>
                </div>
            </div>
        </div>`;
    }
    
    generateAttributes(data) {
        const physicalAttrs = ['str', 'con', 'dex', 'spd'];
        const mentalAttrs = ['lk', 'iq', 'wiz', 'cha'];
        
        return `
        <div class="section-title">${this.LABELS.SECTIONS.ATTRIBUTES}</div>
        <div class="attributes-container">
            <div class="physical-attrs">
                <div class="attr-group-label">Physical</div>
                ${physicalAttrs.map(attr => this.generateAttributeRow(attr, data.attributes[attr], true)).join('')}
            </div>
            <div class="mental-attrs">
                <div class="attr-group-label">Mental</div>
                ${mentalAttrs.map(attr => this.generateAttributeRow(attr, data.attributes[attr], false)).join('')}
            </div>
        </div>`;
    }
    
    generateAttributeRow(attrKey, attrData, isPhysical) {
        const attrInfo = this.LABELS.ATTRIBUTES[attrKey.toUpperCase()];
        const asterisk = attrInfo.hasCombatAdd ? '*' : '';
        const boxSymbol = isPhysical ? '▢' : '';
        
        return `
        <div class="attribute-row">
            <div class="attr-box">${boxSymbol}</div>
            <div class="attr-label">
                <span class="attr-name">${attrInfo.short}</span>
                <span class="attr-full">${attrInfo.full}${asterisk}</span>
            </div>
            <div class="attr-value-box">${attrData.current}</div>
        </div>`;
    }
    
    generateCombatAdds(data) {
        const addsSign = data.combatAdds >= 0 ? '+' : '';
        return `
        <div class="combat-adds">
            <div class="combat-adds-label">${this.LABELS.SECTIONS.COMBAT_ADDS}</div>
            <div class="combat-adds-value">${addsSign}${data.combatAdds}</div>
            <div class="combat-adds-note">*Your character receives a BONUS of one point for each of the following attributes over 12: STR, LK, DEX & SPD.</div>
        </div>`;
    }
    
    generateWeightSection(data) {
        return `
        <div class="weight-section">
            <div class="weight-box">
                <div class="weight-label">WT. POSSIBLE:</div>
                <div class="weight-value">${data.weightPossible}</div>
            </div>
            <div class="weight-box">
                <div class="weight-label">WT. CARRIED:</div>
                <div class="weight-value">${data.weightCarried}</div>
            </div>
        </div>`;
    }
    
    generateEquipmentSection(data) {
        return `
        <div class="equipment-section">
            <div class="section-title">${this.LABELS.SECTIONS.EQUIPMENT}</div>
            <div class="section-lines">
                ${this.generateLines(data.equipment, this.LAYOUT.MAX_EQUIPMENT_LINES)}
            </div>
        </div>`;
    }
    
    generatePortraitBox() {
        return '<div class="portrait-box">Character portrait</div>';
    }
    
    generateAdventurePoints() {
        return `
        <div class="ap-box">
            <div class="ap-header">${this.LABELS.SECTIONS.ADVENTURE_POINTS}</div>
        </div>`;
    }
    
    generateTalentsSection(data) {
        return `
        <div class="talents-section">
            <div class="section-title">${this.LABELS.SECTIONS.TALENTS}</div>
            <div class="section-lines">
                ${this.generateLines(data.talents, this.LAYOUT.MAX_TALENT_LINES)}
            </div>
        </div>`;
    }
    
    generateWeaponsSection(data) {
        return `
        <div class="weapons-section">
            <div class="section-title">${this.LABELS.SECTIONS.WEAPONS}</div>
            <div class="section-lines">
                ${this.generateLines(data.weapons, this.LAYOUT.MAX_WEAPON_LINES)}
            </div>
        </div>`;
    }
    
    generateSpellsSection() {
        return `
        <div class="spells-section">
            <div class="section-title">${this.LABELS.SECTIONS.SPELLS}</div>
            <div class="section-lines">
                ${this.generateLines([], this.LAYOUT.MAX_SPELL_LINES)}
            </div>
        </div>`;
    }
    
    generateFooter() {
        return `
        <div class="footer">
            Permission to copy this page is granted by Flying Buffalo Inc.
        </div>`;
    }
    
    generateLines(items, maxLines) {
        const lines = [];
        
        // Add filled lines
        for (let i = 0; i < Math.min(items.length, maxLines); i++) {
            lines.push(`<div class="line">${items[i]}</div>`);
        }
        
        // Add empty lines
        for (let i = items.length; i < maxLines; i++) {
            lines.push('<div class="line"></div>');
        }
        
        return lines.join('');
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFGenerator;
}