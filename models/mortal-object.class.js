class MortalObject extends MovableObject {
    lifeCount = 1;
    lastHit = 0;
    enemyDamageType;

    hasZeroLife() {
        return this.lifeCount <= 0;
    }

    getHit() {
        this.lifeCount = Math.max(0, this.lifeCount - 1);
    }

    getEnemyDamageType(enemy) {
        return enemy.damageType;
    }

    isHurt() {
        let timepassed = Date.now() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < this.hurtTime;
    }
}
