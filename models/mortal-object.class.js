/**
 * Represents a mortal object in the game, extending the MovableObject class. A mortal object has a life count and can take damage from enemies.
 */
class MortalObject extends MovableObject {
    lifeCount = 1;
    lastHit = 0;
    enemyDamageType = "shock";

    /**
     * Checks if the mortal object has zero life.
     * @returns {boolean} True if the life count is zero or less, false otherwise.
     */
    hasZeroLife() {
        return this.lifeCount <= 0;
    }

    /**
     * Applies incoming damage and refreshes the last-hit timestamp.
     */
    getHit() {
        this.lifeCount = Math.max(0, this.lifeCount - 1);
    }

    /**
     * Retrieves the damage type of the specified enemy.
     * @param {Enemy} enemy The enemy object dealing damage.
     * @returns {string} The damage type of the enemy.
     */
    getEnemyDamageType(enemy) {
        return enemy.damageType;
    }

    /**
     * Checks if the mortal object is currently in a hurt state based on the last hit timestamp and the defined hurt time.
     * @returns {boolean} True if the mortal object is hurt, false otherwise.
     */
    isHurt() {
        let timepassed = Date.now() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < this.hurtTime;
    }
}
