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
            weapons: [], // Will store objects with {name, data}
            armor: [],   // Will store objects with {name, data}
            items: []    // Will store strings (simple items)
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
        
        // Elaborate kindreds from the Peters-McAllister Chart 2.0
        this.elaborateKindredData = {
            // Familiar Illkin
            centaur: {
                name: 'Centaur',
                description: 'Half-human, half-horse beings',
                modifiers: {
                    str: 3, con: 3, dex: 1, spd: 1, lk: 1, iq: 0.5, wiz: 2, cha: 1.5
                },
                heightMod: 1.50,
                weightMod: 8,
                elaborate: true
            },
            dakk: {
                name: 'Dakk',
                description: 'Shadow-touched humanoids',
                modifiers: {
                    str: 2, con: 2, dex: 1, spd: 1, lk: 0.8, iq: 1.1, wiz: 1.1, cha: 0.75
                },
                heightMod: 0.67,
                weightMod: 0.8,
                elaborate: true
            },
            gnome: {
                name: 'Gnome',
                description: 'Small earth-dwelling folk',
                modifiers: {
                    str: 0.33, con: 0.5, dex: 1.5, spd: 1, lk: 1.5, iq: 2, wiz: 1, cha: 0.67
                },
                heightMod: 0.33,
                weightMod: 0.33,
                elaborate: true
            },
            goblin: {
                name: 'Goblin',
                description: 'Small, mischievous humanoids',
                modifiers: {
                    str: 0.75, con: 0.75, dex: 1.5, spd: 1, lk: 1, iq: 1, wiz: 0.75, cha: 0.5
                },
                heightMod: 0.50,
                weightMod: 0.50,
                elaborate: true
            },
            gremlin: {
                name: 'Gremlin',
                description: 'Tiny mechanical mischief-makers',
                modifiers: {
                    str: 0.5, con: 0.5, dex: 1, spd: 1, lk: 1.5, iq: 1.5, wiz: 1.5, cha: 0.5
                },
                heightMod: 0.33,
                weightMod: 0.33,
                elaborate: true
            },
            halfElf: {
                name: 'Half-Elf',
                description: 'Mixed heritage of human and elf',
                modifiers: {
                    str: 1, con: 1, dex: 1.25, spd: 1, lk: 1, iq: 1.25, wiz: 1.25, cha: 1.25
                },
                heightMod: 1.05,
                weightMod: 1,
                elaborate: true
            },
            dwelf: {
                name: 'Dwelf',
                description: 'Mixed heritage of dwarf and elf',
                modifiers: {
                    str: 1.5, con: 1.25, dex: 1, spd: 1, lk: 0.75, iq: 0.9, wiz: 1, cha: 1.25
                },
                heightMod: 0.85,
                weightMod: 1.50,
                elaborate: true
            },
            hobgoblin: {
                name: 'Hobgoblin',
                description: 'Larger, more civilized goblins',
                modifiers: {
                    str: 1, con: 1, dex: 1.5, spd: 1, lk: 0.5, iq: 0.75, wiz: 1, cha: 0.75
                },
                heightMod: 1,
                weightMod: 1.50,
                elaborate: true
            },
            kobold: {
                name: 'Kobold',
                description: 'Small draconic humanoids',
                modifiers: {
                    str: 0.5, con: 0.5, dex: 1.5, spd: 1, lk: 1, iq: 2, wiz: 1, cha: 0.75
                },
                heightMod: 0.50,
                weightMod: 0.50,
                elaborate: true
            },
            selkie: {
                name: 'Selkie',
                description: 'Seal-folk who can take human form',
                modifiers: {
                    str: 1, con: 1, dex: 1, spd: 1, lk: 1, iq: 1, wiz: 1, cha: 0.9
                },
                heightMod: 0.90,
                weightMod: 0.90,
                elaborate: true
            },
            pixie: {
                name: 'Pixie',
                description: 'Tiny winged folk',
                modifiers: {
                    str: 0.25, con: 0.33, dex: 1.25, spd: 1, lk: 1, iq: 1, wiz: 1, cha: 1.5
                },
                heightMod: 0.10,
                weightMod: 0.01,
                elaborate: true
            },
            redcap: {
                name: 'Redcap',
                description: 'Murderous fairy folk',
                modifiers: {
                    str: 0.5, con: 0.67, dex: 1.5, spd: 1, lk: 1.5, iq: 1.25, wiz: 1.25, cha: 0.75
                },
                heightMod: 0.33,
                weightMod: 0.10,
                elaborate: true
            },
            livingSkeleton: {
                name: 'Living Skeleton',
                description: 'Humanoid with transparent flesh',
                modifiers: {
                    str: 1, con: 1.5, dex: 1, spd: 1, lk: 1, iq: 1, wiz: 1, cha: 1
                },
                heightMod: 1,
                weightMod: 0.50,
                elaborate: true
            },
            uruk: {
                name: 'Uruk (Orc)',
                description: 'Brutish warrior folk',
                modifiers: {
                    str: 1.1, con: 1.1, dex: 1, spd: 1, lk: 0.67, iq: 0.75, wiz: 1, cha: 1.1
                },
                heightMod: 1,
                weightMod: 1,
                elaborate: true
            },
            vampire: {
                name: 'Vampire',
                description: 'Undead blood drinkers',
                modifiers: {
                    str: 2.5, con: 1, dex: 1, spd: 1, lk: 1, iq: 1.5, wiz: 1.5, cha: 1.1
                },
                heightMod: 1,
                weightMod: 1,
                elaborate: true
            },
            varta: {
                name: 'Varta',
                description: 'Enigmatic shapeshifters',
                modifiers: {
                    str: 1, con: 1, dex: 0.75, spd: 1, lk: 1.33, iq: 1, wiz: 1.1, cha: 1
                },
                heightMod: 1,
                weightMod: 1,
                elaborate: true
            },
            werewolf: {
                name: 'Werewolf',
                description: 'Lycanthrope shapeshifters',
                modifiers: {
                    str: 2, con: 3, dex: 1, spd: 1, lk: 1, iq: 1, wiz: 1, cha: 1.1
                },
                heightMod: 1.10,
                weightMod: 1.25,
                elaborate: true
            },
            // Less Common Illkin
            harpy: {
                name: 'Harpy',
                description: 'Winged humanoids',
                modifiers: {
                    str: 1.5, con: 1.5, dex: 1, spd: 1, lk: 0.5, iq: 0.67, wiz: 0.75, cha: 0.5
                },
                heightMod: 1,
                weightMod: 0.75,
                elaborate: true
            },
            ogre: {
                name: 'Hrogr (Ogre)',
                description: 'Large brutish humanoids',
                modifiers: {
                    str: 3, con: 4, dex: 0.75, spd: 1, lk: 0.5, iq: 0.5, wiz: 0.5, cha: 1
                },
                heightMod: 1.50,
                weightMod: 3,
                elaborate: true
            },
            minotaur: {
                name: 'Minotaur',
                description: 'Bull-headed humanoids',
                modifiers: {
                    str: 2.5, con: 2.5, dex: 0.75, spd: 1, lk: 1, iq: 0.67, wiz: 1, cha: 2
                },
                heightMod: 1.25,
                weightMod: 2.50,
                elaborate: true
            },
            ratling: {
                name: 'Ratling',
                description: 'Rat-like humanoids',
                modifiers: {
                    str: 0.5, con: 1, dex: 1.5, spd: 1, lk: 1.5, iq: 1, wiz: 0.9, cha: 0.8
                },
                heightMod: 0.50,
                weightMod: 0.33,
                elaborate: true
            },
            troll: {
                name: 'Forest Troll',
                description: 'Regenerating forest dwellers',
                modifiers: {
                    str: 2.5, con: 2.5, dex: 1, spd: 1, lk: 1, iq: 0.75, wiz: 1, cha: 1
                },
                heightMod: 1.50,
                weightMod: 4,
                elaborate: true
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
        
        // Elaborate character types
        this.elaborateClassData = {
            citizen: {
                name: 'Citizen',
                description: 'Average folk with no special combat or magical training',
                requirements: {},
                equipment: ['Varies by profession'],
                startingTalents: 1,
                isElaborate: true,
                abilities: [
                    'Cannot be created if triples were rolled',
                    'Only half combat adds from attributes',
                    'Spells cast at half effectiveness',
                    'Focuses on professional talents'
                ]
            },
            paragon: {
                name: 'Paragon',
                description: 'The most blessed of character types, combining warrior and wizard abilities',
                requirements: {
                    str: 12, con: 12, dex: 12, spd: 12,
                    lk: 12, iq: 12, wiz: 12, cha: 12
                },
                equipment: ['Varies'],
                startingTalents: 1,
                isElaborate: true,
                abilities: [
                    'Must have 12+ in at least 6 of 8 attributes',
                    'Full warrior combat bonuses',
                    'Full wizard spell abilities',
                    'Both warrior and wizard training'
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
        if (!this.kindred) return;
        
        // Check both regular and elaborate kindred data
        let kindredInfo = this.kindredData[this.kindred] || this.elaborateKindredData[this.kindred];
        if (!kindredInfo) return;
        
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
        const previousClass = this.characterClass;
        this.characterClass = characterClass;
        
        // Check both regular and elaborate class data
        const classInfo = this.classData[characterClass] || this.elaborateClassData[characterClass];
        if (classInfo) {
            
            // Clear existing equipment
            this.equipment.weapons = [];
            this.equipment.armor = [];
            this.equipment.items = [];
            
            // Add class-specific equipment with data
            classInfo.equipment.forEach(itemName => {
                if (window.EquipmentData) {
                    // Check weapons
                    if (window.EquipmentData.weapons[itemName]) {
                        this.equipment.weapons.push({
                            name: itemName,
                            data: window.EquipmentData.weapons[itemName]
                        });
                    }
                    // Check armor
                    else if (window.EquipmentData.armor[itemName]) {
                        this.equipment.armor.push({
                            name: itemName,
                            data: window.EquipmentData.armor[itemName]
                        });
                    }
                    // Other items (no data)
                    else {
                        this.equipment.items.push(itemName);
                    }
                } else {
                    // Fallback if EquipmentData not loaded
                    if (['Sword', 'Dagger', 'Staff', 'Club'].includes(itemName)) {
                        this.equipment.weapons.push({ name: itemName, data: null });
                    } else if (['Shield', 'Leather Armor', 'Robes'].includes(itemName)) {
                        this.equipment.armor.push({ name: itemName, data: null });
                    } else {
                        this.equipment.items.push(itemName);
                    }
                }
            });
            
            // Handle talent adjustments when changing from rogue
            if (previousClass === 'rogue' && characterClass !== 'rogue') {
                this.adjustTalentsForClassChange();
            }
        }
    }
    
    // Calculate maximum allowed talents based on level and class
    getMaxTalents() {
        const level = this.level || 1;
        
        if (this.characterClass === 'rogue') {
            // Rogues get: starting 2 + (level-1) normal + floor(level/2) rogue bonuses
            // Level 1: 2
            // Level 2: 2 + 1 + 1 = 4
            // Level 3: 2 + 2 + 1 = 5
            // Level 4: 2 + 3 + 2 = 7
            return 1 + level + Math.floor(level / 2);
        } else {
            // Non-rogues get 1 talent per level
            return level;
        }
    }
    
    // Adjust talents when changing from rogue to another class
    adjustTalentsForClassChange() {
        const maxTalents = this.getMaxTalents();
        
        // If character has more talents than allowed, remove excess
        while (this.talents.length > maxTalents) {
            // Remove rogue talents first, then others
            let removed = false;
            
            // Try to remove a rogue talent first
            for (let i = this.talents.length - 1; i >= 0; i--) {
                if (this.rogueTalents.includes(this.talents[i])) {
                    this.talents.splice(i, 1);
                    removed = true;
                    break;
                }
            }
            
            // If no rogue talent to remove, remove the last talent
            if (!removed && this.talents.length > 0) {
                this.talents.pop();
            }
        }
    }
    
    canSelectClass(characterClass) {
        // Check both regular and elaborate class data
        const classInfo = this.classData[characterClass] || this.elaborateClassData[characterClass];
        if (!classInfo) return false;
        
        // Specialist can only be selected if player rolled triples
        if (characterClass === 'specialist' && !this.hasTriples) {
            return false;
        }
        
        // Citizen cannot be selected if player rolled triples
        if (characterClass === 'citizen' && this.hasTriples) {
            return false;
        }
        
        // Paragon has specific requirements - must have 12+ in at least 6 attributes
        if (characterClass === 'paragon') {
            let highAttributeCount = 0;
            Object.values(this.attributes).forEach(attr => {
                if (attr.current >= 12) highAttributeCount++;
            });
            if (highAttributeCount < 6) {
                return false;
            }
        }
        
        // Check class requirements
        if (classInfo.requirements) {
            for (const [attr, minValue] of Object.entries(classInfo.requirements)) {
                if (this.attributes[attr] && this.attributes[attr].current < minValue) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    getAvailableClasses(includeElaborate = false) {
        const basicClasses = Object.keys(this.classData).filter(cls => this.canSelectClass(cls));
        
        if (includeElaborate) {
            const elaborateClasses = Object.keys(this.elaborateClassData).filter(cls => this.canSelectClass(cls));
            return [...basicClasses, ...elaborateClasses];
        }
        
        return basicClasses;
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
        if (!talentName || this.talents.includes(talentName)) {
            return false;
        }
        
        // Check if adding would exceed max talents
        const maxTalents = this.getMaxTalents();
        if (this.talents.length >= maxTalents) {
            return false;
        }
        
        this.talents.push(talentName);
        return true;
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
        if (!this.equipment[category] || !itemName) return false;
        
        if (category === 'items') {
            // Simple items don't have data
            this.equipment.items.push(itemName);
            return true;
        }
        
        // For weapons and armor, look up data
        if (window.EquipmentData) {
            const dataSource = category === 'weapons' ? window.EquipmentData.weapons : window.EquipmentData.armor;
            const itemData = dataSource[itemName];
            
            if (itemData) {
                this.equipment[category].push({
                    name: itemName,
                    data: itemData
                });
            } else {
                // If not found in data, add without stats
                this.equipment[category].push({
                    name: itemName,
                    data: null
                });
            }
        } else {
            // Fallback if EquipmentData not loaded
            this.equipment[category].push({
                name: itemName,
                data: null
            });
        }
        
        return true;
    }
    
    removeEquipment(category, itemName) {
        if (!this.equipment[category]) return false;
        
        if (category === 'items') {
            const index = this.equipment.items.indexOf(itemName);
            if (index > -1) {
                this.equipment.items.splice(index, 1);
                return true;
            }
        } else {
            // For weapons and armor, find by name property
            const index = this.equipment[category].findIndex(item => item.name === itemName);
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
            errors.push('Character type is required');
        } else if (!this.canSelectClass(this.characterClass)) {
            if (this.characterClass === 'specialist' && !this.hasTriples) {
                errors.push('Cannot select Specialist type without rolling triples');
            } else {
                errors.push(`Cannot select ${this.characterClass} type`);
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
        
        // Add class abilities (check both regular and elaborate)
        const classInfo = this.classData[this.characterClass] || this.elaborateClassData[this.characterClass];
        if (this.characterClass && classInfo) {
            const classAbilities = classInfo.abilities || [];
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