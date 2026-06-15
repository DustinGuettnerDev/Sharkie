class MortalObject extends MovableObject {
    isDead() {
        return this.life <= 0;
    }
    takeDamage(amount = 1) {
        this.isHurt = true;
        this.life = Math.max(0, this.life - amount);
    }

    playHurtAnimation(imagesHurt) {
        this.playAnimation(imagesHurt);
    }

    playDieAnimation(imagesDeath) {
        if (this.isDead()) {
            this.playAnimation(imagesDeath);
        }
    }
}
