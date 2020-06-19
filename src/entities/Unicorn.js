import Phaser from 'phaser';
import StateMachine from 'javascript-state-machine';

const Defaults = {
  // Time in ms that the unicorn is invincible after being damaged.
  InvincibilityDuration: 2000,
};

class Unicorn extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, 'unicorn-fly-sheet', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.scene = scene;

    this.anims.play('unicorn-flying');
    this.body.setCollideWorldBounds(true);
    this.scale = 0.25;
    this.body.setSize(120, 160);
    this.body.setOffset(60, 80);
    this.body.setMaxVelocity(150, 150);
    this.body.setDragX(50);

    // Interactions
    this.keys = scene.cursorKeys;
    this.input = {};
    this.ammo = {};

    this.invincible = false;
    this.flashCounter = 0;

    this.setupAnimations();
    this.setupMovement();
  }

  damage() {
    if (!this.invincible) {
      this.invincible = true;
      this.scene.time.delayedCall(Defaults.InvincibilityDuration, () => {
        this.invincible = false;
        this.alpha = 1;
      }, null, this);
      return true;
    }
    return false;
  }

  setAmmo(bullets) {
    this.ammo = bullets;
  }

  setupAnimations() {
    this.animState = new StateMachine({
      init: 'flying',
      transitions: [
        {name: 'idle', from: ['flying', 'shooting'], to: 'idle'},
        {name: 'fly', from: ['idle', 'shooting'], to: 'flying'},
        {name: 'shoot', from: ['idle', 'flying', 'shooting'], to: 'shooting'},
      ],
      methods: {
        onEnterState: (lifecycle) => {
          console.log(lifecycle);
          this.anims.play('unicorn-' + lifecycle.to);
        },
      },
    });
    this.animPredicates = {
      idle: () => {
        return (this.body.onFloor()
          && this.body.velocity.x == 0
          && (!this.animState.is('shooting') || !this.anims.isPlaying)
        );
      },
      fly: () => {
        return (
          (this.body.velocity.x !== 0 || !this.body.onFloor())
          && (!this.animState.is('shooting') || !this.anims.isPlaying)
        );
      },
      shoot: () => {
        return this.input.didPressSpace;
      },
    };
  }

  setupMovement() {
    this.moveState = new StateMachine({
      init: 'flying',
      transitions: [
        {name: 'walk', from: 'standing', to: 'running'},
        {name: 'stop', from: 'running', to: 'standing'},
        {name: 'takeoff', from: ['standing', 'running'], to: 'flying'},
        {name: 'touchdown', from: 'flying', to: 'standing'},
      ],
      methods: {
        onTakeoff: () => {
          console.log('Take off!');
        },
        onTouchdown: () => {
          console.log('Landing!');
        },
        onWalk: () => {
          console.log('Walking');
        },
        onStop: () => {
          console.log('Stopped');
        },
      },
    });

    this.movePredicates = {
      walk: () => {
        return this.body.velocity.x !== 0;
      },
      stop: () => {
        return this.body.velocity.x == 0;
      },
      takeoff: () => {
        return this.body.velocity.y !== 0;
      },
      touchdown: () => {
        return this.body.onFloor();
      },
    };
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.invincible) {
      this.flashCounter += delta;
      this.alpha = (this.flashCounter % 400) < 200 ? 0.5 : 1;
    }

    this.input.didPressSpace = Phaser.Input.Keyboard.JustDown(this.keys.space);

    if (this.keys.left.isDown) {
      this.body.setAccelerationX(-600);
      this.setFlipX(true);
      this.body.offset.x = 40;
    } else if (this.keys.right.isDown) {
      this.body.setAccelerationX(600);
      this.setFlipX(false);
      this.body.offset.x = 60;
    } else {
      this.body.setAccelerationX(0);
    }
    if (this.keys.up.isDown) {
      this.body.setAccelerationY(-400);
    } else if (this.keys.down.isDown) {
      this.body.setAccelerationY(300);
    } else {
      this.body.setAccelerationY(0);
    }
    if (this.input.didPressSpace) {
      this.ammo.fireBullet(this);
    }

    // Animation update
    for (const t of this.animState.transitions()) {
      if (t in this.animPredicates && this.animPredicates[t]()) {
        this.animState[t]();
        break;
      }
    }
    // Move state update
    for (const t of this.moveState.transitions()) {
      if (t in this.movePredicates && this.movePredicates[t]()) {
        this.moveState[t]();
        break;
      }
    }
  }
}

export default Unicorn;
