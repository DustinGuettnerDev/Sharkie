class MortalObject extends MovableObject {
    isDead() {
        return this.life <= 0;
    }
    getHit() {
        this.life = Math.max(0, this.life - 1);
    }

    playHurtAnimation(imagesHurt) {
        this.playAnimation(imagesHurt);
    }

    playDieAnimation(imagesDeath) {
        if (this.isDead()) {
            this.playAnimation(imagesDeath);
        }
    }

    playSwimmingAnimation() {
        this.playAnimation(this.imagesSwimming);
    }
}
