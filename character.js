class Character {
    constructor() {
        this.name = '';
        this.kindred = '';
        this.characterClass = '';
        this.gender = '';
        this.age = 0;
        this.height = '';
        this.weight = 0;
        this.level = 1;
        
        this.attributes = {
            str: { current: 10, max: 10, hadTriples: false },
            con: { current: 10, max: 10, hadTriples: false },
            dex: { current: 10, max: 10, hadTriples: false },
            spd: { current: 10, max: 10, hadTriples: false },
            lk: { current: 10, max: 10, hadTriples: false },
            iq: { current: 10, max: 10, hadTriples: false },
            wiz: { current: 10, max: 10, hadTriples: false },
            cha: { current: 10, max: 10, hadTriples: false }
        };
        
        this.specialistAttributes = []; // Track which attributes had triples
        this.talents = [];
        this.equipment = {
            weapons: [],
            armor: [],
            items: []
        };
        this.gold = 0;
        this.hasTriples = false;
        
        // Corrected kindred data with multiplicative modifiers
        this.kindredData = {
            human: {
                name: 'Human',
                description: 'Average in all respects, gets second chance on saving rolls',
                modifiers: {
                    str: 1, con: 1, dex: 1, spd: 1, lk: 1, iq: 1, wiz: 1, cha: 1
                },
                heightMod: 1,
                weightMod: 1
            },
            dwarf: {
                name: 'Dwarf (Gristlegrim)',
                description: 'Short, sturdy, and strong',
                modifiers: {
                    str: 2, con: 2, dex: 1, spd: 1, lk: 0.75, iq: 1, wiz: 1, cha: 1
                },
                heightMod: 0.67,
                weightMod: 2
            },
            elf: {
                name: 'Elf',
                description: 'Tall, graceful, and magical',
                modifiers: {
                    str: 1, con: 0.67, dex: 1.33, spd: 1, lk: 1, iq: 1.5, wiz: 1.5, cha: 1.5
                },
                heightMod: 1.10,
                weightMod: 1
            },
            hobb: {
                name: 'Hobb',
                description: 'Small, lucky, and nimble',
                modifiers: {
                    str: 0.5, con: 2, dex: 1.5, spd: 1, lk: 1.5, iq: 1, wiz: 1, cha: 1
                },
                heightMod: 0.5,
                weightMod: 0.75
            },
            fairy: {
                name: 'Fairy',
                description: 'Tiny, magical, and charismatic',
                modifiers: {
                    str: 0.25, con: 0.25, dex: 1.75, spd: 1, lk: 1.5, iq: 1, wiz: 2, cha: 1.5
                },
                heightMod: 0.10,
                weightMod: 0.01
            },
            leprechaun: {
                name: 'Leprechaun',
                description: 'Small, lucky, and mischievous',
                modifiers: {
                    str: 0.33, con: 0.67, dex: 1.5, spd: 1, lk: 1.5, iq: 1.25, wiz: 1.5, cha: 1
                },
                heightMod: 0.33,
                weightMod: 0.10
            }
        };
        
        this.classData = {
            warrior: {
                name: 'Warrior',
                description: 'Skilled fighters with weapon/armor bonuses but no innate magical ability',
                requirements: {},
                equipment: ['Sword', 'Shield', 'Leather Armor'],
                startingTalents: 1,
                abilities: [
                    'Weapon Bonus: +1d6 per level with melee weapons',
                    'Armor Bonus: Can double armor protection (with durability cost)',
                    'No innate magical ability - cannot cast spells'
                ]
            },
            rogue: {
                name: 'Rogue',
                description: 'Adaptable characters who can use both magic and weapons',
                requirements: {},
                equipment: ['Dagger', 'Lockpicks', 'Leather Armor'],
                startingTalents: 2,
                startingSpells: 1, // Rogues know one spell to start
                abilities: [
                    'Starts with 2 talents (instead of 1)',
                    'Gains additional rogue talents on even levels',
                    'Can learn and cast spells (knows 1 to start)',
                    'Full weapon effectiveness with all weapons',
                    'At 7th level: Can specialize as warrior-rogue or wizard-rogue'
                ]
            },
            wizard: {
                name: 'Wizard',
                description: 'Magic users with spell training and magical proficiency',
                requirements: { iq: 10, dex: 10 },
                equipment: ['Staff', 'Spellbook', 'Robes'],
                startingTalents: 1,
                knowsAllFirstLevelSpells: true,
                abilities: [
                    'Knows all 1st level spells',
                    'Reduced spell cost: -1 WIZ per character level difference',
                    'Focus affinity: Additional -1 WIZ per level when using staff/wand',
                    'Limited to 2d6 weapons only',
                    'No personal adds with weapons > 2d6'
                ]
            },
            specialist: {
                name: 'Specialist',
                description: 'Characters born with extraordinary abilities',
                requirements: {},
                equipment: ['Varies by specialization'],
                startingTalents: 1,
                isSpecialist: true,
                abilities: [
                    'Must roll triples (TARO) on at least one attribute',
                    'Special ability based on which attribute(s) had triples',
                    'Doubles saving roll totals for specialist attribute'
                ]
            }
        };
        
        this.talentsList = [
            // Anatomy & Medicine
            'Anatomy', 'Butcher', 'Specific Anatomy (Elvish)', 'Specific Anatomy (Trollish)', 'Surgeon', 'Medicine', 'Healer',
            
            // Animal Knowledge
            'Animal husbandry', 'Horsemanship', 'Riding', 'Hunting', 'Tracking', 'Training: Dog', 'Training: Cat', 'Training: Horse', 'Training: Bird',
            
            // Artisan Skills
            'Actor', 'Painter', 'Sculptor', 'Calligrapher', 'Scribe', 'Jewelry maker', 'Leather worker', 'Musician', 'Potter', 'Ceramicist', 'Singer', 'Bard',
            
            // Athletic Skills
            'Athlete', 'Contortionist', 'Dance', 'Deep water diving', 'Acrobat', 'Juggler', 'Martial artist', 'Mountaineer', 'Skier', 'Caver', 'Swimmer',
            
            // Botany & Plants
            'Botany', 'Knowledge of Plants', 'Apothecary', 'Herbalist', 'Poisoner',
            
            // Builder Skills
            'Builder', 'Architect', 'Engineer', 'Mason', 'Shipbuilder',
            
            // Chemistry & Science
            'Chemistry', 'Alchemist', 'Explosives', 'Scientist', 'Investigator', 'Research Skills',
            
            // Crafts
            'Brewer (wine)', 'Brewer (beer)', 'Brewer (ale)', 'Brewer (mead)', 'Brewer (spirits)', 'Candy maker', 'Tailor', 'Weaver', 'Cook', 'Farmer', 'Tinker', 'Armorer', 'Blacksmith', 'Farrier', 'Swordsmith',
            
            // Culture & Knowledge
            'Diplomat', 'Human lore', 'Elvish lore', 'Dwarvish lore', 'Historian', 'Literature', 'Poet', 'Social adept', 'Comparative Religion', 'Knowledge of rites and rituals', 'Mental discipline',
            
            // Daily Life Skills
            'Bargaining', 'Bartering', 'Streetwise', 'Merchant',
            
            // Combat Skills
            'Exceptional Uses of Weapons', 'Archer', 'Sharpshooter', 'Swordsman',
            
            // Geology
            'Geology', 'Earth Sciences', 'Miner',
            
            // History & Literature
            'History (regional)', 'History (temporal)', 'Historian (Human)', 'Historian (Elvish)', 'Historian (Dwarvish)', 'Librarian', 'Intellectual', 'Literate', 'Well-read', 'Philosopher', 'Playwright', 'Storytelling', 'Writer',
            
            // Language Skills
            'Language Proficiency', 'Ancient Tongues', 'Codes', 'Ciphers', 'Secret writing', 'Translator', 'Rhetoric',
            
            // Legal & Social
            'Bureaucrat', 'Judge', 'Lawyer', 'Persuasion', 'Leadership', 'Seduction', 'Charming', 'Cleverness',
            
            // Marine Knowledge
            'Deep-water fishing', 'Canoeing', 'Kayaking', 'Navigation', 'Piloting', 'Sailing', 'Knot tying',
            
            // Mathematics
            'Mathematics', 'Accounting', 'Bookkeeping', 'Astrology', 'Astronomy', 'Gambling', 'Practical arithmetic', 'Theoretical math',
            
            // Mechanics
            'Mechanics', 'Clockworks', 'Siege Machinery',
            
            // Military
            'Military tactics', 'Small unit tactics',
            
            // Resilience
            'Competitive drinking', 'Endurance', 'Self-defense', 'Dodge',
            
            // Roguery & Thievery
            'Arson', 'Assassin', 'Conspiracy', 'Disguise', 'Garrote', 'Lock-picking', 'Pickpocket', 'Sleight of hand', 'Spy', 'Stealth', 'Hiding', 'Tailing', 'Evasion', 'Thievery',
            
            // Wilderness Skills
            'Camping', 'Firemaking', 'Fishing', 'Trapping', 'Overland trekking', 'Wilderness survival (forest)', 'Wilderness survival (desert)', 'Wilderness survival (mountain)', 'Wilderness survival (arctic)'
        ];
        
        this.rogueTalents = [
            'Acrobat', 'Alchemist', 'Arson', 'Assassin', 'Charming', 'Cleverness', 'Conspiracy', 'Disguise', 'Dodge', 'Exceptional Uses of Weapons', 'Gambling', 'Garrote', 'Lock-picking', 'Pickpocket', 'Poisoner', 'Sleight of hand', 'Spy', 'Stealth', 'Hiding', 'Tailing', 'Evasion', 'Streetwise', 'Thievery'
        ];
    }
    
    rollNewAttributes(useTARO = false) {
        const results = useTARO ? Dice.rollAllAttributesWithTARO() : Dice.rollAllAttributes();
        this.hasTriples = false;
        this.specialistAttributes = [];
        
        Object.keys(this.attributes).forEach(attr => {
            const result = results[attr];
            const baseValue = result.total;
            
            this.attributes[attr].current = baseValue;
            this.attributes[attr].max = baseValue;
            this.attributes[attr].hadTriples = result.hadTriples || false;
            
            // Track which attributes had triples for specialist purposes
            if (result.hadTriples) {
                this.hasTriples = true;
                this.specialistAttributes.push(attr);
            }
        });
        
        // Roll starting gold
        this.gold = Dice.rollStartingGold();
        
        return results;
    }
    
    applyKindredModifiers() {
        if (!this.kindred || !this.kindredData[this.kindred]) return;
        
        const kindredInfo = this.kindredData[this.kindred];
        const modifiers = kindredInfo.modifiers;
        
        Object.keys(modifiers).forEach(attr => {
            if (this.attributes[attr]) {
                // Apply multiplicative modifiers
                const baseValue = this.attributes[attr].max;
                const modifier = modifiers[attr];
                
                // Apply modifier and round appropriately
                let newValue = Math.floor(baseValue * modifier);
                if (modifier > 1) {
                    // Round down for multipliers > 1
                    newValue = Math.floor(baseValue * modifier);
                } else if (modifier < 1) {
                    // Round up for multipliers < 1
                    newValue = Math.ceil(baseValue * modifier);
                }
                
                // Ensure minimum value of 1
                newValue = Math.max(1, newValue);
                
                this.attributes[attr].current = newValue;
                this.attributes[attr].max = newValue;
            }
        });
    }
    
    setClass(characterClass) {
        this.characterClass = characterClass;
        
        if (this.classData[characterClass]) {
            const classInfo = this.classData[characterClass];
            this.equipment.weapons = [...classInfo.equipment.filter(item => 
                ['Sword', 'Dagger', 'Staff', 'Club'].includes(item)
            )];
            this.equipment.armor = [...classInfo.equipment.filter(item => 
                ['Shield', 'Leather Armor', 'Robes', 'Basic Clothing'].includes(item)
            )];
            this.equipment.items = [...classInfo.equipment.filter(item => 
                ['Lockpicks', 'Spellbook'].includes(item)
            )];
        }
    }
    
    canSelectClass(characterClass) {
        if (!this.classData[characterClass]) return false;
        
        // Specialist can only be selected if player rolled triples
        if (characterClass === 'specialist' && !this.hasTriples) {
            return false;
        }
        
        // Check class requirements
        const classInfo = this.classData[characterClass];
        if (classInfo.requirements) {
            for (const [attr, minValue] of Object.entries(classInfo.requirements)) {
                if (this.attributes[attr] && this.attributes[attr].current < minValue) {
                    return false;
                }
            }
        }
        
        // All other classes (warrior, rogue, wizard) can be freely chosen
        return true;
    }
    
    getAvailableClasses() {
        return Object.keys(this.classData).filter(cls => this.canSelectClass(cls));
    }
    
    calculateModifier(attributeValue) {
        return Dice.calculateModifier(attributeValue);
    }
    
    calculateTotalAdds() {
        const combatAttributes = {
            str: this.attributes.str.current,
            dex: this.attributes.dex.current,
            spd: this.attributes.spd.current,
            lk: this.attributes.lk.current
        };
        
        return Dice.calculateAdds(combatAttributes);
    }
    
    calculateWeightPossible() {
        // Weight Possible = STR × 10 pounds (or STR × 100 weight units)
        return this.attributes.str.current * 10;
    }
    
    // Get specialist type based on which attribute(s) had triples
    getSpecialistType() {
        if (!this.hasTriples || this.specialistAttributes.length === 0) {
            return null;
        }
        
        const specialistTypes = {
            str: 'Strong One',
            con: 'Sensitive',
            dex: 'Ranger',
            spd: 'Martial Artist',
            lk: 'Gambler',
            iq: 'Mastermind',
            wiz: 'Specialist Mage',
            cha: 'Leader'
        };
        
        const types = this.specialistAttributes.map(attr => specialistTypes[attr]);
        return types.join(' / ');
    }
    
    addTalent(talentName) {
        if (talentName && !this.talents.includes(talentName)) {
            this.talents.push(talentName);
            return true;
        }
        return false;
    }
    
    removeTalent(talentName) {
        const index = this.talents.indexOf(talentName);
        if (index > -1) {
            this.talents.splice(index, 1);
            return true;
        }
        return false;
    }
    
    addEquipment(category, itemName) {
        if (this.equipment[category] && itemName) {
            this.equipment[category].push(itemName);
            return true;
        }
        return false;
    }
    
    removeEquipment(category, itemName) {
        if (this.equipment[category]) {
            const index = this.equipment[category].indexOf(itemName);
            if (index > -1) {
                this.equipment[category].splice(index, 1);
                return true;
            }
        }
        return false;
    }
    
    exportCharacter() {
        return {
            name: this.name,
            kindred: this.kindred,
            characterClass: this.characterClass,
            gender: this.gender,
            age: this.age,
            height: this.height,
            weight: this.weight,
            level: this.level,
            attributes: this.attributes,
            specialistAttributes: this.specialistAttributes,
            talents: this.talents,
            equipment: this.equipment,
            gold: this.gold,
            totalAdds: this.calculateTotalAdds(),
            timestamp: new Date().toISOString()
        };
    }
    
    importCharacter(characterData) {
        if (!characterData) return false;
        
        try {
            this.name = characterData.name || '';
            this.kindred = characterData.kindred || '';
            this.characterClass = characterData.characterClass || '';
            this.gender = characterData.gender || '';
            this.age = characterData.age || 0;
            this.height = characterData.height || '';
            this.weight = characterData.weight || 0;
            this.level = characterData.level || 1;
            
            if (characterData.attributes) {
                Object.keys(this.attributes).forEach(attr => {
                    if (characterData.attributes[attr]) {
                        this.attributes[attr] = { ...characterData.attributes[attr] };
                    }
                });
            }
            
            this.specialistAttributes = characterData.specialistAttributes || [];
            this.hasTriples = this.specialistAttributes.length > 0;
            this.talents = characterData.talents || [];
            this.equipment = characterData.equipment || { weapons: [], armor: [], items: [] };
            this.gold = characterData.gold || 0;
            
            return true;
        } catch (error) {
            console.error('Error importing character:', error);
            return false;
        }
    }
    
    validateCharacter() {
        const errors = [];
        
        if (!this.name.trim()) {
            errors.push('Character name is required');
        }
        
        if (!this.kindred) {
            errors.push('Kindred selection is required');
        }
        
        if (!this.characterClass) {
            errors.push('Character class is required');
        } else if (!this.canSelectClass(this.characterClass)) {
            if (this.characterClass === 'specialist' && !this.hasTriples) {
                errors.push('Cannot select Specialist class without rolling triples');
            } else {
                errors.push(`Cannot select ${this.characterClass} class`);
            }
        }
        
        Object.keys(this.attributes).forEach(attr => {
            if (this.attributes[attr].current < 1) {
                errors.push(`${attr.toUpperCase()} cannot be less than 1`);
            }
        });
        
        return errors;
    }
    
    // Get abilities based on class and kindred
    getAbilities() {
        const abilities = [];
        
        // Add class abilities
        if (this.characterClass && this.classData[this.characterClass]) {
            const classAbilities = this.classData[this.characterClass].abilities || [];
            abilities.push(...classAbilities);
            
            // Add specialist-specific abilities
            if (this.characterClass === 'specialist' && this.specialistAttributes.length > 0) {
                const specialistType = this.getSpecialistType();
                if (specialistType) {
                    abilities.push(`Specialist Type: ${specialistType}`);
                }
            }
        }
        
        // Add kindred abilities
        if (this.kindred === 'human') {
            abilities.push('Second Chance: Can reroll any non-fumbled saving roll once');
        } else if (this.kindred === 'leprechaun') {
            abilities.push('Wink-Wing: Natural teleportation up to 50 feet for 5 WIZ');
        }
        
        return abilities;
    }
}

window.Character = Character;