class MortalObject extends MovableObject {
    lifeCount = 1;

    hasZeroLife() {
        return this.lifeCount <= 0;
    }
    getHit() {
        this.lifeCount = Math.max(0, this.lifeCount - 1);
    }
}
