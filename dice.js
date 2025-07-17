class Dice {
    static roll(sides = 6) {
        return Math.floor(Math.random() * sides) + 1;
    }
    
    static rollMultiple(count, sides = 6) {
        const rolls = [];
        for (let i = 0; i < count; i++) {
            rolls.push(this.roll(sides));
        }
        return rolls;
    }
    
    static rollSum(count, sides = 6) {
        return this.rollMultiple(count, sides).reduce((sum, roll) => sum + roll, 0);
    }
    
    static rollAttribute() {
        const rolls = this.rollMultiple(3, 6);
        const sum = rolls.reduce((total, roll) => total + roll, 0);
        const isTriples = rolls[0] === rolls[1] && rolls[1] === rolls[2];
        
        return {
            rolls: rolls,
            total: sum,
            isTriples: isTriples,
            tripleValue: isTriples ? rolls[0] : null
        };
    }
    
    // TARO (Triples Add and Roll Over) implementation
    static rollAttributeWithTARO() {
        const initial = this.rollAttribute();
        let total = initial.total;
        let allRolls = [initial.rolls];
        let hadTriples = initial.isTriples;
        
        // If we rolled triples, keep rolling and adding
        if (initial.isTriples) {
            let keepRolling = true;
            
            while (keepRolling) {
                const nextRoll = this.rollAttribute();
                allRolls.push(nextRoll.rolls);
                total += nextRoll.total;
                
                // Only continue if we rolled triples again
                keepRolling = nextRoll.isTriples;
            }
        }
        
        return {
            rolls: allRolls.flat(),
            total: total,
            hadTriples: hadTriples,
            rollSets: allRolls
        };
    }
    
    static rollAllAttributes() {
        const attributes = ['str', 'con', 'dex', 'spd', 'lk', 'iq', 'wiz', 'cha'];
        const results = {};
        
        attributes.forEach(attr => {
            results[attr] = this.rollAttribute();
        });
        
        return results;
    }
    
    static rollAllAttributesWithTARO() {
        const attributes = ['str', 'con', 'dex', 'spd', 'lk', 'iq', 'wiz', 'cha'];
        const results = {};
        
        attributes.forEach(attr => {
            results[attr] = this.rollAttributeWithTARO();
        });
        
        return results;
    }
    
    // Calculate combat adds based on T&T rules
    // Only STR, DEX, SPD, and LK contribute, and only if > 12
    static calculateAdds(attributes) {
        let adds = 0;
        const combatAttributes = ['str', 'dex', 'spd', 'lk'];
        
        combatAttributes.forEach(attr => {
            const value = attributes[attr] || 0;
            if (value > 12) {
                adds += (value - 12);
            }
        });
        
        return adds;
    }
    
    static calculateModifier(value) {
        // This is used for display purposes, not combat adds
        if (value <= 8) return Math.floor((value - 9) / 2);
        if (value <= 12) return 0;
        if (value <= 15) return 1;
        if (value <= 17) return 2;
        if (value <= 20) return 3;
        if (value <= 25) return 4;
        if (value <= 30) return 5;
        return Math.floor((value - 10) / 5);
    }
    
    // Roll for starting gold
    static rollStartingGold() {
        return this.rollSum(3, 6) * 10;
    }
}

window.Dice = Dice;