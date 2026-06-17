class MortalObject extends MovableObject {
    hasZeroLife() {
        return this.life <= 0;
    }
    getHit() {
        this.life = Math.max(0, this.life - 1);
    }

    playHurtAnimation(imagesHurt) {
        this.playAnimation(imagesHurt);
    }

    playDieAnimation(imagesDeath) {
        if (this.hasZeroLife()) {
            this.playAnimation(imagesDeath);
        }
    }

    playSwimmingAnimation() {
        this.playAnimation(this.imagesSwimming);
    }
}
