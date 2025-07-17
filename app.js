class TTCharacterGenerator {
    constructor() {
        this.character = new Character();
        this.initializeFantasyNameData();
        this.initializeHeightWeightTable();
        this.initializeElements();
        this.populateTalentDropdown();
        this.bindEvents();
        this.updateUI();
    }
    
    initializeFantasyNameData() {
        this.fantasyNameParts = {
            prefixes: [
                'Ald', 'Bran', 'Cor', 'Dor', 'El', 'Fen', 'Gar', 'Hal', 'Jar', 'Kar',
                'Lor', 'Mor', 'Nor', 'Or', 'Ral', 'Sar', 'Tar', 'Val', 'Wil', 'Zar',
                'Ara', 'Bel', 'Cel', 'Del', 'Era', 'Fae', 'Gwen', 'Hel', 'Ira', 'Lir',
                'Mir', 'Nym', 'Ori', 'Rhea', 'Syl', 'Tara', 'Una', 'Vel', 'Wyn', 'Zara'
            ],
            middles: [
                'an', 'en', 'in', 'on', 'un', 'ar', 'er', 'or', 'ur', 'al',
                'el', 'il', 'ol', 'ul', 'and', 'end', 'ind', 'ond', 'ath',
                'eth', 'ith', 'oth', 'as', 'es', 'is', 'os', 'us', 'wyn'
            ],
            suffixes: [
                'dor', 'grim', 'har', 'ion', 'las', 'mir', 'nar', 'ric', 'thor', 'var',
                'wen', 'wyn', 'zar', 'dan', 'far', 'gar', 'kar', 'lan', 'mar', 'sar',
                'ara', 'ella', 'ira', 'ora', 'una', 'anna', 'enna', 'inna', 'lyn', 'ryn'
            ],
            titles: [
                'the Bold', 'the Brave', 'the Wise', 'the Swift', 'the Strong',
                'of the North', 'of the Mountain', 'Stormborn', 'Ironfoot', 'Goldbeard',
                'the Silent', 'the Wanderer', 'Dragonslayer', 'the Cunning', 'Lightbringer'
            ]
        };
    }
    
    initializeHeightWeightTable() {
        this.heightWeightTable = {
            3:  { height: "4'4\"", weightMin: 60, weightMax: 75 },
            4:  { height: "4'7\"", weightMin: 75, weightMax: 95 },
            5:  { height: "4'10\"", weightMin: 95, weightMax: 115 },
            6:  { height: "5'1\"", weightMin: 110, weightMax: 135 },
            7:  { height: "5'3\"", weightMin: 125, weightMax: 150 },
            8:  { height: "5'5\"", weightMin: 135, weightMax: 165 },
            9:  { height: "5'7\"", weightMin: 150, weightMax: 175 },
            10: { height: "5'8\"", weightMin: 155, weightMax: 185 },
            11: { height: "5'9\"", weightMin: 160, weightMax: 190 },
            12: { height: "5'10\"", weightMin: 165, weightMax: 195 },
            13: { height: "6'0\"", weightMin: 180, weightMax: 210 },
            14: { height: "6'2\"", weightMin: 190, weightMax: 230 },
            15: { height: "6'4\"", weightMin: 200, weightMax: 240 },
            16: { height: "6'7\"", weightMin: 220, weightMax: 265 },
            17: { height: "6'10\"", weightMin: 240, weightMax: 280 },
            18: { height: "7'1\"", weightMin: 255, weightMax: 300 }
        };
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
            exportPdf: document.getElementById('export-pdf'),
            importCharacter: document.getElementById('import-character'),
            
            totalAdds: document.getElementById('total-adds'),
            weightPossible: document.getElementById('weight-possible'),
            
            newTalent: document.getElementById('new-talent'),
            addTalent: document.getElementById('add-talent'),
            randomTalent: document.getElementById('random-talent'),
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
            
            gold: document.getElementById('gold'),
            
            generateName: document.getElementById('generate-name'),
            rollHeightWeight: document.getElementById('roll-height-weight')
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
            this.updateRollHeightWeightButton();
            this.updateAbilities();
        });
        
        this.elements.characterClass.addEventListener('change', (e) => {
            this.character.setClass(e.target.value);
            this.updateUI();
            this.updateAbilities();
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
                this.updateAbilities();
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
        
        if (this.elements.exportPdf) {
            this.elements.exportPdf.addEventListener('click', () => {
                this.exportPDF();
            });
        }
        
        this.elements.importCharacter.addEventListener('click', () => {
            this.importCharacter();
        });
        
        this.elements.addTalent.addEventListener('click', () => {
            this.addTalent();
        });
        
        if (this.elements.randomTalent) {
            this.elements.randomTalent.addEventListener('click', () => {
                this.generateRandomTalent();
            });
        }
        
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
        
        // Bind generate name button
        if (this.elements.generateName) {
            this.elements.generateName.addEventListener('click', () => {
                this.generateFantasyName();
            });
        }
        
        // Bind roll height/weight button
        if (this.elements.rollHeightWeight) {
            this.elements.rollHeightWeight.addEventListener('click', () => {
                this.rollHeightWeight();
            });
        }
    }
    
    generateFantasyName() {
        const prefix = this.fantasyNameParts.prefixes[Math.floor(Math.random() * this.fantasyNameParts.prefixes.length)];
        const middle = Math.random() > 0.5 ? this.fantasyNameParts.middles[Math.floor(Math.random() * this.fantasyNameParts.middles.length)] : '';
        const suffix = this.fantasyNameParts.suffixes[Math.floor(Math.random() * this.fantasyNameParts.suffixes.length)];
        
        let name = prefix + middle + suffix;
        
        // 20% chance to add a title
        if (Math.random() < 0.2) {
            const title = this.fantasyNameParts.titles[Math.floor(Math.random() * this.fantasyNameParts.titles.length)];
            name += ' ' + title;
        }
        
        this.character.name = name;
        this.elements.name.value = name;
    }
    
    generateRandomTalent() {
        const isLevel1 = this.character.level === 1;
        const isRogue = this.character.characterClass === 'rogue';
        const isEvenLevel = this.character.level % 2 === 0;
        
        // Special handling for level 1 rogues
        if (isLevel1 && isRogue) {
            // Rogues at level 1 should always have exactly 2 talents
            // If they have 0 or 2 talents, replace with 2 new talents
            if (this.character.talents.length === 0 || this.character.talents.length === 2) {
                // Clear all existing talents
                while (this.character.talents.length > 0) {
                    this.character.removeTalent(this.character.talents[0]);
                }
                
                // Determine talent pool
                let availableTalents = isEvenLevel ? [...this.character.rogueTalents] : [...this.character.talentsList];
                
                // Select 2 random talents
                const selectedTalents = [];
                for (let i = 0; i < 2 && availableTalents.length > 0; i++) {
                    const randomIndex = Math.floor(Math.random() * availableTalents.length);
                    const randomTalent = availableTalents[randomIndex];
                    selectedTalents.push(randomTalent);
                    // Remove selected talent from available pool to avoid duplicates
                    availableTalents.splice(randomIndex, 1);
                }
                
                // Add the selected talents
                selectedTalents.forEach(talent => this.character.addTalent(talent));
                this.updateTalentsList();
                
                // Clear the dropdown
                setTimeout(() => {
                    this.elements.newTalent.value = '';
                }, 1000);
                
                return;
            } else if (this.character.talents.length === 1) {
                // If rogue has only 1 talent, add a second one
                let availableTalents = isEvenLevel ? [...this.character.rogueTalents] : [...this.character.talentsList];
                availableTalents = availableTalents.filter(talent => !this.character.talents.includes(talent));
                
                if (availableTalents.length > 0) {
                    const randomIndex = Math.floor(Math.random() * availableTalents.length);
                    const randomTalent = availableTalents[randomIndex];
                    this.character.addTalent(randomTalent);
                    this.updateTalentsList();
                    
                    setTimeout(() => {
                        this.elements.newTalent.value = '';
                    }, 1000);
                }
                return;
            }
        }
        
        // Regular handling for non-rogues at level 1 or any character above level 1
        const maxTalentsAtLevel1 = isRogue ? 2 : 1;
        const shouldReplace = isLevel1 && !isRogue && this.character.talents.length >= maxTalentsAtLevel1;
        
        // Determine which talent pool to use
        let availableTalents = [];
        
        if (isRogue && isEvenLevel) {
            // Rogues on even levels can only choose from rogue-like talents
            availableTalents = [...this.character.rogueTalents];
        } else if (isRogue) {
            // Rogues on odd levels can choose from all talents
            availableTalents = [...this.character.talentsList];
        } else {
            // Non-rogues (or no class selected) can choose from all talents EXCEPT rogue talents
            availableTalents = this.character.talentsList.filter(talent =>
                !this.character.rogueTalents.includes(talent)
            );
        }
        
        // If not replacing, filter out talents the character already has
        if (!shouldReplace) {
            availableTalents = availableTalents.filter(talent => !this.character.talents.includes(talent));
        }
        
        // Check if there are any available talents
        if (availableTalents.length === 0) {
            let message = 'No available talents to add.';
            if (isRogue && isEvenLevel) {
                message = 'No available rogue-like talents to add. Rogues can only select rogue-like talents (marked with *) on even levels.';
            }
            alert(message);
            return;
        }
        
        // Select a random talent
        const randomIndex = Math.floor(Math.random() * availableTalents.length);
        const randomTalent = availableTalents[randomIndex];
        
        // If we should replace, remove an existing talent first
        if (shouldReplace) {
            // For level 1 non-rogues, remove the existing talent
            this.character.talents = [];
        }
        
        // Add the new talent
        if (this.character.addTalent(randomTalent)) {
            // Update the dropdown to show the selected talent
            this.elements.newTalent.value = randomTalent;
            this.updateTalentsList();
            
            // Show which talent was added
            let message = shouldReplace ? `Replaced talent with: ${randomTalent}` : `Added talent: ${randomTalent}`;
            if (this.character.rogueTalents.includes(randomTalent)) {
                message += ' (Rogue-like talent)';
            }
            
            // Clear the dropdown after a short delay
            setTimeout(() => {
                this.elements.newTalent.value = '';
            }, 1000);
        }
    }
    
    updateRollHeightWeightButton() {
        if (this.elements.rollHeightWeight) {
            const hasKindred = this.character.kindred && this.character.kindred !== '';
            this.elements.rollHeightWeight.disabled = !hasKindred;
            
            if (!hasKindred) {
                this.elements.rollHeightWeight.title = 'Select a kindred first to roll height and weight';
            } else {
                this.elements.rollHeightWeight.title = 'Roll 3d6 for height and weight';
            }
        }
    }
    
    rollHeightWeight() {
        // Roll 3d6
        const rolls = Dice.rollMultiple(3, 6);
        const total = rolls.reduce((sum, die) => sum + die, 0);
        const result = this.heightWeightTable[total];
        
        if (!result) {
            alert('Invalid roll result');
            return;
        }
        
        // Get kindred data for multipliers
        const kindredData = this.character.kindredData[this.character.kindred] || this.character.kindredData.human;
        
        // Apply height multiplier
        let height = result.height;
        if (kindredData.heightMod && kindredData.heightMod !== 1) {
            // Parse height and apply multiplier
            const heightMatch = height.match(/(\d+)'(\d+)"/);
            if (heightMatch) {
                const feet = parseInt(heightMatch[1]);
                const inches = parseInt(heightMatch[2]);
                const totalInches = (feet * 12 + inches) * kindredData.heightMod;
                const newFeet = Math.floor(totalInches / 12);
                const newInches = Math.round(totalInches % 12);
                height = `${newFeet}'${newInches}"`;
            }
        }
        
        // Apply weight multiplier
        let weightMin = result.weightMin;
        let weightMax = result.weightMax;
        if (kindredData.weightMod && kindredData.weightMod !== 1) {
            weightMin = Math.round(weightMin * kindredData.weightMod);
            weightMax = Math.round(weightMax * kindredData.weightMod);
        }
        
        // Choose a weight in the range (middle value)
        const weight = Math.round(weightMin + (weightMax - weightMin) / 2);
        
        // Update fields
        this.character.height = height;
        this.character.weight = weight;
        this.elements.height.value = height;
        this.elements.weight.value = `${weight} lbs`;
        
        // Show roll result
        let message = `Height/Weight Roll: ${rolls.join(' + ')} = ${total}\n\n`;
        message += `Base Height: ${result.height}\n`;
        
        if (kindredData.heightMod && kindredData.heightMod !== 1) {
            message += `Kindred Height Multiplier: ×${kindredData.heightMod}\n`;
        }
        message += `Final Height: ${height}\n\n`;
        
        message += `Base Weight Range: ${result.weightMin}-${result.weightMax} lbs\n`;
        if (kindredData.weightMod && kindredData.weightMod !== 1) {
            message += `Kindred Weight Multiplier: ×${kindredData.weightMod}\n`;
            message += `Final Weight Range: ${weightMin}-${weightMax} lbs\n`;
        }
        message += `Set to: ${weight} lbs`;
        
        alert(message);
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
        this.updateRollHeightWeightButton();
        this.updateAbilities();
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
        
        // Update weight possible (STR × 10 pounds)
        const weightPossible = this.character.calculateWeightPossible();
        this.elements.weightPossible.textContent = weightPossible;
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
            
            if (category === 'items' || typeof item === 'string') {
                // Simple items without data
                const itemName = typeof item === 'string' ? item : item.name;
                itemElement.innerHTML = `
                    <span>${itemName}</span>
                    <button class="equipment-remove" onclick="app.removeEquipment('${category}', '${itemName}')">×</button>
                `;
            } else {
                // Weapons and armor with data
                const itemName = item.name;
                const itemData = item.data;
                
                let attributesHtml = '';
                if (itemData) {
                    const attributes = [];
                    
                    // Add damage for weapons
                    if (itemData.damage) {
                        attributes.push(`Damage: ${itemData.damage}`);
                    }
                    
                    // Add protection for armor
                    if (itemData.hits) {
                        attributes.push(`Protection: ${itemData.hits} hits`);
                    }
                    
                    // Add requirements
                    if (itemData.strReq) {
                        attributes.push(`STR: ${itemData.strReq}`);
                    }
                    if (itemData.dexReq) {
                        attributes.push(`DEX: ${itemData.dexReq}`);
                    }
                    if (itemData.dexReqThrown) {
                        attributes.push(`Thrown DEX: ${itemData.dexReqThrown}`);
                    }
                    
                    // Add weight
                    if (itemData.weight) {
                        attributes.push(`Weight: ${itemData.weight} units`);
                    }
                    
                    // Add range for ranged weapons
                    if (itemData.range) {
                        attributes.push(`Range: ${itemData.range} yds`);
                    }
                    
                    // Add DEX penalty for armor
                    if (itemData.dexPenalty && itemData.dexPenalty < 0) {
                        attributes.push(`DEX penalty: ${itemData.dexPenalty}`);
                    }
                    
                    attributesHtml = `<div class="equipment-attributes">${attributes.join(' • ')}</div>`;
                }
                
                itemElement.innerHTML = `
                    <div class="equipment-info">
                        <span class="equipment-name">${itemName}</span>
                        ${attributesHtml}
                    </div>
                    <button class="equipment-remove" onclick="app.removeEquipment('${category}', '${itemName}')">×</button>
                `;
            }
            
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
    
    exportPDF() {
        // Create a new window with the character sheet formatted for printing
        const printWindow = window.open('', '_blank');
        const character = this.character;
        const kindredName = character.kindredData[character.kindred]?.name || 'Unknown';
        const className = character.classData[character.characterClass]?.name || 'Unknown';
        
        // Get abilities
        const abilities = character.getAbilities();
        const abilitiesHTML = abilities.length > 0
            ? abilities.map(ability => `<li>${ability}</li>`).join('')
            : '<li>No special abilities</li>';
        
        // Get equipment lists with attributes
        const weaponsHTML = character.equipment.weapons.length > 0
            ? character.equipment.weapons.map(w => {
                const itemName = typeof w === 'string' ? w : w.name;
                const itemData = typeof w === 'object' ? w.data : null;
                let attributes = '';
                if (itemData) {
                    const attrs = [];
                    if (itemData.damage) attrs.push(`Damage: ${itemData.damage}`);
                    if (itemData.strReq) attrs.push(`STR: ${itemData.strReq}`);
                    if (itemData.dexReq) attrs.push(`DEX: ${itemData.dexReq}`);
                    if (itemData.range) attrs.push(`Range: ${itemData.range} yds`);
                    attributes = attrs.length > 0 ? ` (${attrs.join(', ')})` : '';
                }
                return `<li>${itemName}${attributes}</li>`;
            }).join('')
            : '<li>None</li>';
            
        const armorHTML = character.equipment.armor.length > 0
            ? character.equipment.armor.map(a => {
                const itemName = typeof a === 'string' ? a : a.name;
                const itemData = typeof a === 'object' ? a.data : null;
                let attributes = '';
                if (itemData) {
                    const attrs = [];
                    if (itemData.hits) attrs.push(`Protection: ${itemData.hits} hits`);
                    if (itemData.strReq) attrs.push(`STR: ${itemData.strReq}`);
                    if (itemData.dexPenalty && itemData.dexPenalty < 0) attrs.push(`DEX penalty: ${itemData.dexPenalty}`);
                    attributes = attrs.length > 0 ? ` (${attrs.join(', ')})` : '';
                }
                return `<li>${itemName}${attributes}</li>`;
            }).join('')
            : '<li>None</li>';
            
        const itemsHTML = character.equipment.items.length > 0
            ? character.equipment.items.map(i => `<li>${i}</li>`).join('')
            : '<li>None</li>';
            
        const talentsHTML = character.talents.length > 0
            ? character.talents.map(t => `<li>${t}</li>`).join('')
            : '<li>None</li>';
        
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>${character.name || 'Character'} - T&T Character Sheet</title>
    <style>
        @page {
            size: letter;
            margin: 0.5in;
        }
        @media print {
            body { margin: 0; }
        }
        body {
            font-family: 'Georgia', serif;
            line-height: 1.4;
            color: #2c1810;
            margin: 20px;
        }
        h1, h2, h3 {
            font-family: 'Times New Roman', serif;
            text-transform: uppercase;
            margin: 10px 0;
        }
        h1 {
            text-align: center;
            font-size: 24px;
            border-bottom: 3px double #2c1810;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        h2 {
            font-size: 18px;
            border-bottom: 2px solid #2c1810;
            margin-top: 20px;
        }
        .header-info {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 20px;
        }
        .info-group {
            display: flex;
            align-items: baseline;
            gap: 5px;
        }
        .label {
            font-weight: bold;
        }
        .attributes-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        .attributes-table th,
        .attributes-table td {
            border: 1px solid #2c1810;
            padding: 5px 10px;
            text-align: center;
        }
        .attributes-table th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        .combat-adds {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin: 15px 0;
            padding: 10px;
            border: 2px solid #2c1810;
        }
        ul {
            margin: 5px 0;
            padding-left: 25px;
        }
        .equipment-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #2c1810;
            font-size: 12px;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>Tunnels & Trolls Character Sheet</h1>
    
    <div class="header-info">
        <div class="info-group">
            <span class="label">Name:</span>
            <span>${character.name || 'Unnamed'}</span>
        </div>
        <div class="info-group">
            <span class="label">Class:</span>
            <span>${className}</span>
        </div>
        <div class="info-group">
            <span class="label">Level:</span>
            <span>${character.level}</span>
        </div>
        <div class="info-group">
            <span class="label">Kindred:</span>
            <span>${kindredName}</span>
        </div>
        <div class="info-group">
            <span class="label">Gender:</span>
            <span>${character.gender || 'Not specified'}</span>
        </div>
        <div class="info-group">
            <span class="label">Age:</span>
            <span>${character.age || 'Not specified'}</span>
        </div>
        <div class="info-group">
            <span class="label">Height:</span>
            <span>${character.height || 'Not specified'}</span>
        </div>
        <div class="info-group">
            <span class="label">Weight:</span>
            <span>${character.weight || 'Not specified'}</span>
        </div>
        <div class="info-group">
            <span class="label">Gold:</span>
            <span>${character.gold} gp</span>
        </div>
    </div>
    
    <h2>Attributes</h2>
    <table class="attributes-table">
        <tr>
            <th>Attribute</th>
            <th>Current</th>
            <th>Max</th>
        </tr>
        <tr>
            <td><strong>STR</strong> (Strength)</td>
            <td>${character.attributes.str.current}</td>
            <td>${character.attributes.str.max}</td>
        </tr>
        <tr>
            <td><strong>CON</strong> (Constitution)</td>
            <td>${character.attributes.con.current}</td>
            <td>${character.attributes.con.max}</td>
        </tr>
        <tr>
            <td><strong>DEX</strong> (Dexterity)</td>
            <td>${character.attributes.dex.current}</td>
            <td>${character.attributes.dex.max}</td>
        </tr>
        <tr>
            <td><strong>SPD</strong> (Speed)</td>
            <td>${character.attributes.spd.current}</td>
            <td>${character.attributes.spd.max}</td>
        </tr>
        <tr>
            <td><strong>LK</strong> (Luck)</td>
            <td>${character.attributes.lk.current}</td>
            <td>${character.attributes.lk.max}</td>
        </tr>
        <tr>
            <td><strong>IQ</strong> (Intelligence)</td>
            <td>${character.attributes.iq.current}</td>
            <td>${character.attributes.iq.max}</td>
        </tr>
        <tr>
            <td><strong>WIZ</strong> (Wizardry)</td>
            <td>${character.attributes.wiz.current}</td>
            <td>${character.attributes.wiz.max}</td>
        </tr>
        <tr>
            <td><strong>CHA</strong> (Charisma)</td>
            <td>${character.attributes.cha.current}</td>
            <td>${character.attributes.cha.max}</td>
        </tr>
    </table>
    
    <div class="combat-adds">
        Personal Adds: ${character.calculateTotalAdds() >= 0 ? '+' : ''}${character.calculateTotalAdds()}
    </div>
    
    <h2>Character Abilities</h2>
    <ul>${abilitiesHTML}</ul>
    
    <h2>Talents</h2>
    <ul>${talentsHTML}</ul>
    
    <h2>Equipment</h2>
    <div class="equipment-grid">
        <div>
            <h3>Weapons</h3>
            <ul>${weaponsHTML}</ul>
        </div>
        <div>
            <h3>Armor</h3>
            <ul>${armorHTML}</ul>
        </div>
    </div>
    <h3>Other Items</h3>
    <ul>${itemsHTML}</ul>
    
    <div class="footer">
        <p>Tunnels & Trolls™ is a trademark of Flying Buffalo Inc.</p>
        <p>Character generated on ${new Date().toLocaleDateString()}</p>
    </div>
    
    <script>
        window.print();
        setTimeout(() => window.close(), 1000);
    </script>
</body>
</html>
        `;
        
        printWindow.document.write(html);
        printWindow.document.close();
    }
    
    validateAndShowErrors() {
        const errors = this.character.validateCharacter();
        if (errors.length > 0) {
            alert('Character validation errors:\n' + errors.join('\n'));
            return false;
        }
        return true;
    }
    
    updateAbilities() {
        const abilitiesList = document.getElementById('abilities-list');
        if (!abilitiesList) return;
        
        const abilities = this.character.getAbilities();
        
        if (abilities.length === 0) {
            abilitiesList.innerHTML = '<li class="no-abilities">Select a class and kindred to see abilities</li>';
        } else {
            abilitiesList.innerHTML = abilities.map(ability => `<li>${ability}</li>`).join('');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new TTCharacterGenerator();
});