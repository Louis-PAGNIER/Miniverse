import {NumberAnimator, Vector3Animator} from "@/composables/animations";
import {Vector3} from "three";

export function usePlayerAnimation() {
  const centerPositionAnimator = new Vector3Animator(new Vector3(0, 0, 0));
  const scale = new NumberAnimator(1);

  const positionFrequency = 0.5 + Math.random() * 0.5;
  const positionPhase = Math.random() * Math.PI * 2;
  const rotationSpeed = new Vector3(Math.random(), Math.random(), Math.random());
  const rotationPhase = Math.random();
  const animationStart = Math.random() * 10000;

  const update = (delta: number, elapsed: number, group: any) => {
    if (!group) return;

    centerPositionAnimator.update(delta);
    scale.update(delta);

    const pos = centerPositionAnimator.value;
    group.position.x = pos.x + Math.sin(elapsed * positionFrequency + positionPhase) * 0.5;
    group.position.y = pos.y + Math.cos(elapsed * positionFrequency + positionPhase) * 0.5;
    group.position.z = pos.z + Math.sin(elapsed * positionFrequency + positionPhase) * 0.5;

    group.rotation.setFromVector3(rotationSpeed.clone().multiplyScalar(elapsed * 0.05 + rotationPhase * 1000));
    group.scale.setScalar(scale.value);
  };

  return {
    centerPositionAnimator,
    scale,
    animationStart,
    update
  };
}