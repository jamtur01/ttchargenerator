class TTCharacterGenerator {
    constructor() {
        this.character = new Character();
        this.pdfGenerator = new PDFGenerator();
        this.elaborationsEnabled = false;
        this.initializeFantasyNameData();
        this.initializeHeightWeightTable();
        this.initializeElements();
        this.populateTalentDropdown();
        this.bindEvents();
        this.updateUI();
        this.updateStartingEquipmentInfo();
        this.setupAriaLive();
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
    
    setupAriaLive() {
        // Create aria-live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
        this.liveRegion = liveRegion;
    }
    
    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                this.liveRegion.textContent = '';
            }, 1000);
        }
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
        
        // Bind typeahead events for weapons, armor, and items
        this.initializeTypeahead('weapon', this.elements.newWeapon, 'weapon-typeahead', EquipmentData.weapons);
        this.initializeTypeahead('armor', this.elements.newArmor, 'armor-typeahead', EquipmentData.armor);
        this.initializeTypeahead('item', this.elements.newItem, 'item-typeahead', EquipmentData.items);
        
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
            this.updateTalentsList();
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
                this.updateStartingEquipmentInfo();
            });
        }
        
        // Handle help text
        const infoIcon = document.getElementById('info-icon');
        const helpText = document.getElementById('toggle-help');
        if (infoIcon && helpText) {
            infoIcon.addEventListener('mouseenter', () => {
                helpText.style.display = 'block';
                helpText.setAttribute('aria-hidden', 'false');
                infoIcon.setAttribute('aria-expanded', 'true');
            });
            
            infoIcon.addEventListener('mouseleave', () => {
                helpText.style.display = 'none';
                helpText.setAttribute('aria-hidden', 'true');
                infoIcon.setAttribute('aria-expanded', 'false');
            });
            
            // Keyboard support for info icon
            infoIcon.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const isVisible = helpText.style.display !== 'none';
                    helpText.style.display = isVisible ? 'none' : 'block';
                    helpText.setAttribute('aria-hidden', isVisible ? 'true' : 'false');
                    infoIcon.setAttribute('aria-expanded', !isVisible);
                }
            });
            
            // Close help text when pressing Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && helpText.style.display !== 'none') {
                    helpText.style.display = 'none';
                    helpText.setAttribute('aria-hidden', 'true');
                    infoIcon.setAttribute('aria-expanded', 'false');
                    infoIcon.focus();
                }
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
                this.announceToScreenReader(message);
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
                
                setTimeout(() => {
                    this.elements.newTalent.value = '';
                }, 1000);
            }
        } else {
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
                this.announceToScreenReader(message);
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
            this.announceToScreenReader('Invalid roll result');
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
        this.announceToScreenReader(`Height: ${height}, Weight: ${weight} lbs`);
    }
    
    handleTAROResults(results) {
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
        this.announceToScreenReader(`TARO! You are now a ${specialistType || 'Specialist'}`);
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
            this.handleTAROResults(results);
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
        
        // If triples were rolled, handle TARO
        if (this.character.hasTriples) {
            this.handleTAROResults(results);
        }
        
        this.character.applyKindredModifiers();
        this.updateUI();
    }
    
    updateKindredOptions() {
        const kindredSelect = this.elements.kindred;
        const currentValue = kindredSelect.value;
        
        // Clear existing options
        kindredSelect.innerHTML = '<option value="">Select Kindred</option>';
        
        // Get available kindreds based on elaborations setting
        const availableKindreds = this.character.getAvailableKindreds(this.elaborationsEnabled);
        
        // Separate basic and elaborate kindreds
        const basicKindreds = [];
        const elaborateKindreds = [];
        
        availableKindreds.forEach(key => {
            const kindredData = this.character.kindredData[key];
            const kindredInfo = {
                value: key,
                name: kindredData.name,
                description: kindredData.description,
                isElaborate: kindredData.isElaborate
            };
            
            if (kindredData.isElaborate) {
                elaborateKindreds.push(kindredInfo);
            } else {
                basicKindreds.push(kindredInfo);
            }
        });
        
        // Add basic kindreds
        basicKindreds.sort((a, b) => a.name.localeCompare(b.name));
        basicKindreds.forEach(kindred => {
            const option = document.createElement('option');
            option.value = kindred.value;
            option.textContent = kindred.name;
            option.title = kindred.description;
            kindredSelect.appendChild(option);
        });
        
        // Add elaborate kindreds if any
        if (elaborateKindreds.length > 0) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = '— Elaborate Kindreds —';
            
            elaborateKindreds.sort((a, b) => a.name.localeCompare(b.name));
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
        
        // Get all class keys that should be shown
        const allClassKeys = Object.keys(this.character.classData).filter(key => {
            const classInfo = this.character.classData[key];
            return !classInfo.isElaborate || this.elaborationsEnabled;
        });
        
        // Separate basic and elaborate classes
        const basicClasses = [];
        const elaborateClasses = [];
        
        allClassKeys.forEach(key => {
            const classData = this.character.classData[key];
            const classInfo = {
                value: key,
                name: classData.name,
                description: classData.description,
                isElaborate: classData.isElaborate,
                canSelect: availableClasses.includes(key)
            };
            
            if (classData.isElaborate) {
                elaborateClasses.push(classInfo);
            } else {
                basicClasses.push(classInfo);
            }
        });
        
        // Add basic classes
        basicClasses.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.value;
            option.textContent = cls.name;
            const classData = this.character.classData[cls.value];
            option.title = classData.summary || cls.description;
            
            if (!cls.canSelect) {
                option.disabled = true;
                
                // Add specific disabled reasons
                if (cls.value === 'specialist' && !this.character.hasTriples) {
                    option.title = 'Specialist requires rolling triples on at least one attribute';
                } else if (cls.value === 'wizard' &&
                          (this.character.attributes.iq.current < 10 ||
                           this.character.attributes.dex.current < 10)) {
                    option.title = 'Wizard requires IQ 10+ and DEX 10+ to learn and cast spells';
                }
            }
            
            classSelect.appendChild(option);
        });
        
        // Add elaborate classes if any
        if (elaborateClasses.length > 0) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = '— Elaborate Types —';
            
            elaborateClasses.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.value;
                option.textContent = cls.name;
                const classData = this.character.classData[cls.value];
                option.title = classData.summary || cls.description;
                option.className = 'elaborate-option';
                
                if (!cls.canSelect) {
                    option.disabled = true;
                    
                    // Add specific disabled reasons
                    if (cls.value === 'citizen' && this.character.hasTriples) {
                        option.title = 'Cannot select Citizen when triples were rolled';
                    } else if (cls.value === 'paragon') {
                        option.title = 'Paragon requires IQ, LK, DEX, and WIZ all 12+, plus 12+ in at least 6 of 8 attributes total';
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
            
            // Check if this is a simple string item (no data)
            if (typeof item === 'string') {
                itemElement.innerHTML = `
                    <span>${item}</span>
                    <button class="equipment-remove" onclick="app.removeEquipment('${category}', '${item}')">×</button>
                `;
            } else if (item.data) {
                // Items with data (weapons, armor, or items from database)
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
                    
                    // Add type for items
                    if (itemData.type && category === 'items') {
                        attributes.push(`Type: ${itemData.type}`);
                    }
                    
                    // Add cost
                    if (itemData.cost) {
                        attributes.push(`Cost: ${itemData.cost} gp`);
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
                    
                    // Add description if present (mainly for items)
                    if (itemData.description && category === 'items') {
                        attributesHtml = `<div class="equipment-attributes">${attributes.join(' • ')}</div>
                                         <div class="equipment-description">${itemData.description}</div>`;
                    } else if (attributes.length > 0) {
                        attributesHtml = `<div class="equipment-attributes">${attributes.join(' • ')}</div>`;
                    }
                }
                
                itemElement.innerHTML = `
                    <div class="equipment-info">
                        <span class="equipment-name">${itemName}</span>
                        ${attributesHtml}
                    </div>
                    <button class="equipment-remove" onclick="app.removeEquipment('${category}', '${itemName}')">×</button>
                `;
            } else {
                // Item object but without data
                const itemName = item.name;
                itemElement.innerHTML = `
                    <span>${itemName}</span>
                    <button class="equipment-remove" onclick="app.removeEquipment('${category}', '${itemName}')">×</button>
                `;
            }
            
            listElement.appendChild(itemElement);
        });
    }
    
    addTalent() {
        const talentName = this.elements.newTalent.value.trim();
        
        const maxTalents = this.character.getMaxTalents();
        if (this.character.talents.length >= maxTalents) {
            const msg = `Cannot add more talents. Maximum allowed: ${maxTalents} (based on level ${this.character.level} as ${this.character.characterClass || 'no type'})`;
            alert(msg);
            this.announceToScreenReader(msg);
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
                            this.announceToScreenReader('Character imported successfully');
                        } else {
                            alert('Failed to import character. Please check the file format.');
                            this.announceToScreenReader('Failed to import character');
                        }
                    } catch (error) {
                        alert('Invalid JSON file. Please select a valid character file.');
                        this.announceToScreenReader('Invalid JSON file');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }
    
    exportPDF() {
        if (!this.validateAndShowErrors()) {
            return;
        }
        
        try {
            this.pdfGenerator.generatePDF(this.character);
            this.announceToScreenReader('PDF export window opened');
        } catch (error) {
            if (error.message.includes('popup blocker')) {
                alert('Please allow popups for this website to export PDF');
            } else {
                alert('Failed to generate PDF. Please try again.');
                console.error('PDF export error:', error);
            }
            this.announceToScreenReader('PDF export failed');
        }
    }
    
    validateAndShowErrors() {
        const errors = this.character.validateCharacter();
        if (errors.length > 0) {
            alert('Character validation errors:\n' + errors.join('\n'));
            this.announceToScreenReader('Character validation errors. Please check the form.');
            return false;
        }
        return true;
    }
    
    initializeTypeahead(type, inputElement, dropdownId, dataSource) {
        const dropdown = document.getElementById(dropdownId);
        let currentIndex = -1;
        
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
            } else if (e.key === 'Enter') {
                if (currentIndex >= 0) {
                    // User selected an item from dropdown
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
                        } else if (type === 'item') {
                            this.elements.addItem.click();
                        }
                    }
                } else if (inputElement.value.trim()) {
                    // No selection but text typed - try to find exact match (case-insensitive)
                    const typedText = inputElement.value.trim();
                    const exactMatch = Object.keys(dataSource).find(key => 
                        key.toLowerCase() === typedText.toLowerCase()
                    );
                    
                    if (exactMatch) {
                        // Found exact match in database
                        e.preventDefault();
                        inputElement.value = exactMatch; // Use the correct case from database
                        dropdown.classList.remove('show');
                        
                        // Trigger add button click
                        if (type === 'weapon') {
                            this.elements.addWeapon.click();
                        } else if (type === 'armor') {
                            this.elements.addArmor.click();
                        } else if (type === 'item') {
                            this.elements.addItem.click();
                        }
                    }
                    // If no exact match, let default Enter behavior happen (will add as custom item)
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
                let inputElement;
                let addButton;
                
                // Determine which input and button to use based on dropdown ID
                if (dropdown.id === 'weapon-typeahead') {
                    inputElement = this.elements.newWeapon;
                    addButton = this.elements.addWeapon;
                } else if (dropdown.id === 'armor-typeahead') {
                    inputElement = this.elements.newArmor;
                    addButton = this.elements.addArmor;
                } else if (dropdown.id === 'item-typeahead') {
                    inputElement = this.elements.newItem;
                    addButton = this.elements.addItem;
                }
                
                if (inputElement && addButton) {
                    inputElement.value = itemName;
                    dropdown.classList.remove('show');
                    addButton.click();
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
    
    updateStartingEquipmentInfo() {
        const equipmentList = document.getElementById('starting-equipment-list');
        if (!equipmentList) return;
        
        // Build equipment info from classData
        const equipmentInfo = [];
        
        // Get all non-elaborate classes or elaborate if enabled
        Object.keys(this.character.classData).forEach(key => {
            const classInfo = this.character.classData[key];
            if (!classInfo.isElaborate || this.elaborationsEnabled) {
                const equipment = classInfo.equipment.join(', ');
                const description = classInfo.equipmentDescription || '';
                equipmentInfo.push({
                    name: classInfo.name,
                    equipment: equipment,
                    description: description
                });
            }
        });
        
        // Generate HTML
        let html = equipmentInfo.map(info => {
            return `<li><strong>${info.name}:</strong> ${info.equipment}${info.description ? ' - ' + info.description : ''}</li>`;
        }).join('');
        
        // Add starting gold info
        html += '<li><strong>Starting Gold:</strong> 3d6 × 10 gold pieces - Rolled automatically with attributes</li>';
        
        equipmentList.innerHTML = html;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new TTCharacterGenerator();
});