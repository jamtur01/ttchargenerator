class TTCharacterGenerator {
    constructor() {
        this.character = new Character();
        this.initializeElements();
        this.populateTalentDropdown();
        this.bindEvents();
        this.updateUI();
    }
    
    initializeElements() {
        this.elements = {
            name: document.getElementById('name'),
            kindred: document.getElementById('kindred'),
            characterClass: document.getElementById('class'),
            gender: document.getElementById('gender'),
            age: document.getElementById('age'),
            height: document.getElementById('height'),
            weight: document.getElementById('weight'),
            level: document.getElementById('level'),
            
            rollAttributes: document.getElementById('roll-attributes'),
            rerollAttributes: document.getElementById('reroll-attributes'),
            exportCharacter: document.getElementById('export-character'),
            importCharacter: document.getElementById('import-character'),
            
            totalAdds: document.getElementById('total-adds'),
            
            newTalent: document.getElementById('new-talent'),
            addTalent: document.getElementById('add-talent'),
            talentsList: document.getElementById('talents-list'),
            
            newWeapon: document.getElementById('new-weapon'),
            addWeapon: document.getElementById('add-weapon'),
            weaponsList: document.getElementById('weapons-list'),
            
            newArmor: document.getElementById('new-armor'),
            addArmor: document.getElementById('add-armor'),
            armorList: document.getElementById('armor-list'),
            
            newItem: document.getElementById('new-item'),
            addItem: document.getElementById('add-item'),
            itemsList: document.getElementById('items-list'),
            
            gold: document.getElementById('gold')
        };
        
        this.attributeElements = {};
        ['str', 'con', 'dex', 'spd', 'lk', 'iq', 'wiz', 'cha'].forEach(attr => {
            this.attributeElements[attr] = {
                current: document.getElementById(`${attr}-current`),
                max: document.getElementById(`${attr}-max`),
                modifier: document.getElementById(`${attr}-modifier`)
            };
        });
    }
    
    populateTalentDropdown() {
        const talentSelect = this.elements.newTalent;
        talentSelect.innerHTML = '<option value="">Select a talent</option>';
        
        // Sort talents alphabetically
        const sortedTalents = [...this.character.talentsList].sort();
        
        sortedTalents.forEach(talent => {
            const option = document.createElement('option');
            option.value = talent;
            
            // Check if this is a rogue-like talent and mark with asterisk
            if (this.character.rogueTalents.includes(talent)) {
                option.textContent = `${talent} *`;
                option.title = 'Rogue-like talent (Rogues gain these on even levels)';
            } else {
                option.textContent = talent;
            }
            
            talentSelect.appendChild(option);
        });
    }
    
    bindEvents() {
        this.elements.name.addEventListener('input', (e) => {
            this.character.name = e.target.value;
        });
        
        this.elements.kindred.addEventListener('change', (e) => {
            this.character.kindred = e.target.value;
            this.character.applyKindredModifiers();
            this.updateUI();
        });
        
        this.elements.characterClass.addEventListener('change', (e) => {
            this.character.setClass(e.target.value);
            this.updateUI();
        });
        
        this.elements.gender.addEventListener('change', (e) => {
            this.character.gender = e.target.value;
        });
        
        this.elements.age.addEventListener('input', (e) => {
            this.character.age = parseInt(e.target.value) || 0;
        });
        
        this.elements.height.addEventListener('input', (e) => {
            this.character.height = e.target.value;
        });
        
        this.elements.weight.addEventListener('input', (e) => {
            this.character.weight = parseInt(e.target.value) || 0;
        });
        
        this.elements.level.addEventListener('input', (e) => {
            this.character.level = parseInt(e.target.value) || 1;
        });
        
        this.elements.gold.addEventListener('input', (e) => {
            this.character.gold = parseInt(e.target.value) || 0;
        });
        
        Object.keys(this.attributeElements).forEach(attr => {
            this.attributeElements[attr].current.addEventListener('input', (e) => {
                this.character.attributes[attr].current = parseInt(e.target.value) || 0;
                this.updateModifiers();
            });
            
            this.attributeElements[attr].max.addEventListener('input', (e) => {
                this.character.attributes[attr].max = parseInt(e.target.value) || 0;
            });
        });
        
        this.elements.rollAttributes.addEventListener('click', () => {
            this.rollNewCharacter();
        });
        
        this.elements.rerollAttributes.addEventListener('click', () => {
            this.rerollAttributes();
        });
        
        this.elements.exportCharacter.addEventListener('click', () => {
            this.exportCharacter();
        });
        
        this.elements.importCharacter.addEventListener('click', () => {
            this.importCharacter();
        });
        
        this.elements.addTalent.addEventListener('click', () => {
            this.addTalent();
        });
        
        this.elements.newTalent.addEventListener('change', (e) => {
            if (e.target.value) {
                this.addTalent();
            }
        });
        
        this.elements.addWeapon.addEventListener('click', () => {
            this.addEquipment('weapons', this.elements.newWeapon.value);
        });
        
        this.elements.newWeapon.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addEquipment('weapons', this.elements.newWeapon.value);
            }
        });
        
        this.elements.addArmor.addEventListener('click', () => {
            this.addEquipment('armor', this.elements.newArmor.value);
        });
        
        this.elements.newArmor.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addEquipment('armor', this.elements.newArmor.value);
            }
        });
        
        this.elements.addItem.addEventListener('click', () => {
            this.addEquipment('items', this.elements.newItem.value);
        });
        
        this.elements.newItem.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addEquipment('items', this.elements.newItem.value);
            }
        });
    }
    
    rollNewCharacter() {
        // Always use TARO when rolling new attributes
        const results = this.character.rollNewAttributes(true);
        
        // Add visual feedback for rolling
        Object.keys(this.attributeElements).forEach(attr => {
            this.attributeElements[attr].current.classList.add('dice-roll-animation');
            this.attributeElements[attr].max.classList.add('dice-roll-animation');
        });
        
        // Show TARO results if any triples were rolled
        if (this.character.hasTriples) {
            // Automatically set class to specialist
            this.character.setClass('specialist');
            
            let message = 'Triples rolled! TARO (Triples Add and Roll Over) applied:\n\n';
            
            this.character.specialistAttributes.forEach(attr => {
                const result = results[attr];
                message += `${attr.toUpperCase()}: `;
                
                // Show all roll sets
                result.rollSets.forEach((set, index) => {
                    message += `${set.join(',')}`;
                    if (index < result.rollSets.length - 1) {
                        message += ' → ';
                    }
                });
                
                message += ` = ${result.total}\n`;
            });
            
            const specialistType = this.character.getSpecialistType();
            if (specialistType) {
                message += `\nSpecialist Type: ${specialistType}`;
                message += `\n\nYou are now a Specialist!`;
            }
            
            alert(message);
        }
        
        setTimeout(() => {
            this.updateUI();
            Object.keys(this.attributeElements).forEach(attr => {
                this.attributeElements[attr].current.classList.remove('dice-roll-animation');
                this.attributeElements[attr].max.classList.remove('dice-roll-animation');
            });
        }, 300);
    }
    
    rerollAttributes() {
        const results = this.character.rollNewAttributes(true);
        
        // If triples were rolled, automatically set to specialist
        if (this.character.hasTriples) {
            this.character.setClass('specialist');
            
            let message = 'Triples rolled! TARO (Triples Add and Roll Over) applied:\n\n';
            
            this.character.specialistAttributes.forEach(attr => {
                const result = results[attr];
                message += `${attr.toUpperCase()}: `;
                
                // Show all roll sets
                result.rollSets.forEach((set, index) => {
                    message += `${set.join(',')}`;
                    if (index < result.rollSets.length - 1) {
                        message += ' → ';
                    }
                });
                
                message += ` = ${result.total}\n`;
            });
            
            const specialistType = this.character.getSpecialistType();
            if (specialistType) {
                message += `\nSpecialist Type: ${specialistType}`;
                message += `\n\nYou are now a Specialist!`;
            }
            
            alert(message);
        }
        
        this.character.applyKindredModifiers();
        this.updateUI();
    }
    
    updateUI() {
        this.elements.name.value = this.character.name;
        this.elements.kindred.value = this.character.kindred;
        this.elements.characterClass.value = this.character.characterClass;
        this.elements.gender.value = this.character.gender;
        this.elements.age.value = this.character.age;
        this.elements.height.value = this.character.height;
        this.elements.weight.value = this.character.weight;
        this.elements.level.value = this.character.level;
        this.elements.gold.value = this.character.gold;
        
        Object.keys(this.attributeElements).forEach(attr => {
            const attrData = this.character.attributes[attr];
            this.attributeElements[attr].current.value = attrData.current;
            this.attributeElements[attr].max.value = attrData.max;
            
            // Add visual indicator for attributes that had triples
            if (attrData.hadTriples) {
                this.attributeElements[attr].current.classList.add('specialist-attribute');
                this.attributeElements[attr].max.classList.add('specialist-attribute');
            } else {
                this.attributeElements[attr].current.classList.remove('specialist-attribute');
                this.attributeElements[attr].max.classList.remove('specialist-attribute');
            }
        });
        
        this.updateModifiers();
        this.updateClassOptions();
        this.updateTalentsList();
        this.updateEquipmentLists();
        this.updateSpecialistInfo();
    }
    
    updateModifiers() {
        // Update attribute modifiers (for display only)
        Object.keys(this.attributeElements).forEach(attr => {
            const modifier = this.character.calculateModifier(this.character.attributes[attr].current);
            this.attributeElements[attr].modifier.textContent = modifier >= 0 ? `+${modifier}` : `${modifier}`;
        });
        
        // Update total combat adds (only STR, DEX, SPD, LK > 12)
        const adds = this.character.calculateTotalAdds();
        this.elements.totalAdds.textContent = adds >= 0 ? `+${adds}` : adds;
        
        // Add tooltip to explain combat adds
        this.elements.totalAdds.title = 'Personal Adds from STR, DEX, SPD, and LK above 12';
    }
    
    updateClassOptions() {
        const availableClasses = this.character.getAvailableClasses();
        const classSelect = this.elements.characterClass;
        
        Array.from(classSelect.options).forEach(option => {
            if (option.value && !availableClasses.includes(option.value)) {
                option.disabled = true;
                if (option.value === 'citizen' && this.character.hasTriples) {
                    option.title = 'Cannot select Citizen when triples were rolled';
                } else if (option.value === 'specialist' && !this.character.hasTriples) {
                    option.title = 'Specialist requires rolling triples on at least one attribute';
                } else if (option.value === 'wizard' && 
                          (this.character.attributes.iq.current < 10 || 
                           this.character.attributes.dex.current < 10)) {
                    option.title = 'Wizard requires IQ 10+ and DEX 10+';
                } else {
                    option.title = `Requirements not met for ${option.textContent}`;
                }
            } else {
                option.disabled = false;
                option.title = '';
            }
        });
    }
    
    updateSpecialistInfo() {
        // Add specialist type info if applicable
        if (this.character.hasTriples && this.character.characterClass === 'specialist') {
            const specialistType = this.character.getSpecialistType();
            const classSelect = this.elements.characterClass;
            const selectedOption = classSelect.options[classSelect.selectedIndex];
            if (selectedOption && specialistType) {
                selectedOption.text = `Specialist - ${specialistType}`;
            }
        }
    }
    
    updateTalentsList() {
        this.elements.talentsList.innerHTML = '';
        
        this.character.talents.forEach(talent => {
            const talentItem = document.createElement('div');
            talentItem.className = 'talent-item';
            
            // Check if this is a rogue-like talent and display with asterisk
            const displayName = this.character.rogueTalents.includes(talent) ? `${talent} *` : talent;
            
            talentItem.innerHTML = `
                <span${this.character.rogueTalents.includes(talent) ? ' title="Rogue-like talent"' : ''}>${displayName}</span>
                <button class="talent-remove" onclick="app.removeTalent('${talent}')">×</button>
            `;
            this.elements.talentsList.appendChild(talentItem);
        });
    }
    
    updateEquipmentLists() {
        this.updateEquipmentList('weapons', this.elements.weaponsList);
        this.updateEquipmentList('armor', this.elements.armorList);
        this.updateEquipmentList('items', this.elements.itemsList);
    }
    
    updateEquipmentList(category, listElement) {
        listElement.innerHTML = '';
        
        this.character.equipment[category].forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'equipment-item';
            itemElement.innerHTML = `
                <span>${item}</span>
                <button class="equipment-remove" onclick="app.removeEquipment('${category}', '${item}')">×</button>
            `;
            listElement.appendChild(itemElement);
        });
    }
    
    addTalent() {
        const talentName = this.elements.newTalent.value.trim();
        if (this.character.addTalent(talentName)) {
            this.elements.newTalent.value = '';
            this.updateTalentsList();
        }
    }
    
    removeTalent(talentName) {
        if (this.character.removeTalent(talentName)) {
            this.updateTalentsList();
        }
    }
    
    addEquipment(category, itemName) {
        const trimmedName = itemName.trim();
        if (this.character.addEquipment(category, trimmedName)) {
            const inputElement = category === 'weapons' ? this.elements.newWeapon :
                                 category === 'armor' ? this.elements.newArmor :
                                 this.elements.newItem;
            inputElement.value = '';
            this.updateEquipmentLists();
        }
    }
    
    removeEquipment(category, itemName) {
        if (this.character.removeEquipment(category, itemName)) {
            this.updateEquipmentLists();
        }
    }
    
    exportCharacter() {
        const characterData = this.character.exportCharacter();
        const dataStr = JSON.stringify(characterData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        
        // Generate filename with character name or timestamp
        let filename;
        if (this.character.name && this.character.name.trim()) {
            // Use character name if available
            filename = `${this.character.name.replace(/[^a-z0-9]/gi, '_')}_tt_character.json`;
        } else {
            // Use timestamp if no name
            const now = new Date();
            const timestamp = now.getFullYear() +
                            String(now.getMonth() + 1).padStart(2, '0') +
                            String(now.getDate()).padStart(2, '0') + '_' +
                            String(now.getHours()).padStart(2, '0') +
                            String(now.getMinutes()).padStart(2, '0') +
                            String(now.getSeconds()).padStart(2, '0');
            filename = `character_${timestamp}_tt_character.json`;
        }
        
        link.download = filename;
        link.click();
        
        URL.revokeObjectURL(link.href);
    }
    
    importCharacter() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const characterData = JSON.parse(event.target.result);
                        if (this.character.importCharacter(characterData)) {
                            this.updateUI();
                            alert('Character imported successfully!');
                        } else {
                            alert('Failed to import character. Please check the file format.');
                        }
                    } catch (error) {
                        alert('Invalid JSON file. Please select a valid character file.');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }
    
    validateAndShowErrors() {
        const errors = this.character.validateCharacter();
        if (errors.length > 0) {
            alert('Character validation errors:\n' + errors.join('\n'));
            return false;
        }
        return true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new TTCharacterGenerator();
});