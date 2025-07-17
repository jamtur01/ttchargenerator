// Tunnels & Trolls Equipment Data
// Based on official rules from the Deluxe T&T rulebook

const EquipmentData = {
    weapons: {
        // Swords
        'Short Sword': {
            type: 'sword',
            damage: '3d6',
            strReq: 8,
            dexReq: 7,
            cost: 50,
            weight: 35,
            range: null,
            description: '24-30 inch blade'
        },
        'Sword': {
            type: 'sword',
            damage: '4d6',
            strReq: 12,
            dexReq: 12,
            cost: 60,
            weight: 70,
            range: null,
            description: 'Standard 30-42 inch blade'
        },
        'Broadsword': {
            type: 'sword',
            damage: '4d6',
            strReq: 12,
            dexReq: 12,
            cost: 60,
            weight: 70,
            range: null,
            description: 'Medium sword, 30-42 inches'
        },
        'Long Sword': {
            type: 'sword',
            damage: '5d6',
            strReq: 16,
            dexReq: 18,
            cost: 70,
            weight: 120,
            range: null,
            description: 'Great sword, 42-60 inches'
        },
        'Great Sword': {
            type: 'sword',
            damage: '7d6',
            strReq: 25,
            dexReq: 21,
            cost: 90,
            weight: 140,
            range: null,
            description: 'Heroic sword, 60-72 inches, two-handed'
        },
        'Sabre': {
            type: 'sword',
            damage: '4d6',
            strReq: 12,
            dexReq: 12,
            cost: 66,
            weight: 73,
            range: null,
            description: 'Curved blade for slashing'
        },
        'Scimitar': {
            type: 'sword',
            damage: '4d6',
            strReq: 12,
            dexReq: 12,
            cost: 66,
            weight: 73,
            range: null,
            description: 'Curved sword'
        },
        
        // Daggers
        'Dagger': {
            type: 'dagger',
            damage: '2d6+2',
            strReq: 3,
            dexReq: 3,
            dexReqThrown: 14,
            cost: 20,
            weight: 15,
            range: 15,
            description: 'Standard 8-11 inch blade'
        },
        'Dirk': {
            type: 'dagger',
            damage: '2d6+2',
            strReq: 3,
            dexReq: 3,
            dexReqThrown: 14,
            cost: 20,
            weight: 15,
            range: 15,
            description: 'Common sheath dagger'
        },
        'Kris': {
            type: 'dagger',
            damage: '2d6+3',
            strReq: 5,
            dexReq: 7,
            dexReqThrown: 20,
            cost: 25,
            weight: 20,
            range: 15,
            description: 'Large wavy-bladed dagger'
        },
        'Bowie Knife': {
            type: 'dagger',
            damage: '2d6+3',
            strReq: 5,
            dexReq: 7,
            dexReqThrown: 20,
            cost: 25,
            weight: 20,
            range: 15,
            description: 'Large combat dagger'
        },
        
        // Axes
        'Hatchet': {
            type: 'axe',
            damage: '3d6',
            strReq: 5,
            dexReq: 5,
            dexReqThrown: 15,
            cost: 25,
            weight: 30,
            range: 15,
            description: 'Small throwing axe'
        },
        'Ax': {
            type: 'axe',
            damage: '5d6',
            strReq: 13,
            dexReq: 9,
            dexReqThrown: 15,
            cost: 90,
            weight: 80,
            range: 10,
            description: 'Standard battle axe'
        },
        'Battle Ax': {
            type: 'axe',
            damage: '5d6',
            strReq: 13,
            dexReq: 9,
            cost: 90,
            weight: 80,
            range: null,
            description: 'Two-handed war axe'
        },
        'Great Ax': {
            type: 'axe',
            damage: '7d6',
            strReq: 23,
            dexReq: 10,
            cost: 170,
            weight: 180,
            range: null,
            description: 'Large two-handed axe'
        },
        
        // Hafted weapons
        'Club': {
            type: 'hafted',
            damage: '3d6',
            strReq: 8,
            dexReq: 5,
            cost: 20,
            weight: 30,
            range: null,
            description: 'Simple bludgeon'
        },
        'Mace': {
            type: 'hafted',
            damage: '5d6',
            strReq: 14,
            dexReq: 8,
            cost: 85,
            weight: 110,
            range: null,
            description: 'Metal-headed bludgeon'
        },
        'Morning Star': {
            type: 'hafted',
            damage: '5d6',
            strReq: 14,
            dexReq: 15,
            cost: 85,
            weight: 110,
            range: null,
            description: 'Spiked mace on chain'
        },
        'War Hammer': {
            type: 'hafted',
            damage: '5d6',
            strReq: 14,
            dexReq: 8,
            cost: 90,
            weight: 100,
            range: null,
            description: 'Heavy combat hammer'
        },
        'Maul': {
            type: 'hafted',
            damage: '6d6',
            strReq: 18,
            dexReq: 10,
            cost: 140,
            weight: 140,
            range: null,
            description: 'Large two-handed hammer'
        },
        
        // Spears
        'Spear': {
            type: 'spear',
            damage: '3d6',
            strReq: 7,
            dexReq: 10,
            dexReqThrown: 12,
            cost: 15,
            weight: 35,
            range: 15,
            description: 'Light throwing spear, 3-5 feet'
        },
        'Lance': {
            type: 'spear',
            damage: '4d6',
            strReq: 12,
            dexReq: 8,
            dexReqThrown: 14,
            cost: 50,
            weight: 100,
            range: 20,
            description: 'Medium spear, 5-8 feet'
        },
        'Pike': {
            type: 'spear',
            damage: '6d6',
            strReq: 15,
            dexReq: 12,
            cost: 120,
            weight: 120,
            range: null,
            description: 'Long spear, 8-10 feet'
        },
        'Trident': {
            type: 'spear',
            damage: '4d6',
            strReq: 12,
            dexReq: 8,
            dexReqThrown: 12,
            cost: 50,
            weight: 100,
            range: 20,
            description: 'Three-pronged spear'
        },
        
        // Staffs
        'Staff': {
            type: 'staff',
            damage: '2d6+2',
            strReq: 11,
            dexReq: 10,
            cost: 100,
            weight: 30,
            range: null,
            description: 'Wizard\'s staff, 6 feet'
        },
        'Quarterstaff': {
            type: 'staff',
            damage: '4d6',
            strReq: 12,
            dexReq: 10,
            cost: 50,
            weight: 100,
            range: null,
            description: 'Fighting staff, 6 feet'
        },
        
        // Ranged weapons
        'Sling': {
            type: 'ranged',
            damage: '2d6',
            strReq: 6,
            dexReq: 14,
            cost: 5,
            weight: 5,
            range: 60,
            description: 'Simple leather strap',
            ammunition: 'stones or lead shot'
        },
        'Light Bow': {
            type: 'ranged',
            damage: '3d6',
            strReq: 9,
            dexReq: 15,
            cost: 40,
            weight: 30,
            range: 50,
            description: 'Self bow, 15-30 lb pull',
            ammunition: 'arrows'
        },
        'Medium Bow': {
            type: 'ranged',
            damage: '4d6',
            strReq: 12,
            dexReq: 15,
            cost: 60,
            weight: 40,
            range: 60,
            description: 'Standard bow, 31-50 lb pull',
            ammunition: 'arrows'
        },
        'Heavy Bow': {
            type: 'ranged',
            damage: '5d6',
            strReq: 15,
            dexReq: 15,
            cost: 80,
            weight: 50,
            range: 75,
            description: 'Warrior\'s bow, 51-75 lb pull',
            ammunition: 'arrows'
        },
        'Long Bow': {
            type: 'ranged',
            damage: '6d6',
            strReq: 20,
            dexReq: 16,
            cost: 135,
            weight: 60,
            range: 100,
            description: 'Heroic bow, 76-120 lb pull',
            ammunition: 'arrows'
        },
        'Light Crossbow': {
            type: 'ranged',
            damage: '3d6',
            strReq: 10,
            dexReq: 10,
            cost: 100,
            weight: 100,
            range: 30,
            description: 'Hand-drawn crossbow',
            ammunition: 'bolts'
        },
        'Heavy Crossbow': {
            type: 'ranged',
            damage: '6d6',
            strReq: 17,
            dexReq: 10,
            cost: 220,
            weight: 230,
            range: 90,
            description: 'Pulley-drawn arbalest',
            ammunition: 'bolts',
            cockingStr: 34
        },
        
        // Other weapons
        'Whip': {
            type: 'other',
            damage: '2d6',
            strReq: 13,
            dexReq: 14,
            cost: 40,
            weight: 60,
            range: 6,
            description: 'Braided leather whip'
        },
        'Brass Knuckles': {
            type: 'other',
            damage: '1d6+3',
            strReq: 3,
            dexReq: 6,
            cost: 45,
            weight: 10,
            range: null,
            description: 'Metal hand weapon'
        },
        'Caltrops': {
            type: 'other',
            damage: '1d6',
            strReq: 0,
            dexReq: 3,
            cost: 0.5,
            weight: 1,
            range: 15,
            description: 'Area denial weapon (per piece)'
        }
    },
    
    armor: {
        // Full Suits
        'Plate Armor': {
            type: 'full',
            hits: 16,
            strReq: 10,
            dexPenalty: -3,
            cost: 500,
            weight: 600,
            description: 'Articulated metal plates, full body protection'
        },
        'Banded Mail': {
            type: 'full',
            hits: 13,
            strReq: 11,
            dexPenalty: -3,
            cost: 400,
            weight: 680,
            description: 'Metal strips over mail'
        },
        'Mail': {
            type: 'full',
            hits: 12,
            strReq: 11,
            dexPenalty: -3,
            cost: 330,
            weight: 620,
            description: 'Interlocked metal rings'
        },
        'Scale Mail': {
            type: 'full',
            hits: 10,
            strReq: 11,
            dexPenalty: -3,
            cost: 300,
            weight: 620,
            description: 'Overlapping metal scales'
        },
        'Ring Mail': {
            type: 'full',
            hits: 8,
            strReq: 8,
            dexPenalty: -2,
            cost: 280,
            weight: 350,
            description: 'Ring-joined plates'
        },
        'Hardened Leather': {
            type: 'full',
            hits: 7,
            strReq: 7,
            dexPenalty: -1,
            cost: 180,
            weight: 230,
            description: 'Boiled leather cuirass'
        },
        'Leather Armor': {
            type: 'full',
            hits: 3,
            strReq: 3,
            dexPenalty: 0,
            cost: 50,
            weight: 60,
            description: 'Heavy cured leather'
        },
        'Robes': {
            type: 'full',
            hits: 1,
            strReq: 1,
            dexPenalty: 0,
            cost: 1,
            weight: 10,
            description: 'Thick cloth, minimal protection'
        },
        
        // Helmets
        'Great Helm': {
            type: 'head',
            hits: 3,
            strReq: 3,
            dexPenalty: -1,
            cost: 20,
            weight: 50,
            description: 'Full head and face protection'
        },
        'Open Helm': {
            type: 'head',
            hits: 2,
            strReq: 3,
            dexPenalty: 0,
            cost: 16,
            weight: 45,
            description: 'Open-faced helmet'
        },
        'Steel Cap': {
            type: 'head',
            hits: 1,
            strReq: 1,
            dexPenalty: 0,
            cost: 5,
            weight: 15,
            description: 'Basic skull protection'
        },
        
        // Shields
        'Tower Shield': {
            type: 'shield',
            hits: 7,
            strReq: 12,
            dexReq: 8,
            cost: 130,
            weight: 635,
            description: '10-12 sq ft, near full body coverage'
        },
        'Knight Shield': {
            type: 'shield',
            hits: 5,
            strReq: 10,
            dexReq: 10,
            cost: 70,
            weight: 400,
            description: '6-9 sq ft, torso protection'
        },
        'Shield': {
            type: 'shield',
            hits: 4,
            strReq: 10,
            dexReq: 8,
            cost: 40,
            weight: 350,
            description: '4-5 sq ft round shield'
        },
        'Target Shield': {
            type: 'shield',
            hits: 4,
            strReq: 10,
            dexReq: 8,
            cost: 75,
            weight: 350,
            description: '4-5 sq ft with central spike',
            damage: '2d6' // If used as weapon
        },
        'Buckler': {
            type: 'shield',
            hits: 3,
            strReq: 3,
            dexReq: 8,
            cost: 15,
            weight: 75,
            description: '2-3 sq ft small shield'
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EquipmentData;
}

window.EquipmentData = EquipmentData;