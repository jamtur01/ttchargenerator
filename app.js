class TTCharacterGenerator {
    constructor() {
        this.character = new Character();
        this.elaborationsEnabled = false;
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
            hair: document.getElementById('hair'),
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
            rollHeightWeight: document.getElementById('roll-height-weight'),
            
            elaborationsToggle: document.getElementById('elaborations-toggle')
        };
        
        this.attributeElements = {};
        ['str', 'con', 'dex', 'spd', 'lk', 'iq', 'wiz', 'cha'].forEach(attr => {
            this.attributeElements[attr] = {
                current: document.getElementById(`${attr}-current`),
                max: document.getElementById(`${attr}-max`)
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
        
        // Bind typeahead events for weapons and armor
        this.initializeTypeahead('weapon', this.elements.newWeapon, 'weapon-typeahead', EquipmentData.weapons);
        this.initializeTypeahead('armor', this.elements.newArmor, 'armor-typeahead', EquipmentData.armor);
        
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
            this.updateTalentsList(); // Update talents list after class change
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
        
        this.elements.hair.addEventListener('input', (e) => {
            this.character.hair = e.target.value;
        });
        
        this.elements.level.addEventListener('input', (e) => {
            this.character.level = parseInt(e.target.value) || 1;
            // Adjust talents if needed when level changes
            this.character.adjustTalentsForClassChange();
            this.updateTalentsList();
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
        
        // Bind elaborations toggle
        if (this.elements.elaborationsToggle) {
            this.elements.elaborationsToggle.addEventListener('change', (e) => {
                this.elaborationsEnabled = e.target.checked;
                this.updateKindredOptions();
                this.updateClassOptions();
            });
        }
        
        // Handle help text
        const infoIcon = document.getElementById('info-icon');
        const helpText = document.getElementById('toggle-help');
        if (infoIcon && helpText) {
            infoIcon.addEventListener('mouseenter', () => {
                helpText.style.display = 'block';
            });
            
            infoIcon.addEventListener('mouseleave', () => {
                helpText.style.display = 'none';
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
        const isRogue = this.character.characterClass === 'rogue';
        const isEvenLevel = this.character.level % 2 === 0;
        
        // Get the maximum allowed talents for this character
        const maxTalents = this.character.getMaxTalents();
        const currentTalentCount = this.character.talents.length;
        
        // Check if at maximum talents
        if (currentTalentCount >= maxTalents) {
            // At max talents - need to replace one
            // Determine which talent pool to use
            let availableTalents = [];
            
            if (isRogue && isEvenLevel) {
                // Rogues on even levels can only choose from rogue-like talents
                availableTalents = [...this.character.rogueTalents];
            } else if (isRogue) {
                // Rogues on odd levels can choose from all talents
                availableTalents = [...this.character.talentsList];
            } else {
                // Non-rogues can choose from all talents EXCEPT rogue talents
                availableTalents = this.character.talentsList.filter(talent =>
                    !this.character.rogueTalents.includes(talent)
                );
            }
            
            // Check if there are any available talents
            if (availableTalents.length === 0) {
                let message = 'No available talents to replace with.';
                if (isRogue && isEvenLevel) {
                    message = 'No available rogue-like talents. Rogues can only select rogue-like talents (marked with *) on even levels.';
                }
                alert(message);
                return;
            }
            
            // Select a random talent
            const randomIndex = Math.floor(Math.random() * availableTalents.length);
            const randomTalent = availableTalents[randomIndex];
            
            // Remove a random existing talent
            const talentToRemove = this.character.talents[Math.floor(Math.random() * this.character.talents.length)];
            this.character.removeTalent(talentToRemove);
            
            // Add the new talent
            if (this.character.addTalent(randomTalent)) {
                this.elements.newTalent.value = randomTalent;
                this.updateTalentsList();
                
                // Silently replace without alert
                setTimeout(() => {
                    this.elements.newTalent.value = '';
                }, 1000);
            }
        } else {
            // Below max talents - can add new talent
            let availableTalents = [];
            
            if (isRogue && isEvenLevel) {
                // Rogues on even levels can only choose from rogue-like talents
                availableTalents = [...this.character.rogueTalents];
            } else if (isRogue) {
                // Rogues on odd levels can choose from all talents
                availableTalents = [...this.character.talentsList];
            } else {
                // Non-rogues can choose from all talents EXCEPT rogue talents
                availableTalents = this.character.talentsList.filter(talent =>
                    !this.character.rogueTalents.includes(talent)
                );
            }
            
            // Filter out talents the character already has
            availableTalents = availableTalents.filter(talent => !this.character.talents.includes(talent));
            
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
            
            // Add the new talent
            if (this.character.addTalent(randomTalent)) {
                this.elements.newTalent.value = randomTalent;
                this.updateTalentsList();
                
                let message = `Added talent: ${randomTalent}`;
                if (this.character.rogueTalents.includes(randomTalent)) {
                    message += ' (Rogue-like talent)';
                }
                
                setTimeout(() => {
                    this.elements.newTalent.value = '';
                }, 1000);
            }
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
    
    updateKindredOptions() {
        const kindredSelect = this.elements.kindred;
        const currentValue = kindredSelect.value;
        
        // Clear existing options
        kindredSelect.innerHTML = '<option value="">Select Kindred</option>';
        
        // Add basic kindreds
        const basicKindreds = [
            { value: 'human', name: 'Human', title: '1× all attributes, second chance on failed saving rolls' },
            { value: 'dwarf', name: 'Dwarf', title: '2× STR & CON, 0.75× LK, 0.67× height, 2× weight' },
            { value: 'elf', name: 'Elf', title: '0.67× CON, 1.33× DEX, 1.5× IQ/WIZ/CHA, 1.10× height' },
            { value: 'hobb', name: 'Hobb', title: '0.5× STR, 2× CON, 1.5× DEX/LK, 0.5× height, 0.75× weight' },
            { value: 'fairy', name: 'Fairy', title: '0.25× STR/CON, 1.75× DEX, 1.5× LK/CHA, 2× WIZ, 0.10× height, 0.01× weight' },
            { value: 'leprechaun', name: 'Leprechaun', title: '0.33× STR, 0.67× CON, 1.5× DEX/LK/WIZ, 1.25× IQ, 0.33× height, 0.10× weight' }
        ];
        
        basicKindreds.forEach(kindred => {
            const option = document.createElement('option');
            option.value = kindred.value;
            option.textContent = kindred.name;
            option.title = kindred.title;
            kindredSelect.appendChild(option);
        });
        
        // Add elaborate kindreds if enabled
        if (this.elaborationsEnabled) {
            // Create optgroup for elaborate kindreds
            const optgroup = document.createElement('optgroup');
            optgroup.label = '— Elaborate Kindreds —';
            
            // Sort elaborate kindreds by name
            const elaborateKindreds = Object.entries(this.character.elaborateKindredData)
                .map(([key, data]) => ({ value: key, ...data }))
                .sort((a, b) => a.name.localeCompare(b.name));
            
            elaborateKindreds.forEach(kindred => {
                const option = document.createElement('option');
                option.value = kindred.value;
                option.textContent = kindred.name;
                option.title = kindred.description;
                option.className = 'elaborate-option';
                optgroup.appendChild(option);
            });
            
            kindredSelect.appendChild(optgroup);
        }
        
        // Restore previous selection if still available
        if (currentValue && Array.from(kindredSelect.options).some(opt => opt.value === currentValue)) {
            kindredSelect.value = currentValue;
        }
    }
    
    updateUI() {
        this.elements.name.value = this.character.name;
        this.elements.kindred.value = this.character.kindred;
        this.elements.characterClass.value = this.character.characterClass;
        this.elements.gender.value = this.character.gender;
        this.elements.age.value = this.character.age;
        this.elements.height.value = this.character.height;
        this.elements.weight.value = this.character.weight;
        this.elements.hair.value = this.character.hair;
        this.elements.level.value = this.character.level;
        this.elements.gold.value = this.character.gold;
        
        // Update dropdowns based on elaborations
        this.updateKindredOptions();
        
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
        // Update total combat adds (only STR, DEX, SPD, LK > 12)
        const adds = this.character.calculateTotalAdds();
        this.elements.totalAdds.textContent = adds >= 0 ? `+${adds}` : adds;
        
        // Update weight possible (STR × 10 pounds)
        const weightPossible = this.character.calculateWeightPossible();
        this.elements.weightPossible.textContent = weightPossible;
    }
    
    updateClassOptions() {
        const availableClasses = this.character.getAvailableClasses(this.elaborationsEnabled);
        const classSelect = this.elements.characterClass;
        const currentValue = classSelect.value;
        
        // Clear existing options
        classSelect.innerHTML = '<option value="">Select Type</option>';
        
        // Basic classes
        const basicClasses = [
            { value: 'warrior', name: 'Warrior', title: 'Weapon/armor bonuses, no magic ability' },
            { value: 'rogue', name: 'Rogue', title: 'Can use weapons and magic, starts with 2 talents' },
            { value: 'wizard', name: 'Wizard', title: 'Knows all 1st level spells, limited to 2d6 weapons' },
            { value: 'specialist', name: 'Specialist', title: 'Must roll triples on an attribute, has exceptional abilities' }
        ];
        
        basicClasses.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.value;
            option.textContent = cls.name;
            option.title = cls.title;
            
            if (!availableClasses.includes(cls.value)) {
                option.disabled = true;
                
                // Add specific disabled reasons
                if (cls.value === 'specialist' && !this.character.hasTriples) {
                    option.title = 'Specialist requires rolling triples on at least one attribute';
                } else if (cls.value === 'wizard' &&
                          (this.character.attributes.iq.current < 10 ||
                           this.character.attributes.dex.current < 10)) {
                    option.title = 'Wizard requires IQ 10+ and DEX 10+';
                }
            }
            
            classSelect.appendChild(option);
        });
        
        // Add elaborate classes if enabled
        if (this.elaborationsEnabled) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = '— Elaborate Types —';
            
            const elaborateClasses = [
                { value: 'citizen', name: 'Citizen', title: 'Average folk with no special training' },
                { value: 'paragon', name: 'Paragon', title: 'Combined warrior and wizard abilities' }
            ];
            
            elaborateClasses.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.value;
                option.textContent = cls.name;
                option.title = cls.title;
                option.className = 'elaborate-option';
                
                if (!availableClasses.includes(cls.value)) {
                    option.disabled = true;
                    
                    // Add specific disabled reasons
                    if (cls.value === 'citizen' && this.character.hasTriples) {
                        option.title = 'Cannot select Citizen when triples were rolled';
                    } else if (cls.value === 'paragon') {
                        option.title = 'Paragon requires 12+ in at least 6 of 8 attributes';
                    }
                }
                
                optgroup.appendChild(option);
            });
            
            classSelect.appendChild(optgroup);
        }
        
        // Restore previous selection if still available
        if (currentValue && availableClasses.includes(currentValue)) {
            classSelect.value = currentValue;
        }
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
        
        // Check if at max talents
        const maxTalents = this.character.getMaxTalents();
        if (this.character.talents.length >= maxTalents) {
            alert(`Cannot add more talents. Maximum allowed: ${maxTalents} (based on level ${this.character.level} as ${this.character.characterClass || 'no type'})`);
            return;
        }
        
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
        
        // Get equipment lists
        const weaponsLines = [];
        character.equipment.weapons.forEach(w => {
            const itemName = typeof w === 'string' ? w : w.name;
            const itemData = typeof w === 'object' ? w.data : null;
            if (itemData && itemData.damage) {
                weaponsLines.push(`${itemName} (${itemData.damage})`);
            } else {
                weaponsLines.push(itemName);
            }
        });
        
        const armorLines = [];
        character.equipment.armor.forEach(a => {
            const itemName = typeof a === 'string' ? a : a.name;
            const itemData = typeof a === 'object' ? a.data : null;
            if (itemData && itemData.hits) {
                armorLines.push(`${itemName} (${itemData.hits} hits)`);
            } else {
                armorLines.push(itemName);
            }
        });
        
        const equipmentLines = character.equipment.items.slice();
        
        // Combine armor and other equipment
        const allEquipment = [...armorLines, ...equipmentLines];
        
        // Get talents
        const talents = character.talents.slice();
        
        // Calculate weights
        let wtPossible = Math.floor(character.attributes.str.current * 100);
        let wtCarried = 0;
        
        character.equipment.weapons.forEach(w => {
            if (typeof w === 'object' && w.data && w.data.weight) {
                wtCarried += parseFloat(w.data.weight) || 0;
            }
        });
        character.equipment.armor.forEach(a => {
            if (typeof a === 'object' && a.data && a.data.weight) {
                wtCarried += parseFloat(a.data.weight) || 0;
            }
        });
        
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>${character.name || 'Character'} - T&T Character Sheet</title>
    <style>
        @page {
            size: letter;
            margin: 0.3in;
        }
        @media print {
            body { 
                margin: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11px;
            line-height: 1.2;
            margin: 0;
            padding: 10px;
            background: white;
        }
        .sheet {
            width: 7.5in;
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
        .basic-info {
            margin-bottom: 10px;
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
        .main-columns {
            display: flex;
            gap: 15px;
        }
        .left-column {
            flex: 1;
        }
        .right-column {
            flex: 1.1;
        }
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
        .equipment-section {
            margin-bottom: 8px;
        }
        .weapons-section {
            margin-bottom: 8px;
        }
        .equipment-lines {
            border: 1px solid black;
            padding: 5px;
        }
        .equipment-lines.tall {
            padding-bottom: 7px;
        }
        .ap-box {
            border: 2px solid black;
            padding: 4px 8px;
            margin-bottom: 6px;
            margin-left: 0;
            margin-right: 0;
        }
        .ap-header {
            font-weight: bold;
            font-size: 10px;
            text-align: left;
            letter-spacing: 1px;
        }
        .talents-section, .spells-section {
            margin-bottom: 8px;
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
        }
        .weapons-lines {
            border: 1px solid black;
            padding: 5px;
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
        }
    </style>
</head>
<body>
    <div class="sheet">
        <div class="decorative-border"></div>
        <div class="logo">🐉</div>
        
        <div class="header">
            <h1>TUNNELS & TROLLS</h1>
            <h2>CHARACTER SHEET</h2>
        </div>
        
        <div class="basic-info">
            <div class="info-row">
                <div class="info-item" style="flex: 2;">
                    <span class="info-label">NAME:</span>
                    <span class="info-value">${character.name || ''}</span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-item">
                    <span class="info-label">KINDRED:</span>
                    <span class="info-value">${kindredName}</span>
                </div>
                <div class="info-item" style="flex: 0.5;">
                    <span class="info-label">LEVEL:</span>
                    <span class="info-value">${character.level}</span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-item" style="flex: 2;">
                    <span class="info-label">CHARACTER TYPE:</span>
                    <span class="info-value">${className}</span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-item">
                    <span class="info-label">GENDER:</span>
                    <span class="info-value">${character.gender || ''}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">HEIGHT:</span>
                    <span class="info-value">${character.height || ''}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">WEIGHT:</span>
                    <span class="info-value">${character.weight || ''}</span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-item">
                    <span class="info-label">AGE:</span>
                    <span class="info-value">${character.age || ''}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">HAIR:</span>
                    <span class="info-value">${character.hair || ''}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">MONEY:</span>
                    <span class="info-value">${character.gold} gp</span>
                </div>
            </div>
        </div>
        
        <div class="main-columns">
            <div class="left-column">
                <div class="section-title">PRIME ATTRIBUTES:</div>
                
                <div class="attributes-container">
                    <div class="physical-attrs">
                        <div class="attr-group-label">Physical</div>
                        <div class="attribute-row">
                            <div class="attr-box">▢</div>
                            <div class="attr-label">
                                <span class="attr-name">STR</span>
                                <span class="attr-full">Strength*</span>
                            </div>
                            <div class="attr-value-box">${character.attributes.str.current}</div>
                        </div>
                        <div class="attribute-row">
                            <div class="attr-box">▢</div>
                            <div class="attr-label">
                                <span class="attr-name">CON</span>
                                <span class="attr-full">Constitution</span>
                            </div>
                            <div class="attr-value-box">${character.attributes.con.current}</div>
                        </div>
                        <div class="attribute-row">
                            <div class="attr-box">▢</div>
                            <div class="attr-label">
                                <span class="attr-name">DEX</span>
                                <span class="attr-full">Dexterity*</span>
                            </div>
                            <div class="attr-value-box">${character.attributes.dex.current}</div>
                        </div>
                        <div class="attribute-row">
                            <div class="attr-box">▢</div>
                            <div class="attr-label">
                                <span class="attr-name">SPD</span>
                                <span class="attr-full">Speed*</span>
                            </div>
                            <div class="attr-value-box">${character.attributes.spd.current}</div>
                        </div>
                    </div>
                    
                    <div class="mental-attrs">
                        <div class="attr-group-label">Mental</div>
                        <div class="attribute-row">
                            <div class="attr-box"></div>
                            <div class="attr-label">
                                <span class="attr-name">LK</span>
                                <span class="attr-full">Luck*</span>
                            </div>
                            <div class="attr-value-box">${character.attributes.lk.current}</div>
                        </div>
                        <div class="attribute-row">
                            <div class="attr-box"></div>
                            <div class="attr-label">
                                <span class="attr-name">IQ</span>
                                <span class="attr-full">Intelligence</span>
                            </div>
                            <div class="attr-value-box">${character.attributes.iq.current}</div>
                        </div>
                        <div class="attribute-row">
                            <div class="attr-box"></div>
                            <div class="attr-label">
                                <span class="attr-name">WIZ</span>
                                <span class="attr-full">Wizardry</span>
                            </div>
                            <div class="attr-value-box">${character.attributes.wiz.current}</div>
                        </div>
                        <div class="attribute-row">
                            <div class="attr-box"></div>
                            <div class="attr-label">
                                <span class="attr-name">CHA</span>
                                <span class="attr-full">Charisma</span>
                            </div>
                            <div class="attr-value-box">${character.attributes.cha.current}</div>
                        </div>
                    </div>
                </div>
                
                <div class="combat-adds">
                    <div class="combat-adds-label">PERSONAL / COMBAT ADDS:</div>
                    <div class="combat-adds-value">${character.calculateTotalAdds() >= 0 ? '+' : ''}${character.calculateTotalAdds()}</div>
                    <div class="combat-adds-note">*Your character receives a BONUS of one point for each of the following attributes over 12: STR, LK, DEX & SPD.</div>
                </div>
                
                <div class="weight-section">
                    <div class="weight-box">
                        <div class="weight-label">WT. POSSIBLE:</div>
                        <div class="weight-value">${wtPossible}</div>
                    </div>
                    <div class="weight-box">
                        <div class="weight-label">WT. CARRIED:</div>
                        <div class="weight-value">${Math.floor(wtCarried)}</div>
                    </div>
                </div>
                
                <div class="equipment-section">
                    <div class="section-title">EQUIPMENT:</div>
                    <div class="equipment-lines tall">
                        ${allEquipment.slice(0, 18).map(item => `<div class="line">${item}</div>`).join('')}
                        ${allEquipment.length < 18 ? Array(18 - allEquipment.length).fill('<div class="line"></div>').join('') : ''}
                    </div>
                </div>
            </div>
            
            <div class="right-column">
                <div class="portrait-box">Character portrait</div>
                <div class="ap-box">
                    <div class="ap-header">ADVENTURE POINTS:</div>
                </div>
                
                <div class="talents-section">
                    <div class="section-title">TALENTS:</div>
                    <div class="section-lines">
                        ${talents.slice(0, 5).map(talent => `<div class="line">${talent}</div>`).join('')}
                        ${talents.length < 5 ? Array(5 - talents.length).fill('<div class="line"></div>').join('') : ''}
                    </div>
                </div>
                
                <div class="weapons-section">
                    <div class="section-title">WEAPONS:</div>
                    <div class="section-lines">
                        ${weaponsLines.slice(0, 6).map(weapon => `<div class="line">${weapon}</div>`).join('')}
                        ${weaponsLines.length < 6 ? Array(6 - weaponsLines.length).fill('<div class="line"></div>').join('') : ''}
                    </div>
                </div>
                
                <div class="spells-section">
                    <div class="section-title">SPELLS/MAGIC ITEMS:</div>
                    <div class="section-lines">
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                    </div>
                </div>
                
                <div class="note-text">List additional items & spells on the back.</div>
            </div>
        </div>
        
        <div class="footer">
            Permission to copy this page is granted by Flying Buffalo Inc.
        </div>
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
    
    initializeTypeahead(type, inputElement, dropdownId, dataSource) {
        const dropdown = document.getElementById(dropdownId);
        let currentIndex = -1;
        let filteredItems = [];
        
        // Focus and input events
        inputElement.addEventListener('focus', () => {
            if (inputElement.value.trim()) {
                this.updateTypeaheadDropdown(inputElement.value, dropdown, dataSource);
            }
        });
        
        inputElement.addEventListener('input', (e) => {
            currentIndex = -1;
            this.updateTypeaheadDropdown(e.target.value, dropdown, dataSource);
        });
        
        // Keyboard navigation
        inputElement.addEventListener('keydown', (e) => {
            if (!dropdown.classList.contains('show')) return;
            
            const items = dropdown.querySelectorAll('.typeahead-item');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentIndex = Math.min(currentIndex + 1, items.length - 1);
                this.highlightTypeaheadItem(items, currentIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentIndex = Math.max(currentIndex - 1, -1);
                this.highlightTypeaheadItem(items, currentIndex);
            } else if (e.key === 'Enter' && currentIndex >= 0) {
                e.preventDefault();
                const selectedItem = items[currentIndex];
                if (selectedItem) {
                    const itemName = selectedItem.dataset.itemName;
                    inputElement.value = itemName;
                    dropdown.classList.remove('show');
                    
                    // Trigger add button click
                    if (type === 'weapon') {
                        this.elements.addWeapon.click();
                    } else if (type === 'armor') {
                        this.elements.addArmor.click();
                    }
                }
            } else if (e.key === 'Escape') {
                dropdown.classList.remove('show');
                currentIndex = -1;
            }
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!inputElement.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
                currentIndex = -1;
            }
        });
    }
    
    updateTypeaheadDropdown(searchTerm, dropdown, dataSource) {
        const term = searchTerm.trim().toLowerCase();
        
        if (!term) {
            dropdown.classList.remove('show');
            return;
        }
        
        // Filter items based on search term
        const filteredItems = Object.entries(dataSource)
            .filter(([name, data]) => name.toLowerCase().includes(term))
            .sort(([a], [b]) => {
                // Prioritize items that start with the search term
                const aStarts = a.toLowerCase().startsWith(term);
                const bStarts = b.toLowerCase().startsWith(term);
                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;
                return a.localeCompare(b);
            })
            .slice(0, 10); // Limit to 10 results
        
        if (filteredItems.length === 0) {
            dropdown.innerHTML = '<div class="typeahead-no-results">No items found</div>';
            dropdown.classList.add('show');
            return;
        }
        
        // Build dropdown HTML
        dropdown.innerHTML = filteredItems.map(([name, data]) => {
            const attributes = [];
            
            // Weapon attributes
            if (data.damage) attributes.push(`Damage: ${data.damage}`);
            if (data.strReq) attributes.push(`STR: ${data.strReq}`);
            if (data.dexReq) attributes.push(`DEX: ${data.dexReq}`);
            if (data.range) attributes.push(`Range: ${data.range}`);
            
            // Armor attributes
            if (data.hits) attributes.push(`Protection: ${data.hits}`);
            if (data.dexPenalty && data.dexPenalty < 0) attributes.push(`DEX: ${data.dexPenalty}`);
            
            // Common attributes
            if (data.weight) attributes.push(`Weight: ${data.weight}`);
            if (data.cost) attributes.push(`Cost: ${data.cost}gp`);
            
            return `
                <div class="typeahead-item" data-item-name="${name}">
                    <div class="typeahead-item-name">${name}</div>
                    ${attributes.length > 0 ? `<div class="typeahead-item-details">${attributes.join(' • ')}</div>` : ''}
                </div>
            `;
        }).join('');
        
        dropdown.classList.add('show');
        
        // Add click handlers to items
        dropdown.querySelectorAll('.typeahead-item').forEach(item => {
            item.addEventListener('click', () => {
                const itemName = item.dataset.itemName;
                const inputElement = dropdown.id === 'weapon-typeahead' ? this.elements.newWeapon : this.elements.newArmor;
                inputElement.value = itemName;
                dropdown.classList.remove('show');
                
                // Trigger add button click
                if (dropdown.id === 'weapon-typeahead') {
                    this.elements.addWeapon.click();
                } else {
                    this.elements.addArmor.click();
                }
            });
        });
    }
    
    highlightTypeaheadItem(items, index) {
        items.forEach(item => item.classList.remove('active'));
        if (index >= 0 && index < items.length) {
            items[index].classList.add('active');
            items[index].scrollIntoView({ block: 'nearest' });
        }
    }
    
    updateAbilities() {
        const abilitiesList = document.getElementById('abilities-list');
        if (!abilitiesList) return;
        
        const abilities = this.character.getAbilities();
        
        if (abilities.length === 0) {
            abilitiesList.innerHTML = '<li class="no-abilities">Select a type and kindred to see abilities</li>';
        } else {
            abilitiesList.innerHTML = abilities.map(ability => `<li>${ability}</li>`).join('');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new TTCharacterGenerator();
});