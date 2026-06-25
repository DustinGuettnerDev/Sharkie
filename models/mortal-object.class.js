class MortalObject extends MovableObject {
    life = 1;

    hasZeroLife() {
        return this.life <= 0;
    }
    getHit() {
        this.life = Math.max(0, this.life - 1);
    }
}
