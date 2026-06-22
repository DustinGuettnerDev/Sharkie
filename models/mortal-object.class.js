class MortalObject extends MovableObject {
    hasZeroLife() {
        return this.life <= 0;
    }
    getHit() {
        this.life = Math.max(0, this.life - 1);
    }

    playHurtAnimation(imagesHurt) {
        return this.playAnimation(imagesHurt);
    }

    playDieAnimation(imagesDeath) {
        return this.playAnimation(imagesDeath);
    }

    playSwimmingAnimation() {
        return this.playAnimation(this.imagesSwimming);
    }
}
